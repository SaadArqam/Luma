export function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="animate-pulse space-y-2 px-1 pt-2">
        <div className="h-6 bg-[#2B2C33] rounded w-1/3" />
        <div className="h-4 bg-[#2B2C33] rounded w-1/2" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass-card p-6 rounded-[20px] animate-pulse space-y-4">
          <div className="h-4 bg-[#2B2C33] rounded w-1/3" />
          <div className="h-8 bg-[#2B2C33] rounded w-full" />
        </div>
      ))}
    </div>
  )
}
