import { EmptyState } from '@/components/ui/empty-state';
import { Target } from 'lucide-react';
import { AddGoalForm } from './AddGoalForm';

interface EmptyGoalsStateProps {
  onGoalAdded?: () => void;
}

export function EmptyGoalsState({ onGoalAdded }: EmptyGoalsStateProps) {
  return (
    <EmptyState
      icon={<Target className="h-12 w-12" />}
      title="No goals yet"
      description="Start by creating your first financial goal. Track your progress and stay motivated!"
      action={<AddGoalForm onGoalAdded={onGoalAdded} />}
    />
  );
}
