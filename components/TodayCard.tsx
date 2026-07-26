'use client'

import { useEffect, useState } from 'react'
import { useQuickAddStore } from '@/lib/quickAddStore'
import Link from 'next/link'

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
  if (pct >= 100) return '#C4595A' // danger
  if (pct >= 70)  return '#E0A458' // warning
  return '#7FB69E' // success
}

function formatINR(n: number): string {
  return `₹${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function TodayCard() {
  const { open } = useQuickAddStore()
  const [data, setData] = useState<TodayData | null>(null)
  const [pulse, setPulse] = useState(false)

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
          background: 'rgba(38, 39, 46, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Specular top highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-4 right-4 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent)' }}
        />

        {data === null ? (
          /* Loading skeleton */
          <div className="flex items-center justify-center" style={{ height: 160 }}>
            <div
              className="rounded-full border-2 animate-spin"
              style={{ width: 32, height: 32, borderColor: 'rgba(225,122,77,0.3)', borderTopColor: '#E17A4D' }}
            />
          </div>
        ) : hasBudget ? (
          /* Ring view — budget is set */
          <div className="flex items-center gap-5">
            <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
              <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R}
                  fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={STROKE}
                />
                <circle
                  cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R}
                  fill="none"
                  stroke={data.spentToday === 0 ? 'rgba(255,255,255,0.09)' : ringColor}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={data.spentToday === 0 ? CIRC : dashOffset}
                  style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                <span className="font-inter font-bold font-tnum text-[#F2EFEA]" style={{ fontSize: 17, lineHeight: 1.2 }}>
                  {data.spentToday === 0 ? 'Nothing' : formatINR(data.spentToday)}
                </span>
                <span style={{ fontSize: 10, color: '#8A8790', lineHeight: 1.3 }}>
                  {data.spentToday === 0 ? 'logged yet' : `of ${formatINR(data.totalDailyBudget)}`}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-fraunces text-header-card" style={{ color: '#8A8790', marginBottom: 4 }}>
                Today
              </p>
              {data.spentToday === 0 ? (
                <p style={{ fontSize: 15, color: '#8A8790', lineHeight: 1.4 }}>
                  Nothing logged today yet
                </p>
              ) : remaining >= 0 ? (
                <>
                  <p className="font-inter font-bold font-tnum text-number-card" style={{ color: '#7FB69E' }}>
                    {formatINR(remaining)}
                  </p>
                  <p style={{ fontSize: 13, color: '#8A8790', marginTop: 4 }}>left today</p>
                </>
              ) : (
                <>
                  <p className="font-inter font-bold font-tnum text-number-card" style={{ color: '#C4595A' }}>
                    {formatINR(Math.abs(remaining))} over
                  </p>
                  <p style={{ fontSize: 13, color: '#8A8790', marginTop: 4 }}>today&#39;s budget</p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* No-budget fallback — simple spend number */
          <div>
            <p className="font-fraunces text-header-card" style={{ color: '#8A8790', marginBottom: 8 }}>
              Today
            </p>
            <p className="font-inter font-bold font-tnum" style={{ fontSize: 36, color: '#F2EFEA', lineHeight: 1 }}>
              {data.spentToday === 0 ? '₹0' : formatINR(data.spentToday)}
            </p>
            <p style={{ fontSize: 13, color: '#8A8790', marginTop: 6 }}>
              {data.spentToday === 0 ? 'Nothing logged today yet' : 'spent today'}
            </p>
            <Link
              href="/categories"
              className="inline-block mt-3 text-[#E17A4D] hover:underline font-medium"
              style={{ fontSize: 13 }}
            >
              Set a daily budget in Categories →
            </Link>
          </div>
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
            ? '0 0 0 8px rgba(225, 122, 77, 0.25), 0 4px 20px rgba(225, 122, 77, 0.35)'
            : '0 4px 20px rgba(225, 122, 77, 0.35)',
        }}
      >
        <span
          className="flex items-center justify-center font-bold"
          style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(27, 28, 33, 0.15)', fontSize: 18, lineHeight: 1 }}
        >
          +
        </span>
        Add Expense
      </button>

      {/* Streak line — only shown when streak ≥ 3 */}
      {data !== null && data.currentStreak >= 3 && (
        <p className="text-center font-inter" style={{ fontSize: 12, color: '#8A8790' }}>
          <span style={{ color: '#E17A4D' }}>🔥</span> {data.currentStreak} day streak
        </p>
      )}
    </div>
  )
}
