'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { BankLogo } from '@/components/BankLogo'

export type AccountCardData = {
  id: string
  name: string
  bank_name: string | null
  bank_domain: string | null
  balance: number
  /** e.g. account_type label, or "Combined" for a synthetic total card */
  subtitle: string
  /** masked account number or type label shown under the name, e.g. "•••• 4821" */
  maskedLabel?: string
}

const GRADIENTS = ['var(--gradient-primary)', 'var(--gradient-secondary)', 'var(--gradient-tertiary)']
const FALLBACK_GRADIENT = 'var(--gradient-neutral)'

function formatINR(n: number): string {
  return `${n < 0 ? '-' : ''}₹${Math.abs(n).toLocaleString('en-IN')}`
}

function gradientForIndex(index: number): string {
  return GRADIENTS[index] ?? FALLBACK_GRADIENT
}

export function AccountCardStack({
  accounts,
  variant,
  selectedId,
  onSelect,
  onActiveCardAction,
  onActiveIndexChange,
}: {
  accounts: AccountCardData[]
  variant: 'full' | 'mini'
  /** controlled selection, e.g. the Add Expense form's accountId */
  selectedId?: string
  onSelect?: (id: string) => void
  /** called when the user taps/clicks the currently-active card (Phase 4's edit/delete/make-default sheet trigger) */
  onActiveCardAction?: (id: string) => void
  /** called whenever the active card changes — by swipe/scroll settling OR by click navigation — not just on tap-while-already-active like onActiveCardAction. Fires for both variants; mini-variant consumers typically don't need it since onSelect already covers their case. */
  onActiveIndexChange?: (id: string, index: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  // Latest `accounts` without needing it in effect/callback dependency arrays —
  // ExpenseManager passes a brand-new array literal on every render, so a
  // dependency on `accounts` itself would re-fire on every keystroke elsewhere
  // in that form. Refs can't be written during render (React flags it), so
  // the sync happens in an unconditional effect — it runs after every commit,
  // before any effect declared below it gets to read `accountsRef.current`.
  const accountsRef = useRef(accounts)
  useEffect(() => {
    accountsRef.current = accounts
  })

  // Cards are narrower than the track (the "peek" design) and separated by a
  // flex gap, so neither the forward (index -> scrollLeft) nor the reverse
  // (scrollLeft -> index) math can assume one card == one full container
  // width. We measure the actual card elements instead.
  const syncActiveFromScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const containerRect = el.getBoundingClientRect()
    if (containerRect.width === 0) return
    const containerCenter = containerRect.left + containerRect.width / 2
    let closestIndex = 0
    let closestDistance = Infinity
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const distance = Math.abs(cardCenter - containerCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    })
    setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex))
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', syncActiveFromScroll, { passive: true })
    return () => el.removeEventListener('scroll', syncActiveFromScroll)
  }, [syncActiveFromScroll])

  useEffect(() => {
    const account = accounts[activeIndex]
    if (account) onActiveIndexChange?.(account.id, activeIndex)
  }, [activeIndex, accounts, onActiveIndexChange])

  // `opts.focus` defaults to true for the user-initiated click/keyboard paths
  // below. The mount/selectedId-sync effect passes `focus: false` explicitly —
  // stealing DOM focus on mount (not from a user gesture) would be an
  // unexpected a11y surprise.
  const scrollToIndex = useCallback((index: number, opts?: { focus?: boolean }) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(index, accountsRef.current.length - 1))
    const card = cardRefs.current[clamped]
    if (card) {
      const trackRect = el.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()
      const targetLeft = el.scrollLeft + (cardRect.left - trackRect.left)
      el.scrollTo({ left: targetLeft, behavior: 'smooth' })
    }
    // Move DOM focus to the newly-active card so repeated arrow presses (or
    // clicks) advance from the new position instead of re-targeting from a
    // stale index closed over by the previous keydown handler.
    if (opts?.focus !== false) card?.focus()
  }, [])

  // Scroll the mini carousel to the externally-selected account on mount, and
  // whenever selectedId changes from outside (e.g. a different account
  // becomes default). Without this, a pre-selected account that isn't the
  // first card renders dimmed/scaled-down with no visible indication it's
  // selected until the user manually scrolls.
  useEffect(() => {
    if (variant !== 'mini' || !selectedId) return
    const index = accountsRef.current.findIndex((a) => a.id === selectedId)
    if (index >= 0) scrollToIndex(index, { focus: false })
  }, [variant, selectedId, scrollToIndex])

  const handleCardClick = (account: AccountCardData, index: number) => {
    if (variant === 'mini') {
      onSelect?.(account.id)
    } else if (index === activeIndex) {
      onActiveCardAction?.(account.id)
    }
    scrollToIndex(index)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(index - 1) }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(accounts[index], index) }
  }

  const cardHeight = variant === 'full' ? 155 : 78

  return (
    <div className="space-y-2">
      <div
        ref={trackRef}
        role={variant === 'mini' ? 'radiogroup' : 'region'}
        aria-label="Accounts"
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
      >
        {accounts.map((account, index) => {
          const isSelected = variant === 'mini' ? account.id === selectedId : index === activeIndex
          return (
            <button
              key={account.id}
              ref={(el) => { cardRefs.current[index] = el }}
              type="button"
              role={variant === 'mini' ? 'radio' : undefined}
              aria-checked={variant === 'mini' ? isSelected : undefined}
              tabIndex={0}
              onClick={() => handleCardClick(account, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`shrink-0 rounded-[20px] p-4 text-left tablet:w-[320px] ${variant === 'mini' ? 'w-[calc(60%-12px)]' : 'w-[calc(100%-48px)]'}`}
              style={{
                scrollSnapAlign: 'center',
                height: cardHeight,
                background: gradientForIndex(index),
                opacity: variant === 'mini' && !isSelected ? 0.55 : 1,
                transform: variant === 'mini' && !isSelected ? 'scale(0.94)' : 'scale(1)',
                transition: 'opacity 200ms ease, transform 200ms ease',
              }}
            >
              <div className="flex items-center gap-2">
                <BankLogo name={account.bank_name || account.name} domain={account.bank_domain} size={variant === 'full' ? 28 : 20} />
                <span className="font-display text-sm font-medium truncate" style={{ color: 'var(--luma-canvas)' }}>
                  {account.name}
                </span>
              </div>
              {account.maskedLabel && variant === 'full' && (
                <div className="text-xs mt-1" style={{ color: 'var(--luma-canvas)', opacity: 0.65 }}>{account.maskedLabel}</div>
              )}
              {variant === 'full' && (
                <div className="text-number-hero" style={{ color: 'var(--luma-canvas)', marginTop: 8 }}>
                  {formatINR(account.balance)}
                </div>
              )}
              {variant === 'full' && (
                <div className="text-xs mt-1" style={{ color: 'var(--luma-canvas)', opacity: 0.65 }}>{account.subtitle}</div>
              )}
            </button>
          )
        })}
      </div>
      {variant === 'full' && accounts.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {accounts.map((account, index) => (
            <span
              key={account.id}
              aria-hidden="true"
              className="rounded-full transition-all"
              style={{
                width: index === activeIndex ? 16 : 6,
                height: 6,
                backgroundColor: index === activeIndex ? 'var(--luma-accent)' : 'var(--luma-hairline-strong)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
