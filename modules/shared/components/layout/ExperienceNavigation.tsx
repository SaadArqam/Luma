'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Mic, Clock, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const experienceNavItems = [
  { name: 'Today', href: '/today', icon: Sun },
  { name: 'Capture', href: '/capture', icon: Mic },
  { name: 'Timeline', href: '/timeline', icon: Clock },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Profile', href: '/profile', icon: User },
]

export function ExperienceNavigation() {
  const pathname = usePathname()

  const linkClass = (isActive: boolean) =>
    cn(
      'w-10 h-10 rounded-xl flex items-center justify-center mx-auto motion-fast motion-ease-out cursor-pointer',
      isActive
        ? 'text-accent bg-accent/10'
        : 'text-muted-foreground hover:text-text-primary hover:bg-surface'
    )

  return (
    <aside className="hidden md:flex flex-col w-14 min-h-screen sticky top-0 shrink-0 border-r border-border/50 bg-background">
      <div className="py-6 mb-2 flex items-center justify-center">
        <span className="font-bold text-sm text-accent tracking-tight">L</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2">
        {experienceNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/today' && pathname.startsWith(item.href))
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
    </aside>
  )
}
