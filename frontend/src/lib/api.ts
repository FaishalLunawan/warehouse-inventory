import axios, { AxiosError } from 'axios';
import { ApiResponse, InventoryItem, SearchParams } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const inventoryApi = {
  // Get all items
  async getItems(params?: SearchParams): Promise<InventoryItem[]> {
    const response = await api.get<ApiResponse<InventoryItem[]>>('/items', { params });
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch items');
    }
    return response.data.data || [];
  },

  // Get single item
  async getItem(id: number): Promise<InventoryItem> {
    const response = await api.get<ApiResponse<InventoryItem>>(`/items/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch item');
    }
    if (!response.data.data) {
      throw new Error('Item not found');
    }
    return response.data.data;
  },

  // Create item
  async createItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const response = await api.post<ApiResponse<InventoryItem>>('/items', item);
    if (!response.data.success) {
      const error = new Error(response.data.error || 'Failed to create item');
      (error as any).validationErrors = response.data.validationErrors;
      throw error;
    }
    if (!response.data.data) {
      throw new Error('No data returned');
    }
    return response.data.data;
  },

  // Update item
  async updateItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await api.put<ApiResponse<InventoryItem>>(`/items/${id}`, item);
    if (!response.data.success) {
      const error = new Error(response.data.error || 'Failed to update item');
      (error as any).validationErrors = response.data.validationErrors;
      throw error;
    }
    if (!response.data.data) {
      throw new Error('No data returned');
    }
    return response.data.data;
  },

  // Delete item
  async deleteItem(id: number): Promise<void> {
    const response = await api.delete<ApiResponse>(`/items/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete item');
    }
  },

  // Get categories
  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/items/categories');
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch categories');
    }
    return response.data.data || [];
  },
};

export default api;