import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { dailyBriefService } from '@/modules/daily-brief';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const today = format(new Date(), 'yyyy-MM-dd');

    // Check for cached brief first if not forcing refresh
    if (!forceRefresh) {
      const { data: cachedBrief } = await supabase
        .from('daily_briefs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (cachedBrief) {
        return NextResponse.json({
          ...cachedBrief,
          isCached: true
        });
      }
    }

    // Generate new brief
    const brief = await dailyBriefService.generateBrief(user.id);

    // Cache the brief
    await supabase
      .from('daily_briefs')
      .insert({
        user_id: brief.userId,
        date: brief.date,
        sections: brief.sections,
        generated_at: brief.generatedAt.toISOString()
      });

    return NextResponse.json(brief);
  } catch (error: any) {
    console.error('Error generating daily brief:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily brief' },
      { status: 500 }
    );
  }
}
