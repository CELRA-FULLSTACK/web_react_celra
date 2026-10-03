import { apiInstance, type ApiResponse } from './core.api';

export interface EmployeeRole {
  id: number;
  code: string;
  name: string;
}

export interface Employee {
  id: number;
  company_id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  roles: EmployeeRole[];
  created_at: string;
}

export interface CreateEmployeePayload {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role_id: number;
}

export interface UpdateEmployeePayload {
  full_name?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  role_id?: number;
  new_password?: string;
}

export const getEmployeesApi = (): Promise<ApiResponse<Employee[]>> => {
  return apiInstance.get('/users');
};

export const getEmployeeDetailApi = (
  id: number,
): Promise<ApiResponse<Employee>> => {
  return apiInstance.get(`/users/${id}`);
};

export const createEmployeeApi = (
  payload: CreateEmployeePayload,
): Promise<ApiResponse<Employee>> => {
  return apiInstance.post('/users', payload);
};

export const updateEmployeeApi = (
  id: number,
  payload: UpdateEmployeePayload,
): Promise<ApiResponse<Employee>> => {
  return apiInstance.patch(`/users/${id}`, payload);
};

export const deleteEmployeeApi = (
  id: number,
): Promise<ApiResponse<{ message: string }>> => {
  return apiInstance.delete(`/users/${id}`);
};
