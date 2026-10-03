import React from 'react';
import { BrowserRouter, Navigate, type RouteObject, useRoutes } from 'react-router-dom';
import { authRoutes } from './routes/authRoutes';
import { protectedRoutes } from './routes/protectedRoutes';

const fallbackRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];

const RoutesRenderer: React.FC = () => {
  const routes = useRoutes([...authRoutes, ...protectedRoutes, ...fallbackRoutes]);
  return routes;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <RoutesRenderer />
    </BrowserRouter>
  );
};
