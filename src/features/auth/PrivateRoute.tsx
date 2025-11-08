// src/features/auth/PrivateRoute.tsx
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Navigate, Outlet } from 'react-router-dom';

// For v6 we can use an element wrapper in routes:
// <Route element={<PrivateRoute/>}> <Route path="/" element={<Home/>} /> </Route>
export default function PrivateRoute() {
  const auth = useAppSelector((s) => s.auth);
  const isAuthenticated = !!auth.user && !!auth.token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
