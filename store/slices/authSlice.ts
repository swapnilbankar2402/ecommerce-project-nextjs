// store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface User {
  _id: string;
  name: string;
  email: string;
  roles: ("customer" | "vendor" | "admin")[];
  avatarUrl?: string;
  vendorProfile?: string;
  isActive: boolean;
  lastLogin?: Date;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  accessToken?: string;
  user?: User;
  error?: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success) {
      return rejectWithValue(data.error || "Login failed");
    }
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const refreshUserToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/refreshUserToken", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      return rejectWithValue(data.error || "Token refresh failed");
    }
    return data.accessToken!;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!response.ok) {
        return rejectWithValue("Logout failed");
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const registerUser = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data: AuthResponse = await response.json();
    console.log("response is here data :", data);

    if (!response.ok || !data.success) {
      return rejectWithValue(data.error || "Registration failed");
    }
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    updateUserRoles: (
      state,
      action: PayloadAction<("customer" | "vendor" | "admin")[]>
    ) => {
      if (state.user) {
        state.user.roles = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.accessToken = action.payload.accessToken || null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
        state.isAuthenticated = false;
      })
      // Token refresh
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload ?? null;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.accessToken = action.payload.accessToken || null;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
        state.isAuthenticated = false;
      });
  },
});

// Persist config
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated", "accessToken"], // Only persist these fields
};

export const { clearAuth, clearError, setAccessToken, updateUserRoles } =
  authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);
