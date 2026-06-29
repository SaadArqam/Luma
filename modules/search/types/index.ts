export type SearchEntityType = 
  | 'transaction'
  | 'goal'
  | 'account'
  | 'timeline_event'
  | 'note'
  | 'category'
  | 'recurring_transaction';

export type SearchModule = 
  | 'finance'
  | 'goals'
  | 'accounts'
  | 'timeline'
  | 'journal'
  | 'capture';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  module: SearchModule;
  title: string;
  description?: string;
  metadata: Record<string, any>;
  relevanceScore: number;
  deepLink: string;
}

export interface SearchQuery {
  query: string;
  filters?: {
    types?: SearchEntityType[];
    modules?: SearchModule[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  limit?: number;
}

export interface SearchIndexer {
  module: SearchModule;
  entityType: SearchEntityType;
  index: (userId: string) => Promise<void>;
  search: (userId: string, query: string) => Promise<SearchResult[]>;
}
