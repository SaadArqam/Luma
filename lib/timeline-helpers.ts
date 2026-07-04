// Helper functions to create timeline events from API routes
import type { SupabaseClient } from '@supabase/supabase-js';
import type { TimelineItem } from '@/modules/timeline/types';

export async function createTimelineEvent(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>>,
  eventData: Omit<TimelineItem, 'id'>
): Promise<void> {
  await supabase
    .from('timeline_events')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      timestamp: eventData.timestamp.toISOString(),
      type: eventData.type,
      title: eventData.title,
      description: eventData.description,
      source_module: eventData.sourceModule,
      icon: eventData.icon,
      color: eventData.color,
      metadata: eventData.metadata,
    });
}
