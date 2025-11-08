import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCharacters, setPage } from "./characterSlice";
import type { Character } from "./characterSlice";
import CharacterModal from "./CharacterModal";

export default function CharacterList() {
  const dispatch = useAppDispatch();
  const { characters, loading, error, page, totalCount, searchTerm, filters } = useAppSelector((s) => s.characters);
  const [selected, setSelected] = useState<Character | null>(null);

  useEffect(() => {
    dispatch(fetchCharacters({ page, searchTerm, filters }));
  }, [dispatch, page, searchTerm, filters]);

  if (loading) return <p className="text-center text-gray-500 mt-8">Loading characters...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">Failed to load characters: {error}</p>;

  return (
    <div>
      {/* <CharacterFilters /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((char) => (
          <div
            key={char.name}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center"
            onClick={() => setSelected(char)}
          >
            <img
              src={`https://picsum.photos/seed/${char.name}/200`}
              alt={char.name}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{char.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{char.species.length > 0 ? "Unique Species" : "Human (default)"}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          disabled={page === 1}
          onClick={() => dispatch(setPage(page - 1))}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-sm rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {Math.ceil(totalCount / 10)}
        </span>
        <button
          disabled={page * 10 >= totalCount}
          onClick={() => dispatch(setPage(page + 1))}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-sm rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selected && <CharacterModal character={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
