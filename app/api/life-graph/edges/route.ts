import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { lifeGraphService } from '@/modules/life-graph';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { from_node_id, to_node_id, type, metadata } = body;

    if (!from_node_id || !to_node_id || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const edge = await lifeGraphService.createEdge(
      user.id,
      from_node_id,
      to_node_id,
      type,
      metadata
    );

    return NextResponse.json(edge);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
