import React from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout, refreshToken } from "../features/auth/authSlice";
import CharacterList from "../features/characters/CharacterList";
import CharacterFilters from "../components/CharacterFilters";

// Map species to accent colors
const speciesColors: Record<string, string> = {
  Human: "bg-red-700/70",
  Droid: "bg-blue-700/70",
  Wookiee: "bg-orange-700/70",
  "Twi'lek": "bg-purple-700/70",
  Rodian: "bg-green-700/70",
  default: "bg-gray-800/70",
};

export default function Home() {
  const dispatch = useAppDispatch();
  const { user, token, status } = useAppSelector((s) => s.auth);

  const handleLogout = () => dispatch(logout());
  const handleRefresh = () => dispatch(refreshToken());

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url('https://lumiere-a.akamaihd.net/v1/images/star-wars-backgrounds-14_856985d9.jpeg')` }}
    >
      {/* 🌌 Top Navbar */}
      <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-black/70 backdrop-blur-md shadow-lg border-b border-yellow-500">
    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wider drop-shadow-xl flex items-center gap-2">
  ★ STAR WARS CHARACTERS ★
</h1>

        <div className="flex items-center gap-4 mt-2 md:mt-0">
          {user && (
            <div className="text-sm text-gray-200 hidden md:block">
              Logged in as <span className="font-bold text-yellow-400">{user.name}</span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={status === "loading"}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-md shadow-lg glow"
          >
            Refresh <span className="hidden md:inline">Token</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-md shadow-lg glow"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 🌠 Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-center text-red-400 drop-shadow-lg">
          Welcome, {user?.name || "Jedi"}!
        </h2>

        {/* Filters */}
        <CharacterFilters />

        {/* Character List */}
        <div className="">
          <CharacterList speciesColors={speciesColors} />
        </div>
      </main>
    </div>
  );
}
