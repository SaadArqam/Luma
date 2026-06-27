import { Account } from '@/modules/finance/types';
import { formatCurrency } from '@/modules/shared/utils';
import { cn } from '@/modules/shared/utils';

interface AccountCardProps {
  account: Account & { current_balance: number };
  className?: string;
}

export function AccountCard({ account, className }: AccountCardProps) {
  return (
    <div className={cn(
      'bg-card border border-border rounded-2xl p-6 transition-all hover:shadow-lg',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {account.icon ? (
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: account.color || '#3b82f6' }}>
              {account.icon}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-2xl">
              💰
            </div>
          )}
          <div>
            <h3 className="font-semibold text-text">{account.name}</h3>
            <p className="text-sm text-muted-foreground">{account.type}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-text">
          {formatCurrency(account.current_balance)}
        </p>
        {account.opening_balance !== 0 && (
          <p className="text-sm text-muted-foreground">
            Opening: {formatCurrency(account.opening_balance)}
          </p>
        )}
      </div>
    </div>
  );
}
