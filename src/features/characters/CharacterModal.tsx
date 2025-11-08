// src/features/characters/CharacterModal.tsx
import { useEffect, useState } from "react";
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      {/* Animated background stars */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent), radial-gradient(2px 2px at 30% 80%, white, transparent)',
        backgroundSize: '200% 200%',
      }}></div>

      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div className="relative max-w-xl w-full">
        {/* Outer glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-3xl blur opacity-40 animate-pulse"></div>
        
        {/* Modal container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl border-4 border-yellow-400/50 shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-400/60"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-400/60"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-400/60"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-400/60"></div>

          {/* Close button */}
          <button
            className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-90 shadow-lg border-2 border-red-400"
            onClick={onClose}
          >
            ✖
          </button>

          {/* Content */}
          <div className="relative p-6 pt-8">
            {/* Character name header */}
            <div className="text-center mb-5">
              <h2 className="text-3xl font-extrabold tracking-wider mb-2">
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(250,204,21,0.9)]">
                  {character.name.toUpperCase()}
                </span>
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
            </div>

            {loading ? (
              <div className="text-center py-6">
                <div className="text-yellow-400 text-lg font-bold mb-2 animate-pulse">
                  ⭐ ACCESSING GALACTIC DATABASE ⭐
                </div>
                <div className="text-gray-400 text-sm">Loading homeworld details...</div>
              </div>
            ) : (
              <>
                {/* Character stats section */}
                <div className="mb-5">
                  <h3 className="text-yellow-400 text-lg font-bold mb-3 tracking-wider flex items-center gap-2">
                    <span className="text-xl">👤</span> CHARACTER PROFILE
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                      <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Height</div>
                      <div className="text-yellow-400 text-base font-bold">
                        {(Number(character.height) / 100).toFixed(2)} m
                      </div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                      <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Mass</div>
                      <div className="text-yellow-400 text-base font-bold">{character.mass} kg</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                      <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Birth Year</div>
                      <div className="text-yellow-400 text-base font-bold">{character.birth_year}</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                      <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Films</div>
                      <div className="text-yellow-400 text-base font-bold">{character.films.length} Appearances</div>
                    </div>
                  </div>
                  
                  {/* Date added */}
                  <div className="mt-2 bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30">
                    <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Database Entry Date</div>
                    <div className="text-yellow-400 text-base font-bold">
                      {new Date(character.created).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                </div>

                {/* Homeworld section */}
                {homeworld && (
                  <div>
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent mb-5"></div>
                    
                    <h3 className="text-yellow-400 text-lg font-bold mb-3 tracking-wider flex items-center gap-2">
                      <span className="text-xl">🌍</span> HOMEWORLD DATA
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                        <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Planet Name</div>
                        <div className="text-cyan-400 text-lg font-bold">{homeworld.name}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                          <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Terrain</div>
                          <div className="text-cyan-400 text-base font-bold capitalize">{homeworld.terrain}</div>
                        </div>
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                          <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Climate</div>
                          <div className="text-cyan-400 text-base font-bold capitalize">{homeworld.climate}</div>
                        </div>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                        <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Population</div>
                        <div className="text-cyan-400 text-base font-bold">
                          {homeworld.population === "unknown" 
                            ? "Unknown" 
                            : Number(homeworld.population).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}