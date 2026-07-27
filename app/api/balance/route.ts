import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { resolveAccountForWrite } from '@/lib/accounts'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await request.json()
    const { amount, note, type, date, account_id } = json

    const resolved = await resolveAccountForWrite(supabase, user.id, account_id)
    if ('error' in resolved) return NextResponse.json({ error: resolved.error }, { status: 400 })

    const insertData: Record<string, any> = {
      amount, note, type, user_id: user.id, account_id: resolved.accountId,
    }
    if (date) {
      insertData.created_at = new Date(date).toISOString()
    }

    const { data, error } = await supabase
      .from('balance_entries')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
