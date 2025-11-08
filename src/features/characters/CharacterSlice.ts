import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://swapi.dev/api/people/";

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

export const fetchCharacters = createAsyncThunk<
  { results: Character[]; count: number },
  { page?: number; searchTerm?: string; filters?: Filters },
  { rejectValue: string }
>(
  "characters/fetchCharacters",
  async ({ page = 1, searchTerm = "", filters }, thunkAPI) => {
    try {
      // 1️⃣ Fetch base people
      const peopleRes = await axios.get(`${API_BASE}?page=${page}&search=${searchTerm}`);
      let people: Character[] = peopleRes.data.results;
      const totalCountFromAPI = peopleRes.data.count;

      // 2️⃣ Filter by Species
      if (filters?.species) {
        const speciesRes = await axios.get(
          `https://swapi.dev/api/species/?name=${encodeURIComponent(filters.species)}`
        );
        const matchingSpecies = speciesRes.data.results[0];
        if (matchingSpecies) {
          people = people.filter((p) => matchingSpecies.people.includes(p.url));
        }
      }

      // 3️⃣ Filter by Homeworld
      if (filters?.homeworld) {
        const planetRes = await axios.get(
          `https://swapi.dev/api/planets/?name=${encodeURIComponent(filters.homeworld)}`
        );
        const matchingPlanet = planetRes.data.results[0];
        if (matchingPlanet) {
          people = people.filter((p) => p.homeworld === matchingPlanet.url);
        }
      }

      // 4️⃣ Filter by Film
      if (filters?.film) {
        const filmRes = await axios.get(
          `https://swapi.dev/api/films/?title=${encodeURIComponent(filters.film)}`
        );
        const matchingFilm = filmRes.data.results[0];
        if (matchingFilm) {
          people = people.filter((p) => matchingFilm.characters.includes(p.url));
        }
      }

      return { results: people, count: totalCountFromAPI };
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
