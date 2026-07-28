# Dark Gradient Fintech Redesign — Design Spec

Source request: `.claude/prompt.md`. This doc reconciles that prompt against the actual
codebase (see "Reconciliation notes" below) and is the spec of record for the four
implementation phases. Phases execute in order; each phase stops for review before the
next begins.

## Reconciliation notes (prompt assumptions vs. actual codebase)

The original prompt was written against assumptions that don't match current state.
Resolved with the user as follows — these decisions are binding for all phases:

1. **Theme scope**: the app already has a documented, actively-referenced dark
   glassmorphic system (`app/globals.css` `--luma-*` tokens, Fraunces+Inter,
   `.claude/DESIGN-luma.md` as source-of-truth doc). Decision: **full replace**, not
   layer-alongside. `DESIGN-luma.md` gets rewritten in place to describe the new system,
   preserving its role as the single doc that mirrors `globals.css` 1:1.
2. **`.claude/DESIGN-apple.md`**: unrelated old exploration. **Ignore it**, don't read
   it as input, don't modify it.
3. **Category colors**: `lib/category-colors.ts` already exists (djb2-hash over 12
   desaturated tones, not a curated per-name map — deliberately chosen so arbitrary
   user-created category names all get a stable, distinct color). Categories are
   per-user rows (`categories` table), not a fixed enum; only 3 are seeded by default
   (Food, Travel, Shopping — not "Transport"/"Tiffin" as the prompt assumed, those are
   categories that exist in the requesting user's own account).
   **Correction found during plan-writing** (enumerating call sites surfaced a
   conflict the earlier "replace" decision didn't account for): `getCategoryColor(key)`
   is also called from `components/DashboardChart.tsx:29` (recharts `fill`, needs one
   raw hex) and `components/BankLogo.tsx:66` (bank-avatar background — not a category at
   all, just reusing the hash for a stable per-name color). Neither can take a `{bg,
   text}` pair. Decision: **keep `getCategoryColor(key): string` exactly as-is** for
   those two call sites, and **add** `getCategoryChipColors(name): {bg, text}` in the
   same file — a curated lookup (Food/Travel/Shopping/Transport/Tiffin by name, gray
   fallback for anything else) used only by the category chip UI the prompt actually
   targets (Add Expense category select, Expenses filter). `components/CategoryList.tsx:109`
   keeps using the untouched hash function — it's not one of the four phases' named
   screens. Colors stay raw hex (not CSS vars) because recharts needs literal
   `fill`/`stroke` values.
4. **Account selector**: the prompt describes replacing an "account dropdown," but
   `AccountPicker.tsx` is already a pill-row selector, not a `<select>`. It gets replaced
   by `AccountCardStack variant="mini"` instead, same behavior contract.
5. **Pre-selection logic**: the prompt assumed "most-recently-used." Actual logic
   (`ExpenseManager.tsx`): `is_default` account first, else first account in server-sorted
   list. This exact logic is preserved, just re-described correctly.
6. **Account actions on the Accounts page**: the prompt didn't say what happens to
   `AccountsManager`'s inline edit/delete/make-default row actions once the list becomes
   a carousel. Decision: tapping/clicking the **active** carousel card opens a bottom
   sheet (mobile) / modal (desktop) with those actions, reusing the existing `AccountForm`
   for edit and the existing add flow for "Add new account."

## Cross-cutting requirement: responsive, every phase

This is not a Phase 4 checklist item — every phase's plan and every phase's review must
explicitly cover it:

- Breakpoints: mobile 360–480px (primary), tablet 481–1024px (incl. unfolded foldables),
  laptop/desktop 1025–1920px, large display 1920px+ (main content capped ~640–720px,
  centered, not stretched edge-to-edge).
- Fluid units (`rem`, `%`, `clamp()`) over fixed px wherever layout allows.
- Test widths for every phase before reporting back: **375px, 768px, 1440px, 2560px.**
  Verify actual spacing/font-scale/card-proportion quality at each width, not just "not
  clipped."
- Card carousel specifically: single-card-peek (`calc(100% - Xpx)`) on mobile vs.
  fixed-max-width (~320px) multi-card-visible on tablet/desktop — an explicit breakpoint
  switch, not fluid scaling alone.
- Unbounded headline sizes scale via `clamp()`, not a fixed ratio to body text.
- Each phase's report states which of the four widths were actually tested (browser
  resize / devtools) vs. assumed to carry over.

## Phase 1 — Design tokens

Files: `app/globals.css`, `app/layout.tsx`, `lib/category-colors.ts`,
`.claude/DESIGN-luma.md`.

**Fonts**: add Unbounded (weights 500/700/800/900) via `next/font/google` in
`app/layout.tsx`, alongside the existing Inter import (Inter stays). Remove the Fraunces
import. Map `--font-display` → Unbounded, `--font-body` → Inter, via the existing
`@theme inline` block (replacing the current `--font-serif`/`--font-heading` → Fraunces
mappings). Any component currently using `font-serif`/`font-heading` utility classes
needs to move to the new `font-display` utility — enumerate these call sites as part of
Phase 1 so Phase 3/4 don't hit unstyled headers.

**Colors**: in `app/globals.css`, replace the `--luma-*` block with:
- `--background: #0B0B0F`, `--card-surface: #16161D`, `--border-hairline: #1a1a20`
  (naming stays consistent with the existing `--color-*` `@theme inline` convention, so
  Tailwind utilities like `bg-background`, `bg-card-surface`, `border-hairline` work)
- `--gradient-primary: linear-gradient(135deg, #FF6B35 0%, #FF3D8A 100%)`
- `--gradient-secondary: linear-gradient(135deg, #4361EE 0%, #7B2FF7 100%)`
- `--gradient-tertiary: linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)`
- Keep `--success`/`--warning`/`--danger`/`--info` at their existing values (`#6FC49B`/
  `#EFA84A`/`#D65458`/`#8AA9C4`) — nothing in the prompt asks to change status colors,
  and these desaturated tones read fine against the new near-black `#0B0B0F` background
  (higher contrast than against the old `#1B1C21`, if anything).

Update the shadcn semantic alias block (`:root, .dark { --background: var(--luma-canvas); ... }`)
to point at the new token names instead of the retired `--luma-*` ones.

**Category color map**: add to `lib/category-colors.ts` (not replace) a new export
`getCategoryChipColors(name: string): { bg: string; text: string }`, leaving the
existing `getCategoryColor(key): string` and `CATEGORY_PALETTE` untouched (still used
by `DashboardChart.tsx:29` and `BankLogo.tsx:66`, neither of which can take a bg/text
pair). `getCategoryChipColors` call sites are Phase 3/4 work
(`ExpenseManager.tsx` category select and Expenses filter) — Phase 1 only adds the
function and its map. Entries: Food `#412402`/`#FAC775`, Transport `#04342C`/`#5DCAA5`,
Tiffin `#4B1528`/`#ED93B1`, Shopping `#26215C`/`#AFA9EC`, Travel `#0B2A4B`/`#6FA8DC`
(existing seed default, not in the original prompt's list — assigned a blue-family tone
distinct from Transport's teal-green, same saturation/lightness pattern as the other four:
dark desaturated bg, light saturated text). Gray fallback (e.g. `#2A2A2E`/`#9C9CA3`) for
anything unmatched.

**`DESIGN-luma.md` rewrite**: update `colors:` and `typography:` (Fraunces → Unbounded
references) to match the new tokens. Leave the `chart-categorical` section describing
the djb2-hash approach as-is — it still governs `DashboardChart`/`BankLogo`/`CategoryList`
and hasn't changed — but add a new `category-chip` entry documenting the curated
Food/Travel/Shopping/Transport/Tiffin map and its gray fallback, so both color systems
are documented and a future editor knows which one governs which component. Keep the
doc's existing structure/format (component keys, Do's/Don'ts, Iteration Guide) since
other parts of the app (glass-dock, glass-sidebar, quick-add-sheet, today-ring,
streak-badge) aren't in scope for this redesign and their descriptions should only
change insofar as they reference retired color/font tokens by name.

**Responsive**: token file itself has no layout, but headline sizes (`number-hero`,
`header-display` equivalents) must be defined using `clamp()` in the new typography
tokens, not fixed px, so Phase 3/4 headline usages inherit fluid scaling for free. Test:
confirm `clamp()` values render sensibly at 375/768/1440/2560px in a throwaway test page
or via existing pages that already use `font-display`.

## Phase 2 — AccountCardStack

New file: `components/AccountCardStack.tsx`. Replaces three existing implementations:
`BalanceCard`'s carousel display, `AccountPicker` (Add Expense selector), and
`AccountsManager`'s vertical list.

- Horizontal scroll-snap carousel (`scroll-snap-type: x mandatory`,
  `scroll-snap-align: center` on children).
- Each card: gradient background rotating primary/secondary/tertiary by index (neutral
  dark gradient fallback beyond index 2), account name, masked account number/type label,
  balance in `font-display`, holder/type label. Reuses `BankLogo` for the logo treatment
  currently in `AccountPicker`/`AccountsManager`.
- Dot indicator row synced via scroll event + `Math.round(scrollLeft / clientWidth)`.
- `variant` prop: `'full'` (~155px, Home/Accounts) vs `'mini'` (~78px, Add Expense,
  opacity/scale de-emphasis on unselected cards).
- Keyboard/accessible: cards are real focusable elements (`tabIndex`, `role`), arrow-key
  navigation as progressive enhancement.
- **Responsive**: mobile — card width `calc(100% - Xpx)` so next card peeks. Explicit
  breakpoint (not fluid scaling) switches to fixed max-width (~320px) with multiple cards
  visible side-by-side on tablet/desktop — verify this switch actually happens at the
  tablet breakpoint and doesn't just fluidly stretch one card to 1440px wide. Test at all
  four widths with mock data.

Ships with mock data for review — real data wiring is Phase 3.

## Phase 3 — Wire into Home and Add Expense

1. **Home**: replace `BalanceCard` with `AccountCardStack variant="full"`. First card =
   combined total across all accounts (existing `getAccountsWithBalances` aggregation
   logic), then one card per real account. Keep the rest of Home's layout (stat cards,
   quick actions, recent expenses) — only restyle stat card numbers and expense amounts
   to `font-display`.
