import type { TodaySection, TodayData } from '../types';
import { GreetingBanner } from './GreetingBanner';
import { CelebrationCard } from './CelebrationCard';
import { RecommendationCard } from './RecommendationCard';
import { DailyBriefCard } from '@/modules/daily-brief/components';
import { UpcomingBillsWidget } from '@/modules/recurring-transactions/components/UpcomingBillsWidget';
import { TodayGoalWidget } from '@/modules/goals/components/TodayGoalWidget';
import { TimelineWidget } from '@/modules/timeline/components';
import { WidgetContainer } from '@/components/ui/widget-container';
import { MetricCard } from '@/components/ui/metric-card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency } from '@/modules/shared/utils';
import { Wallet, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface TodaySectionProps {
  section: TodaySection;
  data: TodayData;
  onRecommendationAction?: (action: string) => void;
}

export function TodaySection({ section, data, onRecommendationAction }: TodaySectionProps) {
  switch (section.type) {
    case 'greeting':
      return <GreetingBanner timeOfDay={section.data?.timeOfDay || 'morning'} />;

    case 'daily-brief':
      return <DailyBriefCard />;

    case 'today-budget':
      return (
        <WidgetContainer title="Today's Budget">
          {data.totalDailyBudget === 0 ? (
            <EmptyState
              icon={<Wallet className="h-8 w-8" />}
              title="No budget set"
              description="Set a daily budget to track your spending and stay on target."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                title="Today's Spending"
                value={formatCurrency(section.data?.todayExpenseTotal || 0)}
                icon={<Wallet className="w-5 h-5 text-accent" />}
              />
              <MetricCard
                title="Budget Remaining"
                value={formatCurrency(section.data?.budgetRemaining || 0)}
                icon={<TrendingUp className="w-5 h-5 text-accent" />}
              />
            </div>
          )}
        </WidgetContainer>
      );

    case 'bills-due-today':
      return (
        <WidgetContainer title="Upcoming Bills">
          <UpcomingBillsWidget />
          <div className="mt-3 pt-3 border-t border-border">
            <a href="/recurring" className="text-sm text-accent hover:underline">
              View all bills →
            </a>
          </div>
        </WidgetContainer>
      );

    case 'active-goals':
      return (
        <WidgetContainer title="Active Goals">
          <TodayGoalWidget goals={section.data?.goals || data.goals || []} />
          <div className="mt-3 pt-3 border-t border-border">
            <a href="/goals" className="text-sm text-accent hover:underline">
              View all goals →
            </a>
          </div>
        </WidgetContainer>
      );

    case 'recent-activity':
      return (
        <WidgetContainer title="Recent Activity">
          {data.timelineEvents.length === 0 ? (
            <EmptyState
              icon={<Clock className="h-8 w-8" />}
              title="No recent activity"
              description="Your financial activity will appear here as you make transactions."
            />
          ) : (
            <TimelineWidget events={data.timelineEvents || []} limit={5} />
          )}
          <div className="mt-3 pt-3 border-t border-border">
            <a href="/timeline" className="text-sm text-accent hover:underline">
              View timeline →
            </a>
          </div>
        </WidgetContainer>
      );

    case 'celebration':
      return (
        <WidgetContainer title="Celebrations">
          <div className="space-y-3">
            {section.data?.celebrations?.map((celebration: any, index: number) => (
              <CelebrationCard key={index} celebration={celebration} />
            ))}
          </div>
        </WidgetContainer>
      );

    case 'recommendation':
      return (
        <WidgetContainer title="Recommendations">
          <div className="space-y-3">
            {section.data?.recommendations?.map((recommendation: any, index: number) => (
              <RecommendationCard 
                key={index} 
                recommendation={recommendation} 
                onAction={onRecommendationAction}
              />
            ))}
          </div>
        </WidgetContainer>
      );

    case 'warning':
      return (
        <WidgetContainer title="Alerts">
          <div className="space-y-3">
            {section.data?.budgetExceeded && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <p className="text-sm text-orange-500">
                  You've exceeded your daily budget. Consider reviewing your spending.
                </p>
              </div>
            )}
            {section.data?.overdueBills > 0 && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <p className="text-sm text-orange-500">
                  You have {section.data.overdueBills} overdue bill{section.data.overdueBills !== 1 ? 's' : ''}.
                </p>
              </div>
            )}
          </div>
        </WidgetContainer>
      );

    default:
      return null;
  }
}
