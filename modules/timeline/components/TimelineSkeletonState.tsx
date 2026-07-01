export function TimelineSkeletonState() {
  return (
    <div className="space-y-6">
      {/* Skeleton groups */}
      {[1, 2, 3].map((groupIndex) => (
        <div key={groupIndex} className="mb-8">
          {/* Skeleton group header */}
          <div className="h-8 w-32 bg-muted-surface rounded-lg mb-4 animate-pulse" />
          
          {/* Skeleton items */}
          <div className="space-y-3">
            {[1, 2].map((itemIndex) => (
              <div key={itemIndex} className="flex gap-4">
                {/* Skeleton icon */}
                <div className="w-12 h-12 rounded-full bg-muted-surface animate-pulse shrink-0" />
                
                {/* Skeleton content */}
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-muted-surface rounded-lg animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted-surface rounded-lg animate-pulse" />
                  <div className="h-4 w-1/3 bg-muted-surface rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
