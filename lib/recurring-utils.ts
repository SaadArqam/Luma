import { zonedDateString, addDays } from './dates'

// Due dates are calendar labels ('YYYY-MM-DD'), so all arithmetic here stays on
// the label. The previous version mixed local-time setMonth/setHours with UTC
// toISOString(), which gave different answers on a UTC server and an IST
// browser for the same row.
export function calculateNextDueDate(currentDue: string, frequency: string, customDays?: number): string {
  const day = currentDue.slice(0, 10)
  if (frequency === 'monthly') {
    const [y, m, d] = day.split('-').map(Number)
    // Month index is 0-based, so passing `m` lands on the following month.
    // Overflow rolls forward (31 Jan + 1 month → 3 Mar), matching setMonth.
    return new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10)
  }
  if (frequency === 'weekly') return addDays(day, 7)
  if (frequency === 'custom') return addDays(day, customDays || 30)
  return day
}

export function getDaysUntilDue(nextDueDate: string): number {
  // Both sides are IST calendar dates compared at UTC midnight, so the result
  // is a whole number of days regardless of where this runs.
  const today = Date.parse(`${zonedDateString()}T00:00:00Z`)
  const due = Date.parse(`${nextDueDate.slice(0, 10)}T00:00:00Z`)
  return Math.round((due - today) / 86400000)
}

export function getRecurringStatus(daysUntilDue: number): 'overdue' | 'urgent' | 'upcoming' | 'normal' {
  if (daysUntilDue < 0) return 'overdue'
  if (daysUntilDue <= 3) return 'urgent'
  if (daysUntilDue <= 7) return 'upcoming'
  return 'normal'
}

export function formatDueLabel(days: number): string {
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}
