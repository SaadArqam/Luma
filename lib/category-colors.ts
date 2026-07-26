/**
 * Categorical palette for category colors per DESIGN-luma.md spec:
 * - clay: #D9825A
 * - sage: #8FA888
 * - dusty-blue: #7C93A8
 * - muted-gold: #B8954A
 * - dusty-rose: #B87A8A
 * - muted-teal: #6B9A8F
 */
export const CATEGORY_PALETTE = [
  '#D9825A', // clay
  '#8FA888', // sage
  '#7C93A8', // dusty-blue
  '#B8954A', // muted-gold
  '#B87A8A', // dusty-rose
  '#6B9A8F', // muted-teal
] as const

/**
 * Returns a stable, deterministic color from CATEGORY_PALETTE based on a string hash.
 * Ensures the same category always keeps the exact same visual identity everywhere it appears.
 */
export function getCategoryColor(key: string): string {
  if (!key) return CATEGORY_PALETTE[0]
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  const index = Math.abs(hash) % CATEGORY_PALETTE.length
  return CATEGORY_PALETTE[index]
}
