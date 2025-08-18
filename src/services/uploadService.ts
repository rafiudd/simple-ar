// src/services/uploadService.ts
import axios, { AxiosInstance } from 'axios';
import { API_TIMEOUT } from '../constants';
import { authService } from './authService';

export interface ApiResponse<T> {
  data: T;
  statusCode?: number;
  message?: string;
}

export interface UploadParams {
  file: File;
  bucket: string; // contoh: "public"
  folder: string; // contoh: "myfurqon"
  filename: string; // contoh: "custom-cat"
  onProgress?: (percent: number) => void;
}

export interface UploadResult {
  // Sesuaikan dengan respons server-mu
  url?: string;
  key?: string;
  bucket?: string;
  folder?: string;
  filename?: string;
  message?: string;
  // fallback
  [k: string]: any;
}

class UploadService {
  private api: AxiosInstance;
  private UPLOAD_URL = 'https://muddy-wildebeest-rafiudd-7daec76d.koyeb.app/upload';

  constructor() {
    this.api = axios.create({
      baseURL: '/', // base gak dipakai untuk upload, kita pakai absolute URL
      timeout: API_TIMEOUT,
    });

    this.api.interceptors.request.use((config) => {
      const token = authService.getAuthToken?.();
      if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async uploadToKoyeb({ file, bucket, folder, filename }: UploadParams): Promise<ApiResponse<UploadResult>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('folder', folder);
    formData.append('filename', filename);

    const res = await fetch(this.UPLOAD_URL, {
      method: 'POST',
      body: formData,
      credentials: 'omit',
    });

    if (!res.ok) throw new Error(`Upload gagal: ${res.status}`);

    const data = await res.json();
    return { data, statusCode: res.status, message: 'OK' };
  }
}

export const uploadService = new UploadService();
export const uploadToKoyeb = uploadService.uploadToKoyeb.bind(uploadService);
