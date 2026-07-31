import {
  SearchResponse,
  BatchSearchResponse,
  ProviderListResponse,
  OptimizationResponse,
  AgentResponse,
} from '../types';

const API_BASE = '/api/v1';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  checkHealth: async () => {
    return fetchJSON<{ status: string; version: string }>('/health');
  },

  search: async (
    query: string,
    limit: number = 10,
    sort_by_price: boolean = true,
    use_cache: boolean = true
  ): Promise<SearchResponse> => {
    return fetchJSON<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        limit,
        sort_by_price,
        use_cache,
      }),
    });
  },

  batchSearch: async (queries: string[], limit: number = 5): Promise<BatchSearchResponse> => {
    return fetchJSON<BatchSearchResponse>('/search/batch', {
      method: 'POST',
      body: JSON.stringify({
        queries,
        limit,
      }),
    });
  },

  getProviders: async (): Promise<ProviderListResponse> => {
    return fetchJSON<ProviderListResponse>('/providers');
  },

  searchProvider: async (provider: string, query: string, limit?: number): Promise<SearchResponse> => {
    return fetchJSON<SearchResponse>(`/providers/${provider}`, {
      method: 'POST',
      body: JSON.stringify({
        query,
        limit,
      }),
    });
  },

  optimizeCart: async (items: string[]): Promise<OptimizationResponse> => {
    return fetchJSON<OptimizationResponse>('/optimize', {
      method: 'POST',
      body: JSON.stringify({
        items,
      }),
    });
  },

  analyzeAgent: async (prompt: string, project_type?: string): Promise<AgentResponse> => {
    return fetchJSON<AgentResponse>('/agent/analyze', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        project_type,
      }),
    });
  },
};
