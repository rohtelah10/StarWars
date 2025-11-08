import React, { useState, useEffect } from "react";
import { signup } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate, Link } from "react-router-dom";

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (auth.user && auth.token) navigate("/", { replace: true });
  }, [auth.user, auth.token, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(signup({ name, email, password }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('https://wallpapers.com/images/featured/star-wars-plzcoaffexgf4h81.jpg')` }}
    >
      <div className="w-full max-w-md p-8 bg-black/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-700">
        <h2 className="text-3xl font-bold text-blue-500 text-center mb-6 tracking-widest">
          GALACTIC SIGN UP
        </h2>

        {auth.error && (
          <div className="text-red-500 mb-4 text-center font-semibold">
            {auth.error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-700 outline-none"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-700 outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-700 outline-none"
            required
          />
          <button
            type="submit"
            disabled={auth.status === "loading"}
            className="w-full py-2 bg-blue-700 hover:bg-blue-500 rounded-md font-bold text-black uppercase tracking-wide transition-all duration-300"
          >
            {auth.status === "loading" ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
