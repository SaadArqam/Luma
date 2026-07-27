import type { createClient } from '@/lib/supabase-server'
import type { AccountType } from '@/lib/banks'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export type AccountWithBalance = {
  id: string
  name: string
  bank_name: string | null
  bank_domain: string | null
  account_type: AccountType
  is_default: boolean
  created_at: string
  credited: number
  debited: number
  spent: number
  txCount: number
  balance: number
}

/** Minimal account shape for display next to a transaction. */
export type AccountRef = {
  id: string
  name: string
  bank_name: string | null
  bank_domain: string | null
}

export const ACCOUNT_SELECT = 'id, name, bank_name, bank_domain, account_type, is_default, created_at'

/**
 * Embedded on transaction rows so history can show which account they belong to.
 *
 * The `!constraint` hint is NOT optional. Each transaction table has TWO foreign
 * keys to accounts — the plain `account_id` one and the composite
 * `(user_id, account_id)` ownership one — and with more than one relationship
 * PostgREST refuses to guess: it rejects the WHOLE query with PGRST201 rather
 * than embedding. Because the call sites read `data` without checking `error`,
 * that surfaced as empty expense and balance history, which looks exactly like
 * data loss. Name the constraint and the ambiguity disappears.
 */
const ACCOUNT_REF_COLUMNS = 'id, name, bank_name, bank_domain'
export const ACCOUNT_REF_SELECT_EXPENSES =
  `account:accounts!expenses_account_id_fkey(${ACCOUNT_REF_COLUMNS})`
export const ACCOUNT_REF_SELECT_BALANCE =
  `account:accounts!balance_entries_account_id_fkey(${ACCOUNT_REF_COLUMNS})`

/**
 * Guarantee the user has at least one account.
 *
 * The Phase 1 migration backfilled a "Primary Account" for everyone who existed
 * at the time, but anyone signing up afterwards would have none — and then the
 * expense and balance forms would have nothing to attach a transaction to. This
 * lazily bootstraps one on first use, the same way the categories page seeds
 * default categories.
 *
 * Idempotent: inserts only when the count is zero.
 */
export async function ensureDefaultAccount(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<void> {
  const { count } = await supabase
    .from('accounts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if ((count ?? 0) > 0) return

  await supabase.from('accounts').insert({
    user_id: userId,
    name: 'Primary Account',
    account_type: 'other',
    is_default: true,
  })
}

/** What a form's account picker needs — no balance maths involved. */
export type AccountOption = AccountRef & { is_default: boolean }

/**
 * Accounts for a user, for populating a picker.
 *
 * Deliberately separate from `getAccountsWithBalances`: computing balances means
 * reading every expense and balance entry, and the expense/balance pages already
 * fetch their own transactions. Using the balance version there would pull the
 * same rows twice for data the form never shows.
 */
export async function getAccountOptions(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<AccountOption[]> {
  await ensureDefaultAccount(supabase, userId)

  const { data, error } = await supabase
    .from('accounts')
    .select('id, name, bank_name, bank_domain, is_default')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as AccountOption[]
}

/**
 * Accounts for a user, each with its derived balance.
 *
 * Balances are computed, never stored: credits − debits − expenses. Shared by
 * the accounts page (server render, so the list paints with the HTML) and
 * GET /api/accounts (used to refresh after a mutation), so the two can't drift.
 *
 * Three scoped queries aggregated in memory rather than one pair per account,
 * so adding accounts doesn't add round-trips.
 */
export async function getAccountsWithBalances(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<AccountWithBalance[]> {
  // Bootstrap before reading, so every caller — pages and the API alike — can
  // rely on the list being non-empty and the forms always having a default.
  await ensureDefaultAccount(supabase, userId)

  const [accountsRes, balanceRes, expensesRes] = await Promise.all([
    supabase.from('accounts').select(ACCOUNT_SELECT)
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true }),
    supabase.from('balance_entries').select('account_id, type, amount').eq('user_id', userId),
    supabase.from('expenses').select('account_id, amount').eq('user_id', userId),
  ])

  if (accountsRes.error) throw accountsRes.error

  const totals = new Map<string, { credited: number; debited: number; spent: number; txCount: number }>()
  const bucket = (id: string | null) => {
    if (!id) return null
    if (!totals.has(id)) totals.set(id, { credited: 0, debited: 0, spent: 0, txCount: 0 })
    return totals.get(id)!
  }

  for (const row of balanceRes.data ?? []) {
    const t = bucket(row.account_id)
    if (!t) continue
    if (row.type === 'credit') t.credited += Number(row.amount)
    else t.debited += Number(row.amount)
    t.txCount += 1
  }
  for (const row of expensesRes.data ?? []) {
    const t = bucket(row.account_id)
    if (!t) continue
    t.spent += Number(row.amount)
    t.txCount += 1
  }

  return (accountsRes.data ?? []).map((a) => {
    const t = totals.get(a.id) ?? { credited: 0, debited: 0, spent: 0, txCount: 0 }
    // Cast because this project has no generated Supabase types, so `select()`
    // returns a loose row shape rather than the column list above.
    const row = a as unknown as Omit<AccountWithBalance, 'credited' | 'debited' | 'spent' | 'txCount' | 'balance'>
    return { ...row, ...t, balance: t.credited - t.debited - t.spent }
  })
}
