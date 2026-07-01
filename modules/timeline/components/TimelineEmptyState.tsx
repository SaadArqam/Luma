import { Clock } from 'lucide-react';

export function TimelineEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted-surface flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="text-heading font-medium text-text-primary mb-2">
        Your story starts here
      </h3>
      <p className="text-body text-text-secondary max-w-sm">
        Every meaningful moment you capture will appear here. Start by adding your first expense, goal, or note.
      </p>
    </div>
  );
}
