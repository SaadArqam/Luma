import type { SearchQuery, SearchResult, SearchIndexer } from '../types';

class SearchService {
  private indexers: SearchIndexer[] = [];

  registerIndexer(indexer: SearchIndexer): void {
    this.indexers.push(indexer);
  }

  async search(query: SearchQuery, userId: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    for (const indexer of this.indexers) {
      // Apply filters if provided
      if (query.filters?.modules && !query.filters.modules.includes(indexer.module)) {
        continue;
      }

      if (query.filters?.types && !query.filters.types.includes(indexer.entityType)) {
        continue;
      }

      try {
        const moduleResults = await indexer.search(userId, query.query);
        results.push(...moduleResults);
      } catch (error) {
        console.error(`Search failed for ${indexer.module}.${indexer.entityType}:`, error);
      }
    }

    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply limit
    const limit = query.limit || 20;
    return results.slice(0, limit);
  }

  async indexAll(userId: string): Promise<void> {
    for (const indexer of this.indexers) {
      try {
        await indexer.index(userId);
      } catch (error) {
        console.error(`Indexing failed for ${indexer.module}.${indexer.entityType}:`, error);
      }
    }
  }
}

export const searchService = new SearchService();
