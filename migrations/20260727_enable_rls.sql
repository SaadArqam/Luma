-- ============================================================================
-- Enable Row Level Security across the schema.
--
-- Context: supabase-schema.sql and disable-rls.sql explicitly DISABLED RLS on
-- categories, expenses, balance_entries and stipend_config.
-- Several server-rendered pages also queried those tables with no user filter,
-- so one account's financial data was reachable from another's session. The
-- app-level filters are fixed in the same change as this migration; this file
-- adds the database-level backstop so a future missing filter is a no-op rather
-- than a leak.
--
-- Model: one owner policy per command, per table, keyed on `auth.uid() = user_id`,
-- granted to the `authenticated` role only. `anon` gets nothing. `service_role`
-- bypasses RLS by design — that is what the notification crons and the legacy
-- orphan-row claim in /api/migrate now use (lib/supabase-admin.ts).
--
-- Idempotent: safe to re-run.
--
-- !! BEFORE RUNNING: see the "Pre-flight inventory" query below, and read the
-- !! "Rows that will become invisible" note. Run in a transaction so you can
-- !! roll back if the counts surprise you.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Pre-flight inventory — run this FIRST, on its own, and keep the output.
-- It answers "every table, and its RLS status" before anything changes.
-- ----------------------------------------------------------------------------
-- SELECT c.relname                                        AS table_name,
--        c.relrowsecurity                                 AS rls_enabled,
--        EXISTS (SELECT 1 FROM information_schema.columns
--                 WHERE table_schema = 'public'
--                   AND table_name = c.relname
--                   AND column_name = 'user_id')          AS has_user_id,
--        (SELECT count(*) FROM pg_policies p
--          WHERE p.schemaname = 'public' AND p.tablename = c.relname) AS policy_count
--   FROM pg_class c
--   JOIN pg_namespace n ON n.oid = c.relnamespace
--  WHERE n.nspname = 'public' AND c.relkind IN ('r','p')
--  ORDER BY has_user_id DESC, c.relname;

-- ----------------------------------------------------------------------------
-- Rows that will become invisible
-- ----------------------------------------------------------------------------
-- Rows with user_id IS NULL (legacy pre-auth data) match no owner policy, so
-- after this migration they are readable only via service_role. That is
-- deliberate — they have no owner, so no user should see them. /api/migrate
-- still claims them, using the service-role client. Count them first:
--
--   SELECT 'expenses' t, count(*) FROM expenses WHERE user_id IS NULL
--   UNION ALL SELECT 'categories',        count(*) FROM categories        WHERE user_id IS NULL
--   UNION ALL SELECT 'balance_entries',   count(*) FROM balance_entries   WHERE user_id IS NULL
--   UNION ALL SELECT 'stipend_config',    count(*) FROM stipend_config    WHERE user_id IS NULL;

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Retire the older ad-hoc policies so there is exactly one naming scheme.
--    (These were FOR ALL policies covering the same rule; replaced below.)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage their own push subscriptions"        ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can manage their own notification preferences"  ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can view and create their own daily tips"       ON public.daily_tips;

-- ----------------------------------------------------------------------------
-- 2. Every table that has a user_id column gets RLS + four owner policies.
--
--    Driven off the catalog rather than a hardcoded list so tables added by the
--    other migration files in this directory (goals, rules, graph_nodes,
--    timeline_events, …) are covered too, whether or not they are deployed in
--    this particular database.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public'
       AND c.relkind IN ('r', 'p')
       AND EXISTS (
             SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = c.relname
                AND column_name = 'user_id')
     ORDER BY c.relname
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);

    -- Split per command rather than one FOR ALL policy: identical effect today,
    -- but any single command can later be loosened or audited on its own.
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', tbl || '_select_own', tbl);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (auth.uid() = user_id)',
      tbl || '_select_own', tbl);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', tbl || '_insert_own', tbl);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)',
      tbl || '_insert_own', tbl);

    -- USING gates which rows may be updated; WITH CHECK stops an update from
    -- reassigning a row to somebody else.
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', tbl || '_update_own', tbl);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
      tbl || '_update_own', tbl);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', tbl || '_delete_own', tbl);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (auth.uid() = user_id)',
      tbl || '_delete_own', tbl);

    RAISE NOTICE 'RLS + owner policies applied: %', tbl;
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Tables with no user_id column.
--
--    None of the eight tables this app queries (expenses, categories,
--    balance_entries, stipend_config, user_settings, daily_tips,
--    push_subscriptions, notification_preferences) land here — they
--    all carry user_id and were handled above. Anything remaining is therefore
--    unused by the app, so it gets RLS enabled with NO policy, which denies all
--    access to anon and authenticated while leaving service_role working.
--
--    This is the "off by omission" guard: nothing is left unprotected merely
--    because it was not thought about. If one of these is genuinely meant to be
--    shared/public, add an explicit policy and record why — do not just skip it.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public'
       AND c.relkind IN ('r', 'p')
       AND NOT EXISTS (
             SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = c.relname
                AND column_name = 'user_id')
     ORDER BY c.relname
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    RAISE NOTICE 'RLS enabled with NO policy (deny-all, review me): %', tbl;
  END LOOP;
END $$;

COMMIT;

-- ----------------------------------------------------------------------------
-- 4. Post-migration verification. Expect: rls_enabled = true everywhere, and
--    policy_count = 4 for every table that has a user_id.
-- ----------------------------------------------------------------------------
-- SELECT c.relname AS table_name,
--        c.relrowsecurity AS rls_enabled,
--        (SELECT count(*) FROM pg_policies p
--          WHERE p.schemaname = 'public' AND p.tablename = c.relname) AS policy_count
--   FROM pg_class c
--   JOIN pg_namespace n ON n.oid = c.relnamespace
--  WHERE n.nspname = 'public' AND c.relkind IN ('r','p')
--  ORDER BY c.relrowsecurity, policy_count, c.relname;
--
-- Anything with rls_enabled = false is a bug in this migration.
-- Anything with policy_count = 0 is intentionally deny-all — confirm that's right.
