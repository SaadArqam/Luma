import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { emitEvent } from '@/modules/rules'
import { lifeGraphService } from '@/modules/life-graph'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('expenses')
      .select(`*, category:categories(*), account:accounts(*)`)
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await request.json()
    const { amount, note, date, category_id, account_id } = json

    const { data, error } = await supabase
      .from('expenses')
      .insert({ amount, note, date, category_id, account_id, user_id: user.id })
      .select()
      .single()

    if (error) throw error

    // Get category for icon and color
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('id', category_id)
      .eq('user_id', user.id)
      .single()

    // Create timeline event
    const { data: timelineEvent } = await supabase
      .from('timeline_events')
      .insert({
        user_id: user.id,
        timestamp: date,
        type: 'expense',
        title: note || category?.name || 'Expense',
        description: `₹${amount.toLocaleString('en-IN')}`,
        source_module: 'finance',
        icon: category?.icon || 'credit-card',
        color: category?.color || 'bg-blue-500',
        metadata: { expenseId: data.id, amount },
      })
      .select()
      .single();

    // Create transaction graph node
    const transactionNode = await lifeGraphService.createNode(user.id, 'transaction', data.id, {
      amount,
      note,
      categoryId: category_id,
    });

    // Create timeline event graph node if available
    if (timelineEvent) {
      const timelineNode = await lifeGraphService.createNode(user.id, 'timeline_event', timelineEvent.id, {
        type: timelineEvent.type,
        title: timelineEvent.title,
      });

      await lifeGraphService.createEdge(user.id, transactionNode.id, timelineNode.id, 'generated_by');
    }

    // Emit event for rules engine
    emitEvent('transaction.created', user.id, {
      id: data.id,
      amount,
      note,
      date,
      categoryId: category_id,
      accountId: account_id,
      category
    });

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
