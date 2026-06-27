'use client'
import { useEffect, useState } from 'react'
import { RecurringTransaction } from '../types'
import { BillCard } from './BillCard'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export const UpcomingBillsWidget: React.FC = () => {
  const [bills, setBills] = useState<RecurringTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch('/api/recurring-transactions')
        if (res.ok) {
          const data = await res.json()
          setBills(data.filter((tx: RecurringTransaction) => tx.type === 'expense' && tx.is_active).slice(0, 5))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchBills()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
      </div>
    )
  }

  if (bills.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No upcoming bills</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
      <button
        onClick={() => router.push('/bills')}
        className="w-full py-2 text-center text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
      >
        View all bills
      </button>
    </div>
  )
}
