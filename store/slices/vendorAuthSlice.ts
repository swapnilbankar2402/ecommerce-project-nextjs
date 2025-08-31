import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Vendor interfaces
interface Vendor {
  _id: string;
  email: string;
  businessName: string;
  businessType: "individual" | "company";
  taxId: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  currentApplication: {
    storeName: string;
    storeDescription: string;
    logo?: string;
    banner?: string;
    policies: {
      shipping: string;
      returns: string;
      warranty: string;
    };
    verification: {
      status: "pending" | "approved" | "rejected";
      notes?: string;
      submittedAt: Date;
      reviewedAt?: Date;
    };
  };
  commission: number;
  payoutInfo: {
    method: "bank" | "paypal" | "stripe";
    accountDetails: any;
  };
}

interface VendorAuthState {
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface VendorLoginCredentials {
  email: string;
  password: string;
}

interface VendorRegisterData {
  email: string;
  password: string;
  businessName: string;
  businessType: "individual" | "company";
  taxId: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  storeName: string;
  storeDescription: string;
  policies: {
    shipping: string;
    returns: string;
    warranty: string;
  };
  payoutInfo: {
    method: "bank" | "paypal" | "stripe";
    accountDetails: any;
  };
}

interface VendorAuthResponse {
  success: boolean;
  message: string;
  data : {
    vendor?: Vendor;
  }
  error?: string | null;
}

const initialState: VendorAuthState = {
  vendor: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunk for vendor login
export const loginVendor = createAsyncThunk<
  VendorAuthResponse,
  VendorLoginCredentials,
  { rejectValue: string }
>("vendorAuth/loginVendor", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/vendors/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data: VendorAuthResponse = await response.json();
    if (!response.ok || !data.success) {
      return rejectWithValue(data.message || "Vendor login failed");
    }
    return data;
  } catch (error) {
    console.log("error is here :", error)
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Async thunk for vendor register
export const registerVendor = createAsyncThunk<
  VendorAuthResponse,
  VendorRegisterData,
  { rejectValue: string }
>("vendorAuth/registerVendor", async (vendorData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/vendors/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vendorData),
    });
    const data: VendorAuthResponse = await response.json();
    if (!response.ok || !data.success) {
      return rejectWithValue(data.error || "Vendor registration failed");
    }
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Async thunk for vendor logout
export const logoutVendor = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("vendorAuth/logoutVendor", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/vendors/logout", {
      method: "POST",
    });
    if (!response.ok) {
      return rejectWithValue("Vendor logout failed");
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Vendor auth slice
const vendorAuthSlice = createSlice({
  name: "vendorAuth",
  initialState,
  reducers: {
    clearVendorAuth: (state) => {
      state.vendor = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearVendorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Vendor login
      .addCase(loginVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendor = action.payload.data.vendor || null;
        state.isAuthenticated = true;
      })
      .addCase(loginVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      // Vendor register
      .addCase(registerVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendor = action.payload.data.vendor || null;
        state.isAuthenticated = true;
      })
      .addCase(registerVendor.rejected, (state, action) => {
        (state.isAuthenticated = false),
          (state.isLoading = false),
          (state.error = action.payload ?? null);
      })
      // Vendor Logout
      .addCase(logoutVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutVendor.fulfilled, (state) => {
        state.isLoading = false;
        state.vendor = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      });
  },
});

// Persist config for vendor auth
const vendorPersistConfig = {
  key: "vendorAuth",
  storage,
  whitelist: ["vendor", "isAuthenticated", "accessToken"], // Only persist these fields
};

export const { clearVendorAuth, clearVendorError } = vendorAuthSlice.actions;
export default persistReducer(vendorPersistConfig, vendorAuthSlice.reducer);
