Fix horizontal overflow on the Balance and Expenses pages on mobile (≤ 640px). The root cause is likely one or both of:
1. The two-column grid (form + history) isn't collapsing to single-column below the tablet breakpoint
2. The history/expense tables have fixed-width columns wider than the viewport, and that width is leaking to the whole page instead of being contained to a scrollable table area

## 1. Layout stacking
On both Balance and Expenses pages, confirm the grid/flex container holding [Add Balance form + Balance History] and [Add Expense form + Expense History] switches from side-by-side to stacked (form on top, history below) at the same breakpoint used elsewhere (735px, per the tablet: utility class already set up in globals.css). If it's currently using a fixed grid-template-columns instead of a responsive one, fix it to use the tablet: prefix pattern already established for the sidebar/dock switch.

## 2. Replace table layout with card rows on mobile (≤ 640px)

Instead of forcing the existing table (Date / Category / Note / Amount columns) to shrink or scroll horizontally, restructure each row into a stacked card layout below 640px:

Balance History row (mobile):
- Top line: Note (e.g. "Monthly") on the left, Amount (e.g. "+₹2,805") on the right, in {typography.number-inline}
- Bottom line: Date + "Credit" badge, in {typography.body-muted}
- Full row wrapped in a subtle bottom border {colors.border-hairline}, padding 12px vertical

Expense History row (mobile):
- Top line: category icon + category name on the left, Amount on the right in {typography.number-inline}
- Bottom line: Note + Date, in {typography.body-muted}
- Delete icon stays top-right or becomes a swipe-to-delete gesture if easy to add, otherwise keep as a small icon button
- Same border/padding pattern as above

Keep the existing table layout for ≥ 641px (tablet/desktop) — this is a mobile-only restructure, use a media query or conditional rendering, don't remove the table for larger screens.

## 3. Contain any remaining horizontal scroll
- Add overflow-x: hidden to the page-level wrapper (not body/html globally, which can break the dock's fixed positioning — scope it to the page content container) as a safety net
- Audit for any element with a hardcoded px width (not %, not max-width) inside these two pages — these are the most common cause of silent overflow. Search page-item widths especially in the Recent Expenses / Balance History filter row (e.g. "July 2026" + "all" dropdown area — these could be sitting in a flex row without wrap)
- The month/filter dropdown row on the Expenses page ("Search expenses... July 2026 all ▾") likely needs to wrap onto two lines on mobile — search input full-width on its own row, filters below it

Test at 375px and 412px viewport widths specifically (common Android widths, close to your Realme GT 7's logical resolution) — not just 320px or desktop-shrunk-down, since Android viewport behavior can differ slightly from iOS.

List the specific elements that were causing the overflow once found, so we know the root cause for future pages.