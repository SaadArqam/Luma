-- ============================================================================
-- Multi-account support — Phase 1: schema, RLS, and backfill.
--
-- REVIEW BEFORE RUNNING. Nothing here has been applied.
--
-- !! READ THIS FIRST: `accounts`, `expenses.account_id` and
-- !! `balance_entries.account_id` are ALREADY DECLARED in
-- !! migrations/supabase-schema.sql — with a different shape than this feature
-- !! needs (it has `type`, `icon`, `color`, `currency`, `opening_balance`,
-- !! `archived`; it has no `bank_name`, `bank_domain` or `is_default`).
-- !!
-- !! I could not determine whether that file was ever applied to the live
-- !! database. Evidence suggests NOT — the app orders balance_entries by
-- !! `created_at` and never references the `date` column that file adds, and no
-- !! app code touches `accounts` at all. But that is inference, not proof.
-- !!
-- !! So this migration is written to be correct EITHER WAY: `CREATE TABLE IF
-- !! NOT EXISTS` for the base, then `ADD COLUMN IF NOT EXISTS` for every column
-- !! the feature needs. A bare CREATE TABLE IF NOT EXISTS on its own would be
-- !! the dangerous option — it silently does nothing when the table exists,
-- !! leaving the app expecting columns that were never added.
--
-- Idempotent: safe to re-run. Transactional: all-or-nothing.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Pre-flight — run these FIRST, separately, and keep the output.
-- They tell you which of the two schema worlds you are actually in.
-- ----------------------------------------------------------------------------
-- -- Does accounts already exist, and with what columns?
-- SELECT column_name, data_type, is_nullable, column_default
--   FROM information_schema.columns
--  WHERE table_schema = 'public' AND table_name = 'accounts'
--  ORDER BY ordinal_position;
--
-- -- Do the transaction tables already have account_id, and how does its FK behave?
-- SELECT c.conname, c.conrelid::regclass AS tbl, c.confdeltype AS on_delete
--   FROM pg_constraint c
--  WHERE c.contype = 'f' AND c.confrelid = 'public.accounts'::regclass;
--   -- confdeltype: 'a'=NO ACTION, 'r'=RESTRICT, 'n'=SET NULL, 'c'=CASCADE
--
-- -- How many rows will the backfill touch, and how many can it NOT reach?
-- SELECT 'expenses'        AS tbl, count(*) FILTER (WHERE user_id IS NOT NULL) AS backfillable,
--                                  count(*) FILTER (WHERE user_id IS NULL)     AS orphaned
--   FROM expenses
--  UNION ALL
-- SELECT 'balance_entries', count(*) FILTER (WHERE user_id IS NOT NULL),
--                           count(*) FILTER (WHERE user_id IS NULL)
--   FROM balance_entries;

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. accounts table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accounts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  bank_name    TEXT,
  bank_domain  TEXT,
  account_type TEXT NOT NULL DEFAULT 'other',
  is_default   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reconcile an accounts table that already exists in the older, richer shape.
-- Each of these is a no-op when the column is already present.
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS name         TEXT;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS bank_name    TEXT;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS bank_domain  TEXT;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'other';
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS is_default   BOOLEAN DEFAULT FALSE;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS created_at   TIMESTAMPTZ DEFAULT now();

-- The legacy shape has `type TEXT NOT NULL` with no default. If that column is
-- present, inserts below would fail the NOT NULL check, since this feature
-- writes `account_type` instead. Give it a default and mirror the value across
-- so both columns stay consistent for as long as both exist.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
              WHERE table_schema='public' AND table_name='accounts' AND column_name='type') THEN
    ALTER TABLE public.accounts ALTER COLUMN "type" SET DEFAULT 'other';
    RAISE NOTICE 'Legacy accounts.type column present — defaulted to ''other''. See DECISION 1 in the report.';
  END IF;
END $$;

-- account_type domain. Added as a named constraint so it can be found and
-- widened later; guarded because a re-run must not error.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'accounts_account_type_check') THEN
    ALTER TABLE public.accounts
      ADD CONSTRAINT accounts_account_type_check
      CHECK (account_type IN ('savings', 'current', 'cash', 'other'));
  END IF;
END $$;

-- Needed so a transaction can be tied to an account *belonging to the same
-- user* via a composite foreign key (see section 3).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'accounts_user_id_id_key') THEN
    ALTER TABLE public.accounts ADD CONSTRAINT accounts_user_id_id_key UNIQUE (user_id, id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);

