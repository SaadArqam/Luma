'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Mic, Clock, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const experienceNavItems = [
  { href: '/today', icon: Sun, label: 'Today' },
  { href: '/capture', icon: Mic, label: 'Capture' },
  { href: '/timeline', icon: Clock, label: 'Timeline' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function ExperienceFloatingDock() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 z-[var(--z-fixed)]">
      <div className="glass-strong rounded-2xl border border-border/30 shadow-lg px-2 py-3">
        <div className="flex items-center justify-around">
          {experienceNavItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== '/today' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 min-w-0 motion-fast motion-ease-out cursor-pointer",
                  "min-h-[48px] min-w-[48px]",
                  isActive ? "text-accent" : "text-muted-foreground hover:text-text-primary"
                )}
                style={{ flex: 1 }}
              >
                <div className={cn(
                  "transition-transform motion-fast motion-ease-out",
                  isActive ? "scale-110" : "hover:scale-105"
                )}>
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-[10px] font-medium tracking-tight">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
