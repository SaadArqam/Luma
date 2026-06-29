import { ExtractedEntity } from '../types';
import { Wallet, Target, CheckSquare, Calendar, Book, User, FileText } from 'lucide-react';

interface EntityCardProps {
  entity: ExtractedEntity;
  onEdit: (entity: ExtractedEntity) => void;
  onRemove: (entityId: string) => void;
}

const iconMap = {
  transaction: Wallet,
  goal: Target,
  task: CheckSquare,
  reminder: Calendar,
  habit: Book,
  journal_entry: FileText,
  contact: User,
  note: FileText,
};

const typeLabels = {
  transaction: 'Transaction',
  goal: 'Goal',
  task: 'Task',
  reminder: 'Reminder',
  habit: 'Habit',
  journal_entry: 'Journal Entry',
  contact: 'Contact',
  note: 'Note',
};

const destinationLabels = {
  finance: 'Finance',
  goals: 'Goals',
  tasks: 'Tasks',
  reminders: 'Reminders',
  habits: 'Habits',
  journal: 'Journal',
  contacts: 'Contacts',
  notes: 'Notes',
};

export function EntityCard({ entity, onEdit, onRemove }: EntityCardProps) {
  const Icon = iconMap[entity.type] || FileText;

  return (
    <div className="bg-background border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-text">{typeLabels[entity.type]}</h3>
            <p className="text-xs text-muted-foreground">
              → {destinationLabels[entity.suggestedDestination]}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(entity)}
            className="text-muted-foreground hover:text-text transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(entity.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(entity.data).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-text">{String(value)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Confidence: {Math.round(entity.confidence * 100)}%
        </span>
      </div>
    </div>
  );
}