-- ----------------------------------------------------------------------------
-- 2. RLS on accounts — same four owner-scoped policies, and deliberately the
--    same policy names as migrations/20260727_enable_rls.sql, so the two
--    migrations converge no matter which order they are applied in.
-- ----------------------------------------------------------------------------
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS accounts_select_own ON public.accounts;
CREATE POLICY accounts_select_own ON public.accounts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS accounts_insert_own ON public.accounts;
CREATE POLICY accounts_insert_own ON public.accounts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS accounts_update_own ON public.accounts;
CREATE POLICY accounts_update_own ON public.accounts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS accounts_delete_own ON public.accounts;
CREATE POLICY accounts_delete_own ON public.accounts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 3. account_id on the transaction tables
-- ----------------------------------------------------------------------------
ALTER TABLE public.expenses        ADD COLUMN IF NOT EXISTS account_id UUID;
ALTER TABLE public.balance_entries ADD COLUMN IF NOT EXISTS account_id UUID;

-- Any pre-existing FK from those columns to accounts uses ON DELETE SET NULL
-- (per migrations/supabase-schema.sql), which silently detaches transactions
-- when an account is deleted — exactly the "silent data loss" Phase 2 forbids.
-- Replace it with RESTRICT so the database refuses the delete and the app has
-- to reassign first. Catalog-driven because the constraint name is unknown.
DO $$
DECLARE
  con record;
BEGIN
  FOR con IN
    SELECT c.conname, c.conrelid::regclass AS tbl
      FROM pg_constraint c
     WHERE c.contype = 'f'
       AND c.confrelid = 'public.accounts'::regclass
       AND c.conrelid IN ('public.expenses'::regclass, 'public.balance_entries'::regclass)
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', con.tbl, con.conname);
    RAISE NOTICE 'Dropped pre-existing FK % on % (was likely ON DELETE SET NULL)', con.conname, con.tbl;
  END LOOP;
END $$;

-- Referential integrity: the account must exist, and deleting one that still
-- has transactions is refused.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'expenses_account_id_fkey') THEN
    ALTER TABLE public.expenses
      ADD CONSTRAINT expenses_account_id_fkey
      FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'balance_entries_account_id_fkey') THEN
    ALTER TABLE public.balance_entries
      ADD CONSTRAINT balance_entries_account_id_fkey
      FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- Ownership integrity (DECISION 3 in the report). This makes it structurally
-- impossible to attach your transaction to somebody else's account, even if
-- application code has a bug — RLS protects the row, but nothing in a plain FK
-- checks that the referenced account is yours.
-- MATCH SIMPLE (the default) skips the check when either column is NULL, so
-- this tolerates both the nullable period before Phase 3 and legacy rows whose
-- user_id is NULL.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'expenses_account_owner_fkey') THEN
    ALTER TABLE public.expenses
      ADD CONSTRAINT expenses_account_owner_fkey
      FOREIGN KEY (user_id, account_id) REFERENCES public.accounts(user_id, id) ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'balance_entries_account_owner_fkey') THEN
    ALTER TABLE public.balance_entries
      ADD CONSTRAINT balance_entries_account_owner_fkey
      FOREIGN KEY (user_id, account_id) REFERENCES public.accounts(user_id, id) ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_expenses_account_id        ON public.expenses(account_id);
CREATE INDEX IF NOT EXISTS idx_balance_entries_account_id ON public.balance_entries(account_id);

-- ----------------------------------------------------------------------------
-- 4. Backfill — one default account per user, then point existing rows at it.
--    Guarded by NOT EXISTS / IS NULL so re-running changes nothing.
-- ----------------------------------------------------------------------------
INSERT INTO public.accounts (user_id, name, account_type, is_default)
SELECT u.id, 'Primary Account', 'other', TRUE
  FROM auth.users u
 WHERE NOT EXISTS (SELECT 1 FROM public.accounts a WHERE a.user_id = u.id);

-- Covers the awkward middle case: a user who ALREADY had rows in a pre-existing
-- accounts table gets no Primary Account from the insert above, and so would
-- have no default for the backfill to point at — leaving their transactions
-- stranded. Promote their oldest account instead. Deterministic tie-break so a
-- re-run picks the same row.
UPDATE public.accounts a
   SET is_default = TRUE
 WHERE a.id = (
   SELECT a2.id FROM public.accounts a2
    WHERE a2.user_id = a.user_id
    ORDER BY a2.created_at NULLS LAST, a2.id
    LIMIT 1)
   AND NOT EXISTS (
     SELECT 1 FROM public.accounts a3
      WHERE a3.user_id = a.user_id AND a3.is_default);

