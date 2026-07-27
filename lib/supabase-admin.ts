import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client. **This bypasses Row Level Security.**
 *
 * Only for server-side work that legitimately spans users and therefore has no
 * `auth.uid()` to be scoped by:
 *   • the notification crons, which must read every user's preferences and
 *     expenses to decide who to push to
 *   • the legacy orphan-row claim in /api/migrate, which by definition touches
 *     rows where user_id IS NULL and no owner policy can match
 *
 * Everything reachable from a browser request must keep using
 * `lib/supabase-server.ts` (anon key + the caller's cookie session) so RLS
 * stays in force. Any query made with this client is responsible for its own
 * `.eq('user_id', …)` scoping — the database will not do it for you.
 *
 * `server-only` makes importing this from a client component a build error, so
 * the key can never be bundled into the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY (and NEXT_PUBLIC_SUPABASE_URL) must be set. ' +
      'Cron and migration routes need it to read across users once RLS is enabled. ' +
      'Copy it from Supabase → Project Settings → API → service_role, and set it ' +
      'as a server-side environment variable. Never expose it to the browser.'
    )
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
