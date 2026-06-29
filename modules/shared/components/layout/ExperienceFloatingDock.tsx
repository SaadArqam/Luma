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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-strong flex items-center gap-1 px-3 py-2 rounded-full border border-border/50 elevation-medium">
        {experienceNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/today' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl motion-fast motion-ease-out",
                "hover:bg-surface/50",
                isActive && "bg-accent/10"
              )}
            >
              {isActive && (
                <div className="absolute -top-1.5 w-1.5 h-1.5 rounded-full bg-accent motion-bounce" />
              )}
              <Icon
                size={20}
                strokeWidth={1.5}
                className={cn(
                  "transition-colors motion-fast",
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
