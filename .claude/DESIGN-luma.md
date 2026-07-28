---
version: alpha
name: Luma-design-system
description: A deep-graphite, terracotta-accented daily-use interface for a personal finance/life OS. Liquid Glass chrome (blurred, translucent nav and cards) sits over a warm-editorial content layer — Unbounded display family reserved for headers and balance figures (headlines, stat values), while Inter handles all body and meta text. Minimal but never pastel, and never pure black; elevation comes from lightness steps within the same cool-graphite family, never a jump to a light surface.

colors:
  canvas: "#0B0B0F"
  surface-glass: "rgba(22, 22, 29, 0.75)"
  surface-glass-thin: "rgba(22, 22, 29, 0.48)"
  surface-glass-thick: "rgba(22, 22, 29, 0.88)"
  surface-solid: "#16161D"
  surface-solid-raised: "#1E1E26"
  border-hairline: "#1a1a20"
  border-hairline-strong: "#26262E"
  specular-highlight: "rgba(255, 255, 255, 0.09)"
  text-primary: "#F5F1EA"
  text-muted: "#9C99A2"
  text-faint: "#6C6A73"
  accent: "#FF6B35"
  accent-pressed: "#E0552A"
  accent-glow: "rgba(255, 107, 53, 0.28)"
  accent-border: "rgba(255, 107, 53, 0.55)"
  accent-shadow: "rgba(255, 107, 53, 0.45)"
  success: "#6FC49B"
  success-glow: "rgba(111, 196, 155, 0.22)"
  warning: "#EFA84A"
  warning-glow: "rgba(239, 168, 74, 0.22)"
  danger: "#D65458"
  danger-glow: "rgba(214, 84, 88, 0.22)"
  info: "#8AA9C4"
  gradient-primary: "linear-gradient(135deg, #FF6B35 0%, #FF3D8A 100%)"
  gradient-secondary: "linear-gradient(135deg, #4361EE 0%, #7B2FF7 100%)"
  gradient-tertiary: "linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)"

chart-categorical:
  description: "Reserved for data visualization (donut/bar charts, category legends, bank-avatar backgrounds) ONLY — not UI chrome. Category chips use a separate curated palette (see {component.category-chip} below), not this hash-based system. Unlike the single-accent rule for buttons/nav/borders, categorical charts need real hue variation to be scannable at a glance. Each tone is muted/desaturated to stay consistent with the graphite identity, but spans distinct hue families rather than shades of one gray. Assign by a proper string hash (e.g. djb2) of category id/name mod tones.length, not array index or a weak/collision-prone hash — verify no two categories in actual use resolve to the same tone. A category keeps the same color everywhere it's used even as other categories are added/removed."
  tones:
    clay: "#D9825A"
    muted-gold: "#B8954A"
    warm-sand: "#C4A574"
    sage: "#8FA888"
    muted-teal: "#6B9A8F"
    dusty-blue: "#7C93A8"
    dusty-lavender: "#9088A8"
    dusty-rose: "#B87A8A"
    muted-coral: "#C97B6E"
    olive: "#9B9B6C"
    slate-gray-blue: "#6E7A8A"
    muted-plum: "#8A6A8C"

typography:
  header-display:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: "clamp(28px, 24px + 1vw, 36px)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -0.2px
  header-section:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: "clamp(20px, 18.4px + 0.5vw, 24px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.1px
  header-card:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  number-hero:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: "clamp(32px, 25.6px + 2vw, 44px)"
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.5px
    fontFeatureSettings: "'tnum' 1"
  number-card:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: "clamp(20px, 17.6px + 0.75vw, 26px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.3px
    fontFeatureSettings: "'tnum' 1"
  number-inline:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.3
    fontFeatureSettings: "'tnum' 1"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-muted:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    color: "{colors.text-muted}"
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.1px
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0

rounded:
  sm: 8px
  md: 14px
  lg: 20px
  xl: 28px
  full: 999px

