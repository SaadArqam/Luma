import { createClient } from '@/lib/supabase-server'
import { DashboardChart } from '@/components/DashboardChart'
import { StipendWidget } from '@/components/StipendWidget'
import { BudgetOverview } from '@/components/BudgetOverview'
import { RecurringSection } from '@/components/RecurringSection'
import { TodayCard } from '@/components/TodayCard'
import MigrationBanner from '@/components/MigrationBanner'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { TrendingUp, TrendingDown, Activity, Wallet } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there'

  // Fetch summary data
  const { data: credits } = await supabase.from('balance_entries').select('amount').eq('type', 'credit')
  const { data: debits }  = await supabase.from('balance_entries').select('amount').eq('type', 'debit')
  const { data: allExpenses } = await supabase.from('expenses').select('amount, date, category:categories(id, name, icon)')

  const totalCredited  = credits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalDebited   = debits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalExpenses  = allExpenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalBalance   = totalCredited - totalDebited - totalExpenses

  // Current month stats
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd   = endOfMonth(now)

  let totalSpentThisMonth = 0
  let transactionCount    = 0
  const categoryTotals: Record<string, { name: string; icon: string; total: number }> = {}

  allExpenses?.forEach((expense: any) => {
    const expDate = new Date(expense.date)
    if (expDate >= monthStart && expDate <= monthEnd) {
      const amt = Number(expense.amount)
      totalSpentThisMonth += amt
      transactionCount    += 1
      const cat = expense.category
      if (cat) {
        if (!categoryTotals[cat.id]) categoryTotals[cat.id] = { name: cat.name, icon: cat.icon, total: 0 }
        categoryTotals[cat.id].total += amt
      }
    }
  })

  const spendingByCategory = Object.values(categoryTotals).sort((a, b) => b.total - a.total)

  // Last 5 expenses
  const { data: recentExpenses } = await supabase
    .from('expenses')
    .select('*, category:categories(*)')
    .order('date', { ascending: false })
    .limit(5)

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header greeting ─────────────────────── */}
      <div className="px-1 pt-2">
        <h1 className="font-fraunces text-2xl font-bold tracking-tight text-[#F2EFEA]">
          Paisa<span className="text-[#E17A4D]">Track</span>
        </h1>
        <p className="text-body-muted-luma text-sm mt-0.5">
          Hey {userName} · {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <MigrationBanner />

      {/* ── Today Card + Quick Add + Streak ─────── */}
      <TodayCard />

      {/* ── Recurring upcoming payments ──────────── */}
      <RecurringSection />

      {/* ── Stat cards (demoted — reference info) ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Balance — kept prominent, full width */}
        <div
          className="col-span-2 glass-card p-4 rounded-[20px] relative overflow-hidden flex flex-col justify-between"
          style={{ borderTop: '2px solid #E17A4D' }}
        >
          <div className="absolute right-0 top-0 opacity-[0.05] transform translate-x-1/4 -translate-y-1/4">
            <Wallet className="w-28 h-28 text-[#F2EFEA]" />
          </div>
          <div className="flex flex-row items-center justify-between pb-1">
            <h3 className="font-fraunces text-header-card text-[#8A8790]">Current Balance</h3>
            <Wallet className="h-4 w-4 text-[#8A8790]" />
          </div>
          <div className="font-inter font-bold font-tnum text-number-card text-[#F2EFEA] text-3xl mt-1">
            ₹{totalBalance.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Smaller reference cards */}
        <div className="glass-card p-3 rounded-[20px] flex flex-col justify-between" style={{ borderTop: '2px solid #7FB69E' }}>
          <div className="flex flex-row items-center justify-between pb-1">
            <h3 className="font-fraunces text-header-card text-[#8A8790] text-xs">Credited</h3>
            <TrendingUp className="h-3.5 w-3.5 text-[#7FB69E]" />
          </div>
          <div className="font-inter font-bold font-tnum text-lg text-[#F2EFEA]">₹{totalCredited.toLocaleString('en-IN')}</div>
        </div>

        <div className="glass-card p-3 rounded-[20px] flex flex-col justify-between" style={{ borderTop: '2px solid #C4595A' }}>
          <div className="flex flex-row items-center justify-between pb-1">
            <h3 className="font-fraunces text-header-card text-[#8A8790] text-xs">This Month</h3>
            <TrendingDown className="h-3.5 w-3.5 text-[#C4595A]" />
          </div>
          <div className="font-inter font-bold font-tnum text-lg text-[#F2EFEA]">₹{totalSpentThisMonth.toLocaleString('en-IN')}</div>
        </div>

        <div className="col-span-2 glass-card p-3 px-4 rounded-[20px] flex flex-row items-center gap-3" style={{ borderTop: '2px solid #8AA9C4' }}>
          <Activity className="h-4 w-4 text-[#8AA9C4] shrink-0" />
          <div>
            <p className="font-fraunces text-header-card text-[#8A8790] text-xs">Transactions this month</p>
            <p className="font-inter font-bold font-tnum text-lg text-[#F2EFEA]">{transactionCount}</p>
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
          <h2 className="font-fraunces text-header-section text-[#F2EFEA] flex items-center gap-2">
            <div style={{ width: 3, height: 18, backgroundColor: '#E17A4D', borderRadius: 2 }} />
            <span>Spending by Category</span>
          </h2>
          <DashboardChart data={spendingByCategory} />
        </div>

        <div className="col-span-2 lg:col-span-4 space-y-3">
          <h2 className="font-fraunces text-header-section text-[#F2EFEA] flex items-center gap-2">
            <div style={{ width: 3, height: 18, backgroundColor: '#E17A4D', borderRadius: 2 }} />
            <span>Recent Expenses</span>
          </h2>
          <div className="solid-list-card rounded-[20px] border border-[rgba(255,255,255,0.09)]">
            <Table>
              <TableHeader className="bg-[#2B2C33]">
                <TableRow className="border-b border-[rgba(255,255,255,0.09)]">
                  <TableHead className="font-fraunces text-[#8A8790]">Category</TableHead>
                  <TableHead className="font-fraunces text-[#8A8790]">Date</TableHead>
                  <TableHead className="font-fraunces text-[#8A8790]">Note</TableHead>
                  <TableHead className="font-fraunces text-[#8A8790] text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses && recentExpenses.length > 0 ? (
                  recentExpenses.map((expense) => (
                    <TableRow key={expense.id} className="border-b border-[rgba(255,255,255,0.06)] hover:bg-[#2B2C33]/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              display: 'inline-block', width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                              backgroundColor:
                                expense.category?.name === 'Travel' ? '#8AA9C4'
                                : expense.category?.name === 'Food' ? '#7FB69E'
                                : '#E17A4D',
                            }}
                          />
                          <span className="text-lg bg-[#2B2C33] rounded-full p-1 border border-[rgba(255,255,255,0.09)]">{expense.category?.icon}</span>
                          <span className="font-fraunces text-sm font-medium text-[#F2EFEA]">{expense.category?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-body-muted-luma text-xs whitespace-nowrap font-inter font-tnum">
                        {format(new Date(expense.date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-body-muted-luma text-xs">{expense.note || '-'}</TableCell>
                      <TableCell className="text-right font-inter font-bold font-tnum text-sm text-[#F2EFEA]">
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
