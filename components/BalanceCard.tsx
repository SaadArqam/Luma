'use client'

import { useState } from 'react'
import { ChevronDown, Wallet } from 'lucide-react'
import { BankLogo } from '@/components/BankLogo'

export type AccountBalanceRow = {
  /** null for transactions that predate account selection. */
  id: string | null
  name: string
  bank_name: string | null
  bank_domain: string | null
  balance: number
}

function formatINR(n: number): string {
  return `${n < 0 ? '-' : ''}₹${Math.abs(n).toLocaleString('en-IN')}`
}

/**
 * Current Balance, summed across every account, expanding to a per-account
 * breakdown.
 *
 * The rows always add up to the headline figure: both come from the same
 * aggregation pass on Home, and anything with no account attached is surfaced
 * as an explicit "Unassigned" row rather than quietly dropped — a total whose
 * parts don't sum to the whole would be worse than no breakdown at all.
 */
export function BalanceCard({ total, accounts }: { total: number; accounts: AccountBalanceRow[] }) {
  const [open, setOpen] = useState(false)
  // With a single account the breakdown just restates the total.
  const canExpand = accounts.length > 1
  // "Unassigned" is a bucket, not an account — don't let it inflate the count.
  const realAccountCount = accounts.filter((a) => a.id !== null).length

  return (
    <div
      className="col-span-2 glass-card p-4 rounded-[20px] relative overflow-hidden"
      style={{ borderTop: '2px solid var(--luma-accent)' }}
    >
      {/* Decorative flourish. Kept fully inside the padding box and free of any
          transform: a transformed child is composited separately and
          Chrome/Android does not reliably clip it to the card's rounded,
          backdrop-filtered box, which let it escape the right edge. */}
      <div className="absolute right-3 top-3 opacity-[0.05] pointer-events-none">
        <Wallet className="w-16 h-16 text-luma-text" />
      </div>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full text-left"
          style={{ minHeight: 44 }}
        >
          <Summary total={total} count={realAccountCount} chevron={open ? 'up' : 'down'} />
        </button>
      ) : (
        <Summary total={total} count={realAccountCount} />
      )}

      {canExpand && (
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{ maxHeight: open ? accounts.length * 56 + 16 : 0, opacity: open ? 1 : 0 }}
        >
          <div className="mt-3 pt-3 border-t border-luma-hairline space-y-2.5">
            {accounts.map((a) => (
              <div key={a.id ?? 'unassigned'} className="flex items-center gap-2.5">
                {a.id ? (
                  <BankLogo name={a.bank_name || a.name} domain={a.bank_domain} size={28} />
                ) : (
                  <span
                    aria-hidden="true"
                    className="shrink-0 rounded-[10px] flex items-center justify-center"
                    style={{
                      width: 28, height: 28,
                      border: '1px dashed var(--luma-hairline-strong)',
                      color: 'var(--luma-faint)', fontSize: 13,
                    }}
                  >
                    ?
                  </span>
                )}
                <span className="flex-1 min-w-0 text-sm text-luma-text truncate">{a.name}</span>
                <span className="font-inter font-semibold font-tnum text-sm text-luma-text shrink-0">
                  {formatINR(a.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Summary({ total, count, chevron }: { total: number; count: number; chevron?: 'up' | 'down' }) {
  return (
    <>
      <div className="flex flex-row items-center justify-between pb-1">
        <h3 className="font-fraunces text-header-card text-luma-muted">Current Balance</h3>
        <div className="flex items-center gap-1.5">
          {chevron && (
            <span className="text-caption-luma text-luma-muted">
              {count} {count === 1 ? 'account' : 'accounts'}
            </span>
          )}
          {chevron ? (
            <ChevronDown
              className="h-4 w-4 text-luma-muted transition-transform duration-300"
              style={{ transform: chevron === 'up' ? 'rotate(180deg)' : 'none' }}
            />
          ) : (
            <Wallet className="h-4 w-4 text-luma-muted" />
          )}
        </div>
      </div>
      <div className="font-inter font-bold font-tnum text-number-card text-luma-text text-3xl mt-1">
        {formatINR(total)}
      </div>
    </>
  )
}
