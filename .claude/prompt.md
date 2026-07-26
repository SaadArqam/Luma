Diagnose and fix two related layout bugs introduced by the recent dock-hide-while-sheet-open change:


## Bug 1: Dock no longer sticks to the viewport bottom
The dock is now rendering mid-page (overlapping "Today's Budget") instead of fixed at the bottom of the screen, and at reduced opacity even when no sheet is open.

Likely cause: `position: fixed` only works relative to the viewport if NO ancestor element has `transform`, `filter`, `backdrop-filter`, `perspective`, or `will-change` set to any of these properties. If the fade/hide animation added for the sheet-overlap fix applied a `transform` or `opacity` transition to a wrapper DIV that contains both the dock AND page content (instead of animating the dock's own isolated wrapper), that wrapper now creates a new positioning context — and the dock's `position: fixed` becomes fixed relative to THAT wrapper instead of the viewport, which is exactly this symptom (floating mid-content, tracking scroll instead of staying pinned).

Fix: 
- Find where the dock-hide animation was added. Confirm the animated `transform`/`opacity` is applied ONLY to the dock's own root element, not to any shared layout wrapper, `<main>`, or page container.
- The dock component should be rendered as a sibling to page content at the layout root (in layout.tsx, outside the page's own wrapper div), never nested inside a container that also wraps page content — this is the structural fix, not just a CSS tweak.
- After fixing, confirm `position: fixed; bottom: ...` on the dock is being computed relative to the viewport again (inspect in DevTools — computed position should not shift when the page scrolls).

## Bug 2: Duplicate/ghost header content mid-page
There's a second faint "PaisaTrack / Hey Saad · Sunday, 26 July" rendering partway down the page, underneath the stat cards, on top of what should be the Today's Budget section.

Likely cause: the AnimatePresence page-transition setup (from the earlier Lenis/Framer Motion pass) may not be fully unmounting the previous page/component before mounting the new one — an old instance of the Home page is lingering in the DOM, partially transparent mid-exit-animation, stacked behind the current one.

Fix:
- Check the AnimatePresence usage for `mode="wait"` — without it, enter and exit animations run simultaneously, which causes exactly this "two copies overlapping" symptom.
- Confirm each page/route has a stable, unique `key` prop passed to its motion wrapper (React needs this to know it's a genuinely new instance to animate out the old one, not reuse it).
- Verify the exit animation actually completes and unmounts — if `AnimatePresence` never fires `onExitComplete` cleanly, this ghost can persist indefinitely.

## After fixing both
Test this specific sequence, since it's what triggered the bug originally: open Quick Add sheet from Home → close it → navigate to a different tab via the dock → navigate back to Home. Confirm at each step: dock stays pinned to the true viewport bottom, and there's exactly one copy of the header/greeting rendered, never two.

Report which of the two root causes (or both) was confirmed, since Bug 2 in particular could resurface on other pages if it's a systemic AnimatePresence issue rather than Home-specific.