import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSearchTerm, setFilter, clearFilters } from "../features/characters/characterSlice";

type ResourceNameMap = Record<string, string>;

export default function CharacterFilters() {
  const dispatch = useAppDispatch();
  const { filters, characters, searchTerm } = useAppSelector((s) => s.characters);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [nameCache, setNameCache] = useState<ResourceNameMap>({});

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
    }, 500);
    return () => clearTimeout(timeout);
  }, [localSearch, dispatch]);

  const fetchResourceName = async (url: string): Promise<string> => {
    if (nameCache[url]) return nameCache[url];
    try {
      const res = await fetch(url);
      const data = await res.json();
      const name = data.name || data.title || "Unknown";
      setNameCache((prev) => ({ ...prev, [url]: name }));
      return name;
    } catch {
      return "Unknown";
    }
  };

  useEffect(() => {
    const resolveAll = async () => {
      const urls = new Set<string>();
      characters.forEach((c) => {
        if (Array.isArray(c.species)) c.species.forEach((url) => urls.add(url));
        if (c.homeworld) urls.add(c.homeworld);
        if (Array.isArray(c.films)) c.films.forEach((url) => urls.add(url));
      });
      for (const url of urls) {
        if (!nameCache[url]) await fetchResourceName(url);
      }
    };
    if (characters.length > 0) resolveAll();
  }, [characters]);

  const speciesOptions = Array.from(new Set(characters.flatMap((c) => c.species.map((url) => nameCache[url] || url)))).filter(Boolean);
  const homeworldOptions = Array.from(new Set(characters.map((c) => nameCache[c.homeworld] || c.homeworld))).filter(Boolean);
  const filmOptions = Array.from(new Set(characters.flatMap((c) => c.films.map((url) => nameCache[url] || url)))).filter(Boolean);

  return (
    <div className="relative mb-8">
      {/* Outer glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-2xl blur opacity-20"></div>
      
      {/* Main container */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 rounded-2xl shadow-2xl border-4 border-yellow-400/40 overflow-hidden">
        {/* Star field overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent)',
          backgroundSize: '200% 200%',
        }}></div>

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-yellow-400/50"></div>
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-yellow-400/50"></div>
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-yellow-400/50"></div>
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-yellow-400/50"></div>

        <div className="relative z-10">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold tracking-widest">
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(250,204,21,0.8)]">
                🔍 GALACTIC SEARCH FILTERS
              </span>
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent mt-2"></div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold mb-2 text-yellow-400 uppercase tracking-wider">
                Character Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="e.g. Luke Skywalker"
                  className="w-full px-4 py-2 border-2 border-yellow-400/30 focus:border-yellow-400 rounded-lg bg-black/40 backdrop-blur-sm text-yellow-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400/50">
                  🔍
                </div>
              </div>
            </div>

            {/* Species */}
            <div>
              <label className="block text-xs font-bold mb-2 text-cyan-400 uppercase tracking-wider">
                Species
              </label>
              <select
                value={filters.species}
                onChange={(e) => dispatch(setFilter({ key: "species", value: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-cyan-400/30 focus:border-cyan-400 rounded-lg bg-black/40 backdrop-blur-sm text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">All Species</option>
                {speciesOptions.map((s) => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
              </select>
            </div>

            {/* Homeworld */}
            <div>
              <label className="block text-xs font-bold mb-2 text-purple-400 uppercase tracking-wider">
                Homeworld
              </label>
              <select
                value={filters.homeworld}
                onChange={(e) => dispatch(setFilter({ key: "homeworld", value: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-purple-400/30 focus:border-purple-400 rounded-lg bg-black/40 backdrop-blur-sm text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">All Planets</option>
                {homeworldOptions.map((h) => <option key={h} value={h} className="bg-slate-900">{h}</option>)}
              </select>
            </div>

            {/* Film */}
            <div>
              <label className="block text-xs font-bold mb-2 text-green-400 uppercase tracking-wider">
                Film
              </label>
              <select
                value={filters.film}
                onChange={(e) => dispatch(setFilter({ key: "film", value: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-green-400/30 focus:border-green-400 rounded-lg bg-black/40 backdrop-blur-sm text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">All Films</option>
                {filmOptions.map((f) => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
              </select>
            </div>
          </div>

          {/* Clear Button */}
          <div className="flex justify-center">
            <button
              onClick={() => dispatch(clearFilters())}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50 border-2 border-red-400 uppercase tracking-wider text-sm"
            >
              ⚠️ Clear All Filters
            </button>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      </div>
    </div>
  );
}