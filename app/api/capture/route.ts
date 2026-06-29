import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { captureService } from '@/modules/capture/services';
import type { CaptureInput } from '@/modules/capture/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { source, content } = body;

    if (!source || !content) {
      return NextResponse.json(
        { error: 'Source and content are required' },
        { status: 400 }
      );
    }

    const input: CaptureInput = {
      source,
      content,
      userId: user.id,
    };

    const result = await captureService.processCapture(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Capture error:', error);
    return NextResponse.json(
      { error: 'Failed to process capture' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const sessions = await captureService.getUserSessions(user.id, limit);

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Get capture sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch capture sessions' },
      { status: 500 }
    );
  }
}
