// src/features/auth/SignupForm.tsx
import React, { useState, useEffect } from 'react';
import { signup } from './authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (auth.user && auth.token) {
      navigate('/', { replace: true });
    }
  }, [auth.user, auth.token, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(signup({ email, password, name }));
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white/80 dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
      {auth.error && <div className="text-sm text-red-600 mb-3">{auth.error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-green-600 text-white"
          disabled={auth.status === 'loading'}
        >
          {auth.status === 'loading' ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
