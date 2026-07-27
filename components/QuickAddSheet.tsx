'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuickAddStore } from '@/lib/quickAddStore'
import { useExpenseSync } from '@/lib/expenseSync'
import { zonedDateString } from '@/lib/dates'
import { AccountPicker } from '@/components/AccountPicker'
import type { AccountRef } from '@/lib/accounts'

interface Category {
  id: string
  name: string
  icon: string
}

export function QuickAddSheet() {
  const router = useRouter()
  const { isOpen, close } = useQuickAddStore()
  const bump = useExpenseSync((s) => s.bump)
  const addTodayDelta = useExpenseSync((s) => s.addTodayDelta)
  const consumeTodayDelta = useExpenseSync((s) => s.consumeTodayDelta)
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<(AccountRef & { is_default: boolean })[]>([])
  const [accountId, setAccountId] = useState('')
  const [loading, setLoading] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  // IST calendar date, not the browser's or UTC's — so an expense logged at
  // 01:00 IST defaults to today rather than yesterday.
  const [date, setDate] = useState(() => zonedDateString())

  useEffect(() => {
    if (!isOpen) return

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data)
      })
      .catch(console.error)

    // Preselect the default account. Fetched on open rather than on mount so a
    // newly added account shows up without a reload.
    fetch('/api/accounts')
      .then((res) => res.json())
      .then((data: (AccountRef & { is_default: boolean })[]) => {
        if (!Array.isArray(data)) return
        setAccounts(data)
        setAccountId((prev) => prev || data.find((a) => a.is_default)?.id || data[0]?.id || '')
      })
      .catch(console.error)
  }, [isOpen])

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || !categoryId) return

    const amountNum = Number(amount)
    // Only an expense dated today moves the Today card. Both sides are the IST
    // calendar date, matching what /api/dashboard/today counts.
    const isToday = date === zonedDateString()

    // Optimistic: move the number before the round-trip, roll back if it fails.
    if (isToday) addTodayDelta(amountNum)

    setLoading(true)
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          note: note.trim(),
          date,
          category_id: categoryId,
          account_id: accountId || null,
        }),
      })

      if (res.ok) {
        toast.success('Expense added')
        setAmount('')
        setCategoryId('')
        setNote('')
        close()
        // Two different refresh mechanisms, both required:
        //   bump()           → client components (Today card, budget bars, …)
        //   router.refresh() → server-rendered totals on the Home page
        bump()
        router.refresh()
      } else {
        if (isToday) consumeTodayDelta(amountNum)
        const data = await res.json()
        toast.error(data.error || 'Failed to add expense')
      }
    } catch (err) {
      if (isToday) consumeTodayDelta(amountNum)
      console.error(err)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Scrim — covers full viewport, higher z-index than dock (z-200) */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />

          {/* Bottom Sheet Modal — z-210, surface-glass-thick, safe bottom padding */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[210] rounded-t-[28px] border-t border-x border-luma-hairline overflow-hidden shadow-2xl"
            style={{
              background: 'var(--luma-glass-thick)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Grab handle */}
            <div className="w-10 h-1 bg-luma-hairline-strong rounded-full mx-auto mt-3 mb-4" />

            <div className="px-5 mb-4">
              <h2 className="font-fraunces text-header-section text-luma-text">Add Expense</h2>
            </div>

            <div
              className="flex flex-col gap-3.5 px-5"
              style={{ paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 16px))' }}
            >
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-luma cursor-pointer"
              >
                <option value="" disabled className="bg-luma-surface text-luma-muted">
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-luma-surface text-luma-text">
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter font-tnum text-lg text-luma-muted">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-luma pl-9 font-inter font-bold font-tnum text-xl"
                  style={{ height: 52 }}
                />
              </div>

              <input
                type="text"
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-luma"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-luma"
              />

              <AccountPicker
                id="quickadd-account"
                accounts={accounts}
                value={accountId}
                onChange={setAccountId}
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary-luma mt-2 w-full active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
