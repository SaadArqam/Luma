import { createClient } from '@/lib/supabase-server'
import { ExpenseManager } from '@/components/ExpenseManager'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  const supabase = await createClient()
  
  const [{ data: categories }, { data: expenses }] = await Promise.all([
    supabase.from('categories').select('*').order('created_at', { ascending: true }),
    supabase.from('expenses').select('*, category:categories(*)').order('date', { ascending: false }),
  ])

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-0 sm:px-6 pt-6 pb-2">
        <h1 className="font-fraunces text-header-display text-[#F2EFEA]">Expenses</h1>
        <p className="text-body-muted-luma mt-2">Track and manage your spending</p>
      </div>

      <ExpenseManager categories={categories || []} initialExpenses={expenses || []} />
    </div>
  )
}
