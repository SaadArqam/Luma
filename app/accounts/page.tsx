'use client';

import { useEffect, useState } from 'react';
import { Account } from '@/modules/finance/types';
import { AccountCard } from '@/modules/accounts/components/AccountCard';
import { EmptyAccountsState } from '@/modules/accounts/components/EmptyAccountsState';
import { AddAccountForm } from '@/modules/accounts/components/AddAccountForm';
import { Button } from '@/modules/shared/components/ui/button';
import { formatCurrency } from '@/modules/shared/utils';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<(Account & { current_balance: number })[]>([]);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      toast.error('Failed to load accounts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const totalBalance = accounts.reduce((sum, account) => sum + account.current_balance, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Accounts</h1>
          {!loading && accounts.length > 0 && (
            <p className="text-muted-foreground">
              Total balance: <span className="font-semibold text-text">{formatCurrency(totalBalance)}</span>
            </p>
          )}
        </div>

        <Button onClick={() => setAddAccountOpen(true)} className="gap-2">
          <PlusCircle className="w-5 h-5" />
          Add Account
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : accounts.length === 0 ? (
        <EmptyAccountsState onAddAccount={() => setAddAccountOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}

      <AddAccountForm
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        onSuccess={fetchAccounts}
      />
    </div>
  );
}
