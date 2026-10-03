import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { ForbiddenPage } from '../../pages/Error/ForbiddenPage';

interface RequirePermissionProps {
  permission: string;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
}) => {
  const { user, permissions } = useAppSelector((state) => state.auth);

  // System admin có toàn quyền
  if (user?.role === 'SYSTEM_ADMIN') {
    return <Outlet />;
  }

  // Kiểm tra permission cụ thể
  const hasPermission = permissions.includes(permission);
  if (!hasPermission) {
    return <ForbiddenPage />;
  }

  return <Outlet />;
};
