import { apiInstance, type ApiResponse } from './core.api';

export interface ComplianceProfileData {
  id?: number;
  company_id: number;
  total_employees: number;
  probation_employees: number;
  official_employees: number;
  has_internal_labor_rules: boolean;
  has_registered_labor_rules: boolean;
  has_signed_all_labor_contracts: boolean;
  has_social_insurance_registration: boolean;
  tax_declaration_cycle: string;
  accounting_standard: string;
  has_electronic_invoices: boolean;
  has_digital_signature: boolean;
  business_licenses?: Array<{
    name: string;
    license_number?: string;
    issued_date?: string;
    expiry_date?: string;
    status: 'ACTIVE' | 'EXPIRED' | 'MISSING';
  }> | null;
  completeness_score: number;
}

export const complianceProfileApi = {
  getProfile: async (): Promise<ApiResponse<ComplianceProfileData>> => {
    return apiInstance.get('/compliance/profile');
  },
  updateProfile: async (
    data: Partial<ComplianceProfileData>,
  ): Promise<ApiResponse<ComplianceProfileData>> => {
    return apiInstance.put('/compliance/profile', data);
  },
};
