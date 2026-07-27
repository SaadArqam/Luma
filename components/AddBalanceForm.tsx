'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { zonedDateString } from '@/lib/dates'

export function AddBalanceForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => zonedDateString())
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    if (!amount || isNaN(Number(amount))) return

    
    setLoading(true)
    try {
      const res = await fetch('/api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), note, type: 'credit', date })
      })

      if (res.ok) {
        setAmount('')
        setNote('')
        setDate(zonedDateString())
        router.refresh()
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Failed to add balance')
      }
    } catch (error) {
      console.error(error)
      setErrorMsg('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card shadow-md">
      <CardHeader>
        <CardTitle>Add Balance</CardTitle>
        <CardDescription className="text-body-muted-luma">Credit money to your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <Alert variant="destructive" className="mb-4 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">{errorMsg}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-luma"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-luma"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Salary, Gift"
              className="input-luma"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary-luma w-full disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Adding...' : 'Add Money'}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
