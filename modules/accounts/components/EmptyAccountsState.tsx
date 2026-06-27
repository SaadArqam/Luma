import { Button } from '@/modules/shared/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyAccountsStateProps {
  onAddAccount: () => void;
}

export function EmptyAccountsState({ onAddAccount }: EmptyAccountsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
        <PlusCircle className="w-12 h-12 text-accent" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-text">Track All Your Accounts in One Place</h2>
        <p className="text-muted-foreground max-w-md">
          Start by adding your first account to get a complete view of your finances.
          Whether it's cash, bank accounts, or wallets, we'll help you stay organized.
        </p>
      </div>

      <Button size="lg" onClick={onAddAccount} className="gap-2">
        <PlusCircle className="w-5 h-5" />
        Add Your First Account
      </Button>
    </div>
  );
}
