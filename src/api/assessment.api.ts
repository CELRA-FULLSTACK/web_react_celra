import { apiInstance, type ApiResponse } from './core.api';

export interface AssessmentItemData {
  id: number;
  assessment_id: number;
  requirement_id: number | null;
  title: string;
  legal_reference: string;
  severity: 'CRITICAL' | 'MAJOR' | 'STANDARD';
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'MISSING_EVIDENCE' | 'NEED_EXPERT';
  gap_reason: string | null;
  recommended_action: string | null;
  auto_generated_task_id: number | null;
  created_at: string;
}

export interface ComplianceAssessmentData {
  id: number;
  company_id: number;
  created_by_user_id: number;
  overall_score: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  total_requirements_checked: number;
  compliant_count: number;
  non_compliant_count: number;
  missing_evidence_count: number;
  ai_summary: string | null;
  items: AssessmentItemData[];
  created_at: string;
}

export const assessmentApi = {
  runAssessment: async (): Promise<ApiResponse<ComplianceAssessmentData>> => {
    return apiInstance.post('/compliance/assessments/run');
  },
  getLatestAssessment: async (): Promise<ApiResponse<ComplianceAssessmentData | null>> => {
    return apiInstance.get('/compliance/assessments/latest');
  },
  getAssessmentById: async (
    id: number,
  ): Promise<ApiResponse<ComplianceAssessmentData>> => {
    return apiInstance.get(`/compliance/assessments/${id}`);
  },
};
