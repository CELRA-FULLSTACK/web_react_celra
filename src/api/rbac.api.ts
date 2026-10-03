import { apiInstance, type ApiResponse } from './core.api';

export interface AssignableRole {
  id: number;
  code: string;
  name: string;
  description: string | null;
}

export const getAssignableRolesApi = (): Promise<ApiResponse<AssignableRole[]>> => {
  return apiInstance.get('/rbac/roles');
};
