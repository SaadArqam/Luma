'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { RecurringExpense, RecurringWithStatus } from '@/types'
import { getDaysUntilDue, getRecurringStatus, formatDueLabel } from '@/lib/recurring-utils'

function RecurringClient({ initialData }: { initialData: RecurringExpense[] }) {
  const router = useRouter()
  const [items, setItems] = useState<RecurringWithStatus[]>([])
  const [payingId, setPayingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    processItems(initialData)
  }, [initialData])

  const processItems = (data: RecurringExpense[]) => {
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
    setItems(withStatus)
  }

  const refetch = async () => {
    try {
      const res = await fetch('/api/recurring')
      const data = await res.json()
      processItems(data)
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const handlePay = async (id: string) => {
    setPayingId(id)
    try {
      const res = await fetch(`/api/recurring/${id}/pay`, { method: 'POST' })
      if (res.ok) {
        toast.success('Payment recorded')
        refetch()
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

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this recurring payment?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/recurring/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Recurring payment removed')
        refetch()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to remove')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      toast.error('Failed to remove')
    } finally {
      setDeletingId(null)
    }
  }

  const getDueColor = (status: RecurringWithStatus['status']) => {
    if (status === 'overdue') return '#C4595A'
    if (status === 'urgent') return '#E0A458'
    return undefined
  }

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-[20px] mx-4 p-8 text-center">
        <div style={{ fontSize: '48px', marginBottom: '16px', color: '#8A8790' }}>🔄</div>
        <p className="font-fraunces text-header-card text-[#F2EFEA] mb-2">No recurring payments</p>
        <p className="text-body-muted-luma mb-5">Add recurring expenses like rent, tiffin, subscriptions</p>
        <Link href="/expenses">
          <button className="btn-primary-luma" style={{ padding: '0 24px', height: '48px', minHeight: '48px' }}>
            Add from Expenses →
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3 mx-4">
      {items.map(item => (
        <div key={item.id} className="glass-card rounded-[20px] overflow-hidden p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#2B2C33] border border-[rgba(255,255,255,0.09)] rounded-xl flex items-center justify-center text-lg shrink-0">
              {item.categories?.icon || '💰'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-fraunces text-sm font-medium text-[#F2EFEA]">{item.name}</p>
                <span className="text-[10px] uppercase tracking-wide text-body-muted-luma bg-[#2B2C33] border border-[rgba(255,255,255,0.09)] px-1.5 py-0.5 rounded-md">
                  {item.frequency}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <p className="font-inter font-tnum text-sm font-semibold text-[#F2EFEA]">
                  ₹{Number(item.amount).toLocaleString('en-IN')}
                </p>
                <span className="text-body-muted-luma text-xs">·</span>
                <p className="font-inter font-tnum text-[10px] text-body-muted-luma uppercase tracking-wide">
                  {format(new Date(item.next_due_date), 'dd MMM yyyy')}
                </p>
              </div>
              <p
                className={`text-xs font-medium mt-1 ${!getDueColor(item.status) ? 'text-body-muted-luma' : ''}`}
                style={getDueColor(item.status) ? { color: getDueColor(item.status) } : undefined}
              >
                {formatDueLabel(item.days_until_due)}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                disabled={payingId === item.id}
                onClick={() => handlePay(item.id)}
                className={`h-8 px-3 text-xs font-semibold rounded-full transition-all active:scale-95 flex items-center justify-center ${
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
              <button
                type="button"
                className="text-[10px] uppercase tracking-widest text-body-muted-luma hover:text-[#C4595A] transition-colors duration-150 min-h-[44px] flex items-center justify-center gap-1"
                disabled={deletingId === item.id}
                onClick={() => handleDelete(item.id)}
              >
                {deletingId === item.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecurringClient
