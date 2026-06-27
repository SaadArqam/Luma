import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { User } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>Profile</PageTitle>
        <PageDescription>Manage your account and preferences</PageDescription>
      </PageHeader>
      
      <EmptyState
        icon={<User className="h-12 w-12" />}
        title="Profile Module"
        description="Manage your account settings and preferences. This module will be available soon."
      />
    </div>
  )
}
