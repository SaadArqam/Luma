import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Calendar } from 'lucide-react'

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>Planner</PageTitle>
        <PageDescription>Plan your days and weeks ahead</PageDescription>
      </PageHeader>
      
      <EmptyState
        icon={<Calendar className="h-12 w-12" />}
        title="Planner Module"
        description="Organize your schedule and plan ahead. This module will be available soon."
      />
    </div>
  )
}
