// src/features/characters/FiltersBar.tsx
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSearchTerm, setFilter, clearFilters } from "./characterSlice";

export default function FiltersBar() {
  const dispatch = useAppDispatch();
  const { searchTerm, filters } = useAppSelector((s) => s.characters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleFilterChange = (key: "species" | "homeworld" | "film", value: string) => {
    dispatch(setFilter({ key, value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* 🔍 Search by name */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="🔍 Search by character name..."
        className="w-full sm:w-1/4 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      />

      {/* 🧩 Filter fields */}
      <div className="flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          value={filters.species}
          onChange={(e) => handleFilterChange("species", e.target.value)}
          placeholder="Filter by species..."
          className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        />

        <input
          type="text"
          value={filters.homeworld}
          onChange={(e) => handleFilterChange("homeworld", e.target.value)}
          placeholder="Filter by homeworld..."
          className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        />

        <input
          type="text"
          value={filters.film}
          onChange={(e) => handleFilterChange("film", e.target.value)}
          placeholder="Filter by film..."
          className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        />

        <button
          onClick={() => dispatch(clearFilters())}
          className="px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
