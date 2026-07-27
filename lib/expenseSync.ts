import { create } from 'zustand'

/**
 * Cross-component refresh signal for expense mutations.
 *
 * Why this exists: the Home page is a server component, but the Today card,
 * budget bars and stipend widget are all CLIENT components that load their own
 * data in `useEffect(..., [])`. `router.refresh()` only re-runs the server
 * render — it does NOT remount client components or re-run their effects — so
 * before this store those panels kept showing stale numbers until a reload.
 *
 * Consumers put `version` in their effect's dependency array; anything that
 * mutates expenses calls `bump()` after the server confirms the write.
 */
type ExpenseSyncStore = {
  /** Incremented after every confirmed expense mutation. */
  version: number
  /**
   * Optimistic amount to add to *today's* spend while a write is in flight,
   * so the Today card moves on submit instead of after the round-trip.
   * Held separately from fetched data so reconciliation can't double-count.
   */
  todayDelta: number
  bump: () => void
  addTodayDelta: (amount: number) => void
  /**
   * Retire the exact delta a just-completed fetch already accounts for.
   * Callers snapshot `todayDelta` before fetching and pass that snapshot back,
   * so a second expense added mid-flight keeps its own optimistic amount.
   */
  consumeTodayDelta: (amount: number) => void
}

export const useExpenseSync = create<ExpenseSyncStore>((set) => ({
  version: 0,
  todayDelta: 0,
  bump: () => set((s) => ({ version: s.version + 1 })),
  addTodayDelta: (amount) => set((s) => ({ todayDelta: s.todayDelta + amount })),
  consumeTodayDelta: (amount) => set((s) => ({ todayDelta: s.todayDelta - amount })),
}))
