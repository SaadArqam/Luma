Add a daily AI-generated tip/nudge to the Today card on the Home page. This is v1: one short line of text, regenerated once per day, no chat interface, no interactivity beyond being present.

## 1. Backend: daily tip generation

Create an API route (e.g. app/api/daily-tip/route.ts) that:
- Checks if a tip already exists for this user for today's date (query a new `daily_tips` table: columns user_id, date, tip_text, created_at)
- If yes, return the cached tip — do NOT regenerate
- If no, gather the user's relevant data for today/this week: today's spend, today's budget status, current streak, this week's category breakdown, whether any category is trending over budget
- Call the Anthropic API (claude-sonnet-4-6 model, max_tokens 60) with a system prompt instructing: "You are a quiet, observational daily nudge for a personal finance app. Given this user's spending data, write ONE short sentence (under 15 words) noting something true and specific about their day/week. Tone: warm, observational, never preachy or congratulatory-corporate. Never give generic advice like 'track your spending.' Reference an actual number or pattern from the data given." Pass the gathered data as the user message.
- Store the response in `daily_tips`, return it

## 2. Frontend: display

- On Home page load, fetch from /api/daily-tip (SWR/React Query pattern if already in use, otherwise a simple useEffect fetch with loading state)
- Render as a small line beneath the Today ring/spend number, inside the same {component.glass-card}, NOT a separate card:
  - Icon: a small sparkle or similar (Tabler-style, subtle, {colors.text-muted} color, 14px)
  - Text: {typography.body-muted} (13px), color {colors.text-muted}, max 2 lines with ellipsis overflow
  - Fade-in on load (Framer Motion, opacity 0→1, 300ms, slight delay so it doesn't compete with the ring's own entrance)
- Loading state: show nothing (no skeleton, no spinner) until the tip resolves — this is a quiet feature, a loading spinner would overstate its importance
- Failure state: if the API call fails, fail silently — don't show an error, just omit the line entirely for that session

## 3. Cost control
- The once-per-day cache in `daily_tips` is the primary cost control — confirm the route genuinely checks for an existing row before calling the API, this is not optional
- Set a hard max_tokens: 60 on the API call — this should never need more than one short sentence

Test by checking the tip changes day-to-day but stays fixed across multiple page loads on the same day.