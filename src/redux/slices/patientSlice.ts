import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import {
  type Patient,
  type CreatePatientData,
  type UpdatePatientData,
  type PatientFilters,
  type PatientsState,
  type PatientStats,
  type ApiResponse,
  type PaginatedApiResponse,
  type Gender,
  AppointmentStatus
} from "@/types/patients";

// Initial state
const initialState: PatientsState = {
  patients: [],
  currentPatient: null,
  loading: false,
  loadingCurrent: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {},
  stats: null,
  searchResults: [],
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

// Helper to format date for API
const formatDateForApi = (date: string | Date): string => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }
  return date;
};

// 🔄 Fetch all patients with pagination and filters
export const fetchPatients = createAsyncThunk(
  "patients/fetchAll",
  async (
    params: {
      page?: number;
      limit?: number;
      filters?: PatientFilters;
    },
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 10, filters = {} } = params;
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString().split('T')[0]);
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await api.get<PaginatedApiResponse<Patient>>(`/api/v1/patients?${queryParams}`);

      if (response.data.success) {
        return {
          patients: response.data.data,
          pagination: response.data.pagination,
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch patients");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch patient by ID
export const fetchPatientById = createAsyncThunk(
  "patients/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Patient>>(`/api/v1/patients/${id}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Patient not found");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Create new patient
export const createPatient = createAsyncThunk(
  "patients/create",
  async (patientData: CreatePatientData, { rejectWithValue }) => {
    try {
      // Format date for API
      const formattedData = {
        ...patientData,
        dateOfBirth: patientData.dateOfBirth ? formatDateForApi(patientData.dateOfBirth) : undefined,
      };

      const response = await api.post<ApiResponse<Patient>>("/api/v1/patients", formattedData);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to create patient");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Update patient
export const updatePatient = createAsyncThunk(
  "patients/update",
  async (
    { id, patientData }: { id: string; patientData: UpdatePatientData },
    { rejectWithValue }
  ) => {
    try {
      // Format date if provided
      const formattedData = { ...patientData };
      if (patientData.dateOfBirth) {
        formattedData.dateOfBirth = formatDateForApi(patientData.dateOfBirth);
      }

      const response = await api.put<ApiResponse<Patient>>(`/api/v1/patients/${id}`, formattedData);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to update patient");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Delete patient
export const deletePatient = createAsyncThunk(
  "patients/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/patients/${id}`);
      return id;
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch patient appointments
export const fetchPatientAppointments = createAsyncThunk(
  "patients/fetchAppointments",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Patient["appointments"]>>(`/api/v1/patients/${patientId}/appointments`);

      if (response.data.success) {
        return {
          patientId,
          appointments: response.data.data,
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch patient appointments");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch patient invoices
export const fetchPatientInvoices = createAsyncThunk(
  "patients/fetchInvoices",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Patient["invoices"]>>(`/api/v1/patients/${patientId}/invoices`);

      if (response.data.success) {
        return {
          patientId,
          invoices: response.data.data,
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch patient invoices");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Search patients
export const searchPatients = createAsyncThunk(
  "patients/search",
  async (
    params: {
      query: string;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const { query, limit = 10 } = params;
      const response = await api.get<ApiResponse<Patient[]>>(`/api/v1/patients/search?q=${encodeURIComponent(query)}&limit=${limit}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Search failed");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Get patient statistics
export const fetchPatientStats = createAsyncThunk(
  "patients/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<PatientStats>>("/api/v1/patients/stats/summary");

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch patient statistics");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🧠 Slice logic
const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    // Clear current patient
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<PatientFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
    },

    // Update pagination
    setPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
      state.pagination.page = action.payload.page;
      state.pagination.limit = action.payload.limit;
    },

    // Add or update patient in list (for optimistic updates)
    upsertPatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(patient => patient.id === action.payload.id);
      if (index >= 0) {
        state.patients[index] = action.payload;
      } else {
        state.patients.unshift(action.payload);
      }
    },

    // Remove patient from list
    removePatientFromList: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(patient => patient.id !== action.payload);
    },

    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    // Set current patient's appointments
    setCurrentPatientAppointments: (state, action: PayloadAction<Patient["appointments"]>) => {
      if (state.currentPatient) {
        state.currentPatient.appointments = action.payload;
      }
    },

    // Set current patient's invoices
    setCurrentPatientInvoices: (state, action: PayloadAction<Patient["invoices"]>) => {
      if (state.currentPatient) {
        state.currentPatient.invoices = action.payload;
      }
    },

    // Reset state (for logout)
    resetPatients: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.patients;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch patient by ID
      .addCase(fetchPatientById.pending, (state) => {
        state.loadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentPatient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.error = action.payload as string;
      })

      // Create patient
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients.unshift(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update patient
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in list
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index >= 0) {
          state.patients[index] = action.payload;
        }
        
        // Update current patient if it's the one being viewed
        if (state.currentPatient?.id === action.payload.id) {
          state.currentPatient = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete patient
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = state.patients.filter(patient => patient.id !== action.payload);
        
        // Clear current patient if it was deleted
        if (state.currentPatient?.id === action.payload) {
          state.currentPatient = null;
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch patient appointments
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        if (state.currentPatient?.id === action.payload.patientId) {
          state.currentPatient.appointments = action.payload.appointments;
        }
      })

      // Fetch patient invoices
      .addCase(fetchPatientInvoices.fulfilled, (state, action) => {
        if (state.currentPatient?.id === action.payload.patientId) {
          state.currentPatient.invoices = action.payload.invoices;
        }
      })

      // Search patients
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })

      // Fetch patient stats
      .addCase(fetchPatientStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

// 🎯 Export actions
export const {
  clearCurrentPatient,
  clearError,
  setFilters,
  clearFilters,
  setPagination,
  upsertPatient,
  removePatientFromList,
  clearSearchResults,
  setCurrentPatientAppointments,
  setCurrentPatientInvoices,
  resetPatients,
} = patientsSlice.actions;

export default patientsSlice.reducer;

// 🧠 Selectors
export const selectPatients = (state: { patients: PatientsState }) =>
  state.patients.patients;

export const selectCurrentPatient = (state: { patients: PatientsState }) =>
  state.patients.currentPatient;

export const selectPatientsLoading = (state: { patients: PatientsState }) =>
  state.patients.loading;

export const selectCurrentPatientLoading = (state: { patients: PatientsState }) =>
  state.patients.loadingCurrent;

export const selectPatientsError = (state: { patients: PatientsState }) =>
  state.patients.error;

export const selectPatientsPagination = (state: { patients: PatientsState }) =>
  state.patients.pagination;

export const selectPatientsFilters = (state: { patients: PatientsState }) =>
  state.patients.filters;

export const selectPatientStats = (state: { patients: PatientsState }) =>
  state.patients.stats;

export const selectSearchResults = (state: { patients: PatientsState }) =>
  state.patients.searchResults;

// Helper selectors
export const selectActivePatients = (state: { patients: PatientsState }) =>
  state.patients.patients.filter(patient => patient.isActive);

export const selectPatientsByGender = (gender: Gender) => (state: { patients: PatientsState }) =>
  state.patients.patients.filter(patient => patient.gender === gender);

export const selectPatientsByAgeRange = (minAge: number, maxAge: number) => 
  (state: { patients: PatientsState }) => {
    const now = new Date();
    return state.patients.patients.filter(patient => {
      if (!patient.dateOfBirth) return false;
      const birthDate = new Date(patient.dateOfBirth);
      const age = now.getFullYear() - birthDate.getFullYear();
      return age >= minAge && age <= maxAge;
    });
  };

export const selectPatientsWithUpcomingAppointments = (state: { patients: PatientsState }) => {
  const now = new Date();
  return state.patients.patients.filter(patient => {
    return patient.appointments?.some(app => {
      const appDate = new Date(app.date);
      return appDate >= now && (app.status === AppointmentStatus.SCHEDULED || app.status === AppointmentStatus.CONFIRMED);
    });
  });
};