'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaptureReview } from '@/modules/capture/components';
import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Loader2 } from 'lucide-react';
import type { CaptureSession } from '@/modules/capture/types';

export default function CaptureReviewPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<CaptureSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/capture/${params.sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session');
        const data = await response.json();
        setSession(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [params.sessionId]);

  const handleConfirm = async () => {
    try {
      const response = await fetch(`/api/capture/${params.sessionId}/confirm`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to confirm capture');

      // Navigate to Today after successful creation
      router.push('/today');
    } catch (error) {
      console.error('Confirm error:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/capture');
  };

  const handleEditEntity = (entity: any) => {
    // TODO: Implement entity editing
    console.log('Edit entity:', entity);
  };

  const handleRemoveEntity = (entityId: string) => {
    // TODO: Implement entity removal
    console.log('Remove entity:', entityId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <EmptyState
        title="Session not found"
        description={error || 'Unable to load the capture session.'}
      />
    );
  }

  if (session.processingStatus !== 'reviewing') {
    return (
      <EmptyState
        title="Session not ready"
        description={`This session is currently ${session.processingStatus}.`}
      />
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <PageHeader>
        <PageTitle>Review Capture</PageTitle>
        <PageDescription>
          Review and confirm the items detected from your input.
        </PageDescription>
      </PageHeader>

      <CaptureReview
        entities={session.detectedEntities}
        routing={session.routingDecisions}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onEditEntity={handleEditEntity}
        onRemoveEntity={handleRemoveEntity}
      />
    </div>
  );
}
