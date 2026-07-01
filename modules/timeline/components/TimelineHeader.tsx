import { Search, Filter } from 'lucide-react';

interface TimelineHeaderProps {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  showSearch?: boolean;
  showFilter?: boolean;
}

export function TimelineHeader({ 
  onSearchClick, 
  onFilterClick, 
  showSearch = true,
  showFilter = true 
}: TimelineHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-display font-semibold text-text-primary mb-1">
          Timeline
        </h1>
        <p className="text-body text-text-secondary">
          Your life, one continuous story
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {showSearch && (
          <button
            onClick={onSearchClick}
            aria-label="Search timeline"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface hover:bg-muted-surface transition-colors motion-fast"
          >
            <Search className="h-5 w-5 text-text-secondary" />
          </button>
        )}
        {showFilter && (
          <button
            onClick={onFilterClick}
            aria-label="Filter timeline"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface hover:bg-muted-surface transition-colors motion-fast"
          >
            <Filter className="h-5 w-5 text-text-secondary" />
          </button>
        )}
      </div>
    </div>
  );
}
