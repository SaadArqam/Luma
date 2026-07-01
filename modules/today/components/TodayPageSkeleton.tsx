'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function TodayPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="px-4 pt-6 pb-4 space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Daily Brief Skeleton */}
      <div className="mx-4 mb-3">
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>

      {/* Focus Section Skeleton */}
      <div className="px-4 mb-6">
        <Skeleton className="h-7 w-20 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-card p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section Skeleton */}
      <div className="px-4 mb-6">
        <Skeleton className="h-7 w-24 mb-4" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-card p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Section Skeleton */}
      <div className="px-4 mb-6">
        <Skeleton className="h-7 w-24 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
