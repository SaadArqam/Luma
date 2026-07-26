Fix the Quick Add expense sheet overlapping and blending with the bottom dock.

## Root cause
The sheet's z-index is likely equal to or below the dock's, and/or the dock isn't being hidden while the sheet is open — both are visible and interleaved in the screenshot (dock icons bleeding through the sheet, "Add Expense" submit button overlapped by the dock's home icon).

## Fix

1. **Hide the dock while the sheet is open** — this is the cleanest fix, not just a z-index bump. When the Quick Add sheet's open state is true, animate the dock out (fade + slight downward translate, 150ms) rather than leaving it rendered underneath. A user shouldn't be able to navigate away via the dock while mid-way through adding an expense anyway — hiding it reinforces that this is a focused task.

2. **Sheet z-index** — regardless of the above, set the sheet's z-index explicitly higher than the dock's (e.g. dock at z-index: 100 per earlier spec, sheet should be z-index: 200+) so if there's ever a transition frame where both are visible, the sheet is unambiguously on top.

3. **Sheet background must be fully opaque at the bottom edge** — the current sheet appears to fade to transparent near its bottom, letting the backdrop scrim and dock show through. Use {colors.surface-glass-thick} (85% opacity, not lower) for the full sheet body, with no gradient-to-transparent at any edge.

4. **Sheet bottom padding** — ensure the sheet's own submit button ("Add Expense" inside the sheet, not the dock) has clearance from the bottom of the screen: padding-bottom: max(24px, env(safe-area-inset-bottom) + 16px) on the sheet's inner content, so the button is never close to where the dock would sit.

5. **Verify the backdrop scrim covers full viewport** — rgba(0,0,0,0.6) scrim should sit between the page content and the sheet, full screen, above the (now-hidden) dock, so no page content is visible through it at all while the sheet is open.

Test by opening Quick Add and confirming: dock is completely gone/hidden, sheet background is fully solid with no page content bleeding through, and the sheet's own "Add Expense" submit button is fully visible and tappable without any dock overlap.