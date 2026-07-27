-- ============================================================================
-- Assign every remaining unassigned transaction, then require an account.
--
-- Why this exists: the Phase 1 migration backfilled account_id for everything
-- that existed when it ran, but the expense/balance forms only started SENDING
-- an account when Phase 3 shipped. Anything added in between has
-- account_id = NULL, which is what surfaces as the "Unassigned" row on the
-- dashboard's balance breakdown.
--
-- This supersedes the commented-out NOT NULL block in
-- migrations/20260727_multi_account_phase1.sql (section 5) — both preconditions
-- named there are now met: the forms always send an account, and the API now
-- falls back to the default account if a stale client omits it.
--
-- Idempotent and transactional: safe to re-run, and rolls back cleanly if
-- anything is left unassignable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Pre-flight — run FIRST, on its own. Shows exactly what is about to move and
-- where it will land.
-- ----------------------------------------------------------------------------
-- SELECT 'expenses' AS tbl, count(*) AS unassigned, coalesce(sum(amount), 0) AS amount
--   FROM expenses WHERE user_id IS NOT NULL AND account_id IS NULL
--  UNION ALL
-- SELECT 'balance_entries', count(*), coalesce(sum(amount), 0)
--   FROM balance_entries WHERE user_id IS NOT NULL AND account_id IS NULL;
--
-- -- Which account each user's rows will be assigned to:
-- SELECT user_id, name FROM accounts WHERE is_default;

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Assign unassigned rows to their owner's default account.
--    Same rule the Phase 1 backfill used, so nothing lands on a stranger's
--    account: matched on user_id, restricted to that user's default.
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 2. Anything still unassigned can only be a legacy row with user_id IS NULL —
--    it has no owner, so no owner's account can hold it. Stop with a message
--    that says what to do, rather than letting the ALTER below fail obscurely.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  e_left int;
  b_left int;
BEGIN
  SELECT count(*) INTO e_left FROM public.expenses        WHERE account_id IS NULL;
  SELECT count(*) INTO b_left FROM public.balance_entries WHERE account_id IS NULL;

  IF e_left > 0 OR b_left > 0 THEN
    RAISE EXCEPTION
      'Still unassigned after backfill (expenses: %, balance_entries: %). These are ownerless rows with user_id IS NULL. Claim them first via the app''s migration banner, or delete them, then re-run. Nothing has been changed.',
      e_left, b_left;
  END IF;

  RAISE NOTICE 'All transactions now belong to an account.';
END $$;

-- ----------------------------------------------------------------------------
-- 3. Require an account from here on, so "Unassigned" can never come back.
-- ----------------------------------------------------------------------------
ALTER TABLE public.expenses        ALTER COLUMN account_id SET NOT NULL;
ALTER TABLE public.balance_entries ALTER COLUMN account_id SET NOT NULL;

COMMIT;

-- ----------------------------------------------------------------------------
-- Verification — expect zero rows from the first query, and 'NO' from both
-- rows of the second.
-- ----------------------------------------------------------------------------
-- SELECT 'expenses' AS tbl, count(*) FROM expenses WHERE account_id IS NULL
--  UNION ALL
-- SELECT 'balance_entries', count(*) FROM balance_entries WHERE account_id IS NULL;
--
-- SELECT table_name, column_name, is_nullable
--   FROM information_schema.columns
--  WHERE table_schema = 'public' AND column_name = 'account_id'
--    AND table_name IN ('expenses', 'balance_entries');
