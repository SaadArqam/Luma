Implement working per-user custom reminder times using a GitHub Actions scheduled workflow, replacing the fixed-time-only Vercel Cron for the reminder check. Keep the EOD summary on Vercel Cron (once-daily, that's fine as-is).

## 1. Create .github/workflows/notification-reminders.yml in the repo

name: Trigger daily reminders
on:
  schedule:
    - cron: '*/15 * * * *'
  workflow_dispatch:
jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Call reminder endpoint
        run: |
          curl -f -X POST https://paisa-track-xi.vercel.app/api/notifications/send-reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"

## 2. Add CRON_SECRET as a GitHub repo secret
GitHub repo → Settings → Secrets and variables → Actions → New repository secret, name CRON_SECRET. Use the SAME value as whatever secret already protects the Vercel Cron routes (check the existing env var used for that auth check) — this lets both the GitHub Action and Vercel Cron authenticate the same way.

## 3. Update /api/notifications/send-reminders logic
This route now needs to actually check each user's stored daily_reminder_time against the current time, since it's genuinely being called every 15 minutes:
- Fetch all users where daily_reminder_enabled = true
- For each, get their stored daily_reminder_time and timezone (default 'Asia/Kolkata' if not set)
- Compute their current local time; if it falls within the current 15-minute window of their target time (e.g. target 20:00, window is 19:52:30–20:07:30, or simpler: round current time to nearest 15-min mark and compare), AND they haven't logged an expense yet today, send the notification
- Add a `last_reminder_sent_date` column (or similar) to prevent double-sends if the Action's timing drifts slightly and the same user matches in two consecutive runs — check this before sending, set it after

## 4. Remove the "coming soon" disabled state if present
Confirm the time picker in Settings has no disabled/grayed styling or placeholder note left over from the fixed-time interim fix — it should now be fully functional and honest about what it does.

## 5. Confirm the fix works end-to-end
- Set the reminder time to a few minutes from now
- Manually trigger the workflow once via GitHub Actions' "Run workflow" button (workflow_dispatch) to test without waiting for the schedule
- Confirm the notification arrives close to the selected time, not just at 8 PM
- Change the time to something else, repeat, confirm it now fires at the NEW time — this is the actual bug being fixed

Note for later: GitHub Actions scheduled workflows can be delayed a few minutes under GitHub's own load, and stop running if the repo goes 60+ days with no commits — both fine for personal daily use, but worth knowing if this feels inconsistent occasionally.