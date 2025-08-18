import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants';
import { ApiResponse } from '../types';
import { authService } from './authService';

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  qty: number;
  subtotal: number;
  nama_menu: string;
  model: string;
  ios: string;
  unit_price: number;
}

export interface Order {
  id: number;
  customer_name: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  status: string;
  items: OrderItem[];
}

export interface CreateOrderParams {
  customer_name: string;
  items: { menu_id: number; qty: number }[];
}

class OrderService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = authService.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          authService.clearAuthToken();
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {};
    if (params) config.params = params;
    return this.api.get(endpoint, config);
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.api.post(endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.api.patch(endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.api.delete(endpoint, config);
  }

  async getListOrder(): Promise<Order[]> {
    const res = await this.get<Order[]>('/api/order');
    return res.data;
  }

  async getDetailOrder(id: number): Promise<Order> {
    const res = await this.get<Order>(`/api/order/${id}`);
    return res.data;
  }

  async createOrder(data: CreateOrderParams): Promise<ApiResponse<Order>> {
    return this.post('/api/order', data);
  }

  async updateStatusOrder(id: number, status: string): Promise<Order> {
    const res = await this.patch<Order>(`/api/order/${id}/status`, { status });
    return res.data;
  }

  async deleteOrder(id: number): Promise<void> {
    await this.delete(`/api/order/${id}`);
  }
}

export const orderService = new OrderService();
export const getListOrder = orderService.getListOrder.bind(orderService);
export const getDetailOrder = orderService.getDetailOrder.bind(orderService);
export const createOrder = orderService.createOrder.bind(orderService);
export const updateStatusOrder = orderService.updateStatusOrder.bind(orderService);
export const deleteOrder = orderService.deleteOrder.bind(orderService);
