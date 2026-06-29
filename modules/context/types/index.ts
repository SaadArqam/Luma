export type ContextScope = 
  | 'daily'
  | 'goal'
  | 'financial'
  | 'capture'
  | 'timeline'
  | 'search';

export type ContextSource = 
  | 'today'
  | 'timeline'
  | 'finance'
  | 'goals'
  | 'capture'
  | 'rules';

export interface RelevanceSignal {
  type: 'recently_updated' | 'upcoming_deadline' | 'active_goal' | 'frequent_interaction' | 'incomplete_task' | 'recent_capture';
  score: number;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface ContextEntity {
  id: string;
  type: 'goal' | 'expense' | 'account' | 'transaction' | 'task' | 'timeline_event' | 'capture_session';
  sourceModule: string;
  relevanceScore: number;
  signals: RelevanceSignal[];
  data: Record<string, unknown>;
}

export interface ContextualRecommendation {
  type: string;
  title: string;
  description: string;
  priority: number;
  action?: string;
  relatedEntityIds: string[];
}

export interface BaseContext {
  scope: ContextScope;
  userId: string;
  timestamp: Date;
  currentFocus?: string;
  activeGoals: ContextEntity[];
  recentActivity: ContextEntity[];
  importantDeadlines: ContextEntity[];
  relevantEntities: ContextEntity[];
  contextualRecommendations: ContextualRecommendation[];
}

export interface DailyContext extends BaseContext {
  scope: 'daily';
  todaySpending: number;
  budgetRemaining: number;
  pendingBills: ContextEntity[];
  todayExpenses: ContextEntity[];
}

export interface GoalContext extends BaseContext {
  scope: 'goal';
  goalId: string;
  goalProgress: number;
  contributions: ContextEntity[];
  relatedExpenses: ContextEntity[];
}

export interface FinancialContext extends BaseContext {
  scope: 'financial';
  currentBalance: number;
  monthlySpending: number;
  accounts: ContextEntity[];
  recentTransactions: ContextEntity[];
}

export interface CaptureContext extends BaseContext {
  scope: 'capture';
  recentCaptures: ContextEntity[];
  suggestedCategories: string[];
  relatedGoals: ContextEntity[];
}

export interface TimelineContext extends BaseContext {
  scope: 'timeline';
  recentEvents: ContextEntity[];
  eventTypes: Record<string, number>;
  trendingEntities: ContextEntity[];
}

export interface SearchContext extends BaseContext {
  scope: 'search';
  query?: string;
  recentSearches: string[];
  frequentEntities: ContextEntity[];
}

export type Context = DailyContext | GoalContext | FinancialContext | CaptureContext | TimelineContext | SearchContext;

export interface ContextProvider {
  source: ContextSource;
  getContext(userId: string, scope?: ContextScope): Promise<Partial<BaseContext>>;
  getRelevanceSignals(userId: string): Promise<RelevanceSignal[]>;
}

export interface RelevanceScoringConfig {
  weights: Record<string, number>;
  decayRates: Record<string, number>;
  thresholds: Record<string, number>;
}
