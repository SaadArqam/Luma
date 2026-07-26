import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[POST /api/notifications/subscribe] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized', details: authError?.message }, { status: 401 })
    }

    const { endpoint, keys } = await req.json()
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription payload: missing endpoint or keys' }, { status: 400 })
    }

    // Try upsert first
    const { error: upsertError } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint,
          keys_p256dh: keys.p256dh,
          keys_auth: keys.auth,
        },
        { onConflict: 'user_id, endpoint' }
      )

    if (!upsertError) {
      return NextResponse.json({ success: true })
    }

    console.warn('[POST /api/notifications/subscribe] Upsert failed, attempting fallback query:', upsertError)

    // Fallback: check if subscription exists
    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('endpoint', endpoint)
      .maybeSingle()

    if (existing) {
      const { error: updateError } = await supabase
        .from('push_subscriptions')
        .update({ keys_p256dh: keys.p256dh, keys_auth: keys.auth })
        .eq('id', existing.id)

      if (updateError) {
        console.error('[POST /api/notifications/subscribe] Update error:', updateError)
        return NextResponse.json({
          error: 'Failed to update subscription in database',
          details: updateError.message,
          code: updateError.code,
        }, { status: 500 })
      }
    } else {
      const { error: insertError } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: user.id,
          endpoint,
          keys_p256dh: keys.p256dh,
          keys_auth: keys.auth,
        })

      if (insertError) {
        console.error('[POST /api/notifications/subscribe] Insert error:', insertError)
        return NextResponse.json({
          error: 'Failed to insert subscription into database. Confirm push_subscriptions table exists in Supabase.',
          details: insertError.message,
          code: insertError.code,
        }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[POST /api/notifications/subscribe] Uncaught exception:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
