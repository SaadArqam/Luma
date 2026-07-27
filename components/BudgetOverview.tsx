'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { useExpenseSync } from '@/lib/expenseSync'

interface BudgetStat {
  categoryId: string
  categoryName: string
  categoryIcon: string
  dailyBudget: number
  spentToday: number
  remainingBudget: number
  percentageUsed: number
  status: 'safe' | 'warning' | 'danger'
}

export function BudgetOverview() {
  const version = useExpenseSync((s) => s.version)
  const [stats, setStats] = useState<BudgetStat[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Keyed on `version` so the bars re-read after an expense is added.
  useEffect(() => {
    fetchStats()
  }, [version])

  // Separate effect: the clock tick must not be torn down and restarted every
  // time an expense is added.
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/budget/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch budget stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
  }

  const getStatusColor = (status: 'safe' | 'warning' | 'danger') => {
    switch (status) {
      case 'safe': return 'var(--luma-success)'
      case 'warning': return 'var(--luma-warning)'
      case 'danger': return 'var(--luma-danger)'
    }
  }

  const safeCount = stats.filter(s => s.status === 'safe').length

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-[20px]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-luma-raised rounded w-1/3"></div>
          <div className="h-8 bg-luma-raised rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (stats.length === 0) {
    return (
      <div className="glass-card p-6 rounded-[20px]">
        <h2 className="font-fraunces text-header-section text-luma-text mb-3">Today's Budget</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-body-muted-luma">No budgets set — go to Categories to set daily limits</p>
          <Link href="/categories">
            <button className="btn-primary-luma py-2.5 px-4 text-xs font-semibold h-auto min-h-0">
              Set Budgets
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-fraunces text-header-section text-luma-text flex items-center gap-2">
            <div style={{ width: '3px', height: '18px', backgroundColor: 'var(--luma-accent)', borderRadius: '2px' }} />
            <span>Today's Budget</span>
          </h2>
          <p className="text-body-muted-luma text-xs mt-0.5">As of {format(currentTime, 'h:mm a')}</p>
        </div>
        <p className="text-body-muted-luma text-sm">
          {safeCount} of {stats.length} categories within budget today
        </p>
      </div>

      <div className="grid gap-3">
        {stats.map((stat) => (
          <div
            key={stat.categoryId}
            className="glass-card p-4 rounded-[16px] transition-all"
            style={{ borderLeft: `4px solid ${getStatusColor(stat.status)}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl bg-luma-raised p-2 rounded-full flex items-center justify-center w-10 h-10">{stat.categoryIcon}</span>
                <div>
                  <h3 className="font-fraunces text-header-card text-luma-text">{stat.categoryName}</h3>
                  <p className="text-body-muted-luma text-xs font-inter font-tnum">
                    {formatCurrency(stat.spentToday)} spent of {formatCurrency(stat.dailyBudget)} today
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stat.status === 'danger' && (
                  <Badge className="bg-luma-danger text-luma-text border-none">
                    Over Budget!
                  </Badge>
                )}
                {stat.status === 'warning' && (
                  <Badge className="bg-luma-warning text-luma-canvas border-none font-semibold">
                    Almost there
                  </Badge>
                )}
                <span className="font-inter font-bold font-tnum text-sm text-luma-text">{Math.round(stat.percentageUsed)}%</span>
              </div>
            </div>

            <div className="w-full bg-luma-raised rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(stat.percentageUsed, 100)}%`,
                  backgroundColor: getStatusColor(stat.status)
                }}
              />
            </div>

            <div className="mt-2 text-xs font-inter font-tnum">
              {stat.remainingBudget < 0 ? (
                <p className="text-luma-danger font-medium">
                  {formatCurrency(Math.abs(stat.remainingBudget))} over today's limit
                </p>
              ) : (
                <p className="text-luma-success font-medium">
                  {formatCurrency(stat.remainingBudget)} left today
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-body-muted-luma text-xs text-center">Resets at midnight</p>
    </div>
  )
}
