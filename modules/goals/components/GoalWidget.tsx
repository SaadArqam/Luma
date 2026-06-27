import { Goal } from '../types';
import { GoalCard } from './GoalCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Target } from 'lucide-react';
import { WidgetContainer } from '@/components/ui/widget-container';
import { AddGoalForm } from './AddGoalForm';

interface GoalWidgetProps {
  goals: Goal[];
  onRefresh?: () => void;
  onGoalClick?: (goal: Goal) => void;
}

export function GoalWidget({ goals, onRefresh, onGoalClick }: GoalWidgetProps) {
  return (
    <WidgetContainer
      title="Goals"
      description="Track your financial goals"
      action={<AddGoalForm onGoalAdded={onRefresh} />}
    >
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className="h-8 w-8" />}
          title="No goals yet"
          description="Start by creating your first financial goal"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.slice(0, 4).map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onClick={() => onGoalClick?.(goal)}
            />
          ))}
        </div>
      )}
    </WidgetContainer>
  );
}