components:

  glass-dock:
    description: "Floating bottom nav on mobile (≤834px). Background {colors.surface-glass}, backdrop-filter saturate(180%) blur(20px), border 1px solid {colors.border-hairline}, rounded {rounded.xl}, box-shadow 0 8px 32px rgba(0,0,0,0.4). Active item gets a pill background {colors.accent-glow} with icon color {colors.accent}, animated via layoutId spring transition."

  glass-sidebar:
    description: "Desktop nav (≥835px). Same glass tokens as glass-dock, floated with 12px margin, rounded {rounded.lg}. All 7 nav items visible with icon + label."

  glass-card:
    description: "Default elevated card (stat cards, Today card, budget card). Background {colors.surface-glass}, backdrop-filter blur(16px), border 1px solid {colors.border-hairline}. Status variants add an inset ring: box-shadow inset 0 0 0 1px {colors.success-glow | warning-glow | danger-glow} depending on state, plus 0 4px 20px rgba(0,0,0,0.3) drop shadow. Specular highlight pseudo-element on top edge."

  solid-list-card:
    description: "Dense scrollable content (Expense History, Balance History, Recent Expenses table). Background {colors.surface-solid}, no backdrop-filter (perf: avoid blur behind long scrolling lists), border 1px solid {colors.border-hairline}, rounded {rounded.lg}."

  button-primary:
    description: "Background {colors.accent}, text {colors.canvas} (dark text on terracotta for contrast, not white), {typography.button}, rounded {rounded.full}, padding 14px 24px, height 52px minimum (mobile tap target). box-shadow: 0 4px 20px {colors.accent-shadow} — a soft glow beneath the button so the accent feels lit rather than flat-filled. Active/pressed: transform scale(0.95), background shifts to {colors.accent-pressed}, glow shadow reduces to 0 2px 10px {colors.accent-shadow}."

  button-secondary:
    description: "Background transparent, border 1px solid {colors.border-hairline-strong}, text {colors.text-primary}, {typography.button}, rounded {rounded.full}, padding 12px 20px."

  quick-add-sheet:
    description: "Bottom sheet modal for expense capture, reachable from Home. Background {colors.surface-glass-thick}, backdrop-filter blur(24px), rounded top corners {rounded.xl}, slides up with spring transition, backdrop scrim fades to rgba(0,0,0,0.6)."

  today-ring:
    description: "SVG circular progress on the Today card. Track color {colors.border-hairline-strong}. Fill color: {colors.success} under 70% of daily budget, {colors.warning} 70-100%, {colors.danger} over 100%. Center number in {typography.number-hero}, sub-label in {typography.body-muted}."

  category-chip:
    description: "Pill-shaped, used in category grids and the expense-form category select. Colors come from lib/category-colors.ts's getCategoryChipColors(name) — a curated {bg, text} map (Food/Transport/Travel/Tiffin/Shopping), gray fallback for any other category name. This is separate from chart-categorical below: that one is the hash-based getCategoryColor(key), still used for chart fills and bank-avatar backgrounds, which need a single raw hex rather than a bg/text pair."

  streak-badge:
    description: "Inline, low-emphasis. Flame icon in {colors.accent}, text {typography.caption} in {colors.text-muted}. Only rendered when streak ≥ 3 days — never a loud banner."

  stat-card:
    description: "Compact secondary card (Balance, Credited, Spent, Transactions on Home). Label in {typography.header-card} (Unbounded, small), value in {typography.number-card} (Unbounded, bold tabular). Demoted visual weight vs. the Today card — smaller padding (16px vs 24px)."

## Do's and Don'ts

### Do
- Keep every surface in the cool-dark family — elevation is a lightness step (`{colors.canvas}` → `{colors.surface-solid}` → `{colors.surface-solid-raised}`), never a jump to a pale/light surface.
- Use `{colors.accent}` (orange, `#FF6B35`) as the only accent color for interactive/active UI chrome (buttons/nav/borders) — same single-accent discipline as the Apple reference doc. The three gradients and the category-chip palette are separate, sanctioned exceptions (see the Don't below), not license to add more.
- Reserve the Unbounded display family for headers and numbers only — this consistent typographic anchor across all stat values and headlines is the core identity, don't let it drift into body-text roles.
- Use tabular figures (`font-feature-settings: 'tnum' 1`) on every number that can change, so digit changes don't cause layout shift.
- Reserve `backdrop-filter` for nav and a handful of hero cards — never apply it to long scrolling lists (perf on mid-range Android).

### Don't
- Don't use pure white (`#FFFFFF`) anywhere — text-primary is warm off-white (`#F5F1EA`), and there is no light-mode surface in this system.
- Don't use pure black (`#000000`) as canvas — `{colors.canvas}` is a deep cool graphite (`#0B0B0F`), chosen deliberately over true black so the base reads as a color, not an absence of one.
- Don't use neon/saturated versions of success/warning/danger — they're deliberately muted (sage, amber, brick) to sit quietly next to the accent rather than compete with it.
- Don't set headers or numbers in Inter, and don't set body text in Unbounded — the role-based family split (Unbounded for display/numbers, Inter for body/meta) is the rule, not a suggestion.
- Don't add a second accent color for "variety" in UI chrome — every colored dot/border/glow in the `chart-categorical` dot/avatar system is a desaturated neutral, not a rainbow. `{colors.accent}` (orange) stays the only saturated color for interactive chrome; the three gradients and the five curated `{component.category-chip}` hues are the two sanctioned exceptions (money surfaces and category chips, respectively), not general-purpose color.
- Gradients (`{colors.gradient-primary/secondary/tertiary}`) are reserved for money surfaces — the account card stack and primary CTA/save buttons — not general UI chrome. Everything else still uses the single flat `{colors.accent}`, unchanged from the single-accent rule above.

## Iteration Guide

1. Reference component keys directly when prompting your coding agent, e.g. `{component.glass-card}`, `{component.today-ring}`.
2. When applying this to an existing page, restyle in this order: canvas/surface colors first, then borders, then typography, then component-specific tokens (rings, chips, badges) last.
3. If a new component doesn't fit an existing entry, don't invent a new accent — reuse `{colors.accent}` and vary opacity/weight instead.
4. Test every glass component on a mid-range Android device before shipping — `backdrop-filter` performance is the main risk in this system, not the color/type choices.