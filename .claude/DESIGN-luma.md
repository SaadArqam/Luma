---
version: alpha
name: Luma-design-system
description: A deep-graphite, terracotta-accented daily-use interface for a personal finance/life OS. Liquid Glass chrome (blurred, translucent nav and cards) sits over a warm-editorial content layer — bold tabular numbers paired with a humanist serif for headers. Minimal but never pastel, and never pure black; elevation comes from lightness steps within the same cool-graphite family, never a jump to a light surface.

colors:
  canvas: "#1B1C21"
  surface-glass: "rgba(38, 39, 46, 0.72)"
  surface-glass-thin: "rgba(38, 39, 46, 0.45)"
  surface-glass-thick: "rgba(38, 39, 46, 0.85)"
  surface-solid: "#232429"
  surface-solid-raised: "#2B2C33"
  border-hairline: "rgba(255, 255, 255, 0.09)"
  border-hairline-strong: "rgba(255, 255, 255, 0.16)"
  specular-highlight: "rgba(255, 255, 255, 0.06)"
  text-primary: "#F2EFEA"
  text-muted: "#8A8790"
  text-faint: "#5C5A60"
  accent: "#D97757"
  accent-pressed: "#C4663F"
  accent-glow: "rgba(217, 119, 87, 0.18)"
  accent-border: "rgba(217, 119, 87, 0.40)"
  success: "#7FB69E"
  success-glow: "rgba(127, 182, 158, 0.16)"
  warning: "#E0A458"
  warning-glow: "rgba(224, 164, 88, 0.16)"
  danger: "#C4595A"
  danger-glow: "rgba(196, 89, 90, 0.16)"
  info: "#8AA9C4"

typography:
  header-display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.2px
  header-section:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.1px
  header-card:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  number-hero:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 44px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.5px
    fontFeatureSettings: "'tnum' 1"
  number-card:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.3px
    fontFeatureSettings: "'tnum' 1"
  number-inline:
    fontFamily: "Inter, system-ui, sans-serif"
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
    description: "Background {colors.accent}, text {colors.canvas} (dark text on terracotta for contrast, not white), {typography.button}, rounded {rounded.full}, padding 14px 24px, height 52px minimum (mobile tap target). Active/pressed: transform scale(0.95), background shifts to {colors.accent-pressed}."

  button-secondary:
    description: "Background transparent, border 1px solid {colors.border-hairline-strong}, text {colors.text-primary}, {typography.button}, rounded {rounded.full}, padding 12px 20px."

  quick-add-sheet:
    description: "Bottom sheet modal for expense capture, reachable from Home. Background {colors.surface-glass-thick}, backdrop-filter blur(24px), rounded top corners {rounded.xl}, slides up with spring transition, backdrop scrim fades to rgba(0,0,0,0.6)."

  today-ring:
    description: "SVG circular progress on the Today card. Track color {colors.border-hairline-strong}. Fill color: {colors.success} under 70% of daily budget, {colors.warning} 70-100%, {colors.danger} over 100%. Center number in {typography.number-hero}, sub-label in {typography.body-muted}."

  category-chip:
    description: "Pill-shaped, used in category grids and the expense-form category select. Default: background {colors.surface-solid-raised}, border 1px solid {colors.border-hairline}. Selected: border 2px solid {colors.accent}, background {colors.accent-glow}."

  streak-badge:
    description: "Inline, low-emphasis. Flame icon in {colors.accent}, text {typography.caption} in {colors.text-muted}. Only rendered when streak ≥ 3 days — never a loud banner."

  stat-card:
    description: "Compact secondary card (Balance, Credited, Spent, Transactions on Home). Label in {typography.header-card} (serif, small), value in {typography.number-card} (bold tabular sans). Demoted visual weight vs. the Today card — smaller padding (16px vs 24px)."

## Do's and Don'ts

### Do
- Keep every surface in the cool-dark family — elevation is a lightness step (`{colors.canvas}` → `{colors.surface-solid}` → `{colors.surface-solid-raised}`), never a jump to a pale/light surface.
- Use `{colors.accent}` (terracotta) as the only accent color for interactive/active states — same single-accent discipline as the Apple reference doc.
- Pair serif headers with sans numbers on every card — this contrast is the core identity, don't let one creep into the other's territory.
- Use tabular figures (`font-feature-settings: 'tnum' 1`) on every number that can change, so digit changes don't cause layout shift.
- Reserve `backdrop-filter` for nav and a handful of hero cards — never apply it to long scrolling lists (perf on mid-range Android).

### Don't
- Don't use pure white (`#FFFFFF`) anywhere — text-primary is warm off-white (`#F2EFEA`), and there is no light-mode surface in this system.
- Don't use pure black (`#000000`) as canvas — `{colors.canvas}` is a deep cool graphite (`#1B1C21`), chosen deliberately over true black so the base reads as a color, not an absence of one.
- Don't use neon/saturated versions of success/warning/danger — they're deliberately muted (sage, amber, brick) to sit quietly next to terracotta rather than compete with it.
- Don't set header text in the sans family or number text in the serif — the serif/sans split by role (words vs. figures) is the rule, not a suggestion.
- Don't add a second accent color for "variety" — every colored dot/border/glow in the category system is a desaturated neutral, not a rainbow; terracotta stays the only saturated color in the UI.

## Iteration Guide

1. Reference component keys directly when prompting your coding agent, e.g. `{component.glass-card}`, `{component.today-ring}`.
2. When applying this to an existing page, restyle in this order: canvas/surface colors first, then borders, then typography, then component-specific tokens (rings, chips, badges) last.
3. If a new component doesn't fit an existing entry, don't invent a new accent — reuse `{colors.accent}` and vary opacity/weight instead.
4. Test every glass component on a mid-range Android device before shipping — `backdrop-filter` performance is the main risk in this system, not the color/type choices.
