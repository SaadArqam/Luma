import type { ContextProvider, BaseContext, RelevanceSignal, ContextEntity } from '../types';
import { createClient } from '@/lib/supabase';

export class TimelineProvider implements ContextProvider {
  source = 'timeline' as const;

  async getContext(userId: string, scope?: string): Promise<Partial<BaseContext>> {
    const supabase = createClient();
    
    const { data: events } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50);

    const recentEvents: ContextEntity[] = (events || []).map((event: any) => ({
      id: event.id,
      type: 'timeline_event',
      sourceModule: event.source_module,
      relevanceScore: 0,
      signals: [
        {
          type: 'recently_updated',
          score: 0.7,
          timestamp: new Date(event.timestamp),
        },
      ],
      data: event,
    }));

    // Calculate event types
    const eventTypes: Record<string, number> = {};
    for (const event of events || []) {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
    }

    return {
      userId,
      timestamp: new Date(),
      recentActivity: recentEvents,
      relevantEntities: recentEvents,
    } as any;
  }

  async getRelevanceSignals(userId: string): Promise<RelevanceSignal[]> {
    const context = await this.getContext(userId);
    const signals: RelevanceSignal[] = [];

    for (const entity of context.recentActivity || []) {
      signals.push(...entity.signals);
    }

    return signals;
  }
}

export const timelineProvider = new TimelineProvider();
