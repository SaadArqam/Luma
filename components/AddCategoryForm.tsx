'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function AddCategoryForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('💰')
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    if (!name || !icon) return

    setLoading(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon })
      })

      if (res.ok) {
        setName('')
        setIcon('💰')
        router.refresh()
      } else {
        const data = await res.json()
        // Format postgres unique constraint error
        if (data.error?.includes('duplicate key')) {
          setErrorMsg('A category with this name already exists.')
        } else {
          setErrorMsg(data.error || 'Failed to create category')
        }
      }
    } catch (error) {
      console.error(error)
      setErrorMsg('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-5 rounded-[20px]">
      <h3 className="font-fraunces text-header-card text-[#F2EFEA]">New Category</h3>
      <p className="text-body-muted-luma mt-1 mb-4">Create a custom expense category</p>
      {errorMsg && (
        <Alert variant="destructive" className="mb-4 py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">{errorMsg}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Groceries"
            className="input-luma"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Emoji Icon</Label>
          <input
            id="icon"
            type="text"
            required
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🍔"
            maxLength={2}
            className="input-luma"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary-luma w-full disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  )
}
