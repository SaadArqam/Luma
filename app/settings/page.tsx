'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

export default function SettingsPage() {
  const [amount, setAmount] = useState('')
  const [creditDay, setCreditDay] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [currentConfig, setCurrentConfig] = useState<{ amount: number, credit_day: number } | null>(null)

  useEffect(() => {
    fetchCurrentConfig()
  }, [])

  const fetchCurrentConfig = async () => {
    try {
      const res = await fetch('/api/stipend')
      const data = await res.json()
      if (data) {
        setCurrentConfig(data)
        setAmount(data.amount.toString())
        setCreditDay(data.credit_day.toString())
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/stipend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          credit_day: Number(creditDay)
        })
      })

      if (!res.ok) throw new Error('Failed to save config')

      setMessage({ type: 'success', text: 'Stipend configuration saved successfully!' })
      fetchCurrentConfig()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="pt-2 pb-2">
        <h1 className="font-fraunces text-header-display text-[#F2EFEA] flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-body-muted-luma mt-2">Configure your stipend settings</p>
      </div>

      <div className="max-w-2xl">
        <div className="glass-card p-5 rounded-[20px]">
          <h2 className="font-fraunces text-header-section text-[#F2EFEA] mb-4">Stipend Configuration</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Monthly Stipend Amount (₹)</Label>
              <input
                id="amount"
                type="number"
                placeholder="e.g., 25000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                className="input-luma"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditDay">Stipend Credit Day (1-31)</Label>
              <input
                id="creditDay"
                type="number"
                placeholder="e.g., 1 for 1st of the month"
                value={creditDay}
                onChange={(e) => setCreditDay(e.target.value)}
                required
                min="1"
                max="31"
                className="input-luma"
              />
              <p className="text-body-muted-luma">
                The day of the month when your stipend arrives
              </p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg border-none ${
                message.type === 'success' ? 'badge-success-luma' : 'badge-danger-luma'
              }`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary-luma w-full disabled:opacity-60 disabled:cursor-not-allowed">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
          </form>

          {currentConfig && (
            <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.09)]">
              <h3 className="font-fraunces text-header-card text-[#F2EFEA] mb-3">Current Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-body-muted-luma">Monthly Stipend:</span>
                  <span className="font-inter font-tnum font-medium text-[#F2EFEA]">₹{Number(currentConfig.amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-muted-luma">Credit Day:</span>
                  <span className="font-inter font-tnum font-medium text-[#F2EFEA]">{currentConfig.credit_day}{getOrdinalSuffix(currentConfig.credit_day)} of the month</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account section */}
      <div className="max-w-2xl">
        <div className="glass-card p-5 rounded-[20px]">
          <h2 className="font-fraunces text-header-section text-[#F2EFEA] mb-4">Account</h2>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

function getOrdinalSuffix(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
