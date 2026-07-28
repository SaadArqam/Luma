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
const FALLBACK_GRADIENT = 'linear-gradient(135deg, #2A2A2E 0%, #1a1a20 100%)'

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
}: {
  accounts: AccountCardData[]
  variant: 'full' | 'mini'
  /** controlled selection, e.g. the Add Expense form's accountId */
  selectedId?: string
  onSelect?: (id: string) => void
  /** called when the user taps/clicks the currently-active card (Phase 4's edit/delete/make-default sheet trigger) */
  onActiveCardAction?: (id: string) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

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

  const scrollToIndex = (index: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(index, accounts.length - 1))
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
    card?.focus()
  }

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
