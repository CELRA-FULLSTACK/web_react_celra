import { apiInstance, type ApiResponse } from './core.api';

export interface RegisterCompanyPayload {
  company_name: string;
  tax_code: string;
  company_email: string;
  company_phone?: string;
  address?: string;
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: string;
    permissions: string[];
  };
  company: {
    id: number;
    name: string;
    tax_code: string;
  } | null;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export const registerCompanyApi = (
  payload: RegisterCompanyPayload,
): Promise<ApiResponse<{ company: unknown; user: unknown }>> => {
  return apiInstance.post('/auth/register-company', payload);
};

export const loginApi = (
  payload: LoginPayload,
): Promise<ApiResponse<LoginResponseData>> => {
  return apiInstance.post('/auth/login', payload);
};

export const forgotPasswordApi = (
  payload: ForgotPasswordPayload,
): Promise<ApiResponse<{ message: string }>> => {
  return apiInstance.post('/auth/forgot-password', payload);
};

export const resetPasswordApi = (
  payload: ResetPasswordPayload,
): Promise<ApiResponse<{ message: string }>> => {
  return apiInstance.post('/auth/reset-password', payload);
};
