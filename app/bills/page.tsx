'use client'
import { useEffect, useState } from 'react'
import { RecurringTransaction } from '@/modules/recurring-transactions'
import { RecurringCard } from '@/modules/recurring-transactions/components/RecurringCard'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BillsPage() {
  const [bills, setBills] = useState<RecurringTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch('/api/recurring-transactions')
        if (res.ok) {
          const data = await res.json()
          setBills(data.filter((tx: RecurringTransaction) => tx.type === 'expense'))
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
          <button
            onClick={() => router.push('/bills/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Bill
          </button>
        </div>
        <div className="space-y-4">
          {bills.map((bill) => (
            <RecurringCard key={bill.id} recurringTx={bill} />
          ))}
        </div>
      </div>
    </div>
  )
}
