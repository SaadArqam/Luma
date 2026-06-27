export interface BriefSection {
  type: 'greeting' | 'yesterday-summary' | 'today-status' | 'budget-health' | 'active-goals' | 'upcoming-payments' | 'recommendation' | 'encouragement';
  title?: string;
  content: string;
  priority: number;
}

export interface DailyBrief {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  sections: BriefSection[];
  generatedAt: Date;
  isCached: boolean;
}

export interface BriefData {
  accounts: any[];
  transactions: any[];
  budgets: any[];
  goals: any[];
  timelineEvents: any[];
  insights: any[];
  recurringPayments: any[];
}
