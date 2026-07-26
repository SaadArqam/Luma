'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function MigrationBanner({
  hasClaimableData,
  initialDismissed,
}: {
  hasClaimableData: boolean
  initialDismissed: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(initialDismissed)

  const persistDismissed = () => {
    fetch('/api/migrate/dismiss', { method: 'POST' }).catch(() => {})
  }

  const handleMigrate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/migrate', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        const total = Object.values(data.migrated as Record<string, number>).reduce((a, b) => a + b, 0)
        if (total > 0) {
          toast.success(`Migrated ${total} existing records to your account!`)
        } else {
          toast.success('All data is already linked to your account.')
        }
        setDismissed(true)
        persistDismissed()
      }
    } catch {
      toast.error('Migration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    persistDismissed()
  }

  if (!hasClaimableData || dismissed) return null

  return (
    <div className="flex items-center gap-3 glass-card border border-[#E17A4D]/30 bg-[rgba(225,122,77,0.08)] rounded-[16px] px-4 py-3 text-sm">
      <span className="text-lg">📦</span>
      <p className="flex-1 text-[#8A8790]">
        You have existing data — <button onClick={handleMigrate} disabled={loading} className="text-[#E17A4D] font-medium hover:underline disabled:opacity-50">
          {loading ? 'Claiming...' : 'click here to claim it'}
        </button> for your account.
      </p>
      <button onClick={handleDismiss} className="text-[#8A8790] hover:text-[#F2EFEA] text-xs ml-2">✕</button>
    </div>
  )
}
