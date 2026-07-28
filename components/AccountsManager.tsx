'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Star, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { BankLogo } from '@/components/BankLogo'
import { AccountCardStack, type AccountCardData } from '@/components/AccountCardStack'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BANKS, ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS, type AccountType } from '@/lib/banks'
import type { AccountWithBalance } from '@/lib/accounts'
import type { ExpenseWithCategory } from '@/types'

type Account = AccountWithBalance

const OTHER_BANK = '__other__'

type FormState = {
  name: string
  bankChoice: string      // a BANKS name, or OTHER_BANK for a hand-typed domain
  bankDomain: string      // only used when bankChoice === OTHER_BANK
  accountType: AccountType
}

const EMPTY_FORM: FormState = { name: '', bankChoice: BANKS[0].name, bankDomain: '', accountType: 'savings' }

/** Resolve the form's bank fields into what the API stores. */
function resolveBank(f: FormState): { bank_name: string | null; bank_domain: string | null } {
  if (f.bankChoice === OTHER_BANK) {
    const d = f.bankDomain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    return { bank_name: null, bank_domain: d || null }
  }
  const bank = BANKS.find((b) => b.name === f.bankChoice)
  return { bank_name: bank?.name ?? null, bank_domain: bank?.domain ?? null }
}

export function AccountsManager({ initialAccounts }: { initialAccounts: Account[] }) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)

  // When a delete is blocked, this holds what needs reassigning first.
  const [pendingDelete, setPendingDelete] = useState<{
    account: Account
    expenseCount: number
    balanceCount: number
    reassignTo: string
  } | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  // Clamp defensively so an out-of-range index (e.g. left over after deleting
  // the last account in the list) never indexes past the array.
  const activeAccount = accounts[Math.min(activeIndex, Math.max(accounts.length - 1, 0))]

  const [transactions, setTransactions] = useState<ExpenseWithCategory[]>([])
  // Never show a stale account's transactions once there's no active account
  // to attribute them to (e.g. the last account was just deleted) — derived
  // at render time so the fetch effect below never needs to call setState
  // just to clear the list.
  const displayedTransactions = activeAccount ? transactions : []

  useEffect(() => {
    if (!activeAccount) return
    let cancelled = false
    fetch(`/api/expenses?account_id=${activeAccount.id}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setTransactions(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) toast.error('Could not load transactions') })
    return () => { cancelled = true }
  }, [activeAccount])

  const cardData: AccountCardData[] = useMemo(
    () => accounts.map((a) => ({
      id: a.id,
      name: a.name,
      bank_name: a.bank_name,
      bank_domain: a.bank_domain,
      balance: a.balance,
      // Folded into subtitle (below the balance) rather than maskedLabel
      // (above the balance, between name and balance) — maskedLabel's slot
      // visually competes with the hero balance number, while subtitle is
      // already the card's "metadata line" for account type.
      subtitle: [
        a.is_default ? 'Default' : null,
        ACCOUNT_TYPE_LABELS[a.account_type],
        `${a.txCount} txn${a.txCount === 1 ? '' : 's'}`,
      ].filter(Boolean).join(' · '),
    })),
    [accounts]
  )

  const handleActiveIndexChange = useCallback((_id: string, index: number) => setActiveIndex(index), [])

  const load = async () => {
    try {
      const res = await fetch('/api/accounts')
      const data = await res.json()
      setAccounts(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Could not refresh accounts')
    }
  }

  async function handleAdd() {
    if (!addForm.name.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addForm.name.trim(),
          account_type: addForm.accountType,
          ...resolveBank(addForm),
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Could not add account'); return }
      toast.success('Account added')
      setAddForm(EMPTY_FORM)
      setShowAdd(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  function startEdit(a: Account) {
    const known = BANKS.find((b) => b.name === a.bank_name)
    setEditForm({
      name: a.name,
      bankChoice: known ? known.name : (a.bank_domain ? OTHER_BANK : BANKS[BANKS.length - 1].name),
      bankDomain: known ? '' : (a.bank_domain ?? ''),
      accountType: a.account_type,
    })
    setEditingId(a.id)
  }

  async function handleEditSave(id: string) {
    if (!editForm.name.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          account_type: editForm.accountType,
          ...resolveBank(editForm),
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Could not save'); return }
      toast.success('Account updated')
      setEditingId(null)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function makeDefault(id: string) {
    setBusyId(id)
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: true }),
      })
      if (!res.ok) {
        const d = await res.json()
        toast.error(d.error || 'Could not set default')
        return
      }
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(a: Account, reassignTo?: string) {
    setBusyId(a.id)
    try {
      const qs = reassignTo ? `?reassignTo=${encodeURIComponent(reassignTo)}` : ''
      const res = await fetch(`/api/accounts/${a.id}${qs}`, { method: 'DELETE' })
      const data = await res.json()

      if (res.status === 409 && data.requiresReassign) {
        const others = (accounts ?? []).filter((x) => x.id !== a.id)
        setPendingDelete({
          account: a,
          expenseCount: data.expenseCount,
          balanceCount: data.balanceCount,
          reassignTo: others[0]?.id ?? '',
        })
        return
      }
      if (!res.ok) { toast.error(data.error || 'Could not delete'); return }

      toast.success(data.reassigned > 0
        ? `Account deleted, ${data.reassigned} transaction${data.reassigned === 1 ? '' : 's'} moved`
        : 'Account deleted')
      setPendingDelete(null)
      setSheetOpen(false)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-3">
      <AccountCardStack
        accounts={cardData}
        variant="full"
        onActiveIndexChange={handleActiveIndexChange}
        onActiveCardAction={(id) => {
          const index = accounts.findIndex((a) => a.id === id)
          if (index >= 0) setActiveIndex(index)
          setSheetOpen(true)
        }}
      />

      <div className="solid-list-card">
        {displayedTransactions.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-body-muted-luma">No transactions yet</div>
        ) : (
          displayedTransactions.map((t) => (
            <div key={t.id} className="px-3 py-3 border-b border-luma-hairline-strong last:border-b-0 flex items-center justify-between">
              <span className="text-sm text-luma-text truncate">{t.category?.icon} {t.category?.name}</span>
              <span className="text-number-inline text-luma-text">₹{Number(t.amount).toLocaleString('en-IN')}</span>
            </div>
          ))
        )}
      </div>

      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeAccount?.name}</DialogTitle>
          </DialogHeader>
          {activeAccount && !editingId && (
            <div className="flex items-center gap-1">
              {!activeAccount.is_default && (
                <button
                  onClick={() => makeDefault(activeAccount.id)}
                  disabled={busyId === activeAccount.id}
                  className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-caption-luma text-luma-muted hover:text-luma-text transition-colors disabled:opacity-50"
                >
                  <Star className="w-3.5 h-3.5" /> Make default
                </button>
              )}
              <button
                onClick={() => startEdit(activeAccount)}
                className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-caption-luma text-luma-muted hover:text-luma-text transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(activeAccount)}
                disabled={busyId === activeAccount.id}
                className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-caption-luma text-luma-danger hover:bg-luma-danger-glow transition-colors ml-auto disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
          {activeAccount && editingId === activeAccount.id && (
            <AccountForm
              form={editForm}
              setForm={setEditForm}
              saving={saving}
              submitLabel="Save changes"
              onSubmit={() => handleEditSave(activeAccount.id)}
              onCancel={() => setEditingId(null)}
            />
          )}
          {activeAccount && pendingDelete?.account.id === activeAccount.id && (
            <div className="pt-3 border-t border-luma-hairline-strong space-y-3">
              <p className="text-body-muted-luma text-xs">
                This account has{' '}
                {pendingDelete.expenseCount > 0 && <>{pendingDelete.expenseCount} expense{pendingDelete.expenseCount === 1 ? '' : 's'}</>}
                {pendingDelete.expenseCount > 0 && pendingDelete.balanceCount > 0 && ' and '}
                {pendingDelete.balanceCount > 0 && <>{pendingDelete.balanceCount} balance entr{pendingDelete.balanceCount === 1 ? 'y' : 'ies'}</>}
                . Move them to another account first — nothing is deleted.
              </p>
              <select
                value={pendingDelete.reassignTo}
                onChange={(e) => setPendingDelete({ ...pendingDelete, reassignTo: e.target.value })}
                className="input-luma cursor-pointer"
              >
                {accounts.filter((x) => x.id !== activeAccount.id).map((x) => (
                  <option key={x.id} value={x.id} className="bg-luma-surface text-luma-text">
                    Move to {x.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(activeAccount, pendingDelete.reassignTo)}
                  disabled={busyId === activeAccount.id || !pendingDelete.reassignTo}
                  className="btn-primary-luma flex-1 disabled:opacity-50"
                >
                  {busyId === activeAccount.id ? 'Moving…' : 'Move and delete'}
                </button>
                <button onClick={() => setPendingDelete(null)} className="btn-secondary-luma">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full glass-card rounded-[20px] p-4 flex items-center justify-center gap-2 text-luma-accent min-h-[56px] hover:bg-luma-accent-glow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-inter font-semibold text-sm">Add account</span>
        </button>
      ) : (
        <div className="glass-card rounded-[20px] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-fraunces text-header-card text-luma-text">New account</h2>
            <button onClick={() => setShowAdd(false)} aria-label="Close" className="text-luma-muted hover:text-luma-text p-2">
              <X className="w-4 h-4" />
            </button>
          </div>
          <AccountForm
            form={addForm}
            setForm={setAddForm}
            saving={saving}
            submitLabel="Add account"
            onSubmit={handleAdd}
            onCancel={() => { setShowAdd(false); setAddForm(EMPTY_FORM) }}
          />
        </div>
      )}
    </div>
  )
}

function AccountForm({
  form, setForm, saving, submitLabel, onSubmit, onCancel,
}: {
  form: FormState
  setForm: (f: FormState) => void
  saving: boolean
  submitLabel: string
  onSubmit: () => void
  onCancel: () => void
}) {
  const preview = resolveBank(form)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <BankLogo name={preview.bank_name || form.name || '?'} domain={preview.bank_domain} size={40} />
        <span className="text-body-muted-luma text-xs">
          {preview.bank_domain ? preview.bank_domain : 'No logo — a letter avatar is used'}
        </span>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="acc-name" className="text-caption-luma text-luma-muted">Account name</label>
        <input
          id="acc-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Salary account"
          className="input-luma"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="acc-bank" className="text-caption-luma text-luma-muted">Bank</label>
        <select
          id="acc-bank"
          value={form.bankChoice}
          onChange={(e) => setForm({ ...form, bankChoice: e.target.value })}
          className="input-luma cursor-pointer"
        >
          {BANKS.map((b) => (
            <option key={b.name} value={b.name} className="bg-luma-surface text-luma-text">{b.name}</option>
          ))}
          <option value={OTHER_BANK} className="bg-luma-surface text-luma-text">Another bank — enter website</option>
        </select>
      </div>

      {form.bankChoice === OTHER_BANK && (
        <div className="space-y-1.5">
          <label htmlFor="acc-domain" className="text-caption-luma text-luma-muted">Bank website</label>
          <input
            id="acc-domain"
            type="text"
            inputMode="url"
            value={form.bankDomain}
            onChange={(e) => setForm({ ...form, bankDomain: e.target.value })}
            placeholder="e.g. federalbank.co.in"
            className="input-luma"
          />
          <p className="text-body-muted-luma" style={{ fontSize: 11 }}>
            The website address is used to find the logo. Leave blank for none.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="acc-type" className="text-caption-luma text-luma-muted">Type</label>
        <select
          id="acc-type"
          value={form.accountType}
          onChange={(e) => setForm({ ...form, accountType: e.target.value as AccountType })}
          className="input-luma cursor-pointer"
        >
          {ACCOUNT_TYPES.map((t) => (
            <option key={t} value={t} className="bg-luma-surface text-luma-text">{ACCOUNT_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onSubmit}
          disabled={saving || !form.name.trim()}
          className="btn-primary-luma flex-1 disabled:opacity-50"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        <button onClick={onCancel} className="btn-secondary-luma">Cancel</button>
      </div>
    </div>
  )
}
