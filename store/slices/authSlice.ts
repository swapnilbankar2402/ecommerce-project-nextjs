import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
          console.log("setAuth payload:", action.payload);
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
