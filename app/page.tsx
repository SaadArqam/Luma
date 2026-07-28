import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getAccountOptions, ACCOUNT_REF_SELECT_EXPENSES } from '@/lib/accounts'
import { AccountCardStack, type AccountCardData } from '@/components/AccountCardStack'
import { AccountTag } from '@/components/AccountPicker'
import { DashboardChart } from '@/components/DashboardChart'
import { StipendWidget } from '@/components/StipendWidget'
import { BudgetOverview } from '@/components/BudgetOverview'
import { TodayCard } from '@/components/TodayCard'
import MigrationBanner from '@/components/MigrationBanner'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getCategoryColor } from '@/lib/category-colors'

export const dynamic = 'force-dynamic'

// Tables that can hold rows orphaned from before auth was added (see app/api/migrate/route.ts).
const CLAIMABLE_TABLES = ['expenses', 'categories', 'balance_entries', 'stipend_config'] as const

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // middleware.ts already redirects anonymous visitors; this narrows the type
  // so every query below can be scoped to the signed-in user.
  if (!user) redirect('/login')

  const userName = (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'there'

  // The migration banner is a legacy nicety and must never be able to take the
  // dashboard down. createAdminClient() throws when SUPABASE_SERVICE_ROLE_KEY
  // is unset — which is exactly the state between deploying this code and
  // adding the env var — so degrade to "no banner" instead of a 500.
  // The cron and /api/migrate routes deliberately still throw: unlike the
  // banner, they cannot do their job at all without the key.
  let admin: ReturnType<typeof createAdminClient> | null = null
  try {
    admin = createAdminClient()
  } catch (err) {
    console.warn('[dashboard] orphan-row check skipped:', (err as Error).message)
  }

  // Lightweight: names/logos only. The balances come from the aggregation below.
  const accountOptions = await getAccountOptions(supabase, user.id)

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd   = endOfMonth(now)

  // Fetch summary data — run in parallel instead of sequentially to avoid a request waterfall.
  //
  // This block gates the whole page: nothing (including the Today card, which
  // cannot start its own fetch until the HTML lands) renders until the slowest
  // query here resolves. So it stays scoped and bounded:
  //   • every query is filtered by user_id — previously they were not, which
  //     both leaked other users' rows into the totals and made each scan grow
  //     with the whole table rather than with one user's data
  //   • the all-time total selects `amount` only, with no category join
  //   • month stats are filtered in SQL rather than by pulling all history and
  //     filtering in JS
  const [creditsRes, debitsRes, allAmountsRes, monthExpensesRes, recentExpensesRes, settingsRes, ...claimableRes] = await Promise.all([
    // account_id rides along on the three all-time queries so the per-account
    // breakdown is derived from the very same rows as the headline total — no
    // extra round-trips, and the parts always sum to the whole.
    supabase.from('balance_entries').select('amount, account_id').eq('user_id', user.id).eq('type', 'credit'),
    supabase.from('balance_entries').select('amount, account_id').eq('user_id', user.id).eq('type', 'debit'),
    supabase.from('expenses').select('amount, account_id').eq('user_id', user.id),
    supabase.from('expenses')
      .select('amount, category:categories(id, name, icon)')
      .eq('user_id', user.id)
      .gte('date', monthStart.toISOString())
      .lte('date', monthEnd.toISOString()),
    supabase.from('expenses')
      .select(`*, category:categories(*), ${ACCOUNT_REF_SELECT_EXPENSES}`)
      .eq('user_id', user.id).order('date', { ascending: false }).limit(5),
    supabase.from('user_settings').select('migration_banner_dismissed').eq('user_id', user.id).maybeSingle(),
    // Orphan-row counts drive the migration banner. They must go through
    // service-role: `user_id IS NULL` rows match no owner policy, so under RLS
    // the anon client always counts zero and the banner never appears.
    ...(admin
      ? CLAIMABLE_TABLES.map((table) =>
          admin!.from(table).select('id', { count: 'exact', head: true }).is('user_id', null)
        )
      : []),
  ])

  const credits = creditsRes.data
  const debits = debitsRes.data
  const recentExpenses = recentExpensesRes.data
  if (recentExpensesRes.error) console.error('[dashboard] recent expenses query failed:', recentExpensesRes.error)
  if (creditsRes.error || debitsRes.error || allAmountsRes.error) {
    console.error('[dashboard] balance queries failed:', creditsRes.error ?? debitsRes.error ?? allAmountsRes.error)
  }
  const bannerDismissed = settingsRes.data?.migration_banner_dismissed ?? false
  const hasClaimableData = claimableRes.some((r) => (r.count ?? 0) > 0)

  const totalCredited  = credits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalDebited   = debits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalExpenses  = allAmountsRes.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalBalance   = totalCredited - totalDebited - totalExpenses

  // Per-account balances, from the same rows as the totals above.
  const perAccount = new Map<string | null, number>()
  const addRows = (rows: unknown[] | null | undefined, sign: 1 | -1) => {
    for (const row of rows ?? []) {
      const { amount, account_id } = row as { amount: number | string; account_id: string | null }
      const key = account_id ?? null
      perAccount.set(key, (perAccount.get(key) ?? 0) + sign * Number(amount))
    }
  }
  addRows(credits, 1)
  addRows(debits, -1)
  addRows(allAmountsRes.data, -1)

  const accountBalances: { id: string | null; name: string; bank_name: string | null; bank_domain: string | null; balance: number; is_default: boolean }[] = accountOptions.map((a) => ({
    id: a.id,
    name: a.name,
    bank_name: a.bank_name,
    bank_domain: a.bank_domain,
    balance: perAccount.get(a.id) ?? 0,
    is_default: a.is_default,
  }))

  // Transactions written before account selection existed have no account. Show
  // them explicitly, otherwise the rows would not add up to the total.
  const unassigned = perAccount.get(null) ?? 0
  if (unassigned !== 0) {
    accountBalances.push({
      id: null, name: 'Unassigned', bank_name: null, bank_domain: null, balance: unassigned, is_default: false,
    })
  }

  // Same rows/order the account breakdown always used (server-sorted,
  // is_default first, Unassigned last) — just reshaped for AccountCardStack.
  // "Unassigned" is a bucket, not an account, so it's excluded from the count
  // shown on the combined card, matching the old BalanceCard behaviour.
  const realAccountCount = accountBalances.filter((a) => a.id !== null).length
  const accountCards: AccountCardData[] = [
    {
      id: 'total',
      name: 'Combined',
      bank_name: null,
      bank_domain: null,
      balance: totalBalance,
      subtitle: `${realAccountCount} ${realAccountCount === 1 ? 'account' : 'accounts'}`,
    },
    ...accountBalances.map((a) => ({
      id: a.id ?? 'unassigned',
      name: a.name,
      bank_name: a.bank_name,
      bank_domain: a.bank_domain,
      balance: a.balance,
      subtitle: a.id === null ? 'Unassigned' : a.is_default ? 'Default account' : 'Account',
    })),
  ]

  // Current month stats — the rows are already month-scoped by the query above.
  let totalSpentThisMonth = 0
  let transactionCount    = 0
  const categoryTotals: Record<string, { name: string; icon: string; total: number }> = {}

  monthExpensesRes.data?.forEach((expense: any) => {
    const amt = Number(expense.amount)
    totalSpentThisMonth += amt
    transactionCount    += 1
    const cat = expense.category
    if (cat) {
      if (!categoryTotals[cat.id]) categoryTotals[cat.id] = { name: cat.name, icon: cat.icon, total: 0 }
      categoryTotals[cat.id].total += amt
    }
  })

  const spendingByCategory = Object.values(categoryTotals).sort((a, b) => b.total - a.total)

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

      {/* ── Header greeting ─────────────────────── */}
      <div className="px-1 pt-2">
        <h1 className="font-fraunces text-2xl font-bold tracking-tight text-luma-text">
          Paisa<span className="text-luma-accent">Track</span>
        </h1>
        <p className="text-body-muted-luma text-sm mt-0.5">
          Hey {userName} · {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <MigrationBanner hasClaimableData={hasClaimableData} initialDismissed={bannerDismissed} />

      {/* ── Today Card + Quick Add + Streak ─────── */}
      <TodayCard />

      {/* ── Stat cards (demoted — reference info) ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Balance — combined across accounts, expands to a breakdown */}
        <div className="col-span-2">
          <AccountCardStack accounts={accountCards} variant="full" />
        </div>

        {/* Smaller reference cards */}
        <div className="glass-card p-3 rounded-[20px] flex flex-col justify-between" style={{ borderTop: '2px solid var(--luma-success)' }}>
          <div className="flex flex-row items-center justify-between pb-1">
            <h3 className="font-fraunces text-header-card text-luma-muted text-xs">Credited</h3>
            <TrendingUp className="h-3.5 w-3.5 text-luma-success" />
          </div>
          <div className="text-number-card text-luma-text">₹{totalCredited.toLocaleString('en-IN')}</div>
        </div>

        <div className="glass-card p-3 rounded-[20px] flex flex-col justify-between" style={{ borderTop: '2px solid var(--luma-danger)' }}>
          <div className="flex flex-row items-center justify-between pb-1">
            <h3 className="font-fraunces text-header-card text-luma-muted text-xs">This Month</h3>
            <TrendingDown className="h-3.5 w-3.5 text-luma-danger" />
          </div>
          <div className="text-number-card text-luma-text">₹{totalSpentThisMonth.toLocaleString('en-IN')}</div>
        </div>

        <div className="col-span-2 glass-card p-3 px-4 rounded-[20px] flex flex-row items-center gap-3" style={{ borderTop: '2px solid var(--luma-info)' }}>
          <Activity className="h-4 w-4 text-luma-info shrink-0" />
          <div>
            <p className="font-fraunces text-header-card text-luma-muted text-xs">Transactions this month</p>
            <p className="text-number-card text-luma-text">{transactionCount}</p>
          </div>
        </div>
      </div>

      {/* ── Stipend widget ───────────────────────── */}
      <StipendWidget />

      {/* ── Budget overview ──────────────────────── */}
      <BudgetOverview />

      {/* ── Spending by Category + Recent Expenses ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-2 lg:col-span-3 space-y-3">
          <h2 className="font-fraunces text-header-section text-luma-text flex items-center gap-2">
            <div style={{ width: 3, height: 18, backgroundColor: 'var(--luma-accent)', borderRadius: 2 }} />
            <span>Spending by Category</span>
          </h2>
          <DashboardChart data={spendingByCategory} />
        </div>

        <div className="col-span-2 lg:col-span-4 space-y-3">
          <h2 className="font-fraunces text-header-section text-luma-text flex items-center gap-2">
            <div style={{ width: 3, height: 18, backgroundColor: 'var(--luma-accent)', borderRadius: 2 }} />
            <span>Recent Expenses</span>
          </h2>
          <div className="solid-list-card rounded-[20px] border border-luma-hairline">
            <Table>
              <TableHeader className="bg-luma-raised">
                <TableRow className="border-b border-luma-hairline">
                  <TableHead className="font-fraunces text-luma-muted">Category</TableHead>
                  <TableHead className="font-fraunces text-luma-muted">Date</TableHead>
                  <TableHead className="font-fraunces text-luma-muted">Note</TableHead>
                  <TableHead className="font-fraunces text-luma-muted text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses && recentExpenses.length > 0 ? (
                  recentExpenses.map((expense) => (
                    <TableRow key={expense.id} className="border-b border-luma-specular hover:bg-luma-raised/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: getCategoryColor(expense.category?.name || expense.category?.id || 'default'),
                            }}
                          />
                          <span className="text-lg bg-luma-raised rounded-full p-1 border border-luma-hairline">{expense.category?.icon}</span>
                          <span className="font-fraunces text-sm font-medium text-luma-text">{expense.category?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-body-muted-luma text-xs whitespace-nowrap font-inter font-tnum">
                        {format(new Date(expense.date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-body-muted-luma text-xs">
                        <span className="block truncate">{expense.note || '-'}</span>
                        <AccountTag account={expense.account} />
                      </TableCell>
                      <TableCell className="text-right text-number-card text-luma-text">
                        ₹{Number(expense.amount).toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32 text-body-muted-luma">
                      No recent expenses
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

    </div>
  )
}
