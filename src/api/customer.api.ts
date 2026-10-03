import { apiInstance, type ApiResponse } from './core.api';

export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface ToggleCustomerStatusPayload {
  status: 'ACTIVE' | 'INACTIVE';
}

export const getCustomersApi = (params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ items: Customer[]; pagination: { page: number; limit: number; total: number } }>> => {
  return apiInstance.get('/customers', { params });
};

export const createCustomerApi = (
  payload: CreateCustomerPayload,
): Promise<ApiResponse<Customer>> => {
  return apiInstance.post('/customers', payload);
};

export const updateCustomerApi = (
  id: number,
  payload: UpdateCustomerPayload,
): Promise<ApiResponse<Customer>> => {
  return apiInstance.patch(`/customers/${id}`, payload);
};

export const toggleCustomerStatusApi = (
  id: number,
  payload: ToggleCustomerStatusPayload,
): Promise<ApiResponse<{ message: string }>> => {
  return apiInstance.patch(`/customers/${id}/status`, payload);
};
