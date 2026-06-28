/**
 * Query Settings & Optimization
 * Default query parameters and optimization settings.
 */

export const QUERY_SETTINGS = {
  // Pagination defaults
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Sorting defaults
  defaultSortField: "created_at",
  defaultSortOrder: "desc" as const,
  
  // Search defaults
  minSearchLength: 2,
  maxSearchResults: 50,
  
  // Filter defaults
  maxFilters: 10,
  filterOperators: ["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin", "like", "between"] as const,
  
  // Aggregation defaults
  maxGroupByFields: 5,
  maxAggregationDepth: 3,
  
  // Batch operations
  maxBatchSize: 100,
  batchChunkSize: 25,
  
  // Real-time
  realtimeEnabled: true,
  realtimeThrottleMs: 100,
  
  // Full-text search
  ftSearchEnabled: false,
  ftSearchLanguage: "english",
  
  // Index hints
  useIndexHints: true,
  autoIndexAnalysis: false,
} as const;

export type QuerySettings = typeof QUERY_SETTINGS;
