'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, AlertTriangle, CheckCircle2, Settings } from 'lucide-react'
import Link from 'next/link'
import { useExpenseSync } from '@/lib/expenseSync'

interface StipendStats {
  stipendAmount: number | null
  creditDay: number | null
  daysUntilNextStipend: number | null
  daysElapsed: number | null
  totalDaysInCycle: number | null
  amountSpentThisCycle: number | null
  balanceLeft: number | null
  safeSpendPerDay: number | null
  actualSpendPerDay: number | null
  projectedBalanceOnPayday: number | null
  isOverspending: boolean | null
  willRunOut: boolean | null
}

export function StipendWidget() {
  const version = useExpenseSync((s) => s.version)
  const [stats, setStats] = useState<StipendStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Keyed on `version` — spending changes what's left of the stipend.
  useEffect(() => {
    fetchStats()
  }, [version])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stipend/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stipend stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '₹0'
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
  }

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-[20px]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-luma-raised rounded w-1/3"></div>
          <div className="h-8 bg-luma-raised rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  // If stipend is not configured
  if (!stats || stats.stipendAmount === null) {
    return (
      <div className="glass-card p-5 rounded-[20px] border border-luma-accent/30 bg-luma-accent/10">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-luma-accent shrink-0" />
          <div className="flex-1">
            <p className="text-body-luma font-medium text-luma-text">Set up your stipend in Settings to unlock spending insights</p>
          </div>
          <Link href="/settings">
            <button className="btn-primary-luma py-2.5 px-4 text-xs font-semibold h-auto min-h-0 shrink-0">
              Configure
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const progressPercent = stats.totalDaysInCycle && stats.daysElapsed !== null
    ? Math.round((stats.daysElapsed / stats.totalDaysInCycle) * 100)
    : 0

  const isOverSafeLimit = stats.actualSpendPerDay && stats.safeSpendPerDay && stats.actualSpendPerDay > stats.safeSpendPerDay

  return (
    <div className="space-y-3">
      {/* Row 1: Days Until Stipend & Cycle Progress */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 rounded-[20px]">
          <h3 className="font-fraunces text-header-card text-luma-muted flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-luma-muted" />
            Days Until Stipend
          </h3>
          <div className="font-inter font-bold font-tnum text-3xl text-luma-text">{stats.daysUntilNextStipend}</div>
          <p className="text-body-muted-luma text-xs mt-1">
            {stats.creditDay}{getOrdinalSuffix(stats.creditDay)} of the month
          </p>
        </div>

        <div className="glass-card p-4 rounded-[20px]">
          <h3 className="font-fraunces text-header-card text-luma-muted mb-1">Cycle Progress</h3>
          <div className="font-inter font-bold font-tnum text-xl text-luma-text mb-2">{progressPercent}%</div>
          <div className="w-full bg-luma-raised rounded-full h-2">
            <div
              className="bg-luma-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-body-muted-luma text-xs mt-2 font-tnum">
            {stats.daysElapsed} / {stats.totalDaysInCycle} days
          </p>
        </div>
      </div>

      {/* Row 2: Safe to Spend/day & You're Spending/day */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 rounded-[20px]">
          <h3 className="font-fraunces text-header-card text-luma-muted mb-1">Safe to Spend/day</h3>
          <div className="font-inter font-bold font-tnum text-xl text-luma-success">
            {formatCurrency(stats.safeSpendPerDay)}
          </div>
          <p className="text-body-muted-luma text-xs mt-1">Based on remaining balance</p>
        </div>

        <div className="glass-card p-4 rounded-[20px]">
          <h3 className="font-fraunces text-header-card text-luma-muted mb-1">You&#39;re Spending/day</h3>
          <div className={`font-inter font-bold font-tnum text-xl ${isOverSafeLimit ? 'text-luma-danger' : 'text-luma-success'}`}>
            {formatCurrency(stats.actualSpendPerDay)}
          </div>
          <p className="text-body-muted-luma text-xs mt-1">
            {isOverSafeLimit ? 'Over safe limit' : 'Within safe limit'}
          </p>
        </div>
      </div>

      {/* Row 3: Alert Card */}
      <div className={`glass-card p-4 rounded-[20px] ${
        stats.willRunOut 
          ? 'border-luma-danger/30 bg-luma-danger-glow' 
          : stats.isOverspending 
            ? 'border-luma-warning/30 bg-luma-warning-glow' 
            : 'border-luma-success/30 bg-luma-success-glow'
      }`}>
        <div className="flex items-start gap-3">
          {stats.willRunOut ? (
            <AlertTriangle className="h-5 w-5 text-luma-danger shrink-0 mt-0.5" />
          ) : stats.isOverspending ? (
            <TrendingUp className="h-5 w-5 text-luma-warning shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-luma-success shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            {stats.willRunOut ? (
              <p className="text-sm font-medium text-luma-danger font-inter font-tnum">
                ⚠️ At this rate you&#39;ll run out {formatCurrency(Math.abs(stats.projectedBalanceOnPayday || 0))} before your next stipend
              </p>
            ) : stats.isOverspending ? (
              <p className="text-sm font-medium text-luma-warning font-inter font-tnum">
                📊 Spending {formatCurrency((stats.actualSpendPerDay || 0) - (stats.safeSpendPerDay || 0))}/day over your safe limit
              </p>
            ) : (
              <p className="text-sm font-medium text-luma-success font-inter font-tnum">
                ✅ You&#39;re on track! Projected {formatCurrency(stats.projectedBalanceOnPayday)} left on stipend day
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Projected Balance */}
      <div className="glass-card p-4 rounded-[20px]">
        <h3 className="font-fraunces text-header-card text-luma-muted mb-1">Projected Balance on Stipend Day</h3>
        <div className={`font-inter font-bold font-tnum text-2xl ${(stats.projectedBalanceOnPayday || 0) < 0 ? 'text-luma-danger' : 'text-luma-success'}`}>
          {formatCurrency(stats.projectedBalanceOnPayday)}
        </div>
      </div>
    </div>
  )
}

function getOrdinalSuffix(n: number | null) {
  if (n === null) return ''
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
