import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { emitEvent } from '@/modules/rules';
import { lifeGraphService } from '@/modules/life-graph';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { amount, note, date } = await request.json();

    const { data: contribution, error } = await supabase
      .from('goal_contributions')
      .insert({
        goal_id: params.id,
        user_id: user.id,
        amount,
        note,
        date: date || new Date().toISOString().split('T')[0],
      })
      .select('*')
      .single();

    if (error) throw error;

    const { data: goal } = await supabase
      .from('goals')
      .select('current_amount, target_amount')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    let newStatus = 'active';
    if (goal) {
      const newCurrentAmount = goal.current_amount + amount;
      newStatus = newCurrentAmount >= goal.target_amount ? 'completed' : 'active';

      await supabase
        .from('goals')
        .update({ current_amount: newCurrentAmount, status: newStatus })
        .eq('id', params.id);
    }

    // Get the full goal for timeline event
    const { data: fullGoal } = await supabase
      .from('goals')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    // Create contribution timeline event
    const { data: contributionTimelineEvent } = await supabase
      .from('timeline_events')
      .insert({
        user_id: user.id,
        timestamp: contribution.date,
        type: 'goal-contribution',
        title: `Contributed to ${fullGoal?.title || 'goal'}`,
        description: `₹${amount.toLocaleString('en-IN')}${note ? ` • ${note}` : ''}`,
        source_module: 'goals',
        icon: 'piggy-bank',
        color: fullGoal?.color || 'bg-blue-500',
        metadata: { contributionId: contribution.id, goalId: contribution.goal_id, amount },
      })
      .select()
      .single();

    let completedTimelineEvent: any = null;
    // Create goal completed event if status changed
    if (newStatus === 'completed' && goal?.status !== 'completed') {
      const { data } = await supabase
        .from('timeline_events')
        .insert({
          user_id: user.id,
          timestamp: new Date().toISOString(),
          type: 'goal-completed',
          title: `🎉 Goal completed: ${fullGoal?.title || 'goal'}`,
          description: `Reached ₹${fullGoal?.target_amount?.toLocaleString('en-IN') || ''}`,
          source_module: 'goals',
          icon: 'trophy',
          color: 'bg-yellow-500',
          metadata: { goalId: params.id },
        })
        .select()
        .single();
      completedTimelineEvent = data;
    }

    // Get or create goal node
    let goalNode = await lifeGraphService.getNode(user.id, 'goal', params.id);
    if (!goalNode) {
      goalNode = await lifeGraphService.createNode(user.id, 'goal', params.id, {
        title: fullGoal?.title,
      });
    }

    // Handle contribution timeline event
    if (contributionTimelineEvent) {
      const contributionTimelineNode = await lifeGraphService.createNode(user.id, 'timeline_event', contributionTimelineEvent.id, {
        type: contributionTimelineEvent.type,
        title: contributionTimelineEvent.title,
      });
      await lifeGraphService.createEdge(user.id, goalNode.id, contributionTimelineNode.id, 'generated_by');
    }

    // Handle completed timeline event
    if (completedTimelineEvent) {
      const completedTimelineNode = await lifeGraphService.createNode(user.id, 'timeline_event', completedTimelineEvent.id, {
        type: completedTimelineEvent.type,
        title: completedTimelineEvent.title,
      });
      await lifeGraphService.createEdge(user.id, goalNode.id, completedTimelineNode.id, 'generated_by');
    }

    // Emit event for rules engine
    emitEvent('goal.contribution', user.id, {
      id: contribution.id,
      goalId: contribution.goal_id,
      amount,
      note,
      date: contribution.date,
      goal: fullGoal
    });

    return NextResponse.json(contribution);
  } catch (error: any) {
    console.error('Error adding contribution:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
