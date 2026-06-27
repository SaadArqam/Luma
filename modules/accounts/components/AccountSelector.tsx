'use client';

import { Account } from '@/modules/finance/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/shared/components/ui/select';

interface AccountSelectorProps {
  accounts: (Account & { current_balance: number })[];
  selectedAccountId: string | null;
  onSelect: (accountId: string) => void;
  placeholder?: string;
}

export function AccountSelector({
  accounts,
  selectedAccountId,
  onSelect,
  placeholder = 'Select an account',
}: AccountSelectorProps) {
  return (
    <Select
      value={selectedAccountId || ''}
      onValueChange={onSelect}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name} ({account.type})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
