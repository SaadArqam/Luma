import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { ACCOUNT_TYPES } from '@/lib/banks'
import { ACCOUNT_SELECT } from '@/lib/accounts'

function message(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected error'
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const patch: Record<string, unknown> = {}

    if (body.name !== undefined) {
      const name = String(body.name).trim()
      if (!name) return NextResponse.json({ error: 'Account name is required' }, { status: 400 })
      patch.name = name
    }
    if (body.bank_name !== undefined) patch.bank_name = body.bank_name ? String(body.bank_name).trim() : null
    if (body.bank_domain !== undefined) {
      patch.bank_domain = body.bank_domain ? String(body.bank_domain).trim().toLowerCase() : null
    }
    if (body.account_type !== undefined) {
      const t = String(body.account_type)
      if (!ACCOUNT_TYPES.includes(t as never)) {
        return NextResponse.json({ error: 'Invalid account type' }, { status: 400 })
      }
      patch.account_type = t
    }

    // Promoting an account clears the previous default first — the partial unique
    // index allows only one per user.
    if (body.is_default === true) {
      await supabase.from('accounts').update({ is_default: false })
        .eq('user_id', user.id).eq('is_default', true).neq('id', id)
      patch.is_default = true
    } else if (body.is_default === false) {
      // Refuse to leave the user with no default at all.
      const { count } = await supabase.from('accounts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('is_default', true).eq('id', id)
      if ((count ?? 0) > 0) {
        return NextResponse.json(
          { error: 'Pick another account as default instead of unsetting this one.' },
          { status: 400 },
        )
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('accounts')
      .update(patch)
      .eq('id', id)
      .eq('user_id', user.id)   // RLS also enforces this; belt and braces
      .select(ACCOUNT_SELECT)
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: message(error) }, { status: 500 })
  }
}

/**
 * DELETE /api/accounts/:id            → refuses if the account still has transactions
 * DELETE /api/accounts/:id?reassignTo=<other id> → moves them across, then deletes
 *
 * The database has ON DELETE RESTRICT on both transaction tables, so a delete
 * with rows attached would fail anyway. Checking first lets us say how many
 * rows are in the way instead of surfacing a constraint error.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const reassignTo = new URL(request.url).searchParams.get('reassignTo')

    const { data: target } = await supabase.from('accounts')
      .select('id, is_default').eq('id', id).eq('user_id', user.id).maybeSingle()
    if (!target) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

    const { count: totalAccounts } = await supabase.from('accounts')
      .select('id', { count: 'exact', head: true }).eq('user_id', user.id)
    if ((totalAccounts ?? 0) <= 1) {
      return NextResponse.json(
        { error: 'This is your only account — add another before deleting it.' },
        { status: 400 },
      )
    }

    const [{ count: expenseCount }, { count: balanceCount }] = await Promise.all([
      supabase.from('expenses').select('id', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('account_id', id),
      supabase.from('balance_entries').select('id', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('account_id', id),
    ])
    const attached = (expenseCount ?? 0) + (balanceCount ?? 0)

    if (attached > 0) {
      if (!reassignTo) {
        return NextResponse.json({
          error: 'This account still has transactions.',
          requiresReassign: true,
          expenseCount: expenseCount ?? 0,
          balanceCount: balanceCount ?? 0,
        }, { status: 409 })
      }

      if (reassignTo === id) {
        return NextResponse.json({ error: 'Pick a different account to move them to.' }, { status: 400 })
      }
      const { data: dest } = await supabase.from('accounts')
        .select('id').eq('id', reassignTo).eq('user_id', user.id).maybeSingle()
      if (!dest) return NextResponse.json({ error: 'Target account not found' }, { status: 400 })

      // Move both tables before deleting. If either fails we stop and leave the
      // account in place rather than half-migrating it.
      const moveExpenses = await supabase.from('expenses')
        .update({ account_id: reassignTo }).eq('user_id', user.id).eq('account_id', id)
      if (moveExpenses.error) throw moveExpenses.error

      const moveBalances = await supabase.from('balance_entries')
        .update({ account_id: reassignTo }).eq('user_id', user.id).eq('account_id', id)
      if (moveBalances.error) throw moveBalances.error
    }

    const { error: delError } = await supabase.from('accounts')
      .delete().eq('id', id).eq('user_id', user.id)
    if (delError) throw delError

    // Never leave the user without a default.
    if (target.is_default) {
      const { data: next } = await supabase.from('accounts')
        .select('id').eq('user_id', user.id)
        .order('created_at', { ascending: true }).limit(1).maybeSingle()
      if (next) {
        await supabase.from('accounts').update({ is_default: true }).eq('id', next.id).eq('user_id', user.id)
      }
    }

    return NextResponse.json({ success: true, reassigned: attached })
  } catch (error) {
    return NextResponse.json({ error: message(error) }, { status: 500 })
  }
}
