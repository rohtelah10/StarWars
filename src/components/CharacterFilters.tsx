import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSearchTerm, setFilter, clearFilters } from "../features/characters/characterSlice";

export default function CharacterFilters() {
  const dispatch = useAppDispatch();
  const { filters, characters, searchTerm } = useAppSelector((s) => s.characters);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce the search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
    }, 500);
    return () => clearTimeout(timeout);
  }, [localSearch, dispatch]);

  // Unique filter options derived from loaded characters
  const speciesOptions = Array.from(
    new Set(characters.flatMap((c) => c.species))
  ).filter(Boolean);
  const homeworldOptions = Array.from(
    new Set(characters.map((c) => c.homeworld))
  ).filter(Boolean);
  const filmOptions = Array.from(
    new Set(characters.flatMap((c) => c.films))
  ).filter(Boolean);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row md:items-end gap-4">
      {/* Search Bar */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Search by Name
        </label>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="e.g. Luke Skywalker"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Species Filter */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Species
        </label>
        <select
          value={filters.species}
          onChange={(e) => dispatch(setFilter({ key: "species", value: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="">All</option>
          {speciesOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Homeworld Filter */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Homeworld
        </label>
        <select
          value={filters.homeworld}
          onChange={(e) => dispatch(setFilter({ key: "homeworld", value: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="">All</option>
          {homeworldOptions.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {/* Film Filter */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Film
        </label>
        <select
          value={filters.film}
          onChange={(e) => dispatch(setFilter({ key: "film", value: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="">All</option>
          {filmOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => dispatch(clearFilters())}
        className="self-start md:self-end px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        Clear
      </button>
    </div>
  );
}
