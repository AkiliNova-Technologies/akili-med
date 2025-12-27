import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchAppointments,
  fetchAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  fetchAppointmentsByPatient,
  fetchAppointmentsByDoctor,
  fetchTodayAppointments,
  checkAppointmentAvailability,
  clearCurrentAppointment,
  clearError,
  setFilters,
  clearFilters,
  setPagination,
  upsertAppointment,
  removeAppointmentFromList,
  selectAppointments,
  selectCurrentAppointment,
  selectAppointmentsLoading,
  selectCurrentAppointmentLoading,
  selectAppointmentsError,
  selectAppointmentsPagination,
  selectAppointmentsFilters,
  selectAppointmentsByStatus,
  selectAppointmentsByDoctor,
  selectAppointmentsByPatient,
  selectUpcomingAppointments,
  selectPastAppointments,
} from "@/redux/slices/appointmentsSlice";
import type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters,
} from "@/types/appointments";
import { useCallback } from "react";
import { toast } from "sonner";

export function useReduxAppointments() {
  const dispatch = useAppDispatch();

  // Selectors
  const appointments = useAppSelector(selectAppointments);
  const currentAppointment = useAppSelector(selectCurrentAppointment);
  const loading = useAppSelector(selectAppointmentsLoading);
  const loadingCurrent = useAppSelector(selectCurrentAppointmentLoading);
  const error = useAppSelector(selectAppointmentsError);
  const pagination = useAppSelector(selectAppointmentsPagination);
  const filters = useAppSelector(selectAppointmentsFilters);

  // Helper selectors
  const getAppointmentsByStatus = useCallback(
    (status: string) =>
      selectAppointmentsByStatus(status)({
        appointments: {
          appointments,
          currentAppointment,
          loading,
          loadingCurrent,
          error,
          pagination,
          filters,
        } as any,
      }),
    [appointments]
  );

  const getAppointmentsByDoctor = useCallback(
    (doctorId: string) =>
      selectAppointmentsByDoctor(doctorId)({
        appointments: {
          appointments,
          currentAppointment,
          loading,
          loadingCurrent,
          error,
          pagination,
          filters,
        } as any,
      }),
    [appointments]
  );

  const getAppointmentsByPatient = useCallback(
    (patientId: string) =>
      selectAppointmentsByPatient(patientId)({
        appointments: {
          appointments,
          currentAppointment,
          loading,
          loadingCurrent,
          error,
          pagination,
          filters,
        } as any,
      }),
    [appointments]
  );

  const upcomingAppointments = useAppSelector(selectUpcomingAppointments);
  const pastAppointments = useAppSelector(selectPastAppointments);

  // ========================
  // CRUD OPERATIONS
  // ========================

  const getAppointments = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      filters?: AppointmentFilters;
    }) => {
      try {
        const result = await dispatch(fetchAppointments(params || {})).unwrap();
        toast.success("Appointments loaded successfully");
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to load appointments");
        throw error;
      }
    },
    [dispatch]
  );

  const getAppointment = useCallback(
    async (id: string) => {
      try {
        const appointment = await dispatch(fetchAppointmentById(id)).unwrap();
        return appointment;
      } catch (error: any) {
        toast.error(error || "Failed to load appointment");
        throw error;
      }
    },
    [dispatch]
  );

  const addAppointment = useCallback(
    async (appointmentData: CreateAppointmentData) => {
      try {
        const newAppointment = await dispatch(
          createAppointment(appointmentData)
        ).unwrap();
        toast.success("Appointment created successfully");
        return newAppointment;
      } catch (error: any) {
        toast.error(error || "Failed to create appointment");
        throw error;
      }
    },
    [dispatch]
  );

  const editAppointment = useCallback(
    async (id: string, appointmentData: UpdateAppointmentData) => {
      try {
        const updatedAppointment = await dispatch(
          updateAppointment({ id, appointmentData })
        ).unwrap();
        toast.success("Appointment updated successfully");
        return updatedAppointment;
      } catch (error: any) {
        toast.error(error || "Failed to update appointment");
        throw error;
      }
    },
    [dispatch]
  );

  const removeAppointment = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteAppointment(id)).unwrap();
        toast.success("Appointment deleted successfully");
      } catch (error: any) {
        toast.error(error || "Failed to delete appointment");
        throw error;
      }
    },
    [dispatch]
  );

  const updateStatus = useCallback(
    async (id: string, status: string, notes?: string) => {
      try {
        const updatedAppointment = await dispatch(
          updateAppointmentStatus({ id, status, notes })
        ).unwrap();
        toast.success(`Appointment status updated to ${status}`);
        return updatedAppointment;
      } catch (error: any) {
        toast.error(error || "Failed to update status");
        throw error;
      }
    },
    [dispatch]
  );

  const reschedule = useCallback(
    async (
      id: string,
      date: string | Date,
      startTime: string,
      endTime: string
    ) => {
      try {
        const rescheduledAppointment = await dispatch(
          rescheduleAppointment({ id, date, startTime, endTime })
        ).unwrap();
        toast.success("Appointment rescheduled successfully");
        return rescheduledAppointment;
      } catch (error: any) {
        toast.error(error || "Failed to reschedule appointment");
        throw error;
      }
    },
    [dispatch]
  );

  // ========================
  // FILTERED FETCHES
  // ========================

  const getPatientAppointments = useCallback(
    async (patientId: string, page?: number, limit?: number) => {
      try {
        const result = await dispatch(
          fetchAppointmentsByPatient({ patientId, page, limit })
        ).unwrap();
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to load patient appointments");
        throw error;
      }
    },
    [dispatch]
  );

  const getDoctorAppointments = useCallback(
    async (doctorId: string, page?: number, limit?: number) => {
      try {
        const result = await dispatch(
          fetchAppointmentsByDoctor({ doctorId, page, limit })
        ).unwrap();
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to load doctor appointments");
        throw error;
      }
    },
    [dispatch]
  );

  const getTodayAppointments = useCallback(
    async (doctorId?: string) => {
      try {
        const appointments = await dispatch(
          fetchTodayAppointments({ doctorId })
        ).unwrap();
        return appointments;
      } catch (error: any) {
        toast.error(error || "Failed to load today's appointments");
        throw error;
      }
    },
    [dispatch]
  );

  // ========================
  // UTILITIES
  // ========================

  const checkAvailability = useCallback(
    async (params: {
      doctorId: string;
      date: string | Date;
      startTime: string;
      endTime: string;
      excludeAppointmentId?: string;
    }) => {
      try {
        const availability = await dispatch(
          checkAppointmentAvailability(params)
        ).unwrap();
        return availability;
      } catch (error: any) {
        toast.error(error || "Failed to check availability");
        throw error;
      }
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentAppointment());
  }, [dispatch]);

  const clearAppointmentsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: AppointmentFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const updatePagination = useCallback(
    (page: number, limit: number) => {
      dispatch(setPagination({ page, limit }));
    },
    [dispatch]
  );

  const optimisticUpdate = useCallback(
    (appointment: Appointment) => {
      dispatch(upsertAppointment(appointment));
    },
    [dispatch]
  );

  const optimisticRemove = useCallback(
    (id: string) => {
      dispatch(removeAppointmentFromList(id));
    },
    [dispatch]
  );

  // ========================
  // HELPER FUNCTIONS
  // ========================

  const getAppointmentStats = useCallback(() => {
    const stats = {
      total: appointments.length,
      scheduled: appointments.filter((app) => app.status === "SCHEDULED")
        .length,
      confirmed: appointments.filter((app) => app.status === "CONFIRMED")
        .length,
      inProgress: appointments.filter((app) => app.status === "IN_PROGRESS")
        .length,
      completed: appointments.filter((app) => app.status === "COMPLETED")
        .length,
      cancelled: appointments.filter((app) => app.status === "CANCELLED")
        .length,
      noShow: appointments.filter((app) => app.status === "NO_SHOW").length,
    };

    return stats;
  }, [appointments]);

  const getTodaysStats = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const todaysAppointments = appointments.filter(
      (app) => app.date.split("T")[0] === today
    );

    return {
      total: todaysAppointments.length,
      byStatus: {
        scheduled: todaysAppointments.filter(
          (app) => app.status === "SCHEDULED"
        ).length,
        confirmed: todaysAppointments.filter(
          (app) => app.status === "CONFIRMED"
        ).length,
        inProgress: todaysAppointments.filter(
          (app) => app.status === "IN_PROGRESS"
        ).length,
        completed: todaysAppointments.filter(
          (app) => app.status === "COMPLETED"
        ).length,
      },
    };
  }, [appointments]);

  const formatAppointmentTime = useCallback(
    (date: string, startTime: string, endTime: string) => {
      const appointmentDate = new Date(date);
      const day = appointmentDate.toLocaleDateString("en-US", {
        weekday: "short",
      });
      const dateStr = appointmentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${day}, ${dateStr} • ${startTime} - ${endTime}`;
    },
    []
  );

  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: "bg-blue-100 text-blue-800",
      CONFIRMED: "bg-green-100 text-green-800",
      WAITING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-purple-100 text-purple-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
      NO_SHOW: "bg-orange-100 text-orange-800",
      RESCHEDULED: "bg-indigo-100 text-indigo-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-green-100 text-green-800",
      NORMAL: "bg-blue-100 text-blue-800",
      HIGH: "bg-yellow-100 text-yellow-800",
      EMERGENCY: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  }, []);

  return {
    // State
    appointments,
    currentAppointment,
    loading,
    loadingCurrent,
    error,
    pagination,
    filters,
    upcomingAppointments,
    pastAppointments,

    // Filtered data
    getAppointmentsByStatus,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,

    // CRUD Operations
    getAppointments,
    getAppointment,
    addAppointment,
    editAppointment,
    removeAppointment,
    updateStatus,
    reschedule,

    // Filtered fetches
    getPatientAppointments,
    getDoctorAppointments,
    getTodayAppointments,

    // Utilities
    checkAvailability,
    clearCurrent,
    clearError: clearAppointmentsError,
    updateFilters,
    resetFilters,
    updatePagination,
    optimisticUpdate,
    optimisticRemove,

    // Helper functions
    getAppointmentStats,
    getTodaysStats,
    formatAppointmentTime,
    getStatusColor,
    getPriorityColor,
  };
}

export type UseAppointmentsReturn = ReturnType<typeof useReduxAppointments>;
