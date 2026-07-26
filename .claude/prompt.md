Apply DESIGN-luma.md to the remaining pages: Wallet, Categories, Expenses, Recurring, Reports, and Settings. The Home page already has this applied — use it as the reference implementation for token usage patterns (glass-card, solid-list-card, typography roles, accent color) and match that same approach here.

Read DESIGN-luma.md fully before starting. Go page by page, in this order, and list files touched after each page before moving to the next.

## Wallet page (Balance / Add Balance + Balance History)
- "Add Balance" form container → {component.glass-card}
- Balance History table container → {component.solid-list-card} (scrolling list, no backdrop-filter)
- "Add Money" button → {component.button-primary}
- Amount/Date/Note inputs → background {colors.surface-solid-raised}, border {colors.border-hairline}, text {colors.text-primary}, focus state border {colors.accent-border}
- "Credit" badges in the history table → replace current green with {colors.success}, background {colors.success-glow}
- Page title "Balance" → {typography.header-display}, subtitle "Manage your wallet balance..." → {typography.body-muted}

## Categories page
- "New Category" form → {component.glass-card}
- Each category card in the grid → {component.category-chip} treatment but sized as a card (not pill) — background {colors.surface-solid-raised}, border {colors.border-hairline}; the one with a budget set gets border {colors.accent-border} and its "Daily: ₹210" badge in {colors.accent} on {colors.accent-glow} background
- "Create Category" button → {component.button-primary}
- "Set Budget" small buttons → {component.button-secondary}
- Delete (trash) icon buttons → keep icon-only, recolor icon to {colors.danger} at rest, no fill background until hover/press

## Expenses page
- "Add Expense" form → {component.glass-card}
- Expense History table → {component.solid-list-card}
- Category icons in the list stay as emoji/icons, unchanged
- "Add Expense" button → {component.button-primary}
- Search input and month/filter dropdown → same input styling as Wallet page inputs above
- "Total for selected period" footer row → value in {typography.number-card}, label in {typography.body-muted}
- Recurring payment checkbox → accent color {colors.accent} when checked

## Recurring page
- Empty state card → {component.glass-card}
- "Add from Expenses" button → {component.button-primary}
- Icon in empty state → recolor from current blue to {colors.text-muted} (neutral, not colored — this is an empty state, not a status indicator)

## Reports page
- Time-range toggle (30 days / 90 days / 6 months) → active state uses {component.button-primary} treatment (accent fill), inactive uses {component.button-secondary}
- Spending Activity stat cards (Active Days, Longest Streak, Biggest Day, Daily Average) → {component.glass-card}, labels in {typography.caption}, values in {typography.number-card}
- Heatmap: keep the green intensity scale AS IS — do not recolor to terracotta, the heatmap's green-scale is a separate data-visualization convention distinct from the UI accent color and recoloring it would reduce readability
- Monthly Spending bar chart → active/current month bar uses {colors.accent}, other months use {colors.surface-solid-raised}
- "This Month by Category" list → progress bars recolor from gold to {colors.accent}, but keep each category's own row otherwise neutral (per the earlier "no rainbow" rule)

## Settings page
- I don't have a screenshot of this page — inspect the actual current implementation and apply the same general rules: glass-card containers for forms/sections, button-primary for primary actions, button-secondary for secondary actions, inputs matching the Wallet/Expenses pattern, {typography.header-section} for section titles.

## Cross-cutting
- Every page's glass-dock/glass-sidebar should already be consistent from the Home page work — if any page has a locally-overridden nav style, remove the override and let it inherit the shared component.
- Do not touch layout structure, spacing, or component logic — this pass is tokens/colors/type only, same constraint as the Home page pass.

After each page, tell me what you changed so I can spot anything that needs a follow-up pass.