import { apiInstance, type ApiResponse } from './core.api';
import type { EvidenceData } from './evidence.api';

export interface ComplianceTaskData {
  id: number;
  company_id: number;
  assessment_item_id: number | null;
  title: string;
  description: string | null;
  legal_reference: string | null;
  action_guide: string | null;
  severity: 'CRITICAL' | 'MAJOR' | 'STANDARD';
  status: 'TODO' | 'IN_PROGRESS' | 'RESOLVE' | 'DONE';
  deadline: string | null;
  assigned_to_user_id: number | null;
  assigned_to?: {
    id: number;
    full_name: string;
    username: string;
  } | null;
  completion_note: string | null;
  completed_at: string | null;
  evidences?: EvidenceData[];
  created_at: string;
}

export interface KanbanBoardData {
  TODO: ComplianceTaskData[];
  IN_PROGRESS: ComplianceTaskData[];
  RESOLVE: ComplianceTaskData[];
  DONE: ComplianceTaskData[];
}

export interface FilterTaskParams {
  status?: string;
  severity?: string;
  assigned_to?: number;
  search?: string;
}

export const taskApi = {
  getTasks: async (
    params?: FilterTaskParams,
  ): Promise<ApiResponse<ComplianceTaskData[]>> => {
    return apiInstance.get('/tasks', { params });
  },
  getKanbanBoard: async (): Promise<ApiResponse<KanbanBoardData>> => {
    return apiInstance.get('/tasks/kanban');
  },
  getTaskDetail: async (
    id: number,
  ): Promise<ApiResponse<ComplianceTaskData>> => {
    return apiInstance.get(`/tasks/${id}`);
  },
  updateTaskStatus: async (
    id: number,
    status: 'TODO' | 'IN_PROGRESS' | 'RESOLVE' | 'DONE',
    completion_note?: string,
  ): Promise<ApiResponse<ComplianceTaskData>> => {
    return apiInstance.patch(`/tasks/${id}/status`, { status, completion_note });
  },
  assignTask: async (
    id: number,
    userId: number,
  ): Promise<ApiResponse<ComplianceTaskData>> => {
    return apiInstance.patch(`/tasks/${id}/assign`, { user_id: userId });
  },
};