2. **Add Expense**: replace `AccountPicker` with `AccountCardStack variant="mini"`.
   Selecting a card sets `accountId` — same state variable, same preservation of the
   existing `is_default`-first / first-in-list pre-selection logic from
   `ExpenseManager.tsx` (not "most recently used").
3. **Category pills on this form**: pull from `getCategoryChipColors` (added in Phase 1)
   instead of the current plain-dot treatment.

**Responsive**: re-test the full page (not just the isolated component) at 375/768/1440/2560px
— stat card grid and quick-actions row must wrap rather than squish at narrow widths;
confirm the carousel's mobile-peek vs. desktop-multi-card breakpoint still holds once
embedded in the real page layout (a component tested in isolation can still break once
surrounded by other flex/grid siblings).

## Phase 4 — Accounts page + Expenses filter fixes

1. **Accounts page** (`AccountsManager.tsx` / `app/settings/accounts/page.tsx`):
   `AccountCardStack variant="full"` as the main carousel, "Add new account" affordance
   below (reuses existing `AccountForm` add flow), then a transactions list scoped to
   whichever account is active in the carousel (same scroll-position index driving the
   dots). Active-card tap/click opens the edit/delete/make-default sheet-or-modal
   (reusing `AccountForm` for edit).
2. **Expenses page category filter** (`ExpenseManager.tsx` `<Select>`): apply the
   category color map to both the selected-value display and the option list.
3. **Full responsive pass** across Home, Add Expense, Accounts, Expenses at all four
   widths. Specific checks: carousel breakpoint behavior in each of the four contexts
   it now appears in, stat/quick-action row wrapping, `clamp()`-based headline scaling
   (not a fixed ratio to body text).

## Out of scope

- Nav (`glass-dock`/`glass-sidebar`), `quick-add-sheet`, `today-ring`, `streak-badge` —
  not named in any of the four phases; only affected incidentally if they consume a
  retired token name (in which case they get repointed to the new equivalent token,
  not restyled).
- Light mode — none exists today, none is being added.
- Any change to the `accounts`/`categories`/`expenses` DB schema.
