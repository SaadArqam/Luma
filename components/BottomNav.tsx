'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, Receipt, BarChart2, Settings } from 'lucide-react'

const links = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/balance', icon: Wallet, label: 'Balance' },
  { href: '/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/reports', icon: BarChart2, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-border bg-background"
      style={{ height: '64px', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {links.map(({ href, icon: Icon, label }) => {
        const active = path === href
        return (
          <Link key={href} href={href}
            className="flex flex-col items-center justify-center gap-1">
            <div className={active ? 'bg-accent/10' : 'transparent'} style={{
              borderRadius: '10px',
              padding: '6px 8px',
            }}>
              <Icon 
                size={22} 
                strokeWidth={1.5}
                className={active ? 'text-accent' : 'text-muted-foreground'}
              />
            </div>
            <span
              className="text-[9px] uppercase tracking-wide"
              style={{ color: active ? 'var(--accent)' : 'var(--muted-foreground)', fontWeight: active ? 600 : 500 }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
