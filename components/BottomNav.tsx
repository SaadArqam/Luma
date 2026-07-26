'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, Receipt, BarChart2, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const links = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/balance', icon: Wallet, label: 'Wallet' },
  { href: '/reports', icon: BarChart2, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
] as const

export default function BottomNav() {
  const path = usePathname()
  const activeIndex = links.findIndex((l) => l.href === path)
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex

  // Track item positions for the gliding pill
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [pillStyle, setPillStyle] = useState<{ left: number; opacity: number }>({ left: 0, opacity: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const el = itemRefs.current[resolvedIndex]
    if (!el) return
    const parent = el.parentElement
    if (!parent) return
    const parentRect = parent.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const left = elRect.left - parentRect.left + (elRect.width - 40) / 2
    setPillStyle({ left, opacity: 1 })
  }, [resolvedIndex, mounted])

  return (
    <nav className="liquid-glass-dock" aria-label="Primary navigation">
      {/* Gliding gold pill */}
      <div
        className="dock-pill"
        style={{
          left: pillStyle.left,
          opacity: pillStyle.opacity,
        }}
        aria-hidden="true"
      />

      {links.map(({ href, icon: Icon, label }, i) => {
        const isActive = resolvedIndex === i
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            ref={(el) => { itemRefs.current[i] = el }}
            className={`dock-item${isActive ? ' dock-item--active' : ''}`}
          >
            <Icon size={22} strokeWidth={1.5} />
          </Link>
        )
      })}
    </nav>
  )
}
