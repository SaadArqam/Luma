import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import type { TimelineItem } from '@/modules/timeline/types';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: events, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Convert to our type
    const typedEvents: TimelineItem[] = events.map((event) => ({
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

    return NextResponse.json(typedEvents);
  } catch (error: any) {
    console.error('Error fetching timeline events:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { timestamp, type, title, description, sourceModule, icon, color, metadata } = await request.json();

    const { data: event, error } = await supabase
      .from('timeline_events')
      .insert({
        user_id: user.id,
        timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
        type,
        title,
        description,
        source_module: sourceModule,
        icon,
        color,
        metadata: metadata || {},
      })
      .select('*')
      .single();

    if (error) throw error;

    const typedEvent: TimelineItem = {
      id: event.id,
      timestamp: new Date(event.timestamp),
      type: event.type,
      title: event.title,
      description: event.description,
      sourceModule: event.source_module,
      icon: event.icon,
      color: event.color,
      metadata: event.metadata,
    };

    return NextResponse.json(typedEvent);
  } catch (error: any) {
    console.error('Error creating timeline event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
