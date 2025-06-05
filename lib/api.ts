import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * API Client class for handling HTTP requests
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Remove authorization token
   */
  removeAuthToken() {
    const { Authorization, ...headers } = this.defaultHeaders as any;
    this.defaultHeaders = headers;
  }

  /**
   * Make HTTP request
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    return this.request(url.pathname + url.search, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: 'POST',
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.request(endpoint, options);
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: 'PUT',
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.request(endpoint, options);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: 'PATCH',
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.request(endpoint, options);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Upload file
   */
  async upload<T = any>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const { 'Content-Type': _, ...headers } = this.defaultHeaders as any;

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    CHECK: '/auth/check',
    REFRESH: '/auth/refresh',
  },
  
  // Admin Auth
  ADMIN_AUTH: {
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    CHECK: '/admin/auth/check',
    CHANGE_PASSWORD: '/admin/auth/change-password',
  },
  
  // Services
  SERVICES: {
    LIST: '/services',
    CREATE: '/admin/services',
    UPDATE: (id: number) => `/admin/services/${id}`,
    DELETE: (id: number) => `/admin/services/${id}`,
    GET: (id: number) => `/services/${id}`,
  },
  
  // Portfolio
  PORTFOLIO: {
    LIST: '/portfolio',
    CREATE: '/admin/portfolio',
    UPDATE: (id: number) => `/admin/portfolio/${id}`,
    DELETE: (id: number) => `/admin/portfolio/${id}`,
    GET: (id: number) => `/portfolio/${id}`,
  },
  
  // Bookings
  BOOKINGS: {
    LIST: '/admin/bookings',
    CREATE: '/bookings',
    UPDATE: (id: number) => `/admin/bookings/${id}`,
    DELETE: (id: number) => `/admin/bookings/${id}`,
    GET: (id: number) => `/bookings/${id}`,
  },
  
  // Users
  USERS: {
    LIST: '/admin/users',
    CREATE: '/admin/users',
    UPDATE: (id: number) => `/admin/users/${id}`,
    DELETE: (id: number) => `/admin/users/${id}`,
    GET: (id: number) => `/admin/users/${id}`,
  },
  
  // Content
  CONTENT: {
    LIST: '/admin/content',
    UPDATE: (id: number) => `/admin/content/${id}`,
    GET: (section: string) => `/content/${section}`,
  },
  
  // Contact
  CONTACT: {
    SEND: '/contact',
    LIST: '/admin/contact',
    UPDATE: (id: number) => `/admin/contact/${id}`,
    DELETE: (id: number) => `/admin/contact/${id}`,
  },
  
  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter/subscribe',
    UNSUBSCRIBE: '/newsletter/unsubscribe',
    LIST: '/admin/newsletter',
  },
  
  // Payment
  PAYMENT: {
    CREATE: '/payment/create',
    VERIFY: '/payment/verify',
    WEBHOOK: '/payment/webhook',
  },
  
  // Upload
  UPLOAD: {
    IMAGE: '/admin/upload/image',
    VIDEO: '/admin/upload/video',
    FILE: '/admin/upload/file',
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/admin/analytics',
    OVERVIEW: '/admin/analytics/overview',
    BOOKINGS: '/admin/analytics/bookings',
    REVENUE: '/admin/analytics/revenue',
  },
  
  // Settings
  SETTINGS: {
    GET: '/admin/settings',
    UPDATE: '/admin/settings',
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/admin/dashboard',
  },
};

// Helper functions for common API operations
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  
  signup: (userData: { name: string; email: string; password: string; phone?: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData),
  
  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
  
  checkAuth: () => apiClient.get(API_ENDPOINTS.AUTH.CHECK),
};

export const adminAuthAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiClient.post(API_ENDPOINTS.ADMIN_AUTH.LOGIN, credentials),
  
  logout: () => apiClient.post(API_ENDPOINTS.ADMIN_AUTH.LOGOUT),
  
  checkAuth: () => apiClient.get(API_ENDPOINTS.ADMIN_AUTH.CHECK),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post(API_ENDPOINTS.ADMIN_AUTH.CHANGE_PASSWORD, data),
};

export const servicesAPI = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get(API_ENDPOINTS.SERVICES.LIST, params),
  
  getById: (id: number) =>
    apiClient.get(API_ENDPOINTS.SERVICES.GET(id)),
  
  create: (data: any) =>
    apiClient.post(API_ENDPOINTS.SERVICES.CREATE, data),
  
  update: (id: number, data: any) =>
    apiClient.put(API_ENDPOINTS.SERVICES.UPDATE(id), data),
  
  delete: (id: number) =>
    apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id)),
};

export const portfolioAPI = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get(API_ENDPOINTS.PORTFOLIO.LIST, params),
  
  getById: (id: number) =>
    apiClient.get(API_ENDPOINTS.PORTFOLIO.GET(id)),
  
  create: (data: any) =>
    apiClient.post(API_ENDPOINTS.PORTFOLIO.CREATE, data),
  
  update: (id: number, data: any) =>
    apiClient.put(API_ENDPOINTS.PORTFOLIO.UPDATE(id), data),
  
  delete: (id: number) =>
    apiClient.delete(API_ENDPOINTS.PORTFOLIO.DELETE(id)),
};

export const bookingsAPI = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get(API_ENDPOINTS.BOOKINGS.LIST, params),
  
  getById: (id: number) =>
    apiClient.get(API_ENDPOINTS.BOOKINGS.GET(id)),
  
  create: (data: any) =>
    apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, data),
  
  update: (id: number, data: any) =>
    apiClient.put(API_ENDPOINTS.BOOKINGS.UPDATE(id), data),
  
  delete: (id: number) =>
    apiClient.delete(API_ENDPOINTS.BOOKINGS.DELETE(id)),
};

export const uploadAPI = {
  image: (file: File, additionalData?: Record<string, any>) =>
    apiClient.upload(API_ENDPOINTS.UPLOAD.IMAGE, file, additionalData),
  
  video: (file: File, additionalData?: Record<string, any>) =>
    apiClient.upload(API_ENDPOINTS.UPLOAD.VIDEO, file, additionalData),
  
  file: (file: File, additionalData?: Record<string, any>) =>
    apiClient.upload(API_ENDPOINTS.UPLOAD.FILE, file, additionalData),
};

// Error handling helper
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

// Response interceptor for handling common errors
export const setupApiInterceptors = () => {
  // You can add global error handling here
  // For example, redirect to login on 401 errors
};

export default apiClient;