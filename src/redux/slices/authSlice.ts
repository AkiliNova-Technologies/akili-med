// src/redux/slices/authSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/utils/api";

export type UserRole = "ADMIN" | "DOCTOR" | "NURSE" | "STAFF" | "RECEPTIONIST" 

// User interface matching your Prisma schema
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialLoading: true,
  error: null,
  accessToken: null,
  refreshToken: null,
};

// Helper function to handle API errors
const handleApiError = (error: unknown): string => {
  const err = error as {
    response?: {
      status?: number;
      data?: {
        message?: string;
        error?: string;
        success?: boolean;
      };
    };
    message?: string;
  };

  if (err.response?.data?.message) {
    return err.response.data.message;
  } else if (err.response?.data?.error) {
    return err.response.data.error;
  } else if (err.message) {
    return err.message;
  }

  return "An unexpected error occurred";
};

// Helper to map API response to User type
const mapApiResponseToUser = (apiData: any): User => {
  return {
    id: apiData.id || apiData.user?.id || "",
    email: apiData.email || apiData.user?.email || "",
    name: apiData.name || apiData.user?.name || null,
    role: apiData.role || apiData.user?.role || "STAFF",
    createdAt: apiData.createdAt || apiData.user?.createdAt || new Date().toISOString(),
    updatedAt: apiData.updatedAt || apiData.user?.updatedAt || new Date().toISOString(),
  };
};

// 🔄 Refresh token thunk
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        return rejectWithValue("No refresh token available");
      }

      const response = await api.post("/api/v1/auth/refresh-token", {
        refreshToken,
      });

      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        
        // Set default authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        
        return { accessToken, refreshToken: newRefreshToken };
      } else {
        return rejectWithValue(response.data.message || "Token refresh failed");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Register thunk
export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      email: string;
      password: string;
      name?: string;
      role?: UserRole;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/v1/auth/register", userData);

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Set default authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        
        return {
          user: mapApiResponseToUser(user),
          accessToken,
          refreshToken,
        };
      } else {
        return rejectWithValue(response.data.message || "Registration failed");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Login thunk
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

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Set default authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        
        return {
          user: mapApiResponseToUser(user),
          accessToken,
          refreshToken,
        };
      } else {
        return rejectWithValue(response.data.message || "Login failed");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Logout thunk
export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      if (accessToken) {
        await api.post(
          "/api/v1/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Clear axios authorization header
      delete api.defaults.headers.common["Authorization"];
      
      dispatch(logout());
      return true;
    } catch (error: unknown) {
      // Even if API call fails, clear local state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
      
      dispatch(logout());
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Get profile thunk
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/auth/profile");

      if (response.data.success) {
        const user = mapApiResponseToUser(response.data.data);
        
        // Update localStorage with fresh user data
        localStorage.setItem("user", JSON.stringify(user));
        
        return { user };
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch profile");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Update profile thunk
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    profileData: { name?: string; email?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put("/api/v1/auth/profile", profileData);

      if (response.data.success) {
        const user = mapApiResponseToUser(response.data.data);
        
        // Update localStorage with fresh user data
        localStorage.setItem("user", JSON.stringify(user));
        
        return { user };
      } else {
        return rejectWithValue(response.data.message || "Failed to update profile");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Change password thunk
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put("/api/v1/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        return { message: response.data.message };
      } else {
        return rejectWithValue(response.data.message || "Failed to change password");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Forgot password thunk
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/auth/forgot-password", {
        email,
      });

      if (response.data.success) {
        return { message: response.data.message };
      } else {
        return rejectWithValue(response.data.message || "Failed to process request");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Reset password thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/v1/auth/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        return { message: response.data.message };
      } else {
        return rejectWithValue(response.data.message || "Failed to reset password");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Verify token thunk
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/auth/verify");

      if (response.data.success) {
        const user = mapApiResponseToUser(response.data.data.user);
        return { user, message: response.data.message };
      } else {
        return rejectWithValue(response.data.message || "Token verification failed");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
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
        accessToken?: string;
        refreshToken?: string;
      }>
    ) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
      }
      
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
      
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      delete api.defaults.headers.common["Authorization"];
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    loadUserFromStorage: (state) => {
      if (typeof window !== "undefined") {
        try {
          // Load user from localStorage
          const userStr = localStorage.getItem("user");
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");

          if (userStr && accessToken) {
            const user = JSON.parse(userStr);
            state.user = user;
            state.isAuthenticated = true;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            
            // Set axios default header
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            
            console.log("✅ User loaded from localStorage:", user.email);
          }
        } catch (error) {
          console.error("Error loading from localStorage:", error);
          // Clear corrupted data
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      state.initialLoading = false;
    },
    
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      
      // Set axios default header
      api.defaults.headers.common["Authorization"] = `Bearer ${action.payload.accessToken}`;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout cases
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      })

      // Get profile cases
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Refresh token cases
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      })

      // Verify token cases
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 🎯 Export actions
export const {
  setUser,
  logout,
  updateUser,
  clearError,
  loadUserFromStorage,
  setTokens,
} = authSlice.actions;

export default authSlice.reducer;

// 🧠 Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;
export const selectInitialLoading = (state: { auth: AuthState }) =>
  state.auth.initialLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;

// Helper selector for role-based access
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role;
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.role === "ADMIN";
export const selectIsDoctor = (state: { auth: AuthState }) =>
  state.auth.user?.role === "DOCTOR";
export const selectIsStaff = (state: { auth: AuthState }) =>
  state.auth.user?.role === "STAFF";
export const selectIsReceptionist = (state: { auth: AuthState }) =>
  state.auth.user?.role === "RECEPTIONIST";