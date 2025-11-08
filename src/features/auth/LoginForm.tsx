// src/features/auth/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { login } from './authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('demo@starwars.dev');
  const [password, setPassword] = useState('password123');

  useEffect(() => {
    if (auth.user && auth.token) {
      navigate('/', { replace: true });
    }
  }, [auth.user, auth.token, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ email, password }));
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white/80 dark:bg-gray-800 rounded-xl shadow text-white">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      {auth.error && (
        <div className="text-sm text-red-600 mb-3">{auth.error}</div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 text-black"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 text-black"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-600 text-white"
          disabled={auth.status === 'loading'}
        >
          {auth.status === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm mt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
