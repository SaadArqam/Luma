'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { RecurringExpense, RecurringWithStatus } from '@/types'
import { getDaysUntilDue, getRecurringStatus, formatDueLabel } from '@/lib/recurring-utils'

export function RecurringSection() {
  const router = useRouter()
  const [items, setItems] = useState<RecurringWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    fetchRecurring()
  }, [])

  const fetchRecurring = async () => {
    try {
      const res = await fetch('/api/recurring')
      const data = await res.json()

      if (!res.ok || !Array.isArray(data)) {
        console.warn('fetchRecurring: unexpected response', data)
        return
      }

      const withStatus: RecurringWithStatus[] = data.map(item => {
        const days = getDaysUntilDue(item.next_due_date)
        return {
          ...item,
          days_until_due: days,
          status: getRecurringStatus(days),
        }
      })

      const priority = { overdue: 0, urgent: 1, upcoming: 2, normal: 3 }
      withStatus.sort((a, b) => priority[a.status] - priority[b.status])

      setItems(withStatus.filter(item => item.days_until_due <= 7))
    } catch (error) {
      console.error('Failed to fetch recurring:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async (id: string) => {
    setPayingId(id)
    try {
      const res = await fetch(`/api/recurring/${id}/pay`, { method: 'POST' })
      if (res.ok) {
        toast.success('Payment recorded')
        router.refresh()
        fetchRecurring()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to record payment')
      }
    } catch (error) {
      console.error('Failed to pay:', error)
      toast.error('Failed to record payment')
    } finally {
      setPayingId(null)
    }
  }

  if (loading) return null
  if (items.length === 0) return null

  const getDueColor = (status: RecurringWithStatus['status']) => {
    if (status === 'overdue') return '#C4595A'
    if (status === 'urgent') return '#E0A458'
    return '#8A8790'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-fraunces text-header-card text-[#8A8790]">
          Upcoming Payments
        </h2>
        <Link
          href="/recurring"
          className="text-xs text-[#E17A4D] font-medium flex items-center gap-1 hover:underline transition-colors"
        >
          Manage <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="glass-card rounded-[20px] overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 ${index < items.length - 1 ? 'border-b border-[rgba(255,255,255,0.09)]' : ''}`}
          >
            <div className="w-9 h-9 bg-[#2B2C33] border border-[rgba(255,255,255,0.09)] rounded-xl flex items-center justify-center text-lg shrink-0">
              {item.categories?.icon || '💰'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-fraunces text-sm font-medium truncate text-[#F2EFEA]">{item.name}</p>
              <p className="text-body-muted-luma text-xs uppercase">{item.frequency}</p>
            </div>

            <p
              className="text-xs font-inter font-tnum font-medium shrink-0"
              style={{ color: getDueColor(item.status) }}
            >
              {formatDueLabel(item.days_until_due)}
            </p>

            <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
              <p className="font-inter font-tnum text-sm font-semibold text-[#F2EFEA]">
                ₹{Number(item.amount).toLocaleString('en-IN')}
              </p>
              <button
                disabled={payingId === item.id}
                onClick={() => handlePay(item.id)}
                className={`h-7 px-3 text-xs font-semibold rounded-full transition-all active:scale-95 ${
                  item.status === 'overdue' || item.status === 'urgent'
                    ? 'bg-[#E17A4D] text-[#1B1C21] hover:bg-[#C9663B]'
                    : 'bg-transparent border border-[rgba(255,255,255,0.16)] text-[#F2EFEA] hover:bg-white/5'
                }`}
              >
                {payingId === item.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
