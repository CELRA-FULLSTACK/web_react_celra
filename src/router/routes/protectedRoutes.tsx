import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../components/layouts/MainLayout/MainLayout';
import { DashboardPage } from '../../pages/Dashboard/DashboardPage';
import { EmployeeListPage } from '../../pages/Employees/EmployeeListPage';
import { RoleManagementPage } from '../../pages/Roles/RoleManagementPage';
import { ComplianceProfilePage } from '../../pages/Compliance/ComplianceProfilePage';
import { AssessmentReportPage } from '../../pages/Compliance/AssessmentReportPage';
import { KanbanBoardPage } from '../../pages/Compliance/KanbanBoardPage';
import { DocumentVaultPage } from '../../pages/Compliance/DocumentVaultPage';
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
            path: '/compliance/profile',
            element: <ComplianceProfilePage />,
          },
          {
            path: '/compliance/assessment',
            element: <AssessmentReportPage />,
          },
          {
            path: '/compliance/kanban',
            element: <KanbanBoardPage />,
          },
          {
            path: '/compliance/documents',
            element: <DocumentVaultPage />,
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
