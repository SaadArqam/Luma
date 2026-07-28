# Dark Gradient Fintech Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Luma's current dark glassmorphic terracotta theme with a dark, bold, gradient-driven fintech aesthetic, unify all account-selection/browsing UI into one `AccountCardStack` component, and wire it into Home, Add Expense, Accounts, and Expenses — fully responsive from 360px to 2560px+.

**Architecture:** Phase 1 replaces theme tokens in place (`app/globals.css`, `app/layout.tsx`, `lib/category-colors.ts`, `.claude/DESIGN-luma.md`) without touching any screen component, so every existing component picks up the new palette/font for free. Phase 2 builds `AccountCardStack` in isolation against mock data. Phases 3–4 swap it into the four real screens and restyle the pieces those phases name.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (CSS-native config, no `tailwind.config.*`), `next/font/google`, Supabase.

**Spec:** `docs/superpowers/specs/2026-07-28-dark-gradient-redesign-design.md` — read it first; this plan implements it and does not repeat its reconciliation notes.

## Global Constraints

- No `npm install` / no new dependencies — `node_modules` is already populated for this repo and must stay as-is. If a task seems to need a new package, stop and flag it instead of installing.
- No automated test runner exists in this repo (no jest/vitest/playwright in `package.json`) and none may be added. "Run the test" steps below use `npx --no-install tsc --noEmit`, `npx --no-install eslint <paths>`, and (for CSS output) a throwaway PostCSS compile-and-grep script — never a dev server.
- Visual/behavioral verification (does it actually look right, does the carousel actually scroll-snap on a touchscreen) cannot be done by the implementer — state explicitly in each task's report which checks were run (type-check/lint/compile) versus what must be handed to the user to verify visually, and at which of the four widths: **375px, 768px, 1440px, 2560px**.
- Every phase must state fluid-unit usage (`rem`/`%`/`clamp()`) and carousel breakpoint behavior (mobile single-peek vs. tablet/desktop multi-card) explicitly in its own report — do not assume it "carries over" from an earlier phase without re-confirming against the actual rendered page.
- Reuse the existing `tablet:` Tailwind variant (835px, defined as `--breakpoint-tablet` in `app/globals.css`) as the carousel's mobile→multi-card breakpoint — this is the app's one existing breakpoint (used for the dock/sidebar switch already), do not introduce a second custom breakpoint.
- Never hardcode a color hex/rgba in a component — use a Tailwind utility (`bg-luma-raised`, `text-luma-muted`, etc.) or `var(--luma-*)` / `var(--gradient-*)`, per the existing repo convention documented in `app/globals.css:7-22`.

---

## Phase 1 — Design tokens

### Task 1: Replace theme tokens (colors, gradients, fonts)

**Files:**
- Modify: `app/globals.css:1-148` (token block + `@theme inline` mappings + typography utilities at lines 164-241)
- Modify: `app/layout.tsx:1-18,24-27,84` (font import + `themeColor`)

**Interfaces:**
- Produces: `--gradient-primary`, `--gradient-secondary`, `--gradient-tertiary` (CSS custom properties, usable as `background: var(--gradient-primary)` or inside `linear-gradient()`-consuming Tailwind arbitrary values); `--font-display` (Unbounded) and `--font-body` (Inter) as `@theme inline` font tokens, consumable as the Tailwind utilities `font-display` / `font-sans`; all existing `--luma-*` variable **names** unchanged (so none of the ~150 existing call sites across the app need editing), only their **values** change.
- Consumes: nothing (this is the first task).

**Decisions locked for this task** (beyond the literal prompt text — flag in the Phase 1 report so the user can veto before Phase 2 starts):
- Existing `--luma-*` variable *names* are kept and re-valued in place, rather than introduced under new names — every one of the ~150 existing `bg-luma-*`/`text-luma-*`/`var(--luma-*)` call sites across the app then picks up the new palette with zero component edits, which is how a "tokens-only" Phase 1 can achieve "touches nearly every screen" without touching any screen file.
- `--luma-accent` (and its `-pressed`/`-glow`/`-border`/`-shadow` derivatives) moves from the old muted terracotta (`#ED7D3F`) to `#FF6B35` — the leading color of `--gradient-primary` — so flat-accent UI (focus rings, selected pill borders, small glows) reads as part of the same new family instead of clashing with it. `--luma-success`/`-warning`/`-danger`/`-info` are unchanged (nothing in the prompt asks for new status colors).
- `--luma-hairline` moves from a translucent white overlay (`rgba(255,255,255,0.14)`) to the prompt's literal solid `#1a1a20`, matching "border/divider #1a1a20" as given rather than approximating it with an alpha blend.
- `--luma-text`/`-muted`/`-faint` are unchanged — nothing asks for new text colors and warm off-white still reads correctly on the new near-black canvas.
- The `.font-fraunces` utility class (61 call sites across `components/` and `app/`, per `grep -rn "font-fraunces" components app`) keeps its class **name** but its `font-family` value changes to Unbounded — renaming the class itself would require touching all 61 call sites, which is exactly the component-editing the original prompt's Phase 1 explicitly deferred ("Report back... before touching any components"). New code written in Phase 2+ should use the `font-display` utility directly, not `font-fraunces`.
- `.btn-primary-luma`'s `background-color` becomes `background: var(--gradient-primary)` — this is literally "primary CTA, save buttons" from the prompt's gradient-primary description, and this one class already covers every primary button in the app (Add Expense submit, Account save, etc.), so this single-rule change satisfies that requirement without touching component files.
- Typography utilities (`.text-header-display/-section/-card`, `.text-number-card/-inline`, and a new `.text-number-hero`) switch from fixed `px` to `clamp()`-based `rem` sizes, since Unbounded headline/number sizing must scale fluidly per the cross-cutting responsive requirement — not because any one screen asks for it yet.

- [ ] **Step 1: Update the font import in `app/layout.tsx`**

Replace:
```tsx
import { Fraunces, Inter } from "next/font/google";
...
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
```
with:
```tsx
import { Unbounded, Inter } from "next/font/google";
...
const unbounded = Unbounded({
  variable: "--font-unbounded",
  weight: ["500", "700", "800", "900"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
```

And update the `<html>` tag's `className`:
```tsx
      className={`dark ${unbounded.variable} ${inter.variable} antialiased`}
```

And update the `themeColor` meta (keep in sync with the new canvas value, per the existing comment at `app/layout.tsx:21-23`):
```tsx
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0F" },
    { media: "(prefers-color-scheme: light)", color: "#0B0B0F" },
  ],
```

