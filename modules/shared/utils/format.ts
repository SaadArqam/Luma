export function formatCurrency(amount: number | null, options?: { maximumFractionDigits?: number }): string {
  if (amount === null) return '₹0'
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: options?.maximumFractionDigits || 0 })}`
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'with-time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'with-time') {
    return dateObj.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function getOrdinalSuffix(n: number | null): string {
  if (n === null) return ''
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
