import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_PEOPLE = "https://swapi.dev/api/people/";

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
      let allCharacters: Character[] = [];
      let totalCount = 0;

      // 1️⃣ Name search first
      const peopleRes = await axios.get(`${API_PEOPLE}?page=${page}&search=${encodeURIComponent(searchTerm)}`);
      allCharacters = peopleRes.data.results;
      totalCount = peopleRes.data.count;

      // 2️⃣ Species filter
      if (filters?.species) {
        const speciesRes = await axios.get(
          `https://swapi.dev/api/species/?name=${encodeURIComponent(filters.species)}`
        );
        const matchingSpecies = speciesRes.data.results[0];
        console.log("speciesRes : ", speciesRes);
        console.log("matching species : ", matchingSpecies);
        if (matchingSpecies && matchingSpecies.people.length > 0) {
          allCharacters = await fetchCharactersByUrls(matchingSpecies.people);
          totalCount = allCharacters.length;
        } else {
          allCharacters = [];
          totalCount = 0;
        }
      }

      // 3️⃣ Homeworld filter
      if (filters?.homeworld) {
        const planetRes = await axios.get(
          `https://swapi.dev/api/planets/?name=${encodeURIComponent(filters.homeworld)}`
        );
        const matchingPlanet = planetRes.data.results[0];
        if (matchingPlanet) {
          allCharacters = allCharacters.filter((p) => p.homeworld === matchingPlanet.url);
          totalCount = allCharacters.length;
        } else {
          allCharacters = [];
          totalCount = 0;
        }
      }

      // 4️⃣ Film filter
      if (filters?.film) {
        const filmRes = await axios.get(
          `https://swapi.dev/api/films/?title=${encodeURIComponent(filters.film)}`
        );
        const matchingFilm = filmRes.data.results[0];
        if (matchingFilm) {
          allCharacters = allCharacters.filter((p) => matchingFilm.characters.includes(p.url));
          totalCount = allCharacters.length;
        } else {
          allCharacters = [];
          totalCount = 0;
        }
      }

      return { results: allCharacters, count: totalCount };
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
