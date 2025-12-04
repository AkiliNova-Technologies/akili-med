import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/utils/api";

export interface User {
  id: string;
  userType: "APP_USER" | "SYSTEM_MANAGER" | string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  isActive: boolean;
  permissions: string[];
  roles: string[];
}

// Since tokens are in HttpOnly cookies, we don't need to store them in state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialLoading: true,
  error: null,
};

// 🔄 Refresh token logic
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      // This will automatically send the refresh token cookie
      const response = await api.post("/api/v1/auth/refresh");
      
      // The new tokens are set as HttpOnly cookies by the backend
      // We just need to verify the user is authenticated
      return response.data; // Usually returns { user: User } or similar
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Token refresh failed";
      
      // Clear user state on refresh failure
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Check authentication status
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // You might need a specific endpoint for this, or use an existing one
      // If not available, we can use the refresh endpoint or a user profile endpoint
      const response = await api.get("/api/v1/auth/me"); // Assuming this endpoint exists
      
      if (response.data && response.data.user) {
        return { user: response.data.user };
      }
      
      return rejectWithValue("No authenticated user found");
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string; error?: string } };
        message?: string;
      };
      
      // If 401, it's just not authenticated (not an error)
      if (err.response?.status === 401) {
        return rejectWithValue("Not authenticated");
      }
      
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Authentication check failed";
      
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Login Thunk - with cookie-based authentication
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/v1/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // Tokens are set as HttpOnly cookies by the backend
      // The response should contain user data
      if (response.data && response.data.user) {
        // Store only user data (not tokens) in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        return { user: response.data.user };
      }

      return rejectWithValue("Invalid login response format");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";
      console.error("Login error:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Logout - with cookie cleanup
export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      // This will clear the HttpOnly cookies on the backend
      await api.post("/api/v1/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
      // Even if logout API fails, we still logout locally
    } finally {
      // Clear localStorage user data
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      
      // Clear local auth state
      dispatch(logout());
      return true;
    }
  }
);

// 🔐 Register Thunk
export const register = createAsyncThunk(
  "auth/register",
  async (
    registrationData: {
      email: string;
      password?: string;
      firstName: string;
      lastName: string;
      // Add other registration fields as needed
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/v1/auth/register", registrationData);

      if (response.data && response.data.user) {
        // Store user data
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        return { user: response.data.user };
      }

      return rejectWithValue("Invalid registration response format");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🧠 Slice logic
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: User;
      }>
    ) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;

      // Save user to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;

      // Clear localStorage user data
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Load user from localStorage on app startup
    loadUserFromStorage: (state) => {
      if (typeof window !== "undefined") {
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            state.user = user;
            state.isAuthenticated = true;
            console.log("✅ User loaded from localStorage:", user);
          }
        } catch (error) {
          console.error("Error loading user from localStorage:", error);
          localStorage.removeItem("user");
        }
      }
      state.initialLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        
        // Clear localStorage on login failure
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Logout cases
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
      })
      
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        // Don't set error for "Not authenticated" - it's normal
        if (action.payload !== "Not authenticated") {
          state.error = action.payload as string;
        }
      })
      
      // Refresh token cases
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        // Update user data if returned
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
        
        // Clear localStorage on token refresh failure
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
      });
  },
});

// 🎯 Export actions
export const { setUser, logout, updateUser, clearError, loadUserFromStorage } =
  authSlice.actions;

export default authSlice.reducer;

// 🧠 Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectInitialLoading = (state: { auth: AuthState }) =>
  state.auth.initialLoading;