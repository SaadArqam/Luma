import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { addMonths, format } from 'date-fns';
import { emitEvent } from '@/modules/rules';
import { lifeGraphService } from '@/modules/life-graph';

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
    const { data: timelineEvent } = await supabase
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
      })
      .select()
      .single();

    // Create graph nodes
    const goalNode = await lifeGraphService.createNode(user.id, 'goal', goal.id, {
      title: goal.title,
      description: goal.description,
    });

    if (timelineEvent) {
      const timelineNode = await lifeGraphService.createNode(user.id, 'timeline_event', timelineEvent.id, {
        type: timelineEvent.type,
        title: timelineEvent.title,
      });

      // Connect goal to timeline event
      await lifeGraphService.createEdge(user.id, goalNode.id, timelineNode.id, 'generated_by');
    }

    // Emit event for rules engine
    emitEvent('goal.created', user.id, {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      targetAmount: goal.target_amount,
      targetDate: goal.target_date,
      icon: goal.icon,
      color: goal.color
    });

    return NextResponse.json(goal);
  } catch (error: any) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
