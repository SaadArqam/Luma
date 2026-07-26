'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Wallet } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Category } from '@/types'

export function CategoryList({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [budgetCategoryId, setBudgetCategoryId] = useState<string | null>(null)
  const [budgetAmount, setBudgetAmount] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!deleteId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/categories/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setDeleteId(null)
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveBudget() {
    if (!budgetCategoryId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/categories/${budgetCategoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_budget: budgetAmount ? Number(budgetAmount) : null })
      })

      if (res.ok) {
        setBudgetCategoryId(null)
        setBudgetAmount('')
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveBudget() {
    if (!budgetCategoryId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/categories/${budgetCategoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_budget: null })
      })

      if (res.ok) {
        setBudgetCategoryId(null)
        setBudgetAmount('')
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function openBudgetDialog(category: Category) {
    setBudgetCategoryId(category.id)
    setBudgetAmount(category.daily_budget ? category.daily_budget.toString() : '')
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {initialCategories.map((category) => (
          <div
            key={category.id}
            className="relative group overflow-hidden rounded-[20px] p-6 flex flex-col items-center justify-center gap-3"
            style={{
              backgroundColor: '#2B2C33',
              border: category.daily_budget ? '1px solid rgba(225, 122, 77, 0.40)' : '1px solid rgba(255, 255, 255, 0.09)',
            }}
          >
            <div style={{ backgroundColor: '#232429', borderRadius: '12px', padding: '10px', display: 'inline-block', marginBottom: '8px' }}>
              <span className="text-4xl">{category.icon}</span>
            </div>
            <span
              className="font-fraunces text-center truncate w-full text-[#F2EFEA]"
              style={{ fontSize: '15px', fontWeight: 600 }}
              title={category.name}
            >
              {category.name}
            </span>

            {category.daily_budget ? (
              <div className="text-xs px-2 py-1 rounded-full font-inter font-tnum font-medium" style={{ color: '#E17A4D', backgroundColor: 'rgba(225, 122, 77, 0.18)' }}>
                Daily: ₹{Number(category.daily_budget).toLocaleString('en-IN')}
              </div>
            ) : (
              <div className="text-xs text-body-muted-luma">No budget set</div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => openBudgetDialog(category)}
                className="btn-secondary-luma text-xs"
                style={{ height: 'auto', padding: '6px 14px' }}
              >
                <Wallet className="h-3 w-3 mr-1" />
                Set Budget
              </button>
              <button
                onClick={() => setDeleteId(category.id)}
                aria-label="Delete category"
                className="h-7 w-7 flex items-center justify-center rounded-full text-[#C4595A] hover:bg-[rgba(196,89,90,0.16)] active:scale-95 transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone. Expenses linked to this category might be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!budgetCategoryId} onOpenChange={(open) => !open && setBudgetCategoryId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Daily Budget</DialogTitle>
            <DialogDescription>
              Set a daily spending limit for this category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Daily Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 500"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleRemoveBudget} disabled={loading}>
              Remove Budget
            </Button>
            <Button variant="outline" onClick={() => setBudgetCategoryId(null)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSaveBudget} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
