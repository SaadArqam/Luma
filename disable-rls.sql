-- ############################################################################
-- ##  DO NOT RUN. SUPERSEDED BY migrations/20260727_enable_rls.sql          ##
-- ##                                                                        ##
-- ##  This script turns OFF Row Level Security. Running it re-opens the     ##
-- ##  cross-account data leak that 20260727_enable_rls.sql was written to   ##
-- ##  close: with RLS off, any signed-in user can read every other user's   ##
-- ##  expenses, balances and categories.                                    ##
-- ##                                                                        ##
-- ##  Kept only as a record of how the database was previously configured.  ##
-- ##  If you hit "RLS errors", the fix is a missing user_id on an insert or ##
-- ##  a server-side job that needs the service-role client                  ##
-- ##  (lib/supabase-admin.ts) — not disabling RLS.                          ##
-- ############################################################################

-- Disable Row Level Security on all tables
-- Run this if you already created your tables and are getting RLS errors

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE balance_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE stipend_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses DISABLE ROW LEVEL SECURITY;

-- Optional: If you want to drop RLS completely (but disable is usually enough)
-- ALTER TABLE categories NO FORCE ROW LEVEL SECURITY;
-- ALTER TABLE expenses NO FORCE ROW LEVEL SECURITY;
-- ALTER TABLE balance_entries NO FORCE ROW LEVEL SECURITY;
-- ALTER TABLE stipend_config NO FORCE ROW LEVEL SECURITY;
