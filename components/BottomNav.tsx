'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Wallet, Receipt, BarChart2, Settings } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  type MotionValue,
} from 'framer-motion'

const links = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/balance', icon: Wallet, label: 'Wallet' },
  { href: '/reports', icon: BarChart2, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
] as const

/** Magnetic falloff radius in px. Tune on-device — see prompt note. */
const FALLOFF = 60
/** Peak scale at 0px distance from the touch point. */
const MAX_SCALE = 1.25
/** Matches the pill spring already used elsewhere in the dock. */
const SPRING = { type: 'spring' as const, stiffness: 400, damping: 17 }
/** Keep in sync with .dock-pill width/height in globals.css. */
const PILL = 40
/** Sentinel x meaning "no finger down" — every icon reads as far away, so all scales rest at 1. */
const IDLE_X = -99999
/** Pointer travel beyond which we treat the interaction as a drag rather than a tap. */
const DRAG_THRESHOLD = 6

function DockItem({
  href,
  label,
  Icon,
  isActive,
  center,
  pointerX,
  itemRef,
  suppressClickRef,
}: {
  href: string
  label: string
  Icon: typeof Home
  isActive: boolean
  center: number | undefined
  pointerX: MotionValue<number>
  itemRef: (el: HTMLAnchorElement | null) => void
  suppressClickRef: React.RefObject<boolean>
}) {
  // Linear falloff: MAX_SCALE at the touch point, 1.0 once FALLOFF px away.
  const target = useTransform(pointerX, (x) => {
    if (center === undefined) return 1
    const distance = Math.abs(x - center)
    if (distance >= FALLOFF) return 1
    return 1 + (MAX_SCALE - 1) * (1 - distance / FALLOFF)
  })
  const scale = useSpring(target, SPRING)

  return (
    <Link
      ref={itemRef}
      href={href}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className={`dock-item${isActive ? ' dock-item--active' : ''}`}
      onClick={(e) => {
        // A drag already navigated via router.push; stop the anchor firing too.
        if (suppressClickRef.current) {
          e.preventDefault()
          suppressClickRef.current = false
        }
      }}
      // Let the row own the gesture so dragging across icons doesn't start a link drag.
      draggable={false}
    >
      <motion.span style={{ scale, display: 'flex' }}>
        <Icon size={22} strokeWidth={1.5} />
      </motion.span>
    </Link>
  )
}

export default function BottomNav() {
  const path = usePathname()
  const router = useRouter()

  const activeIndex = Math.max(
    0,
    links.findIndex((l) => l.href === path)
  )

  const rowRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [centers, setCenters] = useState<number[]>([])
  const [pillReady, setPillReady] = useState(false)

  const pointerX = useMotionValue(IDLE_X)
  const pillX = useMotionValue(0)

  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const startXRef = useRef(0)
  const suppressClickRef = useRef(false)

  // Measure each icon's centre relative to the row, so magnification and the
  // pill both work in the same coordinate space.
  const measure = useCallback(() => {
    const row = rowRef.current
    if (!row) return
    const rowLeft = row.getBoundingClientRect().left
    const next = links.map((_, i) => {
      const el = itemRefs.current[i]
      if (!el) return 0
      const r = el.getBoundingClientRect()
      return r.left - rowLeft + r.width / 2
    })
    setCenters(next)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [measure])

  // Park the pill on the active icon: jump on first measure, spring thereafter.
  useEffect(() => {
    const center = centers[activeIndex]
    if (center === undefined || center === 0) return
    const target = center - PILL / 2
    if (!pillReady) {
      pillX.set(target)
      setPillReady(true)
      return
    }
    if (draggingRef.current) return
    const controls = animate(pillX, target, SPRING)
    return () => controls.stop()
  }, [centers, activeIndex, pillReady, pillX])

  const localX = (clientX: number) => {
    const row = rowRef.current
    if (!row) return 0
    return clientX - row.getBoundingClientRect().left
  }

  const clampToBounds = (x: number) => {
    const row = rowRef.current
    if (!row) return x
    return Math.min(Math.max(x, PILL / 2), row.clientWidth - PILL / 2)
  }

  const nearestIndex = (x: number) => {
    if (centers.length === 0) return activeIndex
    let best = 0
    let bestDistance = Infinity
    centers.forEach((c, i) => {
      const d = Math.abs(x - c)
      if (d < bestDistance) {
        bestDistance = d
        best = i
      }
    })
    return best
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore secondary buttons (right-click / middle-click on desktop).
    if (e.button !== 0 && e.pointerType === 'mouse') return
    draggingRef.current = true
    movedRef.current = false
    suppressClickRef.current = false
    const x = localX(e.clientX)
    startXRef.current = x
    pointerX.set(x)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const x = localX(e.clientX)
    if (!movedRef.current && Math.abs(x - startXRef.current) > DRAG_THRESHOLD) {
      movedRef.current = true
    }
    pointerX.set(x)
    // Pill tracks the finger directly while dragging, clamped to the dock.
    if (movedRef.current) pillX.set(clampToBounds(x) - PILL / 2)
  }

  const endGesture = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    if (!draggingRef.current) return
    draggingRef.current = false

    const x = localX(e.clientX)
    const dragged = movedRef.current

    // Release the magnification first so icons spring back to 1.0.
    pointerX.set(IDLE_X)

    if (!dragged) {
      // A tap: the Link navigates, and the route-change effect moves the pill.
      // Re-seating it here too would make it bounce off the old icon first.
      movedRef.current = false
      return
    }

    if (cancelled) {
      // Gesture aborted mid-drag — return the pill to the current route.
      const center = centers[activeIndex]
      if (center !== undefined) animate(pillX, center - PILL / 2, SPRING)
      movedRef.current = false
      return
    }

    const index = nearestIndex(clampToBounds(x))
    const center = centers[index]
    if (center !== undefined) animate(pillX, center - PILL / 2, SPRING)

    // Suppress the click the browser will fire on whichever anchor is under
    // the finger, then navigate to the icon we actually snapped to.
    suppressClickRef.current = true
    if (links[index].href !== path) router.push(links[index].href)
    movedRef.current = false
  }

  return (
    <nav className="liquid-glass-dock" aria-label="Primary navigation">
      <div
        ref={rowRef}
        className="dock-row"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => endGesture(e, false)}
        onPointerCancel={(e) => endGesture(e, true)}
      >
        {/* Gliding terracotta pill — x is driven by the finger, then snapped. */}
        <motion.div
          className="dock-pill"
          style={{ x: pillX, opacity: pillReady ? 1 : 0 }}
          aria-hidden="true"
        />

        {links.map(({ href, icon: Icon, label }, i) => (
          <DockItem
            key={href}
            href={href}
            label={label}
            Icon={Icon}
            isActive={activeIndex === i}
            center={centers[i]}
            pointerX={pointerX}
            itemRef={(el) => {
              itemRefs.current[i] = el
            }}
            suppressClickRef={suppressClickRef}
          />
        ))}
      </div>
    </nav>
  )
}
