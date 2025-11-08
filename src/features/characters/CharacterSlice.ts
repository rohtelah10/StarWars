import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_PEOPLE = "https://swapi.dev/api/people/";
const API_SPECIES = "https://swapi.dev/api/species/";
const API_PLANETS = "https://swapi.dev/api/planets/";
const API_FILMS = "https://swapi.dev/api/films/";

export interface Character {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  species: string[];
  films: string[];
  created: string;
  url: string;
}

export interface Filters {
  species: string;
  homeworld: string;
  film: string;
}

export interface CharacterState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  page: number;
  totalCount: number;
  searchTerm: string;
  filters: Filters;
}

const initialState: CharacterState = {
  characters: [],
  loading: false,
  error: null,
  page: 1,
  totalCount: 0,
  searchTerm: "",
  filters: {
    species: "",
    homeworld: "",
    film: "",
  },
};

// Helper to fetch a single resource by URL
async function fetchResource(url: string) {
  const res = await axios.get(url);
  return res.data;
}

// Helper to fetch multiple characters by array of URLs
async function fetchCharactersByUrls(urls: string[]): Promise<Character[]> {
  const results: Character[] = [];
  for (const url of urls) {
    try {
      const data = await fetchResource(url);
      results.push(data);
    } catch (err) {
      console.warn("Failed to fetch character:", url);
    }
  }
  return results;
}

export const fetchCharacters = createAsyncThunk<
  { results: Character[]; count: number },
  { page?: number; searchTerm?: string; filters?: Filters },
  { rejectValue: string }
>(
  "characters/fetchCharacters",
  async ({ page = 1, searchTerm = "", filters }, thunkAPI) => {
    try {
      let peopleRes = await axios.get(`${API_PEOPLE}?page=${page}&search=${encodeURIComponent(searchTerm)}`);
      let people: Character[] = peopleRes.data.results;
      let totalCount = peopleRes.data.count;

      // Species filter
      if (filters?.species) {
        const speciesRes = await axios.get(API_SPECIES);
        const matchingSpecies = speciesRes.data.results.find(
          (s: any) => s.name.toLowerCase() === filters.species.toLowerCase()
        );
        if (matchingSpecies && matchingSpecies.people.length > 0) {
          people = await fetchCharactersByUrls(matchingSpecies.people);
          totalCount = people.length;
        } else {
          people = [];
          totalCount = 0;
        }
      }

      // Homeworld filter
      if (filters?.homeworld) {
        const planetsRes = await axios.get(API_PLANETS);
        const matchingPlanet = planetsRes.data.results.find(
          (p: any) => p.name.toLowerCase() === filters.homeworld.toLowerCase()
        );
        if (matchingPlanet) {
          people = people.filter((p) => p.homeworld === matchingPlanet.url);
          totalCount = people.length;
        } else {
          people = [];
          totalCount = 0;
        }
      }

      // Film filter
      if (filters?.film) {
        const filmsRes = await axios.get(API_FILMS);
        const matchingFilm = filmsRes.data.results.find(
          (f: any) => f.title.toLowerCase() === filters.film.toLowerCase()
        );
        if (matchingFilm) {
          people = people.filter((p) => matchingFilm.characters.includes(p.url));
          totalCount = people.length;
        } else {
          people = [];
          totalCount = 0;
        }
      }

      return { results: people, count: totalCount };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch characters");
    }
  }
);

const characterSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setFilter: (state, action: PayloadAction<{ key: keyof Filters; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
      state.page = 1;
    },
    clearFilters: (state) => {
      state.filters = { species: "", homeworld: "", film: "" };
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { setPage, setSearchTerm, setFilter, clearFilters } = characterSlice.actions;
export default characterSlice.reducer;
