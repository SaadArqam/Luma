import type { 
  Context, 
  ContextScope, 
  ContextSource, 
  ContextProvider,
  BaseContext,
  DailyContext,
  GoalContext,
  FinancialContext,
  CaptureContext,
  TimelineContext,
  SearchContext
} from '../types';
import { relevanceScorer } from './relevance-scorer';

export class ContextEngine {
  private static instance: ContextEngine;
  private providers: Map<ContextSource, ContextProvider> = new Map();

  private constructor() {}

  public static getInstance(): ContextEngine {
    if (!ContextEngine.instance) {
      ContextEngine.instance = new ContextEngine();
    }
    return ContextEngine.instance;
  }

  public registerProvider(provider: ContextProvider): void {
    this.providers.set(provider.source, provider);
  }

  public unregisterProvider(source: ContextSource): void {
    this.providers.delete(source);
  }

  private async gatherContextFromProviders(
    userId: string,
    scope?: ContextScope
  ): Promise<Partial<BaseContext>[]> {
    const contexts: Partial<BaseContext>[] = [];

    for (const provider of this.providers.values()) {
      try {
        const context = await provider.getContext(userId, scope);
        contexts.push(context);
      } catch (error) {
        console.error(`Error gathering context from ${provider.source}:`, error);
      }
    }

    return contexts;
  }

  private mergeContexts(contexts: Partial<BaseContext>[]): BaseContext {
    const merged: BaseContext = {
      scope: 'daily' as ContextScope,
      userId: '',
      timestamp: new Date(),
      activeGoals: [],
      recentActivity: [],
      importantDeadlines: [],
      relevantEntities: [],
      contextualRecommendations: [],
    };

    for (const context of contexts) {
      if (context.activeGoals) {
        merged.activeGoals.push(...context.activeGoals);
      }
      if (context.recentActivity) {
        merged.recentActivity.push(...context.recentActivity);
      }
      if (context.importantDeadlines) {
        merged.importantDeadlines.push(...context.importantDeadlines);
      }
      if (context.relevantEntities) {
        merged.relevantEntities.push(...context.relevantEntities);
      }
      if (context.contextualRecommendations) {
        merged.contextualRecommendations.push(...context.contextualRecommendations);
      }
      if (context.currentFocus) {
        merged.currentFocus = context.currentFocus;
      }
      if (context.userId) {
        merged.userId = context.userId;
      }
    }

    // Rank entities by relevance
    merged.activeGoals = relevanceScorer.rankEntities(merged.activeGoals);
    merged.recentActivity = relevanceScorer.rankEntities(merged.recentActivity);
    merged.importantDeadlines = relevanceScorer.rankEntities(merged.importantDeadlines);
    merged.relevantEntities = relevanceScorer.rankEntities(merged.relevantEntities);

    // Sort recommendations by priority
    merged.contextualRecommendations.sort((a, b) => b.priority - a.priority);

    return merged;
  }

  public async getCurrentContext(userId: string): Promise<DailyContext> {
    const contexts = await this.gatherContextFromProviders(userId, 'daily');
    const baseContext = this.mergeContexts(contexts);

    // Extract daily-specific data from providers
    let todaySpending = 0;
    let budgetRemaining = 0;
    const pendingBills: any[] = [];
    const todayExpenses: any[] = [];

    for (const context of contexts) {
      if ('todaySpending' in context) todaySpending = (context as any).todaySpending;
      if ('budgetRemaining' in context) budgetRemaining = (context as any).budgetRemaining;
      if ('pendingBills' in context) pendingBills.push(...(context as any).pendingBills);
      if ('todayExpenses' in context) todayExpenses.push(...(context as any).todayExpenses);
    }

    return {
      ...baseContext,
      scope: 'daily',
      todaySpending,
      budgetRemaining,
      pendingBills,
      todayExpenses,
    };
  }

