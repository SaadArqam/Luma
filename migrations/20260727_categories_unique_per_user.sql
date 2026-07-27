-- ============================================================================
-- Scope the categories name uniqueness to each user.
--
-- `categories.name` carries a GLOBAL unique constraint (categories_name_key) —
-- a leftover from before auth existed, when there was only ever one user. It is
-- in no migration file in this repo; it was added directly to the database, the
-- same drift as recurring_expenses.user_id.
--
-- Two consequences, both launch blockers:
--   1. Creating a category fails with "duplicate key value violates unique
--      constraint categories_name_key" whenever ANY other user already has that
--      name. One user claiming "Food" blocks it for everybody.
--   2. Worse, it is silent: app/categories/page.tsx seeds Food/Travel/Shopping
--      for a new user and ignores the insert error, so a second user's seeding
--      fails and the page then shows NO categories at all.
--
-- After this, each user has their own namespace: two users can both have "Food",
-- one user still cannot have two.
--
-- Idempotent and transactional.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Pre-flight — run FIRST, separately.
-- ----------------------------------------------------------------------------
-- -- 1. Confirm the global constraint, and catch any siblings on other tables.
-- --    Anything listed here that is scoped to a single non-user column is
-- --    suspect for exactly the same reason.
-- SELECT c.conname, c.conrelid::regclass AS tbl,
--        pg_get_constraintdef(c.oid) AS definition
--   FROM pg_constraint c
--   JOIN pg_namespace n ON n.oid = c.connamespace
--  WHERE n.nspname = 'public' AND c.contype = 'u'
--  ORDER BY c.conrelid::regclass::text, c.conname;
--
-- -- 2. Would the new per-user constraint be violated? Expect zero rows.
-- SELECT user_id, name, count(*)
--   FROM categories GROUP BY user_id, name HAVING count(*) > 1;

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Refuse to proceed if any single user already holds a duplicate name —
--    otherwise the new constraint fails with a less helpful message.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  dupes int;
BEGIN
  SELECT count(*) INTO dupes FROM (
    SELECT 1 FROM public.categories
     GROUP BY user_id, name HAVING count(*) > 1
  ) d;

  IF dupes > 0 THEN
    RAISE EXCEPTION
      'Cannot scope the constraint: % (user_id, name) pair(s) are already duplicated. Run the pre-flight query above, merge or rename those categories, then re-run. Nothing has been changed.',
      dupes;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. Drop the global uniqueness on name.
--    Targets the known constraint name, then sweeps the catalog for any other
--    unique constraint or bare unique index covering name alone — the original
--    is not in version control, so its name cannot be fully trusted.
-- ----------------------------------------------------------------------------
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_name_key;

DO $$
DECLARE
  obj record;
BEGIN
  -- Unique CONSTRAINTs on exactly (name)
  FOR obj IN
    SELECT c.conname
      FROM pg_constraint c
     WHERE c.conrelid = 'public.categories'::regclass
       AND c.contype = 'u'
       AND c.conkey = ARRAY[
             (SELECT attnum FROM pg_attribute
               WHERE attrelid = 'public.categories'::regclass AND attname = 'name')
           ]::smallint[]
  LOOP
    EXECUTE format('ALTER TABLE public.categories DROP CONSTRAINT %I', obj.conname);
    RAISE NOTICE 'Dropped global unique constraint on categories(name): %', obj.conname;
  END LOOP;

  -- Unique INDEXes on exactly (name) that are not backing a constraint
  FOR obj IN
    SELECT i.relname AS conname
      FROM pg_index x
      JOIN pg_class i ON i.oid = x.indexrelid
     WHERE x.indrelid = 'public.categories'::regclass
       AND x.indisunique
       AND NOT EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conindid = x.indexrelid)
       AND x.indkey::text = (
             SELECT attnum::text FROM pg_attribute
              WHERE attrelid = 'public.categories'::regclass AND attname = 'name')
  LOOP
    EXECUTE format('DROP INDEX public.%I', obj.conname);
    RAISE NOTICE 'Dropped global unique index on categories(name): %', obj.conname;
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Add the per-user constraint.
--    Rows with user_id IS NULL are exempt (NULLs compare as distinct in a
--    unique constraint), which is correct — ownerless legacy rows are already
--    invisible under RLS.
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_user_id_name_key') THEN
    ALTER TABLE public.categories
      ADD CONSTRAINT categories_user_id_name_key UNIQUE (user_id, name);
    RAISE NOTICE 'Added per-user uniqueness: categories(user_id, name)';
  END IF;
END $$;

COMMIT;

-- ----------------------------------------------------------------------------
-- Verification — expect exactly one unique constraint, on (user_id, name).
-- ----------------------------------------------------------------------------
-- SELECT conname, pg_get_constraintdef(oid)
--   FROM pg_constraint
--  WHERE conrelid = 'public.categories'::regclass AND contype = 'u';
--
-- Optional, if you would also like "Food" and "food" treated as the same name
-- within one user (this migration keeps the original case-sensitive behaviour):
--   ALTER TABLE public.categories DROP CONSTRAINT categories_user_id_name_key;
--   CREATE UNIQUE INDEX categories_user_id_lower_name_key
--     ON public.categories (user_id, lower(name));