- [ ] **Step 2: Replace the `:root` color block in `app/globals.css:23-48`**

```css
:root {
  --luma-canvas: #0B0B0F;
  --luma-glass: rgba(22, 22, 29, 0.75);
  --luma-glass-thin: rgba(22, 22, 29, 0.48);
  --luma-glass-thick: rgba(22, 22, 29, 0.88);
  --luma-surface: #16161D;
  --luma-raised: #1E1E26;
  --luma-hairline: #1a1a20;
  --luma-hairline-strong: #26262E;
  --luma-specular: rgba(255, 255, 255, 0.09);
  --luma-text: #F5F1EA;
  --luma-muted: #9C99A2;
  --luma-faint: #6C6A73;
  --luma-accent: #FF6B35;
  --luma-accent-pressed: #E0552A;
  --luma-accent-glow: rgba(255, 107, 53, 0.28);
  --luma-accent-border: rgba(255, 107, 53, 0.55);
  --luma-accent-shadow: rgba(255, 107, 53, 0.45);
  --luma-success: #6FC49B;
  --luma-success-glow: rgba(111, 196, 155, 0.22);
  --luma-warning: #EFA84A;
  --luma-warning-glow: rgba(239, 168, 74, 0.22);
  --luma-danger: #D65458;
  --luma-danger-glow: rgba(214, 84, 88, 0.22);
  --luma-info: #8AA9C4;

  --gradient-primary: linear-gradient(135deg, #FF6B35 0%, #FF3D8A 100%);
  --gradient-secondary: linear-gradient(135deg, #4361EE 0%, #7B2FF7 100%);
  --gradient-tertiary: linear-gradient(135deg, #FFB800 0%, #FF8A00 100%);
}
```

- [ ] **Step 3: Add gradient tokens to the first `@theme inline` block, `app/globals.css:50-75`**

