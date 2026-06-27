import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Target } from 'lucide-react'

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>Goals</PageTitle>
        <PageDescription>Track your personal goals and milestones</PageDescription>
      </PageHeader>
      
      <EmptyState
        icon={<Target className="h-12 w-12" />}
        title="Goals Module"
        description="Set and track your personal goals. This module will be available soon."
      />
    </div>
  )
}
