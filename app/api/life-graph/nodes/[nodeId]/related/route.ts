import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { lifeGraphService } from '@/modules/life-graph';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nodeId: string }> }
) {
  try {
    const { nodeId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const edgeType = searchParams.get('edge_type');
    const nodes = await lifeGraphService.getRelatedNodes(user.id, nodeId, edgeType as any);

    return NextResponse.json(nodes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
