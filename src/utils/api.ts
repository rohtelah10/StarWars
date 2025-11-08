// src/utils/api.ts
export const BASE_URL = "https://swapi.dev/api";

// 🪐 Generic fetch helper
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
}

// 👥 Fetch all characters (paginated)
export async function fetchCharacters(page: number = 1) {
  const data = await fetchJSON<{
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
  }>(`${BASE_URL}/people/?page=${page}`);
  return data;
}

// 🌍 Fetch planet details
export async function fetchPlanet(url: string) {
  return fetchJSON<{
    name: string;
    terrain: string;
    climate: string;
    population: string;
  }>(url);
}

// 🧬 Fetch species details
export async function fetchSpecies(url: string) {
  return fetchJSON<{
    name: string;
  }>(url);
}

export const fetchHomeworld = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch homeworld");
  return res.json();
};