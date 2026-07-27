/**
 * Categorical palette for category colors — mirrors the `chart-categorical.tones`
 * block of .claude/DESIGN-luma.md.
 *
 * These are the ONE exception to "never hardcode a color, use var(--luma-*)":
 * they are handed to recharts as SVG `fill`/`stroke` presentation attributes,
 * where var() does not resolve. Everything that is UI chrome (buttons, borders,
 * text, surfaces) must still go through the tokens in app/globals.css.
 *
 * Data-viz only — never for chrome. Unlike the single-accent rule, charts need
 * real hue variation to be scannable, so these span hue families rather than
 * shades of one gray. Each is desaturated to stay inside the graphite identity.
 */
export const CATEGORY_PALETTE = [
  '#D9825A', // clay
  '#B8954A', // muted-gold
  '#C4A574', // warm-sand
  '#8FA888', // sage
  '#6B9A8F', // muted-teal
  '#7C93A8', // dusty-blue
  '#9088A8', // dusty-lavender
  '#B87A8A', // dusty-rose
  '#C97B6E', // muted-coral
  '#9B9B6C', // olive
  '#6E7A8A', // slate-gray-blue
  '#8A6A8C', // muted-plum
] as const

/**
 * djb2 — the hash the design system specifies. Chosen over index-based
 * assignment so a category keeps the same color everywhere (chart, legend,
 * chips) even as other categories are added or removed, and over a weaker hash
 * so distinct names are less likely to collide onto the same tone.
 *
 * Collisions are still possible with 12 tones; if two categories that appear
 * together ever resolve to the same color, add tones rather than reordering
 * this array — reordering would recolor every existing category.
 */
export function getCategoryColor(key: string): string {
  if (!key) return CATEGORY_PALETTE[0]
  let hash = 5381
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash + key.charCodeAt(i)) | 0 // hash * 33 + c, kept 32-bit
  }
  const index = Math.abs(hash) % CATEGORY_PALETTE.length
  return CATEGORY_PALETTE[index]
}
