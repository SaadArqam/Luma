import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Heart } from 'lucide-react'

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>Health</PageTitle>
        <PageDescription>Monitor your health and wellness</PageDescription>
      </PageHeader>
      
      <EmptyState
        icon={<Heart className="h-12 w-12" />}
        title="Health Module"
        description="Track your health metrics and wellness goals. This module will be available soon."
      />
    </div>
  )
}
