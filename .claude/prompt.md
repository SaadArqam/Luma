Set up push notifications for the PWA: a daily reminder at a user-configurable time, and an end-of-day spending summary. Check if a service worker already exists (from PWA setup) before creating a new one — extend it, don't replace it.

## Phase 1 — Push infrastructure

1. Generate VAPID keys (npx web-push generate-vapid-keys) and store as env vars: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto: your email)
2. npm install web-push
3. In the existing service worker file (public/sw.js or equivalent), add:
   - a 'push' event listener that reads event.data.json() and calls self.registration.showNotification(title, { body, icon, badge, data })
   - a 'notificationclick' listener that opens/focuses the app (clients.openWindow or clients.matchAll + focus) and closes the notification
4. Create a `push_subscriptions` table: id, user_id, endpoint, keys_p256dh, keys_auth, created_at
5. Client-side: a function that requests Notification permission, subscribes via registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID_PUBLIC_KEY }), and POSTs the subscription object to an API route that upserts it into push_subscriptions (keyed on user_id + endpoint, so re-subscribing on a new session doesn't duplicate rows)
6. Create a shared server-side helper (lib/sendPush.ts) that takes a user_id, fetches their subscription(s), and sends via web-push's webpush.sendNotification() — wrap in try/catch and delete the subscription row on a 410 Gone response (means the user uninstalled/revoked)

## Phase 2 — Settings UI for notification preferences

Add to the Settings page:
- Toggle: "Daily reminders" (on/off)
- Time picker: "Remind me at" — defaults to 8:00 PM
- Toggle: "End-of-day summary" (on/off) — defaults to on, fixed time for now (see Phase 4 note)
- On enabling either toggle for the first time, trigger the permission request + subscribe flow from Phase 1 if not already subscribed
- Store preferences in a `notification_preferences` table (or columns on an existing user settings table): user_id, daily_reminder_enabled, daily_reminder_time, eod_summary_enabled, timezone (default 'Asia/Kolkata')

## Phase 3 — Daily reminder logic

Create an API route (app/api/notifications/send-reminders/route.ts):
- Query all users where daily_reminder_enabled = true
- For each, compute their current local time using their stored timezone
- If current local time matches their daily_reminder_time (within the cron's run interval — see Phase 5), AND they haven't logged any expense yet today, send: title "Anything to log today?", body a short line like "You haven't added an expense yet — takes 10 seconds."
- Skip sending if they've already logged something today (no point nudging someone who's already done it)

## Phase 4 — End-of-day summary logic

Create app/api/notifications/send-eod-summary/route.ts:
- Query all users where eod_summary_enabled = true, at a fixed run time for now (e.g. 9:30 PM IST) since this is single-timezone for now — note in code this should become per-user-timezone-aware once there are non-IST users
- For each user, compute today's total spend and budget status
- Send: title "Today's summary", body e.g. "₹210 spent today, ₹10 left in budget" or "₹0 spent today — quiet one" if nothing logged
- Do NOT send this one if the user opened the app zero times today — actually, send it regardless (it's a summary, not a nag) — just vary the copy for zero-activity days

## Phase 5 — Scheduling via Vercel Cron

Add to vercel.json:
{
  "crons": [
    { "path": "/api/notifications/send-reminders", "schedule": "*/15 * * * *" },
    { "path": "/api/notifications/send-eod-summary", "schedule": "0 16 * * *" }
  ]
}
(The reminder cron runs every 15 minutes and checks each user's target time against current time, since Vercel Cron itself can't do per-user custom times. The summary cron's "0 16 * * *" is UTC — adjust to correctly land at ~9:30 PM IST, accounting for the UTC offset, and add a comment noting this is single-timezone-only for now.)
Protect both routes with a shared secret header check (Vercel Cron sends a specific auth pattern — check current Vercel docs for the exact header/verification method) so they can't be triggered by random public requests.

Implement in phases, test Phase 1-2 (permission + subscribe flow working, a manual test notification sending successfully) before wiring up the actual cron-triggered logic in Phase 3-4.