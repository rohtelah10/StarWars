import React, { useState, useEffect } from "react";
import { login } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("demo@starwars.dev");
  const [password, setPassword] = useState("password123");

  useEffect(() => {
    if (auth.user && auth.token) navigate("/", { replace: true });
  }, [auth.user, auth.token, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ email, password }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('https://wallpapers.com/images/featured/star-wars-plzcoaffexgf4h81.jpg')` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Animated stars overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent)',
        backgroundSize: '200% 200%',
      }}></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Outer red glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-2xl blur opacity-50 animate-pulse"></div>
        
        {/* Login container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-2xl shadow-2xl border-4 border-red-500/50 overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-500/60"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-500/60"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-red-500/60"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-500/60"></div>

          <div className="relative p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="mb-3">
                <span className="text-6xl">⚔️</span>
              </div>
              <h2 className="text-4xl font-extrabold tracking-widest mb-2">
                <span className="bg-gradient-to-r from-red-300 via-red-500 to-red-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(239,68,68,0.9)]">
                  IMPERIAL ACCESS
                </span>
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent"></div>
              <p className="text-gray-400 text-sm mt-3 tracking-wider uppercase">Restricted Authorization Required</p>
            </div>

            {/* Error message */}
            {auth.error && (
              <div className="mb-6 p-3 bg-red-950/50 backdrop-blur-sm border-2 border-red-500 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <p className="text-red-400 font-semibold text-sm">{auth.error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email input */}
              <div>
                <label className="block text-xs font-bold mb-2 text-red-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operative@empire.gov"
                    className="w-full px-4 py-3 rounded-lg border-2 border-red-500/30 focus:border-red-500 bg-black/40 backdrop-blur-sm text-red-400 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500/50">
                    👤
                  </div>
                </div>
              </div>

              {/* Password input */}
              <div>
                <label className="block text-xs font-bold mb-2 text-red-400 uppercase tracking-wider">
                  Access Code
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border-2 border-red-500/30 focus:border-red-500 bg-black/40 backdrop-blur-sm text-red-400 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500/50">
                    🔒
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={auth.status === "loading"}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg font-bold text-white uppercase tracking-widest transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50 border-2 border-red-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {auth.status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-pulse">⭐</span>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    
                    Access System
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-red-500/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-gray-500 tracking-wider">or</span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Need Imperial Clearance?{" "}
                <Link 
                  to="/signup" 
                  className="text-red-400 hover:text-red-300 font-bold underline decoration-red-500/50 hover:decoration-red-400 transition-colors"
                >
                  Request Access
                </Link>
              </p>
            </div>

          </div>

          {/* Bottom accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}