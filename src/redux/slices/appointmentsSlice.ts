// src/redux/slices/appointmentsSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/utils/api";
import type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
  AppointmentsState,
} from "@/types/appointments";

// Initial state
const initialState: AppointmentsState = {
  appointments: [],
  currentAppointment: null,
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
    return date.toISOString().split("T")[0];
  }
  return date;
};

// 🔄 Fetch all appointments with pagination and filters
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async (
    params: {
      page?: number;
      limit?: number;
      filters?: AppointmentFilters;
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
            queryParams.append(key, value.toISOString().split("T")[0]);
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await api.get(`/api/v1/appointments?${queryParams}`);

      if (response.data.success) {
        return {
          appointments: response.data.data,
          pagination: response.data.pagination,
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch appointments"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch appointment by ID
export const fetchAppointmentById = createAsyncThunk(
  "appointments/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/appointments/${id}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Appointment not found"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Create new appointment
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (appointmentData: CreateAppointmentData, { rejectWithValue }) => {
    try {
      // Format date for API
      const formattedData = {
        ...appointmentData,
        date: formatDateForApi(appointmentData.date),
      };

      const response = await api.post("/api/v1/appointments", formattedData);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to create appointment"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Update appointment
export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async (
    {
      id,
      appointmentData,
    }: { id: string; appointmentData: UpdateAppointmentData },
    { rejectWithValue }
  ) => {
    try {
      // Format date if provided
      const formattedData = { ...appointmentData };
      if (appointmentData.date) {
        formattedData.date = formatDateForApi(appointmentData.date);
      }

      const response = await api.put(
        `/api/v1/appointments/${id}`,
        formattedData
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to update appointment"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Delete appointment
export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/appointments/${id}`);
      return id;
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Update appointment status
export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateStatus",
  async (
    { id, status, notes }: { id: string; status: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/api/v1/appointments/${id}/status`, {
        status,
        notes,
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to update status"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Reschedule appointment
export const rescheduleAppointment = createAsyncThunk(
  "appointments/reschedule",
  async (
    {
      id,
      date,
      startTime,
      endTime,
    }: { id: string; date: string | Date; startTime: string; endTime: string },
    { rejectWithValue }
  ) => {
    try {
      const formattedDate = formatDateForApi(date);

      const response = await api.put(`/api/v1/appointments/${id}/reschedule`, {
        date: formattedDate,
        startTime,
        endTime,
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to reschedule");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch appointments by patient
export const fetchAppointmentsByPatient = createAsyncThunk(
  "appointments/fetchByPatient",
  async (
    {
      patientId,
      page = 1,
      limit = 10,
    }: { patientId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/api/v1/appointments/patient/${patientId}?page=${page}&limit=${limit}`
      );

      if (response.data.success) {
        return {
          appointments: response.data.data,
          pagination: response.data.pagination,
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch patient appointments"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Fetch appointments by doctor
export const fetchAppointmentsByDoctor = createAsyncThunk(
  "appointments/fetchByDoctor",
  async (
    {
      doctorId,
      page = 1,
      limit = 10,
    }: { doctorId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/api/v1/appointments/doctor/${doctorId}?page=${page}&limit=${limit}`
      );

      if (response.data.success) {
        return {
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

// 🔄 Fetch today's appointments
export const fetchTodayAppointments = createAsyncThunk(
  "appointments/fetchToday",
  async (params: { doctorId?: string } | undefined, { rejectWithValue }) => {
    try {
      const doctorId = params?.doctorId;
      const url = doctorId
        ? `/api/v1/appointments/today?doctorId=${doctorId}`
        : `/api/v1/appointments/today`;

      const response = await api.get(url);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch today's appointments"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔄 Check appointment availability
export const checkAppointmentAvailability = createAsyncThunk(
  "appointments/checkAvailability",
  async (
    params: {
      doctorId: string;
      date: string | Date;
      startTime: string;
      endTime: string;
      excludeAppointmentId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const formattedDate = formatDateForApi(params.date);

      const response = await api.post(
        "/api/v1/appointments/check-availability",
        {
          doctorId: params.doctorId,
          date: formattedDate,
          startTime: params.startTime,
          endTime: params.endTime,
          excludeAppointmentId: params.excludeAppointmentId,
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data.message || "Failed to check availability"
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🧠 Slice logic
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    // Clear current appointment
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<AppointmentFilters>) => {
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

    // Add or update appointment in list (for optimistic updates)
    upsertAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index >= 0) {
        state.appointments[index] = action.payload;
      } else {
        state.appointments.unshift(action.payload);
      }
    },

    // Remove appointment from list
    removeAppointmentFromList: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (app) => app.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch appointment by ID
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentAppointment = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.error = action.payload as string;
      })

      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;

        // Update in list
        const index = state.appointments.findIndex(
          (app) => app.id === action.payload.id
        );
        if (index >= 0) {
          state.appointments[index] = action.payload;
        }

        // Update current appointment if it's the one being viewed
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (app) => app.id !== action.payload
        );

        // Clear current appointment if it was deleted
        if (state.currentAppointment?.id === action.payload) {
          state.currentAppointment = null;
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update status
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;

        // Update in list
        const index = state.appointments.findIndex(
          (app) => app.id === action.payload.id
        );
        if (index >= 0) {
          state.appointments[index] = action.payload;
        }

        // Update current appointment
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reschedule
      .addCase(rescheduleAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.loading = false;

        // Update in list
        const index = state.appointments.findIndex(
          (app) => app.id === action.payload.id
        );
        if (index >= 0) {
          state.appointments[index] = action.payload;
        }

        // Update current appointment
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by patient
      .addCase(fetchAppointmentsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAppointmentsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch by doctor
      .addCase(fetchAppointmentsByDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAppointmentsByDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch today's appointments
      .addCase(fetchTodayAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchTodayAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 🎯 Export actions
export const {
  clearCurrentAppointment,
  clearError,
  setFilters,
  clearFilters,
  setPagination,
  upsertAppointment,
  removeAppointmentFromList,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;

// 🧠 Selectors
export const selectAppointments = (state: {
  appointments: AppointmentsState;
}) => state.appointments.appointments;

export const selectCurrentAppointment = (state: {
  appointments: AppointmentsState;
}) => state.appointments.currentAppointment;

export const selectAppointmentsLoading = (state: {
  appointments: AppointmentsState;
}) => state.appointments.loading;

export const selectCurrentAppointmentLoading = (state: {
  appointments: AppointmentsState;
}) => state.appointments.loadingCurrent;

export const selectAppointmentsError = (state: {
  appointments: AppointmentsState;
}) => state.appointments.error;

export const selectAppointmentsPagination = (state: {
  appointments: AppointmentsState;
}) => state.appointments.pagination;

export const selectAppointmentsFilters = (state: {
  appointments: AppointmentsState;
}) => state.appointments.filters;

// Helper selectors
export const selectAppointmentsByStatus =
  (status: string) => (state: { appointments: AppointmentsState }) =>
    state.appointments.appointments.filter((app) => app.status === status);

export const selectAppointmentsByDoctor =
  (doctorId: string) => (state: { appointments: AppointmentsState }) =>
    state.appointments.appointments.filter((app) => app.doctorId === doctorId);

export const selectAppointmentsByPatient =
  (patientId: string) => (state: { appointments: AppointmentsState }) =>
    state.appointments.appointments.filter(
      (app) => app.patientId === patientId
    );

export const selectUpcomingAppointments = (state: {
  appointments: AppointmentsState;
}) => {
  const now = new Date();
  return state.appointments.appointments.filter((app) => {
    const appointmentDate = new Date(app.date);
    return (
      appointmentDate >= now ||
      app.status === "SCHEDULED" ||
      app.status === "CONFIRMED"
    );
  });
};

export const selectPastAppointments = (state: {
  appointments: AppointmentsState;
}) => {
  const now = new Date();
  return state.appointments.appointments.filter((app) => {
    const appointmentDate = new Date(app.date);
    return (
      appointmentDate < now ||
      app.status === "COMPLETED" ||
      app.status === "CANCELLED"
    );
  });
};
