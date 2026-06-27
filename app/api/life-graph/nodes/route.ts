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
    const { type, external_id, metadata } = body;

    if (!type || !external_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const node = await lifeGraphService.createNode(user.id, type, external_id, metadata);
    return NextResponse.json(node);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const externalId = searchParams.get('external_id');

    if (!type || !externalId) {
      return NextResponse.json({ error: 'Missing required query params' }, { status: 400 });
    }

    const node = await lifeGraphService.getNode(user.id, type, externalId);
    return NextResponse.json(node);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
