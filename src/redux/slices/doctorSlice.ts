import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/utils/api";
import type {
  Doctor,
  CreateDoctorData,
  UpdateDoctorData,
  DoctorFilters,
  ScheduleFilters,
  DoctorsState,
  DoctorStats,
  ApiResponse,
  PaginatedApiResponse,
} from "@/types/doctors";
import type { Appointment } from "@/types/patients";

// Initial state
const initialState: DoctorsState = {
  doctors: [],
  currentDoctor: null,
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
  schedule: [],
  scheduleLoading: false,
  searchResults: [],
  autocompleteResults: [],
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
    return date.toISOString();
  }
  return date;
};

// 🔄 Fetch all doctors with pagination and filters
export const fetchDoctors = createAsyncThunk(
  "doctors/fetchAll",
  async (
    params: {
      page?: number;
      limit?: number;
      filters?: DoctorFilters;
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
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(","));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await api.get<PaginatedApiResponse<Doctor>>(
        `/api/v1/doctors?${queryParams}`
      );

      if (response.data.success) {
        return {
          doctors: response.data.data,
          pagination: response.data.pagination,
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch doctors"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch doctor by ID
export const fetchDoctorById = createAsyncThunk(
  "doctors/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Doctor>>(
        `/api/v1/doctors/${id}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Doctor not found");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Create new doctor
export const createDoctor = createAsyncThunk(
  "doctors/create",
  async (doctorData: CreateDoctorData, { rejectWithValue }) => {
    try {
      // Format dates for API
      const formattedData = {
        ...doctorData,
        dateOfBirth: doctorData.dateOfBirth
          ? formatDateForApi(doctorData.dateOfBirth)
          : undefined,
        licenseExpiryDate: doctorData.licenseExpiryDate
          ? formatDateForApi(doctorData.licenseExpiryDate)
          : undefined,
      };

      const response = await api.post<ApiResponse<Doctor>>(
        "/api/v1/doctors",
        formattedData
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to create doctor"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Update doctor
export const updateDoctor = createAsyncThunk(
  "doctors/update",
  async (
    { id, doctorData }: { id: string; doctorData: UpdateDoctorData },
    { rejectWithValue }
  ) => {
    try {
      // Format dates if provided
      const formattedData = { ...doctorData };
      if (doctorData.dateOfBirth) {
        formattedData.dateOfBirth = formatDateForApi(doctorData.dateOfBirth);
      }
      if (doctorData.licenseExpiryDate) {
        formattedData.licenseExpiryDate = formatDateForApi(
          doctorData.licenseExpiryDate
        );
      }

      const response = await api.put<ApiResponse<Doctor>>(
        `/api/v1/doctors/${id}`,
        formattedData
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to update doctor"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Delete doctor
export const deleteDoctor = createAsyncThunk(
  "doctors/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/doctors/${id}`);
      return id;
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch doctor's appointments
export const fetchDoctorAppointments = createAsyncThunk(
  "doctors/fetchAppointments",
  async (
    params: {
      doctorId: string;
      page?: number;
      limit?: number;
      filters?: {
        status?: string[];
        startDate?: string;
        endDate?: string;
        appointmentType?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const { doctorId, page = 1, limit = 10, filters = {} } = params;

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(","));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await api.get<PaginatedApiResponse<Appointment>>(
        `/api/v1/doctors/${doctorId}/appointments?${queryParams}`
      );

      if (response.data.success) {
        return {
          doctorId,
          appointments: response.data.data,
          pagination: response.data.pagination,
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch doctor appointments"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch doctor's schedule
export const fetchDoctorSchedule = createAsyncThunk(
  "doctors/fetchSchedule",
  async (
    params: {
      doctorId: string;
      startDate?: string | Date;
      endDate?: string | Date;
      filters?: ScheduleFilters;
    },
    { rejectWithValue }
  ) => {
    try {
      const { doctorId, startDate, endDate, filters = {} } = params;

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (startDate) {
        queryParams.append("startDate", formatDateForApi(startDate));
      }
      if (endDate) {
        queryParams.append("endDate", formatDateForApi(endDate));
      }

      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(","));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await api.get<ApiResponse<Appointment[]>>(
        `/api/v1/doctors/${doctorId}/schedule?${queryParams}`
      );

      if (response.data.success) {
        return {
          doctorId,
          schedule: response.data.data,
          startDate,
          endDate,
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch doctor schedule"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch doctors by specialty
export const fetchDoctorsBySpecialty = createAsyncThunk(
  "doctors/fetchBySpecialty",
  async (
    params: {
      specialty: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const { specialty, page = 1, limit = 10 } = params;
      const response = await api.get<PaginatedApiResponse<Doctor>>(
        `/api/v1/doctors/specialty/${specialty}?page=${page}&limit=${limit}`
      );

      if (response.data.success) {
        return {
          doctors: response.data.data,
          pagination: response.data.pagination,
          specialty,
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch doctors by specialty"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Search doctors (autocomplete)
export const searchDoctorsAutocomplete = createAsyncThunk(
  "doctors/searchAutocomplete",
  async (
    params: {
      query: string;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const { query, limit = 10 } = params;
      const response = await api.get<ApiResponse<Doctor[]>>(
        `/api/v1/doctors/search/autocomplete?q=${encodeURIComponent(
          query
        )}&limit=${limit}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Autocomplete search failed"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Advanced doctor search
export const searchDoctors = createAsyncThunk(
  "doctors/search",
  async (
    params: {
      query: string;
      filters?: {
        specializations?: string[];
        hospitals?: string[];
        hasAvailability?: boolean;
      };
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const { query, filters = {}, page = 1, limit = 10 } = params;

      // Build query parameters
      const queryParams = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters to query params with proper type checking
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle boolean values separately
          if (typeof value === "boolean") {
            queryParams.append(key, value.toString());
          }
          // Handle array values
          else if (Array.isArray(value)) {
            if (value.length > 0) {
              queryParams.append(key, value.join(","));
            }
          }
          // Handle string values (or convert other types)
          else {
            queryParams.append(key, value);
          }
        }
      });

      const response = await api.get<PaginatedApiResponse<Doctor>>(
        `/api/v1/doctors/search?${queryParams}`
      );

      if (response.data.success) {
        return {
          doctors: response.data.data,
          pagination: response.data.pagination,
          query,
          filters,
        };
      } else {
        return rejectWithValue(response.data.message || "Search failed");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Get doctor statistics
export const fetchDoctorStats = createAsyncThunk(
  "doctors/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<DoctorStats>>(
        "/api/v1/doctors/stats/summary"
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch doctor statistics"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Toggle doctor availability
export const toggleDoctorAvailability = createAsyncThunk(
  "doctors/toggleAvailability",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/api/v1/doctors/${id}/toggle-availability`
      );

      if (response.data.success) {
        return {
          id,
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to toggle doctor availability"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🧠 Slice logic
const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    // Clear current doctor
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<DoctorFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
    },

    // Update pagination
    setPagination: (
      state,
      action: PayloadAction<{ page: number; limit: number }>
    ) => {
      state.pagination.page = action.payload.page;
      state.pagination.limit = action.payload.limit;
    },

    // Add or update doctor in list (for optimistic updates)
    upsertDoctor: (state, action: PayloadAction<Doctor>) => {
      const index = state.doctors.findIndex(
        (doctor) => doctor.id === action.payload.id
      );
      if (index >= 0) {
        state.doctors[index] = action.payload;
      } else {
        state.doctors.unshift(action.payload);
      }
    },

    // Remove doctor from list
    removeDoctorFromList: (state, action: PayloadAction<string>) => {
      state.doctors = state.doctors.filter(
        (doctor) => doctor.id !== action.payload
      );
    },

    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.autocompleteResults = [];
    },

    // Clear autocomplete results
    clearAutocompleteResults: (state) => {
      state.autocompleteResults = [];
    },

    // Clear schedule
    clearSchedule: (state) => {
      state.schedule = [];
    },

    // Set current doctor's appointments
    setCurrentDoctorAppointments: (
      state,
      action: PayloadAction<Doctor["appointments"]>
    ) => {
      if (state.currentDoctor) {
        state.currentDoctor.appointments = action.payload;
      }
    },

    // Reset state (for logout)
    resetDoctors: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.error = action.payload as string;
      })

      // Create doctor
      .addCase(createDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.unshift(action.payload);
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update doctor
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;

        // Update in list
        const index = state.doctors.findIndex(
          (doctor) => doctor.id === action.payload.id
        );
        if (index >= 0) {
          state.doctors[index] = action.payload;
        }

        // Update current doctor if it's the one being viewed
        if (state.currentDoctor?.id === action.payload.id) {
          state.currentDoctor = action.payload;
        }
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete doctor
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter(
          (doctor) => doctor.id !== action.payload
        );

        // Clear current doctor if it was deleted
        if (state.currentDoctor?.id === action.payload) {
          state.currentDoctor = null;
        }
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch doctor appointments
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        if (state.currentDoctor?.id === action.payload.doctorId) {
          state.currentDoctor.appointments = action.payload.appointments;
        }
      })

      // Fetch doctor schedule
      .addCase(fetchDoctorSchedule.pending, (state) => {
        state.scheduleLoading = true;
      })
      .addCase(fetchDoctorSchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.schedule = action.payload.schedule;
      })
      .addCase(fetchDoctorSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.error = action.payload as string;
      })

      // Search doctors autocomplete
      .addCase(searchDoctorsAutocomplete.fulfilled, (state, action) => {
        state.autocompleteResults = action.payload;
      })

      // Search doctors
      .addCase(searchDoctors.fulfilled, (state, action) => {
        state.searchResults = action.payload.doctors;
      })

      // Fetch doctor stats
      .addCase(fetchDoctorStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Toggle doctor availability
      .addCase(toggleDoctorAvailability.fulfilled, (state, action) => {
        // Update doctor in list
        const index = state.doctors.findIndex(
          (doctor) => doctor.id === action.payload.id
        );
        if (index >= 0) {
          state.doctors[index].isActive = !state.doctors[index].isActive;
        }

        // Update current doctor
        if (state.currentDoctor?.id === action.payload.id) {
          state.currentDoctor.isActive = !state.currentDoctor.isActive;
        }
      });
  },
});

// 🎯 Export actions
export const {
  clearCurrentDoctor,
  clearError,
  setFilters,
  clearFilters,
  setPagination,
  upsertDoctor,
  removeDoctorFromList,
  clearSearchResults,
  clearAutocompleteResults,
  clearSchedule,
  setCurrentDoctorAppointments,
  resetDoctors,
} = doctorsSlice.actions;

export default doctorsSlice.reducer;

// 🧠 Selectors
export const selectDoctors = (state: { doctors: DoctorsState }) =>
  state.doctors.doctors;

export const selectCurrentDoctor = (state: { doctors: DoctorsState }) =>
  state.doctors.currentDoctor;

export const selectDoctorsLoading = (state: { doctors: DoctorsState }) =>
  state.doctors.loading;

export const selectCurrentDoctorLoading = (state: { doctors: DoctorsState }) =>
  state.doctors.loadingCurrent;

export const selectDoctorsError = (state: { doctors: DoctorsState }) =>
  state.doctors.error;

export const selectDoctorsPagination = (state: { doctors: DoctorsState }) =>
  state.doctors.pagination;

export const selectDoctorsFilters = (state: { doctors: DoctorsState }) =>
  state.doctors.filters;

export const selectDoctorStats = (state: { doctors: DoctorsState }) =>
  state.doctors.stats;

export const selectDoctorSchedule = (state: { doctors: DoctorsState }) =>
  state.doctors.schedule;

export const selectScheduleLoading = (state: { doctors: DoctorsState }) =>
  state.doctors.scheduleLoading;

export const selectSearchResults = (state: { doctors: DoctorsState }) =>
  state.doctors.searchResults;

export const selectAutocompleteResults = (state: { doctors: DoctorsState }) =>
  state.doctors.autocompleteResults;

// Helper selectors
export const selectActiveDoctors = (state: { doctors: DoctorsState }) =>
  state.doctors.doctors.filter((doctor) => doctor.isActive);

export const selectDoctorsBySpecialization =
  (specialization: string) => (state: { doctors: DoctorsState }) =>
    state.doctors.doctors.filter(
      (doctor) =>
        doctor.specialization === specialization ||
        doctor.specialty === specialization
    );

export const selectDoctorsByHospital =
  (hospital: string) => (state: { doctors: DoctorsState }) =>
    state.doctors.doctors.filter((doctor) => doctor.hospital === hospital);

export const selectDoctorsWithAvailability =
  (date?: string) => (state: { doctors: DoctorsState }) => {
    const activeDoctors = state.doctors.doctors.filter(
      (doctor) => doctor.isActive
    );

    if (!date || !state.doctors.schedule.length) {
      return activeDoctors;
    }

    return activeDoctors;
  };
