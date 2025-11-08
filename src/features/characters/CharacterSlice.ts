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

// 🔍 Async thunk to fetch characters (supports pagination + search)
export const fetchCharacters = createAsyncThunk<
  { results: Character[]; count: number },
  { page?: number; searchTerm?: string },
  { rejectValue: string }
>("characters/fetchCharacters", async ({ page = 1, searchTerm = "" }, thunkAPI) => {
  try {
    const response = await axios.get(`${API_BASE}?page=${page}&search=${searchTerm}`);
    return { results: response.data.results, count: response.data.count };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch characters");
  }
});

const characterSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.page = 1; // reset page when searching
    },
    setFilter: (state, action: PayloadAction<{ key: keyof Filters; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
      state.page = 1;
    },
    clearFilters: (state) => {
      state.filters = { species: "", homeworld: "", film: "" };
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
