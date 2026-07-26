'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Settings as SettingsIcon, Save, Bell, Clock, Send } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import { subscribeToPushNotifications } from '@/lib/subscribePush'
import { toast } from 'sonner'

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
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="pt-2 pb-2">
        <h1 className="font-fraunces text-header-display text-[#F2EFEA] flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-body-muted-luma mt-2">Configure your stipend settings</p>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card shadow-md">
          <CardHeader>
            <CardTitle className="text-header-section">Stipend Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Monthly Stipend Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="text-lg bg-[#2B2C33] border-[rgba(255,255,255,0.09)] text-[#F2EFEA] focus-visible:border-[rgba(225,122,77,0.40)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditDay">Stipend Credit Day (1-31)</Label>
                <Input
                  id="creditDay"
                  type="number"
                  placeholder="e.g., 1 for 1st of the month"
                  value={creditDay}
                  onChange={(e) => setCreditDay(e.target.value)}
                  required
                  min="1"
                  max="31"
                  className="text-lg bg-[#2B2C33] border-[rgba(255,255,255,0.09)] text-[#F2EFEA] focus-visible:border-[rgba(225,122,77,0.40)]"
                />
                <p className="text-sm text-body-muted-luma">
                  The day of the month when your stipend arrives
                </p>
              </div>

              {message && (
                <div className={`p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-[rgba(127,182,158,0.16)] text-[#7FB69E] border border-[rgba(127,182,158,0.30)]'
                    : 'bg-[rgba(196,89,90,0.16)] text-[#C4595A] border border-[rgba(196,89,90,0.30)]'
                }`}>
                  {message.text}
                </div>
              )}

              <Button type="submit" variant="default" disabled={loading} className="btn-primary-luma w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </form>

            {currentConfig && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3 text-[#F2EFEA]">Current Configuration</h3>
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
          </CardContent>
        </Card>
      </div>

      {/* Account section */}
      <div className="max-w-2xl">
        <Card className="glass-card shadow-md">
          <CardHeader>
            <CardTitle className="text-header-section">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
      {/* Notification Settings */}
      <NotificationSettingsSection />
    </div>
  )
}

function NotificationSettingsSection() {
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false)
  const [dailyReminderTime, setDailyReminderTime] = useState('20:00')
  const [eodSummaryEnabled, setEodSummaryEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/notifications/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.daily_reminder_enabled === 'boolean') {
          setDailyReminderEnabled(data.daily_reminder_enabled)
          setDailyReminderTime(data.daily_reminder_time || '20:00')
          setEodSummaryEnabled(data.eod_summary_enabled ?? true)
        }
      })
      .catch(console.error)
  }, [])

  const handleToggleDailyReminder = async (enabled: boolean) => {
    setDailyReminderEnabled(enabled)
    if (enabled) {
      const ok = await subscribeToPushNotifications()
      if (!ok) {
        toast.error('Notification permissions are required for daily reminders')
      }
    }
    saveSettings(enabled, dailyReminderTime, eodSummaryEnabled)
  }

  const handleToggleEodSummary = async (enabled: boolean) => {
    setEodSummaryEnabled(enabled)
    if (enabled) {
      const ok = await subscribeToPushNotifications()
      if (!ok) {
        toast.error('Notification permissions are required for end-of-day summaries')
      }
    }
    saveSettings(dailyReminderEnabled, dailyReminderTime, enabled)
  }

  const handleTimeChange = (time: string) => {
    setDailyReminderTime(time)
    saveSettings(dailyReminderEnabled, time, eodSummaryEnabled)
  }

  const saveSettings = async (reminderEnabled: boolean, time: string, eodEnabled: boolean) => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daily_reminder_enabled: reminderEnabled,
          daily_reminder_time: time,
          eod_summary_enabled: eodEnabled,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        }),
      })
      if (res.ok) {
        toast.success('Notification preferences updated')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update notification settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSendTestPush = async () => {
    setTesting(true)
    try {
      const subscribed = await subscribeToPushNotifications()
      if (!subscribed) {
        toast.error('Notification permission denied or unavailable')
        setTesting(false)
        return
      }

      const res = await fetch('/api/notifications/test', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Test notification sent to your device!')
      } else {
        toast.error(data.error || 'Failed to send test notification')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred sending test notification')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Card className="glass-card shadow-md">
        <CardHeader>
          <CardTitle className="text-header-section flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#E17A4D]" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Reminder Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.09)]">
            <div>
              <Label className="text-[#F2EFEA] font-medium text-base">Daily Expense Reminder</Label>
              <p className="text-xs text-body-muted-luma mt-0.5">
                Receive a push notification if you haven&#39;t logged an expense by your target time
              </p>
            </div>
            <input
              type="checkbox"
              checked={dailyReminderEnabled}
              onChange={(e) => handleToggleDailyReminder(e.target.checked)}
              className="w-5 h-5 accent-[#E17A4D] cursor-pointer"
            />
          </div>

          {/* Reminder Time Picker */}
          {dailyReminderEnabled && (
            <div className="space-y-2 pb-4 border-b border-[rgba(255,255,255,0.09)]">
              <Label htmlFor="reminderTime" className="text-[#F2EFEA] text-sm flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#8A8790]" />
                Remind me at
              </Label>
              <Input
                id="reminderTime"
                type="time"
                value={dailyReminderTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="max-w-[160px] bg-[#2B2C33] border-[rgba(255,255,255,0.09)] text-[#F2EFEA]"
              />
            </div>
          )}

          {/* EOD Summary Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.09)]">
            <div>
              <Label className="text-[#F2EFEA] font-medium text-base">End-of-day Summary</Label>
              <p className="text-xs text-body-muted-luma mt-0.5">
                Receive a daily evening summary of today&#39;s total spending and budget status
              </p>
            </div>
            <input
              type="checkbox"
              checked={eodSummaryEnabled}
              onChange={(e) => handleToggleEodSummary(e.target.checked)}
              className="w-5 h-5 accent-[#E17A4D] cursor-pointer"
            />
          </div>

          {/* Send Test Notification Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleSendTestPush}
            disabled={testing}
            className="btn-secondary-luma w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {testing ? 'Sending...' : 'Send Test Notification'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function getOrdinalSuffix(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
