import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants';
import { AuthResponse, LoginCredentials } from '../types';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/auth/login`,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          this.clearAuthToken();
          //   window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private authToken: string = '';

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  getAuthToken(): string {
    return this.authToken;
  }

  clearAuthToken(): void {
    this.authToken = '';
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post('/', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/logout');
  }

  async verifyToken(): Promise<boolean> {
    await this.api.get(`${API_BASE_URL}/api/menu`, {
      headers: { Authorization: `Bearer ${this.getAuthToken()}` },
    });
    return true;
  }
}

export const authService = new AuthService();
