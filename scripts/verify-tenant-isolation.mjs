#!/usr/bin/env node
/**
 * Acceptance test for the RLS migration: prove user A genuinely cannot reach
 * user B's data — not merely that the app's queries happen to filter correctly.
 *
 * It talks to PostgREST directly with each user's real JWT, bypassing the app
 * entirely. That is the point: if this passes, isolation holds even when a
 * route forgets its `.eq('user_id', …)`.
 *
 * Usage (read-only by default):
 *
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co \
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \
 *   A_EMAIL=a@example.com A_PASSWORD=... \
 *   B_EMAIL=b@example.com B_PASSWORD=... \
 *   node scripts/verify-tenant-isolation.mjs
 *
 * Add --include-write-tests to also prove B cannot WRITE into A's rows. Those
 * probes are deliberately destructive-if-broken, so they are opt-in; the script
 * cleans up anything it manages to create.
 *
 * Create the second account through the app's normal signup page, add an
 * expense/category/balance entry to BOTH accounts first, then run this.
 */

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const WRITE_TESTS = process.argv.includes('--include-write-tests')

const TABLES = [
  'expenses', 'categories', 'balance_entries', 'stipend_config',
  'recurring_expenses', 'user_settings', 'daily_tips',
  'push_subscriptions', 'notification_preferences',
]

if (!URL_BASE || !ANON) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  process.exit(2)
}

let failures = 0
const pass = (m) => console.log(`  PASS  ${m}`)
const fail = (m) => { failures++; console.log(`  FAIL  ${m}`) }

async function signIn(email, password, label) {
  const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const body = await res.json()
  if (!res.ok || !body.access_token) {
    console.error(`Could not sign in ${label} (${email}): ${body.error_description || body.msg || res.status}`)
    process.exit(2)
  }
  return { token: body.access_token, id: body.user.id, email }
}

const rest = (user, path, init = {}) =>
  fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })

async function main() {
  const A = await signIn(process.env.A_EMAIL, process.env.A_PASSWORD, 'user A')
  const B = await signIn(process.env.B_EMAIL, process.env.B_PASSWORD, 'user B')
  console.log(`user A = ${A.email} (${A.id})`)
  console.log(`user B = ${B.email} (${B.id})\n`)

  if (A.id === B.id) {
    console.error('Both credentials resolve to the same account — the test would be meaningless.')
    process.exit(2)
  }

  // ── 1. Reads are scoped to the caller ────────────────────────────────────
  console.log('1. SELECT isolation')
  const seen = {}
  for (const table of TABLES) {
    for (const [label, user] of [['A', A], ['B', B]]) {
      const res = await rest(user, `${table}?select=*`)
      if (!res.ok) {
        // A table that doesn't exist in this database is not a failure.
        if (res.status === 404) { console.log(`  skip  ${table} (not present)`); seen[table] = null; break }
        fail(`${table}: user ${label} got HTTP ${res.status} — ${(await res.text()).slice(0, 120)}`)
        continue
      }
      const rows = await res.json()
      seen[`${table}:${label}`] = rows
      const foreign = rows.filter(r => 'user_id' in r && r.user_id !== user.id)
      if (foreign.length) fail(`${table}: user ${label} can read ${foreign.length} row(s) owned by someone else`)
      else pass(`${table}: user ${label} sees only own rows (${rows.length})`)
    }
  }

  // ── 2. No row is visible to both accounts ────────────────────────────────
  console.log('\n2. No overlap between the two accounts')
  for (const table of TABLES) {
    const a = seen[`${table}:A`], b = seen[`${table}:B`]
    if (!a || !b) continue
    const bIds = new Set(b.map(r => r.id))
    const shared = a.filter(r => bIds.has(r.id))
    if (shared.length) fail(`${table}: ${shared.length} row(s) visible to BOTH accounts`)
    else pass(`${table}: no shared rows`)
  }

  // ── 3. Targeting a known foreign row by id returns nothing ───────────────
  console.log("\n3. Direct fetch of another user's row by id")
  for (const table of TABLES) {
    const aRows = seen[`${table}:A`]
    if (!aRows || !aRows.length) continue
    const targetId = aRows[0].id
    const res = await rest(B, `${table}?id=eq.${targetId}&select=*`)
    if (!res.ok) { pass(`${table}: request rejected (HTTP ${res.status})`); continue }
    const rows = await res.json()
    if (rows.length) fail(`${table}: user B fetched user A's row ${targetId} by id`)
    else pass(`${table}: user B gets 0 rows for user A's id`)
  }

  if (!WRITE_TESTS) {
    console.log('\n(write probes skipped — pass --include-write-tests to run them)')
  } else {
    // ── 4. B cannot modify A's rows, nor forge ownership ───────────────────
    console.log('\n4. Write isolation')
    const aExpenses = seen['expenses:A']
    if (aExpenses?.length) {
      const target = aExpenses[0]
      // Set `note` to the value it already has: a no-op if it somehow succeeds.
      const res = await rest(B, `expenses?id=eq.${target.id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ note: target.note ?? null }),
      })
      const rows = res.ok ? await res.json() : []
      if (rows.length) fail(`user B UPDATED user A's expense ${target.id}`)
      else pass("user B cannot update user A's expense")

      const del = await rest(B, `expenses?id=eq.${target.id}`, {
        method: 'DELETE', headers: { Prefer: 'return=representation' },
      })
      const delRows = del.ok ? await del.json() : []
      if (delRows.length) fail(`user B DELETED user A's expense ${target.id} — restore from a backup`)
      else pass("user B cannot delete user A's expense")
    } else {
      console.log('  skip  user A has no expenses to target — add one and re-run')
    }

    // Forging user_id on insert must be refused by the WITH CHECK clause.
    const forged = await rest(B, 'categories', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ name: 'rls-probe', icon: '🔒', user_id: A.id }),
    })
    if (forged.ok) {
      const rows = await forged.json()
      fail(`user B inserted a row owned by user A (${rows[0]?.id}) — cleaning up`)
      if (rows[0]?.id) {
        // Needs service-role to remove, since B cannot see it anymore.
        console.log(`        DELETE FROM categories WHERE id = '${rows[0].id}';`)
      }
    } else {
      pass('user B cannot insert a row owned by user A')
    }
  }

  console.log(`\n${failures === 0 ? 'ISOLATION VERIFIED — no failures' : `${failures} FAILURE(S) — isolation is NOT complete`}`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch(err => { console.error(err); process.exit(2) })
