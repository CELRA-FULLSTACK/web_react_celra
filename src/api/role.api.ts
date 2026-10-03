import { apiInstance, type ApiResponse } from './core.api';

export type RolePermission = {
  resource: string;
  actions: string[];
};

export type SystemResource = {
  resource: string;
  label: string;
};

export type Role = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_system: boolean;
  permission_matrix: RolePermission[] | null;
  created_at: string;
};

export type CreateRolePayload = {
  name: string;
  code: string;
  description?: string;
  permissions?: RolePermission[];
};

export type UpdateRolePayload = {
  name?: string;
  description?: string;
};

export const getRolesApi = (): Promise<ApiResponse<{ roles: Role[]; systemResources: SystemResource[] }>> => {
  return apiInstance.get('/roles');
};

export const getRoleByIdApi = (id: number): Promise<ApiResponse<Role>> => {
  return apiInstance.get(`/roles/${id}`);
};

export const createRoleApi = (payload: CreateRolePayload): Promise<ApiResponse<Role>> => {
  return apiInstance.post('/roles', payload);
};

export const updateRoleApi = (id: number, payload: UpdateRolePayload): Promise<ApiResponse<Role>> => {
  return apiInstance.put(`/roles/${id}`, payload);
};

export const updateRolePermissionsApi = (
  id: number,
  permissions: RolePermission[],
): Promise<ApiResponse<Role>> => {
  return apiInstance.put(`/roles/${id}/permissions`, { permissions });
};

export const deleteRoleApi = (id: number): Promise<ApiResponse<{ message: string }>> => {
  return apiInstance.delete(`/roles/${id}`);
};
