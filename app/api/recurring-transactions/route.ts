import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { recurringTransactionService } from '@/modules/recurring-transactions'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('recurring_transactions')
      .select(`*, categories(name, icon), accounts(name, icon)`)
      .eq('user_id', user.id)
      .order('next_due_date', { ascending: true })

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
    const {
      name,
      amount,
      category_id,
      account_id,
      type = 'expense',
      frequency = 'monthly',
      custom_days,
      start_date,
      end_date,
      next_due_date,
      notes,
      is_active = true,
    } = json

    const { data, error } = await supabase
      .from('recurring_transactions')
      .insert({
        name,
        amount,
        category_id,
        account_id,
        type,
        frequency,
        custom_days: frequency === 'custom' ? (custom_days || 30) : null,
        start_date: start_date || next_due_date,
        end_date,
        next_due_date,
        notes,
        is_active,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await request.json()
    const { id, ...updates } = json

    const { data, error } = await supabase
      .from('recurring_transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
