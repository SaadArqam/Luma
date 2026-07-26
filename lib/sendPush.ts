import webpush from 'web-push'
import { createClient } from '@/lib/supabase-server'

const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const privateKey = process.env.VAPID_PRIVATE_KEY || ''
const subject = process.env.VAPID_SUBJECT || 'mailto:admin@paisatrack.app'

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey)
}

export interface PushPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, any>
  tag?: string
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  const supabase = await createClient()

  // Fetch all push subscriptions for this user
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, keys_p256dh, keys_auth')
    .eq('user_id', userId)

  if (error || !subs || subs.length === 0) {
    return { success: false, sentCount: 0, reason: 'No subscriptions found' }
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
      console.error(`Push send error for sub ${sub.id}:`, err?.statusCode || err?.message)

      // If subscription expired / uninstalled / revoked (410 Gone / 404 Not Found), remove from DB
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id)
      }
    }
  }

  return { success: sentCount > 0, sentCount }
}
