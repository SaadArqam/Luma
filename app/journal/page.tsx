import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { BookOpen } from 'lucide-react'

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>Journal</PageTitle>
        <PageDescription>Reflect on your thoughts and experiences</PageDescription>
      </PageHeader>
      
      <EmptyState
        icon={<BookOpen className="h-12 w-12" />}
        title="Journal Module"
        description="Write and reflect on your daily experiences. This module will be available soon."
      />
    </div>
  )
}
