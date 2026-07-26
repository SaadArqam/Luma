Apply the design system defined in DESIGN-luma.md to the Home/dashboard page (app/page.tsx or wherever the dashboard currently lives). Read DESIGN-luma.md first and use its token references directly — do not invent new colors or type values.

## Scope for this pass
Home page only. Do not touch Expenses, Categories, Wallet, Recurring, or Reports yet — those come in later passes.

## 1. Base layer
- Replace the current canvas background with {colors.canvas} (#1B1C21)
- Replace all existing card/panel backgrounds with the correct token per component type:
  - Stat cards (Current Balance, Total Credited, Spent This Month, Transactions) and the Today's Budget card → {component.glass-card} background/border/blur values
  - Recent Expenses table → {component.solid-list-card} (no backdrop-filter — this is a scrolling list)
- Replace all hairline borders with {colors.border-hairline}, and any currently-bold borders with {colors.border-hairline-strong}

## 2. Typography
- Any section title ("Today's Budget", "Spending by Category", "Recent Expenses") → {typography.header-section}, font Fraunces
- Card labels (e.g. "Current Balance", "Total Credited") → {typography.header-card}
- All numeric values (₹555.58, ₹17,310, ₹4,503.96, the 16 in Transactions) → {typography.number-card} for stat cards. Use font-feature-settings tabular-nums so digits don't shift width when they update.
- Body copy (dates, notes, "Resets at midnight", "1 of 1 categories within budget today") → {typography.body} or {typography.body-muted} depending on current emphasis
- Import Fraunces and Inter via next/font/google if not already set up; do not use CDN links.

## 3. Color mapping — replace gold (#E8B84B) with terracotta
- Every current gold usage (Configure button, active nav states, "click here to claim it" link, budget bar fill) → {colors.accent} (#D97757)
- Button text on terracotta background → {colors.canvas}, NOT white (per DESIGN-luma.md button-primary spec — dark text on the warm accent, not light text)
- Pressed/active state on any terracotta element → {colors.accent-pressed}

## 4. Semantic status colors
- The Today's Budget progress bar and "X% within budget" indicator: apply {colors.success} / {colors.warning} / {colors.danger} per the thresholds in {component.today-ring} (under 70% / 70-100% / over 100%), even though the full ring redesign hasn't shipped yet — just recolor the existing bar/badge with these tokens for now
- Spending by Category donut: recolor slices — Fuel/Food/Gifts/extra should use desaturated neutral tones from the graphite family (NOT rainbow colors), with only the currently-selected/hovered slice picking up {colors.accent-glow} as a highlight

## 5. Buttons
- "Configure" button → {component.button-primary}
- Any secondary/ghost buttons → {component.button-secondary}
- Apply transform: scale(0.95) on :active for every button (check this is already wired from earlier motion work — if using Framer Motion whileTap, use that instead of raw CSS)

## 6. Glass dock / sidebar
- If not already using DESIGN-luma tokens (it was built against the old gold/black glass spec), update {component.glass-dock} and {component.glass-sidebar} background/border values to match DESIGN-luma.md, and swap the active-pill highlight from gold to {colors.accent-glow} / {colors.accent}

## 7. What NOT to change yet
- Don't build the Today ring or Quick Add sheet in this pass — that's separate, upcoming work. This pass is a token/color/type swap on the EXISTING layout structure only.
- Don't touch the "You have existing data" claim banner logic, just restyle its container/text with the new tokens.

Implement this as one pass. Afterward, list every file you touched so I can review the diff before testing on device.