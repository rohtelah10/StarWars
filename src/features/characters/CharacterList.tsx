// src/features/characters/CharacterList.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchCharacters, setPage } from "./characterSlice";
import type { Character } from "./characterSlice";
import CharacterModal from "./CharacterModal";

export default function CharacterList() {
  const dispatch = useAppDispatch();
  const { characters, loading, error, page, totalCount, searchTerm, filters } =
    useAppSelector((s) => s.characters);

  const [selected, setSelected] = useState<Character | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});
  const [speciesNames, setSpeciesNames] = useState<Record<string, string>>({});

  const UNSPLASH_KEY = "GgFaeMc10F647oeyVQr-CCRqTliE0oY8ahMbYWZaapE";

  // Fetch Unsplash images
  async function fetchCharacterImage(name: string): Promise<string> {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          name + " star wars"
        )}&client_id=${UNSPLASH_KEY}&per_page=1`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
      return `https://picsum.photos/seed/${name}/400/600`;
    } catch {
      return `https://picsum.photos/seed/${name}/400/600`;
    }
  }

  useEffect(() => {
    characters.forEach(async (char) => {
      if (!images[char.name]) {
        const url = await fetchCharacterImage(char.name);
        setImages((prev) => ({ ...prev, [char.name]: url }));
      }
    });
  }, [characters]);

  // Fetch species names
  useEffect(() => {
    const fetchSpeciesNames = async () => {
      const urls = new Set<string>();
      characters.forEach((c) => c.species.forEach((url) => urls.add(url)));

      for (const url of urls) {
        if (!speciesNames[url]) {
          try {
            const res = await fetch(url);
            const data = await res.json();
            setSpeciesNames((prev) => ({ ...prev, [url]: data.name || "Unknown" }));
          } catch {
            setSpeciesNames((prev) => ({ ...prev, [url]: "Unknown" }));
          }
        }
      }
    };
    if (characters.length > 0) fetchSpeciesNames();
  }, [characters]);

  const speciesColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    Human: { 
      bg: "from-slate-900 via-blue-900 to-indigo-950",
      text: "from-blue-300 via-cyan-400 to-sky-300",
      border: "border-cyan-400/40 group-hover:border-cyan-400/80",
      glow: "from-cyan-400 via-blue-500 to-cyan-400"
    },
    Droid: { 
      bg: "from-zinc-900 via-slate-800 to-gray-900",
      text: "from-gray-300 via-slate-400 to-zinc-300",
      border: "border-slate-400/40 group-hover:border-slate-400/80",
      glow: "from-slate-400 via-gray-500 to-slate-400"
    },
    Wookiee: { 
      bg: "from-orange-950 via-amber-900 to-yellow-950",
      text: "from-orange-300 via-amber-400 to-yellow-300",
      border: "border-amber-400/40 group-hover:border-amber-400/80",
      glow: "from-amber-400 via-orange-500 to-amber-400"
    },
    Rodian: { 
      bg: "from-emerald-950 via-green-900 to-teal-950",
      text: "from-emerald-300 via-green-400 to-teal-300",
      border: "border-green-400/40 group-hover:border-green-400/80",
      glow: "from-green-400 via-emerald-500 to-green-400"
    },
    "Twi'lek": { 
      bg: "from-violet-950 via-purple-900 to-fuchsia-950",
      text: "from-violet-300 via-purple-400 to-fuchsia-300",
      border: "border-purple-400/40 group-hover:border-purple-400/80",
      glow: "from-purple-400 via-fuchsia-500 to-purple-400"
    },
    Hutt: { 
      bg: "from-lime-950 via-green-950 to-emerald-900",
      text: "from-lime-300 via-green-400 to-emerald-300",
      border: "border-lime-400/40 group-hover:border-lime-400/80",
      glow: "from-lime-400 via-green-500 to-lime-400"
    },
    Yoda: { 
      bg: "from-green-950 via-emerald-900 to-teal-900",
      text: "from-green-300 via-emerald-400 to-teal-300",
      border: "border-emerald-400/40 group-hover:border-emerald-400/80",
      glow: "from-emerald-400 via-green-500 to-emerald-400"
    },
    Zabrak: { 
      bg: "from-red-950 via-rose-900 to-pink-950",
      text: "from-red-300 via-rose-400 to-pink-300",
      border: "border-rose-400/40 group-hover:border-rose-400/80",
      glow: "from-rose-400 via-red-500 to-rose-400"
    },
    Gungan: { 
      bg: "from-orange-950 via-yellow-900 to-amber-950",
      text: "from-orange-300 via-yellow-400 to-amber-300",
      border: "border-yellow-400/40 group-hover:border-yellow-400/80",
      glow: "from-yellow-400 via-orange-500 to-yellow-400"
    },
    "Mon Calamari": { 
      bg: "from-cyan-950 via-teal-900 to-sky-950",
      text: "from-cyan-300 via-teal-400 to-sky-300",
      border: "border-teal-400/40 group-hover:border-teal-400/80",
      glow: "from-teal-400 via-cyan-500 to-teal-400"
    },
    Ewok: { 
      bg: "from-amber-950 via-orange-900 to-brown-900",
      text: "from-amber-300 via-orange-400 to-yellow-300",
      border: "border-orange-400/40 group-hover:border-orange-400/80",
      glow: "from-orange-400 via-amber-500 to-orange-400"
    },
    Sullustan: { 
      bg: "from-pink-950 via-rose-900 to-red-950",
      text: "from-pink-300 via-rose-400 to-red-300",
      border: "border-pink-400/40 group-hover:border-pink-400/80",
      glow: "from-pink-400 via-rose-500 to-pink-400"
    },
    Neimodian: { 
      bg: "from-lime-950 via-yellow-900 to-green-950",
      text: "from-lime-300 via-yellow-400 to-green-300",
      border: "border-lime-400/40 group-hover:border-lime-400/80",
      glow: "from-lime-400 via-yellow-500 to-lime-400"
    },
    Chagrian: { 
      bg: "from-blue-950 via-indigo-900 to-violet-950",
      text: "from-blue-300 via-indigo-400 to-violet-300",
      border: "border-indigo-400/40 group-hover:border-indigo-400/80",
      glow: "from-indigo-400 via-blue-500 to-indigo-400"
    },
    Geonosian: { 
      bg: "from-orange-950 via-red-900 to-rose-950",
      text: "from-orange-300 via-red-400 to-rose-300",
      border: "border-red-400/40 group-hover:border-red-400/80",
      glow: "from-red-400 via-orange-500 to-red-400"
    },
    Mirialan: { 
      bg: "from-green-950 via-lime-900 to-emerald-950",
      text: "from-green-300 via-lime-400 to-emerald-300",
      border: "border-lime-400/40 group-hover:border-lime-400/80",
      glow: "from-lime-400 via-green-500 to-lime-400"
    },
    Clawdite: { 
      bg: "from-teal-950 via-cyan-900 to-blue-950",
      text: "from-teal-300 via-cyan-400 to-blue-300",
      border: "border-cyan-400/40 group-hover:border-cyan-400/80",
      glow: "from-cyan-400 via-teal-500 to-cyan-400"
    },
    Besalisk: { 
      bg: "from-indigo-950 via-blue-900 to-cyan-950",
      text: "from-indigo-300 via-blue-400 to-cyan-300",
      border: "border-blue-400/40 group-hover:border-blue-400/80",
      glow: "from-blue-400 via-indigo-500 to-blue-400"
    },
    Kaminoan: { 
      bg: "from-gray-950 via-slate-900 to-zinc-950",
      text: "from-gray-300 via-slate-400 to-zinc-300",
      border: "border-slate-400/40 group-hover:border-slate-400/80",
      glow: "from-slate-400 via-gray-500 to-slate-400"
    },
    Aleena: { 
      bg: "from-purple-950 via-fuchsia-900 to-pink-950",
      text: "from-purple-300 via-fuchsia-400 to-pink-300",
      border: "border-fuchsia-400/40 group-hover:border-fuchsia-400/80",
      glow: "from-fuchsia-400 via-purple-500 to-fuchsia-400"
    },
    Vulptereen: { 
      bg: "from-yellow-950 via-amber-900 to-orange-950",
      text: "from-yellow-300 via-amber-400 to-orange-300",
      border: "border-amber-400/40 group-hover:border-amber-400/80",
      glow: "from-amber-400 via-yellow-500 to-amber-400"
    },
    Xexto: { 
      bg: "from-sky-950 via-blue-900 to-indigo-950",
      text: "from-sky-300 via-blue-400 to-indigo-300",
      border: "border-sky-400/40 group-hover:border-sky-400/80",
      glow: "from-sky-400 via-blue-500 to-sky-400"
    },
    Toong: { 
      bg: "from-rose-950 via-pink-900 to-fuchsia-950",
      text: "from-rose-300 via-pink-400 to-fuchsia-300",
      border: "border-pink-400/40 group-hover:border-pink-400/80",
      glow: "from-pink-400 via-rose-500 to-pink-400"
    },
    Cerean: { 
      bg: "from-teal-950 via-emerald-900 to-green-950",
      text: "from-teal-300 via-emerald-400 to-green-300",
      border: "border-emerald-400/40 group-hover:border-emerald-400/80",
      glow: "from-emerald-400 via-teal-500 to-emerald-400"
    },
    Nautolan: { 
      bg: "from-green-950 via-teal-900 to-cyan-950",
      text: "from-green-300 via-teal-400 to-cyan-300",
      border: "border-teal-400/40 group-hover:border-teal-400/80",
      glow: "from-teal-400 via-green-500 to-teal-400"
    },
    Tholothian: { 
      bg: "from-purple-950 via-violet-900 to-indigo-950",
      text: "from-purple-300 via-violet-400 to-indigo-300",
      border: "border-violet-400/40 group-hover:border-violet-400/80",
      glow: "from-violet-400 via-purple-500 to-violet-400"
    },
    Iktotchi: { 
      bg: "from-pink-950 via-red-900 to-orange-950",
      text: "from-pink-300 via-red-400 to-orange-300",
      border: "border-red-400/40 group-hover:border-red-400/80",
      glow: "from-red-400 via-pink-500 to-red-400"
    },
    Quermian: { 
      bg: "from-slate-950 via-gray-900 to-zinc-950",
      text: "from-slate-300 via-gray-400 to-zinc-300",
      border: "border-gray-400/40 group-hover:border-gray-400/80",
      glow: "from-gray-400 via-slate-500 to-gray-400"
    },
    "Kel Dor": { 
      bg: "from-orange-950 via-amber-900 to-yellow-950",
      text: "from-orange-300 via-amber-400 to-yellow-300",
      border: "border-amber-400/40 group-hover:border-amber-400/80",
      glow: "from-amber-400 via-orange-500 to-amber-400"
    },
    Chiss: { 
      bg: "from-blue-950 via-cyan-900 to-sky-950",
      text: "from-blue-300 via-cyan-400 to-sky-300",
      border: "border-cyan-400/40 group-hover:border-cyan-400/80",
      glow: "from-cyan-400 via-blue-500 to-cyan-400"
    },
    Unknown: { 
      bg: "from-stone-950 via-neutral-900 to-gray-950",
      text: "from-stone-300 via-neutral-400 to-gray-300",
      border: "border-neutral-400/40 group-hover:border-neutral-400/80",
      glow: "from-neutral-400 via-stone-500 to-neutral-400"
    },
  };

  useEffect(() => {
    dispatch(fetchCharacters({ page, searchTerm, filters }));
  }, [dispatch, page, searchTerm, filters]);

  if (loading)
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="text-center">
          <div className="text-yellow-400 text-3xl font-bold mb-4 animate-pulse">
            ⭐ LOADING GALAXY DATABASE ⭐
          </div>
          <div className="text-gray-400 text-lg">Accessing Jedi Archives...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 text-2xl font-bold mb-2">
          ⚠️ TRANSMISSION ERROR ⚠️
        </p>
        <p className="text-red-400 text-lg">
          Failed to access character database: {error}
        </p>
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {characters.map((char) => {
          const speciesName =
            char.species.length > 0
              ? char.species.map((url) => speciesNames[url] || "Unknown")[0]
              : "Human";

          const gradient = speciesColors[speciesName]?.bg || speciesColors.Unknown.bg;
          const textColor = speciesColors[speciesName]?.text || speciesColors.Unknown.text;
          const borderColor = speciesColors[speciesName]?.border || speciesColors.Unknown.border;
          const glowColor = speciesColors[speciesName]?.glow || speciesColors.Unknown.glow;

          return (
            <div
              key={char.name}
              className="relative group cursor-pointer"
              onClick={() => setSelected(char)}
            >
              {/* Outer glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${glowColor} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse`}></div>
              
              {/* Card container */}
              <div
                className={`relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-300 overflow-hidden border-4 ${borderColor}`}
                style={{ minHeight: "450px" }}
              >
                {/* Animated background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}
                ></div>

                {/* Star field overlay */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent)',
                  backgroundSize: '200% 200%',
                  backgroundPosition: '0% 0%'
                }}></div>

                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-current to-transparent`} style={{ color: textColor.split(' ')[1].replace('via-', '') }}></div>

                {/* Character Image */}
                <div className="relative">
                  <img
                    src={images[char.name] || `https://picsum.photos/seed/${char.name}/400/600`}
                    alt={char.name}
                    className="relative w-full h-64 object-cover shadow-lg"
                  />
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Species badge */}
                  <div className={`absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border ${borderColor.split(' ')[0]}`}>
                    <span className={`bg-gradient-to-r ${textColor} bg-clip-text text-transparent text-xs font-bold tracking-wider`}>
                      {speciesName.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Character Info */}
                <div className="relative z-10 p-5">
                  {/* Name with Star Wars font style */}
                  <h2 className="text-3xl font-extrabold text-center mb-3 tracking-wider">
                    <span className={`bg-gradient-to-r ${textColor} bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(250,204,21,0.8)]`}>
                      {char.name.toUpperCase()}
                    </span>
                  </h2>

                  {/* Divider line */}
                  <div className={`h-px bg-gradient-to-r from-transparent via-current to-transparent mb-3 opacity-50`} style={{ color: textColor.split(' ')[1].replace('via-', '') }}></div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-2 border ${borderColor.split(' ')[0]}`}>
                      <div className="text-gray-400 text-xs uppercase tracking-wide">Birth Year</div>
                      <div className={`bg-gradient-to-r ${textColor} bg-clip-text text-transparent font-bold`}>{char.birth_year}</div>
                    </div>
                    <div className={`bg-black/30 backdrop-blur-sm rounded-lg p-2 border ${borderColor.split(' ')[0]}`}>
                      <div className="text-gray-400 text-xs uppercase tracking-wide">Gender</div>
                      <div className={`bg-gradient-to-r ${textColor} bg-clip-text text-transparent font-bold capitalize`}>{char.gender}</div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50`} style={{ color: textColor.split(' ')[1].replace('via-', '') }}></div>
                </div>

                {/* Corner decorations */}
                <div className={`absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 ${borderColor.split(' ')[0]}`}></div>
                <div className={`absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 ${borderColor.split(' ')[0]}`}></div>
                <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 ${borderColor.split(' ')[0]}`}></div>
                <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 ${borderColor.split(' ')[0]}`}></div>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300`} style={{ color: textColor.split(' ')[1].replace('via-', '') }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-12 gap-6">
        <button
          disabled={page === 1}
          onClick={() => dispatch(setPage(page - 1))}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-lg tracking-wider shadow-lg shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-yellow-300"
        >
          ◀ PREV
        </button>
        <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-yellow-400/50">
          <span className="text-yellow-400 text-lg font-bold tracking-wider">
            PAGE {page} OF {Math.ceil(totalCount / 10)}
          </span>
        </div>
        <button
          disabled={page * 10 >= totalCount}
          onClick={() => dispatch(setPage(page + 1))}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-lg tracking-wider shadow-lg shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-yellow-300"
        >
          NEXT ▶
        </button>
      </div>

      {/* Modal */}
      {selected && (
        <CharacterModal character={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}