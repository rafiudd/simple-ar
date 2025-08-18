// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Pagination & Table
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: String;
  token: string;
  refreshToken: string;
}

export interface CreateMenuParams {
  nama_menu: string;
  model: string;
  ios: string;
  price: number;
}

export interface Menu {
  id: number;
  nama_menu: string;
  model: string;
  ios: string;
  price: number;
  created_at: string;
  updated_at: string;
}
