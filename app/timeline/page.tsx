'use client';

import { useEffect, useState } from 'react';
import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header';
import { Timeline } from '@/modules/timeline/components';
import type { TimelineEvent } from '@/modules/timeline/types';
import { createClient } from '@/lib/supabase';

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/timeline');
      if (!response.ok) throw new Error('Failed to fetch timeline events');
      const data = await response.json();
      // Convert string timestamps to Date objects
      const typedEvents = data.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }));
      setEvents(typedEvents);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader>
        <PageTitle>Timeline</PageTitle>
        <PageDescription>View all your activities in one place</PageDescription>
      </PageHeader>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card border border-border/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <Timeline events={events} />
      )}
    </div>
  );
}
