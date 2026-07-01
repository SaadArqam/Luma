// Timeline Item Types
export type TimelineItemType = 
  | 'transaction'
  | 'capture'
  | 'journal-entry'
  | 'goal-progress'
  | 'habit-completion'
  | 'planner-event'
  | 'health-record'
  | 'ai-insight'
  | 'reminder'
  | 'milestone'
  | 'achievement';

// Source Modules
export type SourceModule = 
  | 'finance'
  | 'goals'
  | 'planner'
  | 'habits'
  | 'journal'
  | 'health'
  | 'ai'
  | 'notifications'
  | 'capture';

// Timeline Group Labels
export type TimelineGroupLabel = 
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | 'Last Week'
  | 'June'
  | 'May'
  | 'April'
  | 'March'
  | 'February'
  | 'January'
  | 'December'
  | 'November'
  | 'October'
  | 'September'
  | 'August'
  | 'July'
  | 'Earlier';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  timestamp: Date;
  title: string;
  description?: string;
  sourceModule: SourceModule;
  icon: string;
  color: string;
  context?: string; // Additional context (e.g., category name, goal name)
  preview?: string; // Optional preview content
  actions?: TimelineAction[];
  metadata?: Record<string, unknown>;
  deepLink?: string;
  entityId?: string;
}

export interface TimelineAction {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface TimelineGroup {
  label: TimelineGroupLabel;
  dateRange?: { start: Date; end: Date };
  items: TimelineItem[];
  dailySummary?: DailySummary;
  reflections?: Reflection[];
}

export interface DailySummary {
  habitsCompleted?: number;
  capturesCount?: number;
  budgetStatus?: 'within' | 'over' | 'under';
  summaryText?: string;
}

export interface Reflection {
  id: string;
  type: 'pattern' | 'insight' | 'observation';
  text: string;
  timestamp: Date;
}

export interface TimelineFilter {
  dateRange?: { start: Date; end: Date };
  types?: TimelineItemType[];
  tags?: string[];
  people?: string[];
  places?: string[];
  hasAttachments?: boolean;
}

export type EventFilter = 'all' | SourceModule;
