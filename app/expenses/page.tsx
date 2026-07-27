import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ExpenseManager } from '@/components/ExpenseManager'
import { getAccountOptions, ACCOUNT_REF_SELECT } from '@/lib/accounts'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Accounts first: this bootstraps a default account for a brand-new user, so
  // the form below always has something to attach the expense to.
  const accounts = await getAccountOptions(supabase, user.id)

  const [{ data: categories }, { data: expenses }] = await Promise.all([
    supabase.from('categories').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    supabase.from('expenses')
      .select(`*, category:categories(*), ${ACCOUNT_REF_SELECT}`)
      .eq('user_id', user.id)
      .order('date', { ascending: false }),
  ])

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full overflow-x-hidden">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-0 sm:px-6 pt-6 pb-2">
        <h1 className="font-fraunces text-header-display text-luma-text">Expenses</h1>
        <p className="text-body-muted-luma mt-2">Track and manage your spending</p>
      </div>

      <ExpenseManager
        categories={categories || []}
        initialExpenses={expenses || []}
        accounts={accounts}
      />
    </div>
  )
}
