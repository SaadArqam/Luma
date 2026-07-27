import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { ACCOUNT_TYPES } from '@/lib/banks'
import { getAccountsWithBalances, ACCOUNT_SELECT } from '@/lib/accounts'

function message(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected error'
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json(await getAccountsWithBalances(supabase, user.id))
  } catch (error) {
    return NextResponse.json({ error: message(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const bankName = body.bank_name ? String(body.bank_name).trim() : null
    const bankDomain = body.bank_domain ? String(body.bank_domain).trim().toLowerCase() : null
    const accountType = String(body.account_type ?? 'other')

    if (!name) return NextResponse.json({ error: 'Account name is required' }, { status: 400 })
    if (!ACCOUNT_TYPES.includes(accountType as never)) {
      return NextResponse.json({ error: 'Invalid account type' }, { status: 400 })
    }

    const { count } = await supabase
      .from('accounts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // The first account is always the default — otherwise the expense form would
    // have nothing preselected. Beyond that, honour what was asked for.
    const makeDefault = (count ?? 0) === 0 ? true : !!body.is_default

    // At most one default per user is enforced by a partial unique index, so the
    // old default has to be cleared before the new one is written.
    if (makeDefault && (count ?? 0) > 0) {
      await supabase.from('accounts').update({ is_default: false })
        .eq('user_id', user.id).eq('is_default', true)
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        name,
        bank_name: bankName,
        bank_domain: bankDomain,
        account_type: accountType,
        is_default: makeDefault,
      })
      .select(ACCOUNT_SELECT)
      .single()

    if (error) throw error
    return NextResponse.json({ ...data, credited: 0, debited: 0, spent: 0, txCount: 0, balance: 0 })
  } catch (error) {
    return NextResponse.json({ error: message(error) }, { status: 500 })
  }
}
