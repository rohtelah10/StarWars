// src/pages/Home.tsx
import React from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout, refreshToken } from "../features/auth/authSlice";
import CharacterList from "../features/characters/CharacterList";
import CharacterFilters from "../components/CharacterFilters";

export default function Home() {
  const dispatch = useAppDispatch();
  const { user, token, status } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRefresh = () => {
    dispatch(refreshToken());
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* 🌌 Top Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-xl font-semibold">
          🌌 Star Wars Characters Dashboard
        </h1>

        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm text-gray-700 dark:text-gray-200">
              Logged in as <span className="font-medium">{user.name}</span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={status === "loading"}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md"
          >
            Refresh Token
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 🌠 Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Welcome, {user?.name || "Jedi"}!
        </h2>

         <CharacterFilters />

        {/* Character List Component */}
        <CharacterList />
      </main>
    </div>
  );
}
