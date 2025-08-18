import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants';
import { ApiResponse, CreateMenuParams, Menu } from '../types';
import { authService } from './authService';

class MenuService {
  private api: AxiosInstance;
  private UPLOAD_URL = 'https://muddy-wildebeest-rafiudd-7daec76d.koyeb.app/upload';

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
    if (params) {
      config.params = params;
    }
    return this.api.get(endpoint, config);
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.api.post(endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.api.put(endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.api.delete(endpoint);
  }

  async getListMenu(): Promise<Menu[]> {
    const res = await this.get<Menu[]>('/api/menu');
    return res.data;
  }

  async deleteMenu(id: number): Promise<ApiResponse<null>> {
    return this.delete(`/api/menu/${id}`);
  }

  async createMenu(data: CreateMenuParams): Promise<ApiResponse<Menu>> {
    return this.post('/api/menu', data);
  }

  async updateMenu(id: number, data: CreateMenuParams): Promise<ApiResponse<Menu>> {
    return this.put(`/api/menu/${id}`, data);
  }

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'public');
    formData.append('folder', 'laper3d');
    formData.append('filename', file.name);

    try {
      const res = await fetch(this.UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload gagal: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log(data);

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export const menuService = new MenuService();
export const getListMenu = menuService.getListMenu.bind(menuService);
export const deleteMenu = menuService.deleteMenu.bind(menuService);
export const createMenu = menuService.createMenu.bind(menuService);
export const updateMenu = menuService.updateMenu.bind(menuService);
export const uploadFile = menuService.uploadFile.bind(menuService);
