export interface Product {
  title: string;
  price: number;
  formatted_price?: string;
  url: string;
  image_url?: string;
  store: string;
  in_stock: boolean;
  sku?: string;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  count: number;
  products: Product[];
  message?: string;
  error?: string;
}

export interface BatchSearchResponse {
  success: boolean;
  count: number;
  results: Record<string, Product[]>;
  message?: string;
}

export interface ProviderInfo {
  name: string;
  display_name: string;
  base_url: string;
  status: string;
}

export interface ProviderListResponse {
  success: boolean;
  count: number;
  providers: ProviderInfo[];
}

export interface OptimizationResponse {
  success: boolean;
  message: string;
  total_cost?: number;
  details?: Record<string, any>;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
  error?: string;
}
