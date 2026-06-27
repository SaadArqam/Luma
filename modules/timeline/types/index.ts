export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: string;
  title: string;
  description?: string;
  sourceModule: 'finance' | 'goals' | 'planner' | 'habits' | 'journal' | 'health' | 'ai' | 'notifications';
  icon: string;
  color: string;
  metadata?: Record<string, unknown>;
}

export interface TimelineGroup {
  label: 'Today' | 'Yesterday' | 'Earlier This Week' | 'Earlier This Month';
  events: TimelineEvent[];
}

export type EventFilter = 'all' | 'finance' | 'goals' | 'planner' | 'habits' | 'journal' | 'health' | 'ai' | 'notifications';
