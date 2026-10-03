import type { RouteObject } from 'react-router-dom';
import { AuthLayout } from '../../components/layouts/AuthLayout/AuthLayout';
import { ForgotPasswordPage } from '../../pages/Auth/ForgotPasswordPage';
import { LoginPage } from '../../pages/Auth/LoginPage';
import { RegisterCompanyPage } from '../../pages/Auth/RegisterCompanyPage';
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage';

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register-company',
        element: <RegisterCompanyPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
    ],
  },
];
