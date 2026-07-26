Diagnose the 500 errors on /api/notifications/subscribe and /api/notifications/settings.

## 1. Get the actual server-side error first
Go to the Vercel dashboard → this project → Logs (or Observability/Functions tab depending on current Vercel UI) → filter to these two routes → find the actual stack trace from the most recent failed requests. Do not guess at the fix without seeing this — a generic 500 can mean several different things and the log will say exactly which.

## 2. Most likely causes to check, in order of likelihood

a) VAPID_PRIVATE_KEY missing or malformed on the server side
   Unlike NEXT_PUBLIC_VAPID_PUBLIC_KEY (client), VAPID_PRIVATE_KEY and VAPID_SUBJECT are server-only and used when the /subscribe route initializes web-push (webpush.setVapidDetails(...)). Confirm both are set in Vercel env vars for this environment, and that the deployment picked them up (redeploy after adding if just added).

b) Database table missing or schema mismatch
   /subscribe writes to push_subscriptions, /settings reads/writes notification_preferences (or wherever these were meant to be added per the earlier plan). Confirm these tables/columns actually exist in the live Supabase database — if the migration was only written but never run against the actual database, every query against them will throw and surface as a 500.

c) RLS (row-level security) blocking the insert/update
   If Supabase RLS is enabled on these new tables but no policy was added allowing the authenticated user to insert/select their own rows, every request will fail server-side. Check Supabase dashboard → Authentication → Policies for push_subscriptions and notification_preferences — confirm policies exist allowing users to manage their own rows (auth.uid() = user_id pattern, matching whatever pattern the rest of the app's tables already use).

d) web-push package not properly initialized
   Confirm 'web-push' is actually in package.json dependencies (not just installed locally and not committed), and that the import/require in the API route matches how it's actually installed (import webpush from 'web-push' vs require patterns can differ based on the route's runtime — check if this route is Edge or Node.js runtime, since 'web-push' requires Node.js APIs and will fail entirely on Edge runtime).

## 3. Report back
Paste the actual stack trace/error message from Vercel logs here (or summarize it) rather than just confirming "it's fixed" — given how many candidate causes there are, knowing which one it actually was will save time if anything adjacent breaks later.