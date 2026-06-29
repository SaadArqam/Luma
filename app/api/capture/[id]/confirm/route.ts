import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { captureService } from '@/modules/capture/services';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await captureService.getSession(params.id);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify user owns the session
    if (session.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify session is in reviewing state
    if (session.processingStatus !== 'reviewing') {
      return NextResponse.json(
        { error: 'Session is not ready for confirmation' },
        { status: 400 }
      );
    }

    await captureService.confirmAndCreate(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm capture error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm capture' },
      { status: 500 }
    );
  }
}
