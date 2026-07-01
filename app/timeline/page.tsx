'use client';

import { useEffect, useState } from 'react';
import { Timeline } from '@/modules/timeline/components';
import { TimelineHeader } from '@/modules/timeline/components';
import { TimelineSkeletonState } from '@/modules/timeline/components';
import type { TimelineItem } from '@/modules/timeline/types';

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/timeline');
      if (!response.ok) throw new Error('Failed to fetch timeline items');
      const data = await response.json();
      // Convert string timestamps to Date objects
      const typedItems = data.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
      setItems(typedItems);
    } catch (error) {
      console.error('Error fetching timeline items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-6">
      <TimelineHeader />
      
      {loading ? (
        <TimelineSkeletonState />
      ) : (
        <Timeline items={items} />
      )}
    </div>
  );
}