  public async getGoalContext(userId: string, goalId: string): Promise<GoalContext> {
    const contexts = await this.gatherContextFromProviders(userId, 'goal');
    const baseContext = this.mergeContexts(contexts);

    let goalProgress = 0;
    const contributions: any[] = [];
    const relatedExpenses: any[] = [];

    for (const context of contexts) {
      if ('goalProgress' in context) goalProgress = (context as any).goalProgress;
      if ('contributions' in context) contributions.push(...(context as any).contributions);
      if ('relatedExpenses' in context) relatedExpenses.push(...(context as any).relatedExpenses);
    }

    return {
      ...baseContext,
      scope: 'goal',
      goalId,
      goalProgress,
      contributions,
      relatedExpenses,
    };
  }

  public async getFinancialContext(userId: string): Promise<FinancialContext> {
    const contexts = await this.gatherContextFromProviders(userId, 'financial');
    const baseContext = this.mergeContexts(contexts);

    let currentBalance = 0;
    let monthlySpending = 0;
    const accounts: any[] = [];
    const recentTransactions: any[] = [];

    for (const context of contexts) {
      if ('currentBalance' in context) currentBalance = (context as any).currentBalance;
      if ('monthlySpending' in context) monthlySpending = (context as any).monthlySpending;
      if ('accounts' in context) accounts.push(...(context as any).accounts);
      if ('recentTransactions' in context) recentTransactions.push(...(context as any).recentTransactions);
    }

    return {
      ...baseContext,
      scope: 'financial',
      currentBalance,
      monthlySpending,
      accounts,
      recentTransactions,
    };
  }

  public async getCaptureContext(userId: string): Promise<CaptureContext> {
    const contexts = await this.gatherContextFromProviders(userId, 'capture');
    const baseContext = this.mergeContexts(contexts);

    const recentCaptures: any[] = [];
    const suggestedCategories: string[] = [];
    const relatedGoals: any[] = [];

    for (const context of contexts) {
      if ('recentCaptures' in context) recentCaptures.push(...(context as any).recentCaptures);
      if ('suggestedCategories' in context) suggestedCategories.push(...(context as any).suggestedCategories);
      if ('relatedGoals' in context) relatedGoals.push(...(context as any).relatedGoals);
    }

    return {
      ...baseContext,
      scope: 'capture',
      recentCaptures,
      suggestedCategories,
      relatedGoals,
    };
  }

  public async getTimelineContext(userId: string): Promise<TimelineContext> {
    const contexts = await this.gatherContextFromProviders(userId, 'timeline');
    const baseContext = this.mergeContexts(contexts);

    const recentEvents: any[] = [];
    const eventTypes: Record<string, number> = {};
    const trendingEntities: any[] = [];

    for (const context of contexts) {
      if ('recentEvents' in context) recentEvents.push(...(context as any).recentEvents);
      if ('eventTypes' in context) {
        const types = (context as any).eventTypes;
        for (const [type, count] of Object.entries(types)) {
          eventTypes[type] = (eventTypes[type] || 0) + (count as number);
        }
      }
      if ('trendingEntities' in context) trendingEntities.push(...(context as any).trendingEntities);
    }

    return {
      ...baseContext,
      scope: 'timeline',
      recentEvents,
      eventTypes,
      trendingEntities,
    };
  }

  public async getSearchContext(userId: string, query?: string): Promise<SearchContext> {
    const contexts = await this.gatherContextFromProviders(userId, 'search');
    const baseContext = this.mergeContexts(contexts);

    const recentSearches: string[] = [];
    const frequentEntities: any[] = [];

    for (const context of contexts) {
      if ('recentSearches' in context) recentSearches.push(...(context as any).recentSearches);
      if ('frequentEntities' in context) frequentEntities.push(...(context as any).frequentEntities);
    }

    return {
      ...baseContext,
      scope: 'search',
      query,
      recentSearches,
      frequentEntities,
    };
  }
}

export const contextEngine = ContextEngine.getInstance();
