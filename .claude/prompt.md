Fix the "You have existing data — click here to claim it" banner reappearing after dismissal or navigation.

## Diagnose first
Find where the dismiss (X) handler is implemented. It's almost certainly using local useState (e.g. const [dismissed, setDismissed] = useState(false)) which resets every time the component remounts — i.e. every route change, since Home unmounts when you navigate away and remounts when you come back.

## Fix
Persist the dismissal so it survives navigation and page reloads:
- On dismiss click, write a flag to the database (a `banner_dismissed` or similar column/row tied to the user, in whatever table tracks user preferences/settings — check if one exists, create a minimal one if not) rather than only local state
- On Home page load, check that flag before rendering the banner at all
- If a full DB round-trip feels heavy for something this minor, an acceptable lighter-weight fix is localStorage (localStorage.setItem('claimBannerDismissed', 'true')) — but note this means the dismissal is per-device, not per-account, so it'll reappear if the user logs in elsewhere. Given this is a one-time "claim your data" prompt tied to account state, prefer the DB approach if there's already a user settings table to add one column to.

## Also verify
Once dismissed, confirm the banner doesn't just hide visually (display: none via CSS while still in the DOM/state as "shown") — it should not re-fetch or re-check the claimable-data condition until the underlying data state actually changes (e.g. don't show it again just because of a re-render).

Diagnose and fix the ~2 second delay when navigating between pages via the dock/sidebar.

## Diagnose first — check these in order, report findings before fixing
1. Confirm all dock/sidebar nav items use Next.js `<Link>` (or `router.push` from `next/navigation`) and NOT plain `<a href>` tags or `window.location` — a plain anchor tag causes a full page reload, which would fully explain a 2-second delay. This is the most likely cause.
2. Check each page component for data-fetching — is it fetching fresh data from Supabase on every mount with no loading skeleton, so the user stares at a blank/frozen screen until the fetch resolves? If so, the "delay" is actually a fetch waterfall, not a routing problem.
3. Check if Next.js prefetching is disabled anywhere (Link components with prefetch={false}) — default prefetch should make nav near-instant once the destination's JS is already loaded.
4. Check bundle size — if each page is pulling in large dependencies (chart libraries, etc.) without code-splitting, first navigation to that page pays the full JS-parse cost. Run `next build` and check the per-route bundle sizes in the output.

## Likely fixes, apply whichever the diagnosis points to
- If plain <a> tags: replace with <Link href="...">
- If blocking fetches with no loading state: add a loading.tsx (Next.js App Router convention) per route so navigation feels instant even while data loads in the background, instead of a frozen screen
- If large bundles: dynamic-import heavy components (e.g. chart library on Reports page) with next/dynamic so they don't block other routes' initial load
- If it's the glass/backdrop-filter recalculating: check whether the dock/sidebar are being remounted on every route change instead of staying persistent across navigations — they should live in the root layout.tsx, not be re-rendered per-page, or the browser recalculates the blur effect on every nav which is expensive

Report back which of these was the actual cause once found — this matters for knowing whether to expect the same issue on pages not yet built.

## Also, separately
The bottom dock is still overlapping page content (visible in the latest screenshot — the Settings/Configure card and nav icons are overlapping). The padding-bottom fix requested earlier doesn't appear to have been applied, or was reverted. Re-check that the page-level scroll container has bottom padding accounting for the dock's full height + margin, on every page, not just Home.