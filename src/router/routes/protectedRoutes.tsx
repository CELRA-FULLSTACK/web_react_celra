import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../components/layouts/MainLayout/MainLayout';
import { DashboardPage } from '../../pages/Dashboard/DashboardPage';
import { EmployeeListPage } from '../../pages/Employees/EmployeeListPage';
import { CustomerManagementPage } from '../../pages/Customers/CustomerManagementPage';
import { RoleManagementPage } from '../../pages/Roles/RoleManagementPage';
import { RequireAuth } from '../guards/RequireAuth';
import { RequirePermission } from '../guards/RequirePermission';

export const protectedRoutes: RouteObject[] = [
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            element: <RequirePermission permission="employee:view" />,
            children: [
              {
                path: '/employees',
                element: <EmployeeListPage />,
              },
            ],
          },
          {
            element: <RequirePermission permission="customer:view" />,
            children: [
              {
                path: '/customers',
                element: <CustomerManagementPage />,
              },
            ],
          },
          {
            element: <RequirePermission permission="employee:view" />,
            children: [
              {
                path: '/roles',
                element: <RoleManagementPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];
