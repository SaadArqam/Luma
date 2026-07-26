/**
 * Fixed neutral palette of desaturated shades for category colors per DESIGN-luma.md spec:
 * Tone A: #4A4B54 (cool slate)
 * Tone B: #5C5850 (warm taupe)
 * Tone C: #45504A (muted sage-gray)
 * Tone D: #524850 (muted plum-gray)
 * Tone E: #565048 (muted olive-gray)
 */
export const CATEGORY_PALETTE = [
  '#4A4B54', // cool slate
  '#5C5850', // warm taupe
  '#45504A', // muted sage-gray
  '#524850', // muted plum-gray
  '#565048', // muted olive-gray
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
