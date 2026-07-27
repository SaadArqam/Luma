'use client'

import { useEffect, useState } from 'react'
import { useQuickAddStore } from '@/lib/quickAddStore'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface TodayData {
  spentToday: number
  totalDailyBudget: number
  currentStreak: number
  hasExpensesToday: boolean
}

const RING_SIZE = 140
const STROKE = 10
const R = (RING_SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

function getRingColor(pct: number): string {
  if (pct >= 100) return 'var(--luma-danger)' // danger
  if (pct >= 70)  return 'var(--luma-warning)' // warning
  return 'var(--luma-success)' // success
}

function formatINR(n: number): string {
  return `₹${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function TodayCard() {
  const { open } = useQuickAddStore()
  const [data, setData] = useState<TodayData | null>(null)
  const [pulse, setPulse] = useState(false)
  const [tip, setTip] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/today')
      .then(r => r.json())
      .then((d) => {
        if (d && typeof d.spentToday === 'number') {
          setData(d)
          if (!d.hasExpensesToday) {
            setTimeout(() => setPulse(true), 600)
            setTimeout(() => setPulse(false), 2000)
          }
        }
      })
      .catch(console.error)

    fetch('/api/daily-tip')
      .then(r => r.json())
      .then((d) => {
        if (d && d.tip) setTip(d.tip)
      })
      .catch(() => {
        // Fail silently — don't show an error
      })
  }, [])

  const hasBudget = data !== null && data.totalDailyBudget > 0
  const pct = hasBudget ? Math.min((data!.spentToday / data!.totalDailyBudget) * 100, 110) : 0
  const remaining = hasBudget ? data!.totalDailyBudget - data!.spentToday : 0
  const dashOffset = CIRC - (CIRC * Math.min(pct, 100)) / 100
  const ringColor = getRingColor(pct)

  return (
    <div className="space-y-3">
      {/* Today Card */}
      <div
        className="relative overflow-hidden rounded-[20px] p-5 glass-card"
        style={{
          background: 'var(--luma-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--luma-hairline)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Specular top highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-4 right-4 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--luma-specular), transparent)' }}
        />

        {data === null ? (
          /* Loading skeleton */
          <div className="flex items-center justify-center" style={{ height: 160 }}>
            <div
              className="rounded-full border-2 animate-spin"
              style={{ width: 32, height: 32, borderColor: 'var(--luma-accent-glow)', borderTopColor: 'var(--luma-accent)' }}
            />
          </div>
        ) : hasBudget ? (
          /* Ring view — budget is set */
          <div className="flex items-center gap-5">
            <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
              <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
                {/* Stroke goes through `style`, not the SVG presentation
                    attribute — var() only resolves in CSS properties. */}
                <circle
                  cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R}
                  fill="none" strokeWidth={STROKE}
                  style={{ stroke: 'var(--luma-hairline)' }}
                />
                <circle
                  cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R}
                  fill="none"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={data.spentToday === 0 ? CIRC : dashOffset}
                  style={{
                    stroke: data.spentToday === 0 ? 'var(--luma-hairline)' : ringColor,
                    transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                <span className="font-inter font-bold font-tnum text-luma-text" style={{ fontSize: 17, lineHeight: 1.2 }}>
                  {data.spentToday === 0 ? 'Nothing' : formatINR(data.spentToday)}
                </span>
                <span style={{ fontSize: 10, color: 'var(--luma-muted)', lineHeight: 1.3 }}>
                  {data.spentToday === 0 ? 'logged yet' : `of ${formatINR(data.totalDailyBudget)}`}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-fraunces text-header-card" style={{ color: 'var(--luma-muted)', marginBottom: 4 }}>
                Today
              </p>
              {data.spentToday === 0 ? (
                <p style={{ fontSize: 15, color: 'var(--luma-muted)', lineHeight: 1.4 }}>
                  Nothing logged today yet
                </p>
              ) : remaining >= 0 ? (
                <>
                  <p className="font-inter font-bold font-tnum text-number-card" style={{ color: 'var(--luma-success)' }}>
                    {formatINR(remaining)}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--luma-muted)', marginTop: 4 }}>left today</p>
                </>
              ) : (
                <>
                  <p className="font-inter font-bold font-tnum text-number-card" style={{ color: 'var(--luma-danger)' }}>
                    {formatINR(Math.abs(remaining))} over
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--luma-muted)', marginTop: 4 }}>today&#39;s budget</p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* No-budget fallback — simple spend number */
          <div>
            <p className="font-fraunces text-header-card" style={{ color: 'var(--luma-muted)', marginBottom: 8 }}>
              Today
            </p>
            <p className="font-inter font-bold font-tnum" style={{ fontSize: 36, color: 'var(--luma-text)', lineHeight: 1 }}>
              {data.spentToday === 0 ? '₹0' : formatINR(data.spentToday)}
            </p>
            <p style={{ fontSize: 13, color: 'var(--luma-muted)', marginTop: 6 }}>
              {data.spentToday === 0 ? 'Nothing logged today yet' : 'spent today'}
            </p>
            <Link
              href="/categories"
              className="inline-block mt-3 text-luma-accent hover:underline font-medium"
              style={{ fontSize: 13 }}
            >
              Set a daily budget in Categories →
            </Link>
          </div>
        )}

        {/* Daily AI tip / nudge */}
        {tip && (
          <motion.div
            className="flex items-start gap-2 pt-3.5 mt-3.5 border-t border-luma-hairline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-luma-muted shrink-0 mt-0.5" />
            <p className="text-[13px] text-luma-muted line-clamp-2 leading-relaxed font-inter">
              {tip}
            </p>
          </motion.div>
        )}
      </div>

      {/* Quick Add Button */}
      <button
        id="quick-add-expense"
        onClick={open}
        aria-label="Add Expense"
        className="btn-primary-luma w-full"
        style={{
          boxShadow: pulse
            ? '0 0 0 8px var(--luma-accent-shadow), 0 4px 20px var(--luma-accent-shadow)'
            : '0 4px 20px var(--luma-accent-shadow)',
        }}
      >
        <span
          className="flex items-center justify-center font-bold"
          style={{ width: 24, height: 24, borderRadius: '50%', background: 'color-mix(in srgb, var(--luma-canvas) 15%, transparent)', fontSize: 18, lineHeight: 1 }}
        >
          +
        </span>
        Add Expense
      </button>

      {/* Streak line — only shown when streak ≥ 3 */}
      {data !== null && data.currentStreak >= 3 && (
        <p className="text-center font-inter" style={{ fontSize: 12, color: 'var(--luma-muted)' }}>
          <span style={{ color: 'var(--luma-accent)' }}>🔥</span> {data.currentStreak} day streak
        </p>
      )}
    </div>
  )
}
