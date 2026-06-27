import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { addMonths, format } from 'date-fns';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(goals);
  } catch (error: any) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, target_amount, target_date, currency, icon, color, template } = await request.json();

    let finalTargetDate = target_date;
    let finalTargetAmount = target_amount;

    if (template && template.defaultTargetDateMonths) {
      finalTargetDate = format(addMonths(new Date(), template.defaultTargetDateMonths), 'yyyy-MM-dd');
    }

    if (template && template.defaultTargetAmount) {
      finalTargetAmount = template.defaultTargetAmount;
    }

    const { data: goal, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title,
        description,
        target_amount: finalTargetAmount,
        current_amount: 0,
        target_date: finalTargetDate,
        currency: currency || 'INR',
        icon: icon || 'target',
        color: color || 'bg-blue-500',
        status: 'active',
        archived: false,
      })
      .select('*')
      .single();

    if (error) throw error;

    // Create timeline event
    await supabase
      .from('timeline_events')
      .insert({
        user_id: user.id,
        timestamp: goal.created_at,
        type: 'goal-created',
        title: `Created goal: ${goal.title}`,
        description: goal.description || undefined,
        source_module: 'goals',
        icon: goal.icon,
        color: goal.color,
        metadata: { goalId: goal.id, targetAmount: goal.target_amount },
      });

    return NextResponse.json(goal);
  } catch (error: any) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
