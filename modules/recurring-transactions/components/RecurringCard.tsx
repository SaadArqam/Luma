'use client'
import { RecurringTransaction } from '../types'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface RecurringCardProps {
  recurringTx: RecurringTransaction & { 
    categories?: { name: string; icon: string }, 
    accounts?: { name: string; icon: string }
  }
}

export const RecurringCard: React.FC<RecurringCardProps> = ({ recurringTx }) => {
  const router = useRouter()
  const isExpense = recurringTx.type === 'expense'

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isExpense ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {recurringTx.categories?.icon || (isExpense ? '💰' : '💵')}
          </span>
          <div>
            <h3 className="font-medium text-gray-900">{recurringTx.name}</h3>
            <p className="text-xs text-gray-500">
              {recurringTx.frequency} • Next: {format(new Date(recurringTx.next_due_date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className={`font-bold ${isExpense ? 'text-red-600' : 'text-green-600'}`}>
          {isExpense ? '-' : '+'}₹{recurringTx.amount.toLocaleString('en-IN')}
        </div>
      </div>
      {recurringTx.notes && (
        <p className="text-sm text-gray-600 mb-2">{recurringTx.notes}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {recurringTx.accounts?.name || 'No account'}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${recurringTx.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {recurringTx.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  )
}
