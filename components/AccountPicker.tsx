'use client'

import Link from 'next/link'
import { BankLogo } from '@/components/BankLogo'
import type { AccountRef } from '@/lib/accounts'

/**
 * Account selector for the expense and balance forms.
 *
 * A row of pills rather than a `<select>`, because a native option list cannot
 * render a logo — and with two or three accounts this is also one tap instead of
 * two. Scrolls horizontally once there are more than fit, so it degrades rather
 * than breaking.
 */
export function AccountPicker({
  accounts,
  value,
  onChange,
  label = 'Account',
  id = 'account-picker',
}: {
  accounts: AccountRef[]
  value: string
  onChange: (id: string) => void
  label?: string
  id?: string
}) {
  if (accounts.length === 0) {
    return (
      <p className="text-body-muted-luma text-xs">
        No accounts yet —{' '}
        <Link href="/settings/accounts" className="text-luma-accent hover:underline">
          add one in Settings
        </Link>
        .
      </p>
    )
  }

  // Nothing to choose: show which account it lands in, without a control.
  if (accounts.length === 1) {
    return (
      <div className="space-y-1.5">
        <span className="text-caption-luma text-luma-muted">{label}</span>
        <div className="flex items-center gap-2">
          <BankLogo name={accounts[0].bank_name || accounts[0].name} domain={accounts[0].bank_domain} size={24} />
          <span className="text-sm text-luma-text truncate">{accounts[0].name}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <span className="text-caption-luma text-luma-muted" id={`${id}-label`}>{label}</span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {accounts.map((a) => {
          const selected = a.id === value
          return (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(a.id)}
              className="flex items-center gap-2 shrink-0 rounded-full pl-1.5 pr-3.5 transition-colors"
              style={{
                minHeight: 44,
                border: `1px solid ${selected ? 'var(--luma-accent)' : 'var(--luma-hairline)'}`,
                backgroundColor: selected ? 'var(--luma-accent-glow)' : 'var(--luma-raised)',
              }}
            >
              <BankLogo name={a.bank_name || a.name} domain={a.bank_domain} size={26} />
              <span
                className="text-sm whitespace-nowrap"
                style={{
                  color: selected ? 'var(--luma-text)' : 'var(--luma-muted)',
                  fontWeight: selected ? 600 : 400,
                }}
              >
                {a.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * The account a transaction belongs to, shown on a history row. Deliberately
 * low-contrast and small — this is metadata, not the headline.
 */
export function AccountTag({ account }: { account?: AccountRef | null }) {
  if (!account) return null
  return (
    <span className="inline-flex items-center gap-1.5 align-middle max-w-[130px]">
      <BankLogo name={account.bank_name || account.name} domain={account.bank_domain} size={14} />
      <span className="text-luma-muted truncate" style={{ fontSize: 11 }}>{account.name}</span>
    </span>
  )
}
