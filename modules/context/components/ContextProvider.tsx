'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { contextEngine } from '../services';
import { todayProvider, timelineProvider, financeProvider, goalsProvider, captureProvider } from '../providers';
import type { DailyContext, GoalContext, FinancialContext, CaptureContext, TimelineContext, SearchContext } from '../types';

interface ContextEngineContextValue {
  dailyContext: DailyContext | null;
  goalContext: GoalContext | null;
  financialContext: FinancialContext | null;
  captureContext: CaptureContext | null;
  timelineContext: TimelineContext | null;
  searchContext: SearchContext | null;
  loading: boolean;
  error: string | null;
  refreshContext: () => Promise<void>;
}

const ContextEngineContext = createContext<ContextEngineContextValue | undefined>(undefined);

interface ContextEngineProviderProps {
  children: ReactNode;
  userId: string;
}

export function ContextEngineProvider({ children, userId }: ContextEngineProviderProps) {
  const [dailyContext, setDailyContext] = useState<DailyContext | null>(null);
  const [goalContext, setGoalContext] = useState<GoalContext | null>(null);
  const [financialContext, setFinancialContext] = useState<FinancialContext | null>(null);
  const [captureContext, setCaptureContext] = useState<CaptureContext | null>(null);
  const [timelineContext, setTimelineContext] = useState<TimelineContext | null>(null);
  const [searchContext, setSearchContext] = useState<SearchContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshContext = async () => {
    setLoading(true);
    setError(null);

    try {
      // Register providers
      contextEngine.registerProvider(todayProvider);
      contextEngine.registerProvider(timelineProvider);
      contextEngine.registerProvider(financeProvider);
      contextEngine.registerProvider(goalsProvider);
      contextEngine.registerProvider(captureProvider);

      // Fetch all contexts in parallel
      const [daily, financial, capture, timeline, search] = await Promise.all([
        contextEngine.getCurrentContext(userId),
        contextEngine.getFinancialContext(userId),
        contextEngine.getCaptureContext(userId),
        contextEngine.getTimelineContext(userId),
        contextEngine.getSearchContext(userId),
      ]);

      setDailyContext(daily);
      setFinancialContext(financial);
      setCaptureContext(capture);
      setTimelineContext(timeline);
      setSearchContext(search);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load context');
      console.error('Context Engine error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshContext();
  }, [userId]);

  const value: ContextEngineContextValue = {
    dailyContext,
    goalContext,
    financialContext,
    captureContext,
    timelineContext,
    searchContext,
    loading,
    error,
    refreshContext,
  };

  return (
    <ContextEngineContext.Provider value={value}>
      {children}
    </ContextEngineContext.Provider>
  );
}

export function useContextEngine() {
  const context = useContext(ContextEngineContext);
  if (context === undefined) {
    throw new Error('useContextEngine must be used within a ContextEngineProvider');
  }
  return context;
}
