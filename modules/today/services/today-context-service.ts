import { TodayContext, TodayData, TimeOfDay, SectionType, Celebration, Recommendation, TodaySection } from '../types';
import { getTimeOfDay, getMessageGenerator } from '../utils/message-generator';
import { getCelebrations } from '../utils/celebration-detector';
import { getRecommendations } from '../utils/recommendation-engine';

export class TodayContextService {
  private static instance: TodayContextService;

  public static getInstance(): TodayContextService {
    if (!TodayContextService.instance) {
      TodayContextService.instance = new TodayContextService();
    }
    return TodayContextService.instance;
  }

  private getTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  private calculateSectionPriority(sectionType: SectionType, data: TodayData, timeOfDay: TimeOfDay): number {
    const basePriorities: Record<SectionType, number> = {
      'greeting': 100,
      'warning': 95,
      'celebration': 90,
      'daily-brief': 85,
      'today-budget': 80,
      'bills-due-today': 75,
      'active-goals': 70,
      'recommendation': 60,
      'recent-activity': 50,
    };

    let priority = basePriorities[sectionType] || 50;

    // Boost priority based on data conditions
    if (sectionType === 'bills-due-today' && data.pendingRecurring.length > 0) {
      priority += 20;
    }

    if (sectionType === 'today-budget' && data.budgetRemaining < 0) {
      priority += 15;
    }

    if (sectionType === 'active-goals' && data.goals.some(g => g.currentAmount >= g.targetAmount)) {
      priority += 15;
    }

    if (sectionType === 'celebration') {
      priority += 10;
    }

    // Time-based adjustments
    if (timeOfDay === 'morning' && sectionType === 'daily-brief') {
      priority += 10;
    }

    if (timeOfDay === 'evening' && sectionType === 'today-budget') {
      priority += 10;
    }

    return priority;
  }

  private determineSections(data: TodayData, timeOfDay: TimeOfDay): TodaySection[] {
    const sections: TodaySection[] = [];

    // Greeting - always visible
    sections.push({
      type: 'greeting',
      priority: this.calculateSectionPriority('greeting', data, timeOfDay),
      visible: true,
      data: { timeOfDay }
    });

    // Daily Brief - always visible
    sections.push({
      type: 'daily-brief',
      priority: this.calculateSectionPriority('daily-brief', data, timeOfDay),
      visible: true,
    });

    // Today's Budget - visible if budget exists
    if (data.totalDailyBudget > 0) {
      sections.push({
        type: 'today-budget',
        priority: this.calculateSectionPriority('today-budget', data, timeOfDay),
        visible: true,
        data: {
          todayExpenseTotal: data.todayExpenseTotal,
          budgetRemaining: data.budgetRemaining,
          totalDailyBudget: data.totalDailyBudget
        }
      });
    }

    // Bills Due Today - visible if there are pending bills
    if (data.pendingRecurring.length > 0) {
      sections.push({
        type: 'bills-due-today',
        priority: this.calculateSectionPriority('bills-due-today', data, timeOfDay),
        visible: true,
        data: { pendingRecurring: data.pendingRecurring }
      });
    }

    // Active Goals - visible if there are active goals
    if (data.goals.length > 0) {
      sections.push({
        type: 'active-goals',
        priority: this.calculateSectionPriority('active-goals', data, timeOfDay),
        visible: true,
        data: { goals: data.goals }
      });
    }

    // Recent Activity - visible if there are recent expenses
    if (data.recentExpenses.length > 0) {
      sections.push({
        type: 'recent-activity',
        priority: this.calculateSectionPriority('recent-activity', data, timeOfDay),
        visible: true,
        data: { recentExpenses: data.recentExpenses }
      });
    }

    // Celebration - visible if there are celebrations
    const celebrations = getCelebrations(data);
    if (celebrations.length > 0) {
      sections.push({
        type: 'celebration',
        priority: this.calculateSectionPriority('celebration', data, timeOfDay),
        visible: true,
        data: { celebrations }
      });
    }

    // Recommendation - visible if there are recommendations
    const recommendations = getRecommendations(data, timeOfDay);
    if (recommendations.length > 0) {
      sections.push({
        type: 'recommendation',
        priority: this.calculateSectionPriority('recommendation', data, timeOfDay),
        visible: true,
        data: { recommendations }
      });
    }

    // Warning - visible if budget exceeded or overdue bills
    const hasWarnings = data.budgetRemaining < 0 || data.pendingRecurring.length > 0;
    if (hasWarnings) {
      sections.push({
        type: 'warning',
        priority: this.calculateSectionPriority('warning', data, timeOfDay),
        visible: true,
        data: {
          budgetExceeded: data.budgetRemaining < 0,
          overdueBills: data.pendingRecurring.length
        }
      });
    }

    // Sort by priority (highest first)
    return sections.sort((a, b) => b.priority - a.priority);
  }

  private hasData(data: TodayData): boolean {
    return (
      data.todayExpenses.length > 0 ||
      data.goals.length > 0 ||
      data.recurringPayments.length > 0 ||
      data.accounts.length > 0 ||
      data.budgets.length > 0
    );
  }

  public buildContext(data: TodayData): TodayContext {
    const timeOfDay = this.getTimeOfDay();
    const sections = this.determineSections(data, timeOfDay);
    const celebrations = getCelebrations(data);
    const recommendations = getRecommendations(data, timeOfDay);
    const hasData = this.hasData(data);

    return {
      timeOfDay,
      sections,
      celebrations,
      recommendations,
      hasData
    };
  }
}

export const todayContextService = TodayContextService.getInstance();
