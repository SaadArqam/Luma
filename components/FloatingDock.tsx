'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Wallet, Target, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/today', icon: Sun, label: 'Today' },
  { href: '/finance', icon: Wallet, label: 'Finance' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/ai', icon: Sparkles, label: 'AI' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function FloatingDock() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/today' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200",
                "hover:bg-surface/50",
                isActive && "bg-accent/10"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-accent" />
              )}
              <Icon
                size={20}
                strokeWidth={1.5}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-accent" : "text-muted-foreground"
                )}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
