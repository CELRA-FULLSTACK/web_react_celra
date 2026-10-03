import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  permissions: string[];
}

export interface CompanyInfo {
  id: number;
  name: string;
  tax_code: string;
}

export interface AuthState {
  token: string | null;
  user: UserInfo | null;
  company: CompanyInfo | null;
  permissions: string[];
  isAuthenticated: boolean;
}

// Khôi phục trạng thái xác thực từ localStorage khi F5 / mở lại trình duyệt
const loadInitialState = (): AuthState => {
  try {
    const token = localStorage.getItem('celra_token');
    const userStr = localStorage.getItem('celra_user');
    const companyStr = localStorage.getItem('celra_company');
    const permsStr = localStorage.getItem('celra_permissions');

    const user = userStr ? (JSON.parse(userStr) as UserInfo) : null;
    const company = companyStr ? (JSON.parse(companyStr) as CompanyInfo) : null;
    const permissions = permsStr ? (JSON.parse(permsStr) as string[]) : [];

    return {
      token,
      user,
      company,
      permissions: user?.permissions || permissions,
      isAuthenticated: Boolean(token),
    };
  } catch {
    return {
      token: null,
      user: null,
      company: null,
      permissions: [],
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = loadInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user: UserInfo;
        company: CompanyInfo | null;
      }>,
    ) => {
      const { accessToken, user, company } = action.payload;
      state.token = accessToken;
      state.user = user;
      state.company = company;
      state.permissions = user.permissions || [];
      state.isAuthenticated = true;

      // Lưu trữ đồng bộ vào localStorage
      localStorage.setItem('celra_token', accessToken);
      localStorage.setItem('celra_user', JSON.stringify(user));
      if (company) {
        localStorage.setItem('celra_company', JSON.stringify(company));
      } else {
        localStorage.removeItem('celra_company');
      }
      localStorage.setItem(
        'celra_permissions',
        JSON.stringify(user.permissions || []),
      );
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.company = null;
      state.permissions = [];
      state.isAuthenticated = false;

      // Dọn dẹp sạch sẽ localStorage
      localStorage.removeItem('celra_token');
      localStorage.removeItem('celra_user');
      localStorage.removeItem('celra_company');
      localStorage.removeItem('celra_permissions');
    },

    updateUserProfile: (
      state,
      action: PayloadAction<Partial<UserInfo>>,
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('celra_user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
