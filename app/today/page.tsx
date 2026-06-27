import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { WidgetContainer } from '@/components/ui/widget-container'
import { MetricCard } from '@/components/ui/metric-card'
import { ProgressCard } from '@/components/ui/progress-card'
import { TimelineCard } from '@/components/ui/timeline-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Sun, Wallet, Target, CheckSquare, Sparkles, Clock } from 'lucide-react'

export default function TodayPage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>Today</PageTitle>
        <PageDescription>Your daily overview and quick actions</PageDescription>
      </PageHeader>
      
      {/* Daily Summary */}
      <WidgetContainer title="Daily Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Date"
            value={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            icon={<Sun className="h-5 w-5 text-accent" />}
          />
          <MetricCard
            title="Tasks Completed"
            value="0/5"
            icon={<CheckSquare className="h-5 w-5 text-accent" />}
          />
          <MetricCard
            title="Focus Time"
            value="0h"
            icon={<Clock className="h-5 w-5 text-accent" />}
          />
        </div>
      </WidgetContainer>

      {/* Money Overview */}
      <WidgetContainer title="Money">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Today's Spending"
            value="$0"
            icon={<Wallet className="h-5 w-5 text-accent" />}
          />
          <MetricCard
            title="Budget Remaining"
            value="$0"
            icon={<Wallet className="h-5 w-5 text-accent" />}
          />
        </div>
      </WidgetContainer>

      {/* Goals */}
      <WidgetContainer title="Goals">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProgressCard
            title="Savings Goal"
            progress="$0"
            total="$1,000"
            icon={<Target className="h-5 w-5 text-accent" />}
          />
          <ProgressCard
            title="Monthly Budget"
            progress="$0"
            total="$2,000"
            icon={<Target className="h-5 w-5 text-accent" />}
          />
        </div>
      </WidgetContainer>

      {/* Tasks */}
      <WidgetContainer title="Tasks">
        <EmptyState
          icon={<CheckSquare className="h-8 w-8" />}
          title="No tasks today"
          description="Add tasks to track your daily progress"
        />
      </WidgetContainer>

      {/* AI Insight */}
      <WidgetContainer title="AI Insight">
        <EmptyState
          icon={<Sparkles className="h-8 w-8" />}
          title="AI Insights"
          description="Get personalized insights and recommendations powered by AI"
        />
      </WidgetContainer>

      {/* Recent Activity */}
      <WidgetContainer title="Recent Activity">
        <div className="space-y-3">
          <TimelineCard
            title="No recent activity"
            description="Your recent activities will appear here"
            time="Today"
          />
        </div>
      </WidgetContainer>
    </div>
  )
}