Add these three lines inside the existing block (anywhere among the other `--color-luma-*` lines):
```css
  --color-gradient-primary: var(--gradient-primary);
  --color-gradient-secondary: var(--gradient-secondary);
  --color-gradient-tertiary: var(--gradient-tertiary);
```
(Tailwind v4 can't turn a `linear-gradient()` value into a `bg-*` utility via `@theme inline` the way it does flat colors, so these three exist for discoverability/documentation only — Phase 2+ code applies gradients via inline `style={{ background: 'var(--gradient-primary)' }}`, same pattern already used throughout the codebase for `var(--luma-accent-glow)` etc.)

- [ ] **Step 4: Repoint fonts in the second `@theme inline` block, `app/globals.css:77-122`**

Replace:
```css
  --font-sans: var(--font-inter), Inter, system-ui, sans-serif;
  --font-serif: var(--font-fraunces), Fraunces, Georgia, serif;
  --font-mono: var(--font-inter), Inter, system-ui, sans-serif;
  --font-heading: var(--font-fraunces), Fraunces, Georgia, serif;
```
with:
```css
  --font-sans: var(--font-inter), Inter, system-ui, sans-serif;
  --font-serif: var(--font-unbounded), Unbounded, system-ui, sans-serif;
  --font-mono: var(--font-inter), Inter, system-ui, sans-serif;
  --font-heading: var(--font-unbounded), Unbounded, system-ui, sans-serif;
  --font-display: var(--font-unbounded), Unbounded, system-ui, sans-serif;
  --font-body: var(--font-inter), Inter, system-ui, sans-serif;
```
(`--font-serif`/`--font-heading` stay mapped, now to Unbounded, so the two existing shadcn call sites at `components/ui/dialog.tsx:125` and `components/ui/card.tsx:41` — both use the `font-heading` utility — pick up Unbounded with no edit. `--font-display`/`--font-body` are the new names Phase 2+ code should use directly.)

- [ ] **Step 5: Update the shadcn semantic alias block, `app/globals.css:127-148`**

No changes needed to this block's structure — it already aliases to `var(--luma-*)` names, which Step 2 re-valued. Confirm by inspection that no line in this block contains a literal hex/rgba (only `var(--luma-*)` references) — if the confirm fails, that's a pre-existing violation of the file's own documented rule (`app/globals.css:12`), fix it as part of this task rather than leaving it.

- [ ] **Step 6: Update typography utilities, `app/globals.css:164-241`**

Replace the block from `.font-fraunces` through `.text-body-muted-luma` with:
```css
.font-fraunces {
  font-family: var(--font-display), Unbounded, system-ui, sans-serif;
}

.font-inter {
  font-family: var(--font-body), Inter, system-ui, sans-serif;
}

.font-tnum {
  font-feature-settings: 'tnum' 1;
  font-variant-numeric: tabular-nums;
}

.text-header-display {
  font-family: var(--font-display), Unbounded, system-ui, sans-serif;
  font-size: clamp(1.75rem, 1.5rem + 1vw, 2.25rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.2px;
}

.text-header-section {
  font-family: var(--font-display), Unbounded, system-ui, sans-serif;
  font-size: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.1px;
}

.text-header-card {
  font-family: var(--font-display), Unbounded, system-ui, sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.3;
}

.text-number-hero {
  font-family: var(--font-display), Unbounded, system-ui, sans-serif;
  font-size: clamp(2rem, 1.6rem + 2vw, 2.75rem);
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.5px;
  font-feature-settings: 'tnum' 1;
  font-variant-numeric: tabular-nums;
}

.text-number-card {
  font-family: var(--font-display), Unbounded, system-ui, sans-serif;
  font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.625rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.3px;
  font-feature-settings: 'tnum' 1;
  font-variant-numeric: tabular-nums;
}

.text-number-inline {
  font-family: var(--font-display), Unbounded, system-ui, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.3;
  font-feature-settings: 'tnum' 1;
  font-variant-numeric: tabular-nums;
}

.text-body-luma {
  font-family: var(--font-body), Inter, system-ui, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
}

.text-caption-luma {
  font-family: var(--font-body), Inter, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.1px;
}

.text-body-muted-luma {
  font-family: var(--font-body), Inter, system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  color: var(--luma-muted);
}
```
(`.text-number-hero` is new — added for Phase 2's `AccountCardStack` balance figure and any other hero-sized number; it did not exist as a utility before, only as a YAML entry in `DESIGN-luma.md`.)

- [ ] **Step 7: Update the primary button gradient, `app/globals.css:274-297`**

In `.btn-primary-luma`, replace:
```css
  background-color: var(--luma-accent);
```
with:
```css
  background: var(--gradient-primary);
```
Leave every other line (padding, radius, box-shadow using `--luma-accent-shadow`, the `:active` state) unchanged — the glow still comes from the flat accent color beneath the gradient fill, which is the existing intended effect (`app/globals.css:290`, `.btn-primary-luma:active` at `app/globals.css:293-297`).

- [ ] **Step 8: Verify TypeScript and lint**

Run: `npx --no-install tsc --noEmit`
Expected: same baseline failures as documented in prior verification (one `lib/sendPush.ts` TS2307 for `web-push`), no new errors. If a new error appears, it's a regression from this step — fix before continuing.

Run: `npx --no-install eslint app components lib`
Expected: same baseline ~62 problems as prior verification, no new ones introduced by this task (this task doesn't touch any `.tsx` besides `app/layout.tsx`'s import lines, so a new eslint error would point at a typo there).

- [ ] **Step 9: Verify the compiled CSS actually contains the new tokens**

Since there's no dev server to load in this task, compile `app/globals.css` through PostCSS directly and grep the output. Write a throwaway script (delete after running):

```js
// scratch-compile-check.mjs (repo root, delete after use)
import postcss from 'postcss'
import tailwindPostcss from '@tailwindcss/postcss'
import { readFileSync, writeFileSync } from 'node:fs'

const css = readFileSync('app/globals.css', 'utf8')
const result = await postcss([tailwindPostcss()]).process(css, { from: 'app/globals.css' })
writeFileSync('scratch-compiled.css', result.css)
```

Run: `node scratch-compile-check.mjs`
Then check the output for the new tokens:
```bash
grep -c "gradient-primary" scratch-compiled.css
grep -c "0B0B0F" scratch-compiled.css
grep -c "unbounded\|Unbounded" scratch-compiled.css
```
Expected: each returns a count ≥ 1. (Recall: utilities land inside `@layer utilities`, so don't anchor a grep with `^\.` or it will look like a false failure — a plain substring grep as above is safe.)

Delete `scratch-compile-check.mjs` and `scratch-compiled.css` once confirmed — they're not part of the app.

- [ ] **Step 10: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: replace theme tokens with gradient-driven dark palette

Repoints existing --luma-* token values (not names) to the new
near-black/gradient palette, swaps Fraunces for Unbounded via the
same font-heading/font-serif aliases, and switches typography
utilities to clamp()-based fluid sizing."
```

### Task 2: Add curated category chip colors

**Files:**
- Modify: `lib/category-colors.ts` (append only — do not change existing exports)

**Interfaces:**
- Consumes: nothing new (pure module, no imports needed beyond what's already there).
- Produces: `getCategoryChipColors(name: string): { bg: string; text: string }`, `CATEGORY_CHIP_COLORS: Record<string, { bg: string; text: string }>`. Existing `getCategoryColor(key: string): string` and `CATEGORY_PALETTE` are untouched and still used by `components/DashboardChart.tsx:29`, `components/BankLogo.tsx:66`, `components/CategoryList.tsx:109` — Phase 3/4 tasks are the ones that call `getCategoryChipColors`, not this task.

- [ ] **Step 1: Append the curated map and lookup function**

Add to the end of `lib/category-colors.ts`:
```ts
/**
 * Curated bg/text pairs for the category CHIP UI (Add Expense category
 * select, Expenses filter) — distinct from CATEGORY_PALETTE above, which is
 * for data-viz/avatar single-hex fills. Keyed by category name (case-
 * insensitive); anything not listed falls back to a neutral gray so a
 * newly-created category never renders unstyled.
 */
export const CATEGORY_CHIP_COLORS: Record<string, { bg: string; text: string }> = {
  food: { bg: '#412402', text: '#FAC775' },
  transport: { bg: '#04342C', text: '#5DCAA5' },
  travel: { bg: '#0B2A4B', text: '#6FA8DC' },
  tiffin: { bg: '#4B1528', text: '#ED93B1' },
  shopping: { bg: '#26215C', text: '#AFA9EC' },
}

const CATEGORY_CHIP_FALLBACK = { bg: '#2A2A2E', text: '#9C9CA3' }

export function getCategoryChipColors(name: string): { bg: string; text: string } {
  if (!name) return CATEGORY_CHIP_FALLBACK
  return CATEGORY_CHIP_COLORS[name.trim().toLowerCase()] ?? CATEGORY_CHIP_FALLBACK
}
```

- [ ] **Step 2: Verify TypeScript and lint**

Run: `npx --no-install tsc --noEmit`
Expected: same baseline as Task 1 Step 8, no new errors.

Run: `npx --no-install eslint lib`
Expected: no new problems in `lib/category-colors.ts`.

- [ ] **Step 3: Verify behavior by inspection**

No test runner exists to execute this, so verify by tracing the function against its own table (write this trace into the commit body or PR description, not into the source file):
- `getCategoryChipColors('Food')` → `{ bg: '#412402', text: '#FAC775' }` (case-insensitive match)
- `getCategoryChipColors('groceries')` → `{ bg: '#2A2A2E', text: '#9C9CA3' }` (fallback, not in map)
- `getCategoryChipColors('')` → fallback
State explicitly in the task report that this was verified by code inspection, not execution — real rendering verification happens in Phase 3 once a component actually calls this function.

- [ ] **Step 4: Commit**

```bash
git add lib/category-colors.ts
git commit -m "feat: add curated category chip colors alongside existing hash palette

getCategoryChipColors is additive — DashboardChart/BankLogo/CategoryList
keep using the existing hash-based getCategoryColor, which still needs
a single raw hex none of those three can use a bg/text pair for."
```

### Task 3: Rewrite `.claude/DESIGN-luma.md`

**Files:**
- Modify: `.claude/DESIGN-luma.md` (full rewrite of `colors:`, `typography:`, add a `category-chip` component entry; `chart-categorical` and all other `components:` entries stay as-is)

**Interfaces:**
- Consumes: the exact token values from Task 1 Step 2 and Task 2 Step 1 — this doc must mirror them 1:1, per its own stated purpose (`app/globals.css:7-10`).
- Produces: nothing consumed by other tasks — this is documentation, not code.

- [ ] **Step 1: Update the `colors:` block**

Replace `.claude/DESIGN-luma.md:6-30` with:
```yaml
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
```

- [ ] **Step 2: Update the `typography:` block**

Replace `.claude/DESIGN-luma.md:48-110` (the entire `typography:` block) with:
```yaml
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
```
(`header-card` and `number-inline` stay fixed-px, not `clamp()`, matching Task 1 Step 6's CSS exactly — both are small enough at 15px that fluid scaling isn't needed. `clamp()` min values above are each the CSS min converted to px and reduced by the vw coefficient's contribution at 0 viewport width, matching the `rem`-based clamp() expressions in Task 1 Step 6 — e.g. `header-display`'s CSS is `clamp(1.75rem, 1.5rem + 1vw, 2.25rem)`, i.e. `clamp(28px, 24px + 1vw, 36px)` at the browser default 16px root.)

- [ ] **Step 3: Add a `category-chip` component entry**

Insert into the `components:` block (after the existing `category-chip:` entry at `.claude/DESIGN-luma.md:145-146`), documenting that there are now two category color systems:
```yaml
  category-chip:
    description: "Pill-shaped, used in category grids and the expense-form category select. Colors come from lib/category-colors.ts's getCategoryChipColors(name) — a curated {bg, text} map (Food/Transport/Travel/Tiffin/Shopping), gray fallback for any other category name. This is separate from chart-categorical below: that one is the hash-based getCategoryColor(key), still used for chart fills and bank-avatar backgrounds, which need a single raw hex rather than a bg/text pair."
```

- [ ] **Step 4: Update the Do/Don't section**

In `.claude/DESIGN-luma.md:163-168`, the line `Don't add a second accent color for "variety"` still holds for the single flat `--luma-accent`, but add one line acknowledging gradients now exist for money surfaces specifically:
```markdown
- Gradients (`{colors.gradient-primary/secondary/tertiary}`) are reserved for money surfaces — the account card stack and primary CTA/save buttons — not general UI chrome. Everything else still uses the single flat `{colors.accent}`, unchanged from the single-accent rule above.
```

- [ ] **Step 5: Read the full diff for internal consistency**

Confirm every `fontSize`/`fontFamily` pair in the rewritten `typography:` block matches the corresponding CSS utility written in Task 1 Step 6 exactly (same clamp range, same weight). Confirm no leftover reference to Fraunces or to the old hex values (`#1B1C21`, `#2A2B32`, `#35363F`, `#ED7D3F`) remains anywhere in the file.

- [ ] **Step 6: Commit**

```bash
git add .claude/DESIGN-luma.md
git commit -m "docs: update DESIGN-luma.md for the gradient theme and category chips

Mirrors app/globals.css 1:1 per this doc's own stated purpose, and
documents the new curated category-chip color system alongside the
unchanged hash-based chart-categorical one."
```

---

**Phase 1 stop point.** Report back: the diff for all four files, which of the four widths (375/768/1440/2560px) you visually spot-checked yourself (likely none, per the no-dev-server constraint — say so explicitly) versus which the user needs to check, and the two flagged "decisions locked for this task" callouts from Task 1 for the user to confirm or veto before Phase 2 begins.

---

## Phase 2 — Reusable swipeable card component

### Task 4: Build `AccountCardStack`

**Files:**
- Create: `components/AccountCardStack.tsx`
- Create: `app/dev/account-card-stack/page.tsx` (throwaway mock-data demo route for the Phase 2 review — delete in Phase 3 Task 5 once real wiring replaces it)

**Interfaces:**
- Consumes: `BankLogo` from `components/BankLogo.tsx` (existing, signature `{ name: string; domain?: string | null; size?: number }`); `.text-number-hero` / `.text-number-card` utilities and `--gradient-primary/secondary/tertiary` from Phase 1.
- Produces:
```ts
export type AccountCardData = {
  id: string
  name: string
  bank_name: string | null
  bank_domain: string | null
  balance: number
  /** e.g. account_type label, or "Combined" for a synthetic total card */
  subtitle: string
  /** masked account number or type label shown under the name, e.g. "•••• 4821" */
  maskedLabel?: string
}

export function AccountCardStack({
  accounts,
  variant,
  selectedId,
  onSelect,
  onActiveCardAction,
}: {
  accounts: AccountCardData[]
  variant: 'full' | 'mini'
  /** controlled selection, e.g. the Add Expense form's accountId */
  selectedId?: string
  onSelect?: (id: string) => void
  /** called when the user taps/clicks the currently-active card (Phase 4's edit/delete/make-default sheet trigger) */
  onActiveCardAction?: (id: string) => void
}): JSX.Element
```
This is the only export other tasks import. `formatINR` is duplicated locally (same one-line implementation already duplicated in `components/BalanceCard.tsx:16-18` and `components/AccountsManager.tsx:14-17` — following that existing pattern rather than introducing a new shared util module for one function).

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { BankLogo } from '@/components/BankLogo'

export type AccountCardData = {
  id: string
  name: string
  bank_name: string | null
  bank_domain: string | null
  balance: number
  subtitle: string
  maskedLabel?: string
}

const GRADIENTS = ['var(--gradient-primary)', 'var(--gradient-secondary)', 'var(--gradient-tertiary)']
const FALLBACK_GRADIENT = 'linear-gradient(135deg, #2A2A2E 0%, #1a1a20 100%)'

function formatINR(n: number): string {
  return `${n < 0 ? '-' : ''}₹${Math.abs(n).toLocaleString('en-IN')}`
}

function gradientForIndex(index: number): string {
  return GRADIENTS[index] ?? FALLBACK_GRADIENT
}

export function AccountCardStack({
  accounts,
  variant,
  selectedId,
  onSelect,
  onActiveCardAction,
}: {
  accounts: AccountCardData[]
  variant: 'full' | 'mini'
  selectedId?: string
  onSelect?: (id: string) => void
  onActiveCardAction?: (id: string) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const syncActiveFromScroll = useCallback(() => {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex((prev) => (prev === index ? prev : index))
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', syncActiveFromScroll, { passive: true })
    return () => el.removeEventListener('scroll', syncActiveFromScroll)
  }, [syncActiveFromScroll])

  const scrollToIndex = (index: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(index, accounts.length - 1))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  const handleCardClick = (account: AccountCardData, index: number) => {
    if (variant === 'mini') {
      onSelect?.(account.id)
    } else if (index === activeIndex) {
      onActiveCardAction?.(account.id)
    }
    scrollToIndex(index)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(index - 1) }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(accounts[index], index) }
  }

  const cardHeight = variant === 'full' ? 155 : 78

  return (
    <div className="space-y-2">
      <div
        ref={trackRef}
        role={variant === 'mini' ? 'radiogroup' : 'region'}
        aria-label="Accounts"
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
      >
        {accounts.map((account, index) => {
          const isSelected = variant === 'mini' ? account.id === selectedId : index === activeIndex
          return (
            <button
              key={account.id}
              type="button"
              role={variant === 'mini' ? 'radio' : undefined}
              aria-checked={variant === 'mini' ? isSelected : undefined}
              tabIndex={0}
              onClick={() => handleCardClick(account, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="shrink-0 rounded-[20px] p-4 text-left tablet:w-[320px]"
              style={{
                scrollSnapAlign: 'center',
                width: variant === 'mini' ? 'calc(60% - 12px)' : 'calc(100% - 48px)',
                height: cardHeight,
                background: gradientForIndex(index),
                opacity: variant === 'mini' && !isSelected ? 0.55 : 1,
                transform: variant === 'mini' && !isSelected ? 'scale(0.94)' : 'scale(1)',
                transition: 'opacity 200ms ease, transform 200ms ease',
              }}
            >
              <div className="flex items-center gap-2">
                <BankLogo name={account.bank_name || account.name} domain={account.bank_domain} size={variant === 'full' ? 28 : 20} />
                <span className="font-display text-sm font-medium truncate" style={{ color: '#0B0B0F' }}>
                  {account.name}
                </span>
              </div>
              {account.maskedLabel && variant === 'full' && (
                <div className="text-xs mt-1" style={{ color: 'rgba(11,11,15,0.65)' }}>{account.maskedLabel}</div>
              )}
              {variant === 'full' && (
                <div className="text-number-hero" style={{ color: '#0B0B0F', marginTop: 8 }}>
                  {formatINR(account.balance)}
                </div>
              )}
              {variant === 'full' && (
                <div className="text-xs mt-1" style={{ color: 'rgba(11,11,15,0.65)' }}>{account.subtitle}</div>
              )}
            </button>
          )
        })}
      </div>
      {variant === 'full' && accounts.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {accounts.map((account, index) => (
            <span
              key={account.id}
              aria-hidden="true"
              className="rounded-full transition-all"
              style={{
                width: index === activeIndex ? 16 : 6,
                height: 6,
                backgroundColor: index === activeIndex ? 'var(--luma-accent)' : 'var(--luma-hairline-strong)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

Note on the responsive requirement: mobile card width is `calc(100% - 48px)` (full) / `calc(60% - 12px)` (mini) so the next card visibly peeks at the edge; at the `tablet:` breakpoint (835px) it switches to a fixed `320px` — an explicit breakpoint change via the Tailwind `tablet:w-[320px]` class, not fluid scaling, matching the spec's explicit requirement that this be a breakpoint switch rather than continuous scaling.

- [ ] **Step 2: Build the mock-data demo page**

```tsx
// app/dev/account-card-stack/page.tsx
'use client'

import { useState } from 'react'
import { AccountCardStack, type AccountCardData } from '@/components/AccountCardStack'

const MOCK_ACCOUNTS: AccountCardData[] = [
  { id: 'total', name: 'Combined', bank_name: null, bank_domain: null, balance: 184320, subtitle: '3 accounts' },
  { id: 'a1', name: 'HDFC Salary', bank_name: 'HDFC Bank', bank_domain: 'hdfcbank.com', balance: 92150, subtitle: 'Savings', maskedLabel: '•••• 4821' },
  { id: 'a2', name: 'ICICI Daily', bank_name: 'ICICI Bank', bank_domain: 'icicibank.com', balance: 61200, subtitle: 'Savings', maskedLabel: '•••• 1190' },
  { id: 'a3', name: 'Cash', bank_name: null, bank_domain: null, balance: 30970, subtitle: 'Cash', maskedLabel: undefined },
]

export default function AccountCardStackDemoPage() {
  const [selected, setSelected] = useState(MOCK_ACCOUNTS[1].id)
  return (
    <div className="p-4 space-y-8 max-w-3xl mx-auto">
      <section>
        <h2 className="text-header-section mb-3">variant=&quot;full&quot;</h2>
        <AccountCardStack accounts={MOCK_ACCOUNTS} variant="full" onActiveCardAction={(id) => alert(`action sheet for ${id}`)} />
      </section>
      <section>
        <h2 className="text-header-section mb-3">variant=&quot;mini&quot;</h2>
        <AccountCardStack
          accounts={MOCK_ACCOUNTS.slice(1)}
          variant="mini"
          selectedId={selected}
          onSelect={setSelected}
        />
        <p className="text-body-muted-luma mt-2">selected: {selected}</p>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript and lint**

Run: `npx --no-install tsc --noEmit`
Expected: no new errors beyond the Task 1 baseline.

Run: `npx --no-install eslint app components`
Expected: no new problems in `components/AccountCardStack.tsx` or `app/dev/account-card-stack/page.tsx`.

- [ ] **Step 4: Hand off for visual/behavioral verification**

State explicitly in the report: this was NOT run in a browser. The user should open `/dev/account-card-stack` and check, at 375px/768px/1440px/2560px:
- Mobile: next card visibly peeks at the right edge; scroll-snap lands centered; dots track the active card.
- At/above 835px: cards switch to a fixed 320px width with more than one visible at once, not one card stretched wide.
- Keyboard: focus a card, press ArrowRight/ArrowLeft to move between cards, Enter/Space to select (mini) or open the action callback (full, on the already-active card).
- `mini` variant: unselected cards are visibly de-emphasized (dimmer, slightly scaled down) versus the selected one.

- [ ] **Step 5: Commit**

```bash
git add components/AccountCardStack.tsx app/dev/account-card-stack/
git commit -m "feat: add AccountCardStack component with mock-data demo route

Shared full/mini variant carousel meant to replace BalanceCard,
AccountPicker, and AccountsManager's vertical list in Phases 3-4.
Demo route at /dev/account-card-stack is throwaway, removed once
real wiring lands."
```

---

**Phase 2 stop point.** Report back the component file and demo route; ask the user to check it on-device/devtools at the four widths per Step 4 before Phase 3 begins.

---

## Phase 3 — Wire into Home and Add Expense

### Task 5: Wire `AccountCardStack` into Home

**Files:**
- Modify: `app/page.tsx` (replace `BalanceCard` usage, restyle stat card numbers and expense amounts)
- Delete: `app/dev/account-card-stack/` (mock demo route from Task 4, no longer needed once real data is wired)
- `components/BalanceCard.tsx` becomes dead code after this task — do not delete it yet. It's removed in Task 9 Step 2, once Task 6 has also confirmed `AccountPicker`'s function export is unused, so both removals happen together.

**Interfaces:**
- Consumes: `AccountCardStack`, `AccountCardData` from Task 4; `getAccountsWithBalances` / `AccountWithBalance` from `lib/accounts.ts` (existing, unchanged).
- Produces: nothing new consumed elsewhere.

- [ ] **Step 1: Read the current Home data flow**

`app/page.tsx` currently calls `getAccountsWithBalances` and passes `total`/`accounts` to `<BalanceCard>` (per the existing pattern documented in `components/BalanceCard.tsx:20-27`). Locate that exact call and the `<BalanceCard total={...} accounts={...} />` JSX before editing.

- [ ] **Step 2: Map account data to `AccountCardData` and render the stack**

Replace the `<BalanceCard total={total} accounts={accountRows} />` usage with:
```tsx
const accountCards: AccountCardData[] = [
  {
    id: 'total',
    name: 'Combined',
    bank_name: null,
    bank_domain: null,
    balance: total,
    subtitle: `${accountsWithBalances.length} ${accountsWithBalances.length === 1 ? 'account' : 'accounts'}`,
  },
  ...accountsWithBalances.map((a) => ({
    id: a.id,
    name: a.name,
    bank_name: a.bank_name,
    bank_domain: a.bank_domain,
    balance: a.balance,
    subtitle: a.account_type,
  })),
]
```
placed where `total` and the per-account rows are already computed for `BalanceCard`, then render:
```tsx
<AccountCardStack accounts={accountCards} variant="full" />
```
in the same grid position `BalanceCard` occupied (`col-span-2` in the stat grid). Add `import { AccountCardStack, type AccountCardData } from '@/components/AccountCardStack'` and remove the now-unused `BalanceCard` import.

- [ ] **Step 3: Restyle stat card numbers and expense amounts to the display font**

In `app/page.tsx`, find the small stat cards (Credited / This Month / Transactions) and the Recent Expenses amount column. Any of these using `font-inter font-bold font-tnum` for the number itself should use `.text-number-card` (which after Task 1 Step 6 is Unbounded, clamp-sized, still tabular) instead — e.g. a stat value currently rendered as:
```tsx
<span className="font-inter font-bold font-tnum text-2xl text-luma-text">{value}</span>
```
becomes:
```tsx
<span className="text-number-card text-luma-text">{value}</span>
```
Do this for every stat number and every expense-amount number in `app/page.tsx` — labels/captions around them keep their existing classes.

- [ ] **Step 4: Delete the throwaway demo route**

```bash
git rm -r app/dev/account-card-stack
```

- [ ] **Step 5: Verify TypeScript and lint**

Run: `npx --no-install tsc --noEmit`
Expected: no new errors.

Run: `npx --no-install eslint app`
Expected: no new problems.

- [ ] **Step 6: Hand off for visual verification**

State explicitly: not run in a browser. User checks `/` at 375/768/1440/2560px — combined total is the first card, one card per real account follows, stat card numbers and expense amounts now render in Unbounded, and the rest of Home's layout (quick actions, recent expenses list) is otherwise unchanged.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "feat: replace Home's BalanceCard with AccountCardStack

First card is the combined total, followed by one real account per
card. Stat numbers and expense amounts now use the Unbounded-backed
text-number-card utility."
```

### Task 6: Wire `AccountCardStack` into Add Expense and category chips

**Files:**
- Modify: `components/ExpenseManager.tsx` (replace `<AccountPicker>` usage; category select items get chip colors)

**Interfaces:**
- Consumes: `AccountCardStack`, `AccountCardData` from Task 4; `getCategoryChipColors` from Task 2; existing `AccountOption` type from `lib/accounts.ts`.

- [ ] **Step 1: Map `AccountOption[]` to `AccountCardData[]`**

`ExpenseManager` receives `accounts: AccountOption[]` (no `balance`/`account_type` — that type is deliberately balance-free per `lib/accounts.ts:123-133`). `AccountCardStack`'s `mini` variant (Task 4) never renders the balance figure at all — only `full` does — so there's no fake `₹0` to worry about; pass `balance: 0` purely to satisfy the `AccountCardData` type, and `subtitle: a.name` since the mini card doesn't render `subtitle` either (also `full`-only).

- [ ] **Step 2: Replace the `<AccountPicker>` call site**

In `components/ExpenseManager.tsx:309-314`, replace:
```tsx
<AccountPicker
  id="expense-account"
  accounts={accounts}
  value={accountId}
  onChange={setAccountId}
/>
```
with:
```tsx
<AccountCardStack
  accounts={accounts.map((a) => ({
    id: a.id,
    name: a.name,
    bank_name: a.bank_name,
    bank_domain: a.bank_domain,
    balance: 0,
    subtitle: a.name,
  }))}
  variant="mini"
  selectedId={accountId}
  onSelect={setAccountId}
/>
```
Remove the now-unused `import { AccountPicker, AccountTag } from '@/components/AccountPicker'` — replace with `import { AccountTag } from '@/components/AccountPicker'` (still used at `components/ExpenseManager.tsx:430,479` for the transaction-row tag) plus `import { AccountCardStack } from '@/components/AccountCardStack'`.

The existing pre-selection logic at `components/ExpenseManager.tsx:37` (`accounts.find((a) => a.is_default)?.id ?? accounts[0]?.id ?? ''`) is untouched — it still sets the initial `accountId` state; only the control rendering it changed.

- [ ] **Step 3: Apply chip colors to the category select**

In `components/ExpenseManager.tsx:206-213` (the `<SelectItem>` list for the Add Expense category dropdown), wrap the icon+name span with chip coloring:
```tsx
{categoryList.map(cat => {
  const chip = getCategoryChipColors(cat.name)
  return (
    <SelectItem key={cat.id} value={cat.id}>
      <span
        className="flex items-center gap-2 rounded-full px-2 py-0.5"
        style={{ backgroundColor: chip.bg, color: chip.text }}
      >
        <span>{cat.icon}</span>
        <span>{cat.name}</span>
      </span>
    </SelectItem>
  )
})}
```
Add `import { getCategoryChipColors } from '@/lib/category-colors'` alongside the existing `getCategoryColor` import (both are used in this file now — `getCategoryColor` stays for the Recent Expenses category dot at `components/ExpenseManager.tsx:465-468`, which is unchanged by this task).

- [ ] **Step 4: Verify TypeScript and lint**

Run: `npx --no-install tsc --noEmit`
Expected: no new errors. If `AccountPicker`'s `AccountTag` import path or the removed `AccountPicker` import causes an unused-import lint warning, fix it.

Run: `npx --no-install eslint components`
Expected: no new problems.

- [ ] **Step 5: Hand off for visual verification**

State explicitly: not run in a browser. User checks Add Expense at 375/768/1440/2560px — account mini-cards scroll horizontally, selecting one sets the same `accountId` the old picker did (confirm by submitting an expense and checking it lands on the right account), the default/first account is still pre-selected on load, and the category dropdown's options now show colored chips instead of a plain dot.

- [ ] **Step 6: Commit**

```bash
git add components/ExpenseManager.tsx
git commit -m "feat: wire AccountCardStack mini variant into Add Expense

Replaces AccountPicker while preserving the existing is_default-first
preselection logic. Category select now shows curated chip colors."
```

---

**Phase 3 stop point.** Report back: diffs for `app/page.tsx`, `components/ExpenseManager.tsx`, `components/AccountCardStack.tsx`; confirm account balance/selection data is real (not mock); explicitly flag that submitting a real expense against the new mini-card selector should be checked by the user before Phase 4 (the pre-selection logic wasn't changed, but the control that sets it was fully swapped, so it's worth an explicit real-submit check, not just a visual one).

---

## Phase 4 — Accounts page + Expenses filter fixes

### Task 7: Replace `AccountsManager`'s vertical list with the carousel + action sheet

**Files:**
- Modify: `components/AccountsManager.tsx` (replace the vertical `.map` list with `AccountCardStack variant="full"`, move edit/delete/make-default into a sheet/modal triggered by tapping the active card, add scoped recent-transactions list, keep the existing "Add account" affordance and `AccountForm`)

**Interfaces:**
- Consumes: `AccountCardStack` from Task 4; existing `AccountForm` (defined in the same file, `components/AccountsManager.tsx:310-402`, unchanged); existing `handleEditSave`/`makeDefault`/`handleDelete`/`startEdit` handlers (unchanged logic, only their trigger changes).
- Produces: nothing new consumed elsewhere — this is the last consumer of `AccountsManager`'s internals.
- Confirmed by reading `app/api/expenses/route.ts`: its `GET` handler takes no query params at all — it returns every expense for the authenticated user, unfiltered (`app/api/expenses/route.ts:5-22`). Step 1 below adds `account_id` filtering to it; fetching all expenses client-side and filtering in the browser was ruled out since it would leak every account's transactions into the client bundle for what should be a single-account view.

- [ ] **Step 1: Add `account_id` filtering to the expenses API**

In `app/api/expenses/route.ts`, change the `GET` export to read the URL's query string and scope the query when `account_id` is present:
```ts
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const accountId = new URL(request.url).searchParams.get('account_id')

    let query = supabase
      .from('expenses')
      .select(`*, category:categories(*)`)
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (accountId) query = query.eq('account_id', accountId)

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```
This preserves the exact existing response shape and error handling (`app/api/expenses/route.ts:19-21`, unchanged) — the only addition is the optional filter and the `request: Request` parameter the handler didn't previously need.

- [ ] **Step 2: Build the active-account transaction list and action sheet inside `AccountsManager`**

Replace the `accounts.map(...)` vertical list (`components/AccountsManager.tsx:174-278`) with:
```tsx
const [activeIndex, setActiveIndex] = useState(0)
const [sheetOpen, setSheetOpen] = useState(false)
const activeAccount = accounts[activeIndex]

const cardData: AccountCardData[] = accounts.map((a) => ({
  id: a.id,
  name: a.name,
  bank_name: a.bank_name,
  bank_domain: a.bank_domain,
  balance: a.balance,
  subtitle: ACCOUNT_TYPE_LABELS[a.account_type],
}))
```
(add `AccountCardStack`, `AccountCardData` import from `@/components/AccountCardStack`)

```tsx
<AccountCardStack
  accounts={cardData}
  variant="full"
  onActiveCardAction={(id) => {
    const index = accounts.findIndex((a) => a.id === id)
    if (index >= 0) setActiveIndex(index)
    setSheetOpen(true)
  }}
/>
```
For the sheet/modal itself, reuse the existing shadcn `Dialog` primitives already in this codebase (`components/ui/dialog.tsx`, confirmed present) rather than hand-rolling one:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
```
```tsx
<Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{activeAccount?.name}</DialogTitle>
    </DialogHeader>
    {activeAccount && !editingId && (
      <div className="flex items-center gap-1">
        {!activeAccount.is_default && (
          <button onClick={() => makeDefault(activeAccount.id)} disabled={busyId === activeAccount.id} className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-caption-luma text-luma-muted hover:text-luma-text transition-colors disabled:opacity-50">
            <Star className="w-3.5 h-3.5" /> Make default
          </button>
        )}
        <button onClick={() => startEdit(activeAccount)} className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-caption-luma text-luma-muted hover:text-luma-text transition-colors">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
        <button onClick={() => handleDelete(activeAccount)} disabled={busyId === activeAccount.id} className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-caption-luma text-luma-danger hover:bg-luma-danger-glow transition-colors ml-auto disabled:opacity-50">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    )}
    {activeAccount && editingId === activeAccount.id && (
      <AccountForm form={editForm} setForm={setEditForm} saving={saving} submitLabel="Save changes" onSubmit={() => handleEditSave(activeAccount.id)} onCancel={() => setEditingId(null)} />
    )}
    {/* pendingDelete reassign UI (components/AccountsManager.tsx:231-264, unchanged) goes here, scoped to activeAccount */}
  </DialogContent>
</Dialog>
```
Keep the existing "Add account" button and its `AccountForm` block (`components/AccountsManager.tsx:280-305`) exactly as-is, below the carousel.

- [ ] **Step 3: Add the scoped recent-transactions list**

Below the carousel and above (or below, whichever reads better once rendered — decide by inspection when visually verifying) the "Add account" affordance, add:
```tsx
const [transactions, setTransactions] = useState<ExpenseWithCategory[]>([])

useEffect(() => {
  if (!activeAccount) return
  fetch(`/api/expenses?account_id=${activeAccount.id}`)
    .then((r) => r.json())
    .then((data) => setTransactions(Array.isArray(data) ? data : []))
}, [activeAccount?.id])
```
```tsx
<div className="solid-list-card">
  {transactions.length === 0 ? (
    <div className="h-24 flex items-center justify-center text-body-muted-luma">No transactions yet</div>
  ) : (
    transactions.map((t) => (
      <div key={t.id} className="px-3 py-3 border-b border-luma-hairline last:border-b-0 flex items-center justify-between">
        <span className="text-sm text-luma-text truncate">{t.category?.icon} {t.category?.name}</span>
        <span className="text-number-inline text-luma-text">₹{Number(t.amount).toLocaleString('en-IN')}</span>
      </div>
    ))
  )}
</div>
```
(`ExpenseWithCategory` is the existing type from `@/types`, already imported elsewhere in the codebase, e.g. `components/ExpenseManager.tsx:14`.)

- [ ] **Step 4: Verify TypeScript and lint**

Run: `npx --no-install tsc --noEmit`
Expected: no new errors.

Run: `npx --no-install eslint app components`
Expected: no new problems.

- [ ] **Step 5: Hand off for visual verification**

State explicitly: not run in a browser. User checks `/settings/accounts` at 375/768/1440/2560px — carousel browses accounts, tapping the active card opens the sheet/modal with working edit/delete/make-default, "Add account" flow is unchanged, and the transaction list below updates to match whichever account is active in the carousel (swipe/click to a different card, list should refetch).

- [ ] **Step 6: Commit**

```bash
git add components/AccountsManager.tsx app/api/expenses/route.ts
git commit -m "feat: replace Accounts page vertical list with AccountCardStack

Edit/delete/make-default now live in a modal triggered by tapping the
active carousel card. Adds a recent-transactions list scoped to
whichever account is active, and an account_id filter on GET
/api/expenses to support it."
```

### Task 8: Category color chips on the Expenses filter

**Files:**
- Modify: `components/ExpenseManager.tsx:364-385` (the Expenses page category filter `<Select>` — same file as Task 6, different section)

**Interfaces:**
- Consumes: `getCategoryChipColors` from Task 2 (already imported in this file as of Task 6 Step 3).

- [ ] **Step 1: Apply chip colors to the filter's selected-value display**

Replace `components/ExpenseManager.tsx:365-371`:
```tsx
<SelectTrigger className="w-full max-w-full sm:w-[150px] bg-luma-raised border-luma-hairline text-luma-text focus-visible:border-luma-accent-border">
  <SelectValue placeholder="Category">
    {(value: string | null) =>
      !value || value === 'all' ? 'All Categories' : categoryLabel(value) ?? 'All Categories'
    }
  </SelectValue>
</SelectTrigger>
```
with:
```tsx
<SelectTrigger
  className="w-full max-w-full sm:w-[150px] border-luma-hairline text-luma-text focus-visible:border-luma-accent-border"
  style={
    filterCategory !== 'all'
      ? { backgroundColor: getCategoryChipColors(categoryList.find((c) => c.id === filterCategory)?.name ?? '').bg }
      : undefined
  }
>
  <SelectValue placeholder="Category">
    {(value: string | null) =>
      !value || value === 'all' ? 'All Categories' : categoryLabel(value) ?? 'All Categories'
    }
  </SelectValue>
</SelectTrigger>
```
(`bg-luma-raised` utility is dropped from the trigger's className when a category is selected, since the inline `style` background needs to win — Tailwind classes and inline styles both set `background-color`, and the inline one already takes precedence in the DOM, but removing the now-redundant class keeps the source honest about which one is actually controlling the color.)

- [ ] **Step 2: Apply chip colors to the option list**

Replace `components/ExpenseManager.tsx:376-383`:
```tsx
{categoryList.map(cat => (
  <SelectItem key={cat.id} value={cat.id}>
    <span className="flex items-center gap-2">
      <span>{cat.icon}</span>
      <span>{cat.name}</span>
    </span>
  </SelectItem>
))}
```
with the same chip-wrapped span pattern from Task 6 Step 3:
```tsx
{categoryList.map(cat => {
  const chip = getCategoryChipColors(cat.name)
  return (
    <SelectItem key={cat.id} value={cat.id}>
      <span className="flex items-center gap-2 rounded-full px-2 py-0.5" style={{ backgroundColor: chip.bg, color: chip.text }}>
        <span>{cat.icon}</span>
        <span>{cat.name}</span>
      </span>
    </SelectItem>
  )
})}
```

- [ ] **Step 3: Verify TypeScript and lint**

Run: `npx --no-install tsc --noEmit`
Expected: no new errors.

Run: `npx --no-install eslint components`
Expected: no new problems.

- [ ] **Step 4: Hand off for visual verification**

State explicitly: not run in a browser. User checks the Expenses page filter dropdown at 375/768/1440/2560px — selected value shows the chip background, option list shows chip colors per category, "All Categories" stays neutral.

- [ ] **Step 5: Commit**

```bash
git add components/ExpenseManager.tsx
git commit -m "feat: apply category chip colors to the Expenses filter dropdown"
```

### Task 9: Full responsive pass and final report

**Files:** none (verification-only task)

**Interfaces:** none.

- [ ] **Step 1: Re-run static checks across everything touched**

Run: `npx --no-install tsc --noEmit`
Run: `npx --no-install eslint app components lib`
Expected: no errors/problems beyond the documented pre-existing baseline (`lib/sendPush.ts` TS2307, ~62 baseline eslint problems).

- [ ] **Step 2: Confirm dead code removal**

`components/BalanceCard.tsx` and `components/AccountPicker.tsx`'s exported `AccountPicker` function (not `AccountTag`, still used) are dead after Tasks 5–7. Run:
```bash
grep -rn "BalanceCard\|<AccountPicker" app components
```
Expected: no remaining usages. Delete `components/BalanceCard.tsx` entirely; in `components/AccountPicker.tsx`, remove the `AccountPicker` function export but keep `AccountTag` (still consumed by `components/ExpenseManager.tsx:430,479`).

- [ ] **Step 3: Commit the cleanup**

```bash
git rm components/BalanceCard.tsx
git add components/AccountPicker.tsx
git commit -m "chore: remove BalanceCard and the unused AccountPicker selector

Both are fully superseded by AccountCardStack as of Phase 3/4. AccountTag
(the inline account-on-a-transaction-row label) stays — still in use."
```

- [ ] **Step 4: Write the final report**

Per the original prompt's closing request, produce a summary covering:
- Every file touched across all four phases (list from `git log --stat` since the first commit of this plan).
- Which of the four widths (375/768/1440/2560px) were actually visually tested by the user versus only statically verified (type-check/lint/compile) by the implementer — be explicit per phase, not just once at the end, since each phase's hand-off step already recorded this.
- The three decisions flagged during planning that went beyond the prompt's literal text (accent color derived from gradient-primary, `.font-fraunces` class kept with a new font value, `getCategoryColor` kept alongside the new `getCategoryChipColors` rather than replaced) — confirm the user is still fine with all three now that they're live in the app, not just in the abstract during planning.

---

**Phase 4 stop point — end of plan.** All four phases complete once Task 9 is done and reported.
