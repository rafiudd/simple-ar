// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://urban-dyanne-rafiudd-c0ab3ad2.koyeb.app/api';
export const API_VERSION = 'v1';
export const API_TIMEOUT = 30000;

// Authentication
export const TOKEN_KEY = 'charity_admin_token';
export const REFRESH_TOKEN_KEY = 'charity_admin_refresh_token';
export const USER_KEY = 'charity_admin_user';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB    
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGES_PER_CAMPAIGN = 5;
