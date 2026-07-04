import { Timeline } from '@/modules/timeline/components';
import { TimelineHeader } from '@/modules/timeline/components';
import { TimelineSkeletonState } from '@/modules/timeline/components';
import type { TimelineItem } from '@/modules/timeline/types';
import { createClient } from '@/lib/supabase-server';
import { Suspense } from 'react';

async function fetchTimelineItems(): Promise<TimelineItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: events } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false });

  const typedItems = (events || []).map((event: any) => ({
    id: event.id,
    timestamp: new Date(event.timestamp),
    type: event.type,
    title: event.title,
    description: event.description,
    sourceModule: event.source_module,
    icon: event.icon,
    color: event.color,
    metadata: event.metadata,
    deepLink: event.deep_link,
    entityId: event.entity_id,
  }));

  return typedItems;
}

async function TimelineContent() {
  const items = await fetchTimelineItems();
  return <Timeline items={items} />;
}

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <TimelineHeader />
      
      <Suspense fallback={<TimelineSkeletonState />}>
        <TimelineContent />
      </Suspense>
    </div>
  );
}
