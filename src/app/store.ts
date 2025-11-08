import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
//@ts-ignore
import characterReducer from "../features/characters/characterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    characters: characterReducer, // ✅ added this line
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
