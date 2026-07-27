import webpush from 'web-push'
import { createAdminClient } from '@/lib/supabase-admin'

export interface PushPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, any>
  tag?: string
}

let isVapidInitialized = false

function initVapid() {
  if (isVapidInitialized) return true

  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
  const privateKey = process.env.VAPID_PRIVATE_KEY || ''
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@paisatrack.app'

  if (publicKey && privateKey) {
    try {
      webpush.setVapidDetails(subject, publicKey, privateKey)
      isVapidInitialized = true
      return true
    } catch (err) {
      console.error('[lib/sendPush] Failed to initialize VAPID details:', err)
      return false
    }
  }

  console.warn('[lib/sendPush] VAPID keys missing on server. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in environment variables.')
  return false
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  if (!initVapid()) {
    return { success: false, sentCount: 0, reason: 'VAPID keys not configured on server' }
  }

  // Service-role: this is called from the notification crons, which have no
  // user session, and it must read subscriptions belonging to `userId` rather
  // than to the caller. Every query below is scoped by hand.
  const supabase = createAdminClient()

  // Fetch all push subscriptions for this user
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, keys_p256dh, keys_auth')
    .eq('user_id', userId)

  if (error) {
    console.error('[lib/sendPush] Supabase query error fetching subscriptions:', error)
    return { success: false, sentCount: 0, reason: error.message }
  }

  if (!subs || subs.length === 0) {
    return { success: false, sentCount: 0, reason: 'No subscriptions found for user' }
  }

  let sentCount = 0

  for (const sub of subs) {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.keys_p256dh,
        auth: sub.keys_auth,
      },
    }

    try {
      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload)
      )
      sentCount++
    } catch (err: any) {
      console.error(`[lib/sendPush] Push error for sub ${sub.id}:`, err?.statusCode || err?.message)

      // If subscription expired / uninstalled / revoked (410 Gone / 404 Not Found), remove from DB
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        // user_id is redundant given `sub` came from this user's rows, but the
        // service-role client has no RLS backstop, so scope every write.
        await supabase.from('push_subscriptions').delete().eq('id', sub.id).eq('user_id', userId)
      }
    }
  }

  return { success: sentCount > 0, sentCount }
}
