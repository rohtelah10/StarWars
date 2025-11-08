// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthService } from './AuthService';
import type { RootState } from '../../app/store';
import type { PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  // We store expiry seconds for simulation (not necessary in prod)
  expiresIn: number | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  expiresIn: null,
};

// Initialize from localStorage if present
const local = AuthService.getLocalAuth();
if (local) {
  initialState.user = local.user;
  initialState.token = local.token;
  initialState.status = 'idle';
}

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await AuthService.login(email, password);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { email, password, name }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await AuthService.signup(email, password, name);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Signup failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_: void, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    try {
      const res = await AuthService.refresh(token ?? '');
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Refresh failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  AuthService.clear();
  return;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // used for synchronous manual setIfNeeded (rare)
    setAuth(state, action: PayloadAction<{ user: User; token: string; expiresIn?: number }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      state.expiresIn = action.payload.expiresIn ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.expiresIn = a.payload.expiresIn ?? null;
      })
      .addCase(login.rejected, (s, a) => {
        s.status = 'failed';
        s.error = (a.payload as string) || a.error.message || 'Login failed';
      })

      // signup
      .addCase(signup.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(signup.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.expiresIn = a.payload.expiresIn ?? null;
      })
      .addCase(signup.rejected, (s, a) => {
        s.status = 'failed';
        s.error = (a.payload as string) || a.error.message || 'Signup failed';
      })

      // refresh
    //   .addCase(refreshToken.pending, (s) => {
    //     // optionally mark as loading but keep UI intact
    //   })
      .addCase(refreshToken.fulfilled, (s, a) => {
        s.token = a.payload.token;
        s.expiresIn = a.payload.expiresIn ?? null;
      })
      .addCase(refreshToken.rejected, (s) => {
        // if refresh fails, clear auth to force re-login
        s.user = null;
        s.token = null;
        s.status = 'idle';
        s.error = 'Session expired. Please sign in again.';
        AuthService.clear();
      })

      // logout
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.token = null;
        s.status = 'idle';
        s.error = null;
        s.expiresIn = null;
      });
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
