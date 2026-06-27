'use client'
import { RecurringTransaction } from '../types'
import { format, isBefore, isToday } from 'date-fns'

interface BillCardProps {
  bill: RecurringTransaction & { 
    categories?: { name: string; icon: string }, 
    accounts?: { name: string; icon: string }
  }
}

export const BillCard: React.FC<BillCardProps> = ({ bill }) => {
  const dueDate = new Date(bill.next_due_date)
  const isOverdue = isBefore(dueDate, new Date()) && !isToday(dueDate)
  const isDueToday = isToday(dueDate)

  return (
    <div className={`p-4 rounded-xl border ${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isOverdue ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
            {bill.categories?.icon || '📄'}
          </span>
          <div>
            <h3 className="font-medium text-gray-900">{bill.name}</h3>
            <p className="text-xs text-gray-500">
              {bill.frequency} • {format(dueDate, 'MMM d')}
            </p>
          </div>
        </div>
        <div className="font-bold text-gray-900">
          ₹{bill.amount.toLocaleString('en-IN')}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {bill.accounts?.name || 'No account'}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isDueToday ? 'bg-yellow-100 text-yellow-700' : 
          isOverdue ? 'bg-red-100 text-red-700' : 
          'bg-green-100 text-green-700'
        }`}>
          {isDueToday ? 'Due Today' : isOverdue ? 'Overdue' : 'Upcoming'}
        </div>
      </div>
    </div>
  )
}