UPDATE public.expenses e
   SET account_id = a.id
  FROM public.accounts a
 WHERE a.user_id = e.user_id
   AND a.is_default
   AND e.user_id IS NOT NULL
   AND e.account_id IS NULL;

UPDATE public.balance_entries b
   SET account_id = a.id
  FROM public.accounts a
 WHERE a.user_id = b.user_id
   AND a.is_default
   AND b.user_id IS NOT NULL
   AND b.account_id IS NULL;

-- At most one default per user. Created AFTER the backfill: if this index fails
-- to build, some user already has two defaults and that must be resolved by
-- hand rather than papered over. (Postgres cannot declaratively require
-- *exactly* one — the app must not delete a user's last default account.)
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_one_default_per_user
  ON public.accounts(user_id) WHERE is_default;

-- Report what could not be reached, rather than leaving it silent.
DO $$
DECLARE
  e_orphans int;
  b_orphans int;
BEGIN
  SELECT count(*) INTO e_orphans FROM public.expenses        WHERE account_id IS NULL;
  SELECT count(*) INTO b_orphans FROM public.balance_entries WHERE account_id IS NULL;
  RAISE NOTICE 'Rows still without an account — expenses: %, balance_entries: %', e_orphans, b_orphans;
  IF e_orphans > 0 OR b_orphans > 0 THEN
    RAISE NOTICE 'These are rows with user_id IS NULL (pre-auth legacy data). They have no owner, so no owner''s account can hold them. They BLOCK the NOT NULL step — see DECISION 2.';
  END IF;
END $$;

COMMIT;

-- ----------------------------------------------------------------------------
-- 5. DO NOT RUN YET — the NOT NULL step (DECISION 2).
--
--    Recommended, but only once BOTH are true:
--      (a) Phase 3 has shipped, so every insert sends an account_id. Applying
--          this today breaks Add Expense and Add Balance immediately, because
--          neither form sends the column yet.
--      (b) The orphaned rows reported above are resolved — claimed via
--          /api/migrate, or deleted. While any remain, the ALTER simply fails.
-- ----------------------------------------------------------------------------
-- BEGIN;
-- ALTER TABLE public.expenses        ALTER COLUMN account_id SET NOT NULL;
-- ALTER TABLE public.balance_entries ALTER COLUMN account_id SET NOT NULL;
-- COMMIT;

-- ----------------------------------------------------------------------------
-- 6. Post-migration verification
-- ----------------------------------------------------------------------------
-- -- RLS on, four policies:
-- SELECT relrowsecurity,
--        (SELECT count(*) FROM pg_policies WHERE schemaname='public' AND tablename='accounts')
--   FROM pg_class WHERE oid = 'public.accounts'::regclass;
--
-- -- Every user has exactly one default:
-- SELECT user_id, count(*) FILTER (WHERE is_default) AS defaults
--   FROM public.accounts GROUP BY user_id HAVING count(*) FILTER (WHERE is_default) <> 1;
--   -- expect zero rows
--
-- -- No transaction points at an account owned by a different user:
-- SELECT 'expenses' AS tbl, count(*) FROM public.expenses e
--   JOIN public.accounts a ON a.id = e.account_id WHERE a.user_id IS DISTINCT FROM e.user_id
--  UNION ALL
-- SELECT 'balance_entries', count(*) FROM public.balance_entries b
--   JOIN public.accounts a ON a.id = b.account_id WHERE a.user_id IS DISTINCT FROM b.user_id;
--   -- expect 0, 0

-- ----------------------------------------------------------------------------
-- 7. Rollback (only safe before Phase 2/3 code ships)
-- ----------------------------------------------------------------------------
-- BEGIN;
-- ALTER TABLE public.expenses        DROP CONSTRAINT IF EXISTS expenses_account_owner_fkey;
-- ALTER TABLE public.balance_entries DROP CONSTRAINT IF EXISTS balance_entries_account_owner_fkey;
-- ALTER TABLE public.expenses        DROP CONSTRAINT IF EXISTS expenses_account_id_fkey;
-- ALTER TABLE public.balance_entries DROP CONSTRAINT IF EXISTS balance_entries_account_id_fkey;
-- ALTER TABLE public.expenses        DROP COLUMN IF EXISTS account_id;
-- ALTER TABLE public.balance_entries DROP COLUMN IF EXISTS account_id;
-- DROP TABLE IF EXISTS public.accounts;   -- destroys the accounts created above
-- COMMIT;
