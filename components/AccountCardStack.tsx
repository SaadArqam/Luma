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
  const [activeIndex, setActiveIndex] = useState(0)

  const syncActiveFromScroll = useCallback(() => {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex((prev) => (prev === index ? prev : index))
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
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  const handleCardClick = (account: AccountCardData, index: number) => {
    if (variant === 'mini') {
      onSelect?.(account.id)
    } else if (index === activeIndex) {
      onActiveCardAction?.(account.id)
    }
    scrollToIndex(index)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
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
              type="button"
              role={variant === 'mini' ? 'radio' : undefined}
              aria-checked={variant === 'mini' ? isSelected : undefined}
              tabIndex={0}
              onClick={() => handleCardClick(account, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="shrink-0 rounded-[20px] p-4 text-left tablet:w-[320px]"
              style={{
                scrollSnapAlign: 'center',
                width: variant === 'mini' ? 'calc(60% - 12px)' : 'calc(100% - 48px)',
                height: cardHeight,
                background: gradientForIndex(index),
                opacity: variant === 'mini' && !isSelected ? 0.55 : 1,
                transform: variant === 'mini' && !isSelected ? 'scale(0.94)' : 'scale(1)',
                transition: 'opacity 200ms ease, transform 200ms ease',
              }}
            >
              <div className="flex items-center gap-2">
                <BankLogo name={account.bank_name || account.name} domain={account.bank_domain} size={variant === 'full' ? 28 : 20} />
                <span className="font-display text-sm font-medium truncate" style={{ color: '#0B0B0F' }}>
                  {account.name}
                </span>
              </div>
              {account.maskedLabel && variant === 'full' && (
                <div className="text-xs mt-1" style={{ color: 'rgba(11,11,15,0.65)' }}>{account.maskedLabel}</div>
              )}
              {variant === 'full' && (
                <div className="text-number-hero" style={{ color: '#0B0B0F', marginTop: 8 }}>
                  {formatINR(account.balance)}
                </div>
              )}
              {variant === 'full' && (
                <div className="text-xs mt-1" style={{ color: 'rgba(11,11,15,0.65)' }}>{account.subtitle}</div>
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
