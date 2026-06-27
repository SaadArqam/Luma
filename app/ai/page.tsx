import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Sparkles } from 'lucide-react'

export default function AIPage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>AI Assistant</PageTitle>
        <PageDescription>Get intelligent insights and suggestions</PageDescription>
      </PageHeader>
      
      <EmptyState
        icon={<Sparkles className="h-12 w-12" />}
        title="AI Module"
        description="Your personal AI assistant for insights and recommendations. This module will be available soon."
      />
    </div>
  )
}
