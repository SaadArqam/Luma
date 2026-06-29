'use client';

import { useState } from 'react';
import { SearchLauncher } from '@/modules/shared/components/SearchLauncher';
import type { SearchResult } from '@/modules/search/types';
import { searchService } from '@/modules/search/services';
import { createClient } from '@/lib/supabase';

export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const searchResults = await searchService.search(
        { query, limit: 20 },
        user.id
      );
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-text">Search</h1>
        <p className="text-muted-foreground">
          Search across all your data - transactions, goals, notes, and more.
        </p>
      </div>

      <SearchLauncher onSearch={handleSearch} />

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          Searching...
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Enter a search query to find items across your data.
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          {results.map((result) => (
            <a
              key={result.id}
              href={result.deepLink}
              className="block p-4 bg-background border border-border rounded-xl hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-text">{result.title}</h3>
                  {result.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                      {result.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-surface text-muted-foreground rounded-full">
                      {result.module}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(result.relevanceScore * 100)}%
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
