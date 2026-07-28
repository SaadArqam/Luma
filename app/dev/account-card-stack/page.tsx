'use client'

import { useState } from 'react'
import { AccountCardStack, type AccountCardData } from '@/components/AccountCardStack'

const MOCK_ACCOUNTS: AccountCardData[] = [
  { id: 'total', name: 'Combined', bank_name: null, bank_domain: null, balance: 184320, subtitle: '3 accounts' },
  { id: 'a1', name: 'HDFC Salary', bank_name: 'HDFC Bank', bank_domain: 'hdfcbank.com', balance: 92150, subtitle: 'Savings', maskedLabel: '•••• 4821' },
  { id: 'a2', name: 'ICICI Daily', bank_name: 'ICICI Bank', bank_domain: 'icicibank.com', balance: 61200, subtitle: 'Savings', maskedLabel: '•••• 1190' },
  { id: 'a3', name: 'Cash', bank_name: null, bank_domain: null, balance: 30970, subtitle: 'Cash', maskedLabel: undefined },
]

export default function AccountCardStackDemoPage() {
  const [selected, setSelected] = useState(MOCK_ACCOUNTS[1].id)
  return (
    <div className="p-4 space-y-8 max-w-3xl mx-auto">
      <section>
        <h2 className="text-header-section mb-3">variant=&quot;full&quot;</h2>
        <AccountCardStack accounts={MOCK_ACCOUNTS} variant="full" onActiveCardAction={(id) => alert(`action sheet for ${id}`)} />
      </section>
      <section>
        <h2 className="text-header-section mb-3">variant=&quot;mini&quot;</h2>
        <AccountCardStack
          accounts={MOCK_ACCOUNTS.slice(1)}
          variant="mini"
          selectedId={selected}
          onSelect={setSelected}
        />
        <p className="text-body-muted-luma mt-2">selected: {selected}</p>
      </section>
    </div>
  )
}
