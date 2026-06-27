import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { recurringTransactionService } from '@/modules/recurring-transactions'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await recurringTransactionService.generateTransactionsForUser(user.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
