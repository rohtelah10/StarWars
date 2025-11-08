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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row md:items-end gap-4">
      {/* Search */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Search by Name</label>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="e.g. Luke Skywalker"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Species */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Species</label>
        <select
          value={filters.species}
          onChange={(e) => dispatch(setFilter({ key: "species", value: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="">All</option>
          {speciesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Homeworld */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Homeworld</label>
        <select
          value={filters.homeworld}
          onChange={(e) => dispatch(setFilter({ key: "homeworld", value: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="">All</option>
          {homeworldOptions.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {/* Film */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Film</label>
        <select
          value={filters.film}
          onChange={(e) => dispatch(setFilter({ key: "film", value: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="">All</option>
          {filmOptions.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Clear */}
      <button
        onClick={() => dispatch(clearFilters())}
        className="self-start md:self-end px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        Clear
      </button>
    </div>
  );
}
