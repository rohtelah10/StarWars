import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './features/auth/LoginForm';
import SignupForm from './features/auth/SignupForm';
import PrivateRoute from './features/auth/PrivateRoute';
import Home from './pages/Home'; // your app home
import { useAppDispatch, useAppSelector } from './app/hooks';
import { refreshToken } from './features/auth/authSlice';

export default function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  // Simple silent refresh simulator: every 4 minutes try to refresh if logged in.
  useEffect(() => {
    if (!auth.token) return;
    const interval = setInterval(() => {
      dispatch(refreshToken());
    }, 4 * 60 * 1000); // 4 minutes

    return () => clearInterval(interval);
  }, [auth.token, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          {/* add other private routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
