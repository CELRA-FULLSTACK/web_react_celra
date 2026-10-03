import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export interface ApiResponse<T = unknown> {
  code: number;
  status: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động đính kèm Bearer Token
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('celra_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Bóc tách ApiResponse và xử lý 401 Unauthorized
apiInstance.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data từ format chuẩn backend { code, status, message, data }
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Hết hạn hoặc sai token -> Xóa thông tin đăng nhập
      localStorage.removeItem('celra_token');
      localStorage.removeItem('celra_user');
      localStorage.removeItem('celra_company');
      localStorage.removeItem('celra_permissions');

      // Chuyển hướng về trang đăng nhập nếu không phải đang ở trang auth
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        !currentPath.includes('/forgot-password') &&
        !currentPath.includes('/reset-password')
      ) {
        window.location.href = '/login';
      }
    }

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Có lỗi xảy ra, vui lòng thử lại sau';

    return Promise.reject(new Error(errorMessage));
  },
);
