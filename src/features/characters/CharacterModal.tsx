// src/features/characters/CharacterModal.tsx
import React, { useEffect, useState } from "react";
import type { Character } from "./characterSlice";
import { fetchHomeworld } from "../../utils/api";

interface CharacterModalProps {
  character: Character | null;
  onClose: () => void;
}

interface Homeworld {
  name: string;
  terrain: string;
  climate: string;
  population: string;
}

export default function CharacterModal({ character, onClose }: CharacterModalProps) {
  const [homeworld, setHomeworld] = useState<Homeworld | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (character) {
      setLoading(true);
      fetchHomeworld(character.homeworld)
        .then(setHomeworld)
        .finally(() => setLoading(false));
    }
  }, [character]);

  if (!character) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-3">{character.name}</h2>

        {loading ? (
          <p className="text-gray-500">Loading homeworld details...</p>
        ) : (
          <>
            <div className="space-y-2 text-gray-700 dark:text-gray-200">
              <p>
                <strong>Height:</strong> {(Number(character.height) / 100).toFixed(2)} m
              </p>
              <p>
                <strong>Mass:</strong> {character.mass} kg
              </p>
              <p>
                <strong>Birth Year:</strong> {character.birth_year}
              </p>
              <p>
                <strong>Films:</strong> {character.films.length}
              </p>
              <p>
                <strong>Date Added:</strong>{" "}
                {new Date(character.created).toLocaleDateString("en-GB")}
              </p>
            </div>

            {homeworld && (
              <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-3">
                <h3 className="font-semibold mb-2">🌍 Homeworld</h3>
                <p>
                  <strong>Name:</strong> {homeworld.name}
                </p>
                <p>
                  <strong>Terrain:</strong> {homeworld.terrain}
                </p>
                <p>
                  <strong>Climate:</strong> {homeworld.climate}
                </p>
                <p>
                  <strong>Population:</strong> {homeworld.population}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
