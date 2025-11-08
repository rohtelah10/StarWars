import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosResponse } from "axios";

const API_BASE = "https://swapi.dev/api/people/";


interface PaginatedResponse {
  results: any[]; // You may want to specify the exact type of results if possible
  next: string | null;
}

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

// Utility to fetch all paginated results
async function fetchAllPages(url: string): Promise<any[]> {
  let results: any[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const res: AxiosResponse<PaginatedResponse> = await axios.get(nextUrl);
    results = results.concat(res.data.results);
    nextUrl = res.data.next;
  }

  return results;
}

// Async thunk to fetch characters with filters
export const fetchCharacters = createAsyncThunk<
  { results: Character[]; count: number },
  { page?: number; searchTerm?: string; filters?: Filters },
  { rejectValue: string }
>(
  "characters/fetchCharacters",
  async ({ page = 1, searchTerm = "", filters }, thunkAPI) => {
    try {
      // 1️⃣ Fetch people from the main endpoint
      const peopleRes = await axios.get(`${API_BASE}?page=${page}&search=${searchTerm}`);
      let people: Character[] = peopleRes.data.results;
      const totalCountFromAPI = peopleRes.data.count;

      // 2️⃣ Filter by Species
      if (filters?.species) {
        const allSpecies = await fetchAllPages("https://swapi.dev/api/species/");
        const speciesObj = allSpecies.find(
          (s: any) => s.name.toLowerCase() === filters.species.toLowerCase()
        );
        if (speciesObj) {
          const speciesPeopleUrls: string[] = speciesObj.people;
          people = people.filter((p) => speciesPeopleUrls.includes(p.url));
        } else {
          people = [];
        }
      }

      // 3️⃣ Filter by Homeworld
      if (filters?.homeworld) {
        const allPlanets = await fetchAllPages("https://swapi.dev/api/planets/");
        const planetObj = allPlanets.find(
          (p: any) => p.name.toLowerCase() === filters.homeworld.toLowerCase()
        );
        if (planetObj) {
          const planetResidents: string[] = planetObj.residents;
          people = people.filter((p) => planetResidents.includes(p.url));
        } else {
          people = [];
        }
      }

      // 4️⃣ Filter by Film
      if (filters?.film) {
        const allFilms = await fetchAllPages("https://swapi.dev/api/films/");
        const filmObj = allFilms.find(
          (f: any) => f.title.toLowerCase() === filters.film.toLowerCase()
        );
        if (filmObj) {
          const filmCharacters: string[] = filmObj.characters;
          people = people.filter((p) => filmCharacters.includes(p.url));
        } else {
          people = [];
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
