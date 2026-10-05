import { apiInstance, type ApiResponse } from './core.api';

export interface EvidenceData {
  id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  verified_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploaded_by_user_id: number | null;
  uploaded_by?: {
    id: number;
    full_name: string;
    username: string;
  } | null;
  task?: {
    id: number;
    title: string;
    status: string;
  };
  created_at: string;
}

export const evidenceApi = {
  uploadTaskEvidence: async (
    taskId: number,
    file: File,
  ): Promise<ApiResponse<EvidenceData>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiInstance.post(`/evidences/tasks/${taskId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getCompanyEvidences: async (): Promise<ApiResponse<EvidenceData[]>> => {
    return apiInstance.get('/evidences');
  },
  deleteEvidence: async (
    id: number,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    return apiInstance.delete(`/evidences/${id}`);
  },
};
