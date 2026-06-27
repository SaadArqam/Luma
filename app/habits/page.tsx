import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Repeat } from 'lucide-react'

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>Habits</PageTitle>
        <PageDescription>Build and track daily habits</PageDescription>
      </PageHeader>
      
      <EmptyState
        icon={<Repeat className="h-12 w-12" />}
        title="Habits Module"
        description="Build and maintain positive habits. This module will be available soon."
      />
    </div>
  )
}
