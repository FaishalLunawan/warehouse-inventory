export interface InventoryItem {
  id?: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchParams {
  search?: string;
  category?: string;
}