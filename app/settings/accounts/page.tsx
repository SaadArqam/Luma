import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { getAccountsWithBalances } from '@/lib/accounts'
import { AccountsManager } from '@/components/AccountsManager'

export const dynamic = 'force-dynamic'

export default async function AccountsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetched here rather than in a client effect so the list arrives with the
  // HTML instead of after a round-trip — same pattern as the expenses page.
  const accounts = await getAccountsWithBalances(supabase, user.id)

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto w-full">
      <div className="pt-2">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 text-luma-muted hover:text-luma-text transition-colors text-caption-luma mb-3 min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Settings
        </Link>
        <h1 className="font-fraunces text-header-display text-luma-text">Accounts</h1>
        <div style={{ width: 40, height: 3, backgroundColor: 'var(--luma-accent)', borderRadius: 2, marginTop: 6 }} />
        <p className="text-body-muted-luma mt-2">
          Your bank and cash accounts. Each transaction belongs to one of these.
        </p>
      </div>

      <AccountsManager initialAccounts={accounts} />
    </div>
  )
}
