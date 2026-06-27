'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, Wallet, Tag, Receipt, RefreshCw, Settings, BarChart2, CreditCard, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'

const mainNavItems = [
  { name: 'Today', href: '/today', icon: Home },
  { name: 'Accounts', href: '/accounts', icon: CreditCard },
  { name: 'Add Balance', href: '/balance', icon: Wallet },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Recurring', href: '/recurring', icon: RefreshCw },
  { name: 'Timeline', href: '/timeline', icon: Clock },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
]

const settingsItem = { name: 'Settings', href: '/settings', icon: Settings }

export function Sidebar() {
  const pathname = usePathname()
  const [userInitial, setUserInitial] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.full_name as string | undefined
        const email = user.email ?? ''
        setUserInitial((name ? name[0] : email[0] ?? '?').toUpperCase())
      }
    })
  }, [])

  const linkClass = (isActive: boolean) =>
    cn(
      'w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all duration-150 cursor-pointer',
      isActive
        ? 'text-accent bg-accent/10'
        : 'text-muted-foreground hover:text-text hover:bg-surface'
    )

  return (
    <aside className="hidden md:flex flex-col w-14 min-h-screen sticky top-0 shrink-0 border-r border-border bg-background">
      <div className="py-5 mb-2 flex items-center justify-center">
        <span className="font-bold text-sm text-accent">L</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={linkClass(isActive)}
            >
              <item.icon size={20} strokeWidth={1.5} />
            </Link>
          )
        })}
      </nav>

      <div className="px-2 pb-3 mt-auto flex flex-col gap-1">
        <Link
          href={settingsItem.href}
          title={settingsItem.name}
          className={linkClass(pathname === settingsItem.href)}
        >
          <settingsItem.icon size={20} strokeWidth={1.5} />
        </Link>

        {/* User avatar */}
        {userInitial && (
          <Link
            href="/settings"
            title="Account"
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto bg-accent/10 text-accent text-xs font-bold hover:bg-accent/20 transition-colors"
          >
            {userInitial}
          </Link>
        )}
      </div>
    </aside>
  )
}
