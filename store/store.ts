import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
// add more reducers as your app grows

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// ✅ Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
