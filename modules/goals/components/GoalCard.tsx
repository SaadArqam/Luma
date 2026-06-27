import { Goal } from '../types';
import { formatCurrency } from '@/modules/shared/utils';
import { calculateGoalProgress } from '../utils/calculations';
import { format } from 'date-fns';
import { Target, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
  className?: string;
}

export function GoalCard({ goal, onClick, className }: GoalCardProps) {
  const progress = calculateGoalProgress(goal);
  const iconMap: Record<string, any> = {
    'shield-check': Target,
    'laptop': Target,
    'plane': Target,
    'car': Target,
    'graduation-cap': Target,
    'home': Target,
    'target': Target,
  };

  const Icon = iconMap[goal.icon] || Target;

  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border rounded-2xl p-6 transition-all hover:shadow-lg cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${goal.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-text">{goal.title}</h3>
            {goal.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{goal.description}</p>
            )}
          </div>
        </div>
        {goal.status === 'completed' && (
          <CheckCircle className="w-6 h-6 text-green-500" />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-2xl font-bold text-text">
                {formatCurrency(progress.saved)}
              </p>
              <p className="text-sm text-muted-foreground">
                of {formatCurrency(goal.target_amount)}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${
                progress.status === 'completed' ? 'text-green-500' :
                progress.status === 'ahead' ? 'text-green-500' :
                progress.status === 'behind' ? 'text-red-500' : 'text-blue-500'
              }`}>
                {Math.round(progress.percentage)}%
              </p>
            </div>
          </div>

          <div className="h-3 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress.status === 'completed' ? 'bg-green-500' :
                progress.status === 'ahead' ? 'bg-green-500' :
                progress.status === 'behind' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
        </div>

        {goal.target_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}
            </span>
            {progress.daysRemaining !== undefined && (
              <span className="ml-auto">
                {progress.daysRemaining} days left
              </span>
            )}
          </div>
        )}

        {progress.status !== 'completed' && progress.monthlyRequired && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>
              Need {formatCurrency(progress.monthlyRequired)}/month
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
