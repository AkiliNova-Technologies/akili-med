// src/hooks/useDoctors.ts
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchDoctors,
  fetchDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  fetchDoctorAppointments,
  fetchDoctorSchedule,
  fetchDoctorsBySpecialty,
  searchDoctorsAutocomplete,
  searchDoctors,
  fetchDoctorStats,
  toggleDoctorAvailability,
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
  selectDoctors,
  selectCurrentDoctor,
  selectDoctorsLoading,
  selectCurrentDoctorLoading,
  selectDoctorsError,
  selectDoctorsPagination,
  selectDoctorsFilters,
  selectDoctorStats,
  selectDoctorSchedule,
  selectScheduleLoading,
  selectSearchResults,
  selectAutocompleteResults,
  selectActiveDoctors,
  selectDoctorsBySpecialization,
  selectDoctorsByHospital,
  selectDoctorsWithAvailability,
} from "@/redux/slices/doctorSlice";
import type {
  Doctor,
  CreateDoctorData,
  UpdateDoctorData,
  DoctorFilters,
  ScheduleFilters,
} from "@/types/doctors";
import type { Appointment } from "@/types/patients";
import api from "@/utils/api";
import { useCallback } from "react";
import { toast } from "sonner";

export function useReduxDoctors() {
  const dispatch = useAppDispatch();

  // Selectors
  const doctors = useAppSelector(selectDoctors);
  const currentDoctor = useAppSelector(selectCurrentDoctor);
  const loading = useAppSelector(selectDoctorsLoading);
  const loadingCurrent = useAppSelector(selectCurrentDoctorLoading);
  const error = useAppSelector(selectDoctorsError);
  const pagination = useAppSelector(selectDoctorsPagination);
  const filters = useAppSelector(selectDoctorsFilters);
  const stats = useAppSelector(selectDoctorStats);
  const schedule = useAppSelector(selectDoctorSchedule);
  const scheduleLoading = useAppSelector(selectScheduleLoading);
  const searchResults = useAppSelector(selectSearchResults);
  const autocompleteResults = useAppSelector(selectAutocompleteResults);

  // Helper selectors
  const activeDoctors = useAppSelector(selectActiveDoctors);
  const getDoctorsBySpecialization = useCallback(
    (specialization: string) => selectDoctorsBySpecialization(specialization)({ doctors: { doctors, currentDoctor, loading, loadingCurrent, error, pagination, filters, stats, schedule, scheduleLoading, searchResults, autocompleteResults } as any }),
    [doctors]
  );
  const getDoctorsByHospital = useCallback(
    (hospital: string) => selectDoctorsByHospital(hospital)({ doctors: { doctors, currentDoctor, loading, loadingCurrent, error, pagination, filters, stats, schedule, scheduleLoading, searchResults, autocompleteResults } as any }),
    [doctors]
  );
  const getDoctorsWithAvailability = useCallback(
    (date: string) => selectDoctorsWithAvailability(date)({ doctors: { doctors, currentDoctor, loading, loadingCurrent, error, pagination, filters, stats, schedule, scheduleLoading, searchResults, autocompleteResults } as any }),
    [doctors]
  );

  // ========================
  // CRUD OPERATIONS
  // ========================

  const getDoctors = useCallback(
    async (params?: { page?: number; limit?: number; filters?: DoctorFilters }) => {
      try {
        const result = await dispatch(fetchDoctors(params || {})).unwrap();
        toast.success("Doctors loaded successfully");
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to load doctors");
        throw error;
      }
    },
    [dispatch]
  );

  const getDoctor = useCallback(
    async (id: string) => {
      try {
        const doctor = await dispatch(fetchDoctorById(id)).unwrap();
        return doctor;
      } catch (error: any) {
        toast.error(error || "Failed to load doctor");
        throw error;
      }
    },
    [dispatch]
  );

  const addDoctor = useCallback(
    async (doctorData: CreateDoctorData) => {
      try {
        const newDoctor = await dispatch(createDoctor(doctorData)).unwrap();
        toast.success("Doctor created successfully");
        return newDoctor;
      } catch (error: any) {
        toast.error(error || "Failed to create doctor");
        throw error;
      }
    },
    [dispatch]
  );

  const editDoctor = useCallback(
    async (id: string, doctorData: UpdateDoctorData) => {
      try {
        const updatedDoctor = await dispatch(updateDoctor({ id, doctorData })).unwrap();
        toast.success("Doctor updated successfully");
        return updatedDoctor;
      } catch (error: any) {
        toast.error(error || "Failed to update doctor");
        throw error;
      }
    },
    [dispatch]
  );

  const removeDoctor = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteDoctor(id)).unwrap();
        toast.success("Doctor deleted successfully");
      } catch (error: any) {
        toast.error(error || "Failed to delete doctor");
        throw error;
      }
    },
    [dispatch]
  );

  // ========================
  // RELATED DATA OPERATIONS
  // ========================

  const getDoctorAppointments = useCallback(
    async (
      doctorId: string,
      page?: number,
      limit?: number,
      filters?: {
        status?: string[];
        startDate?: string;
        endDate?: string;
        appointmentType?: string;
      }
    ) => {
      try {
        const result = await dispatch(
          fetchDoctorAppointments({ doctorId, page, limit, filters })
        ).unwrap();
        dispatch(setCurrentDoctorAppointments(result.appointments));
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to fetch doctor appointments");
        throw error;
      }
    },
    [dispatch]
  );

  const getDoctorSchedule = useCallback(
    async (
      doctorId: string,
      startDate?: string | Date,
      endDate?: string | Date,
      filters?: ScheduleFilters
    ) => {
      try {
        const result = await dispatch(
          fetchDoctorSchedule({ doctorId, startDate, endDate, filters })
        ).unwrap();
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to fetch doctor schedule");
        throw error;
      }
    },
    [dispatch]
  );

  // ========================
  // SEARCH & FILTER
  // ========================

  const getDoctorsBySpecialty = useCallback(
    async (specialty: string, page?: number, limit?: number) => {
      try {
        const result = await dispatch(
          fetchDoctorsBySpecialty({ specialty, page, limit })
        ).unwrap();
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to fetch doctors by specialty");
        throw error;
      }
    },
    [dispatch]
  );

  const searchAutocomplete = useCallback(
    async (query: string, limit?: number) => {
      try {
        const results = await dispatch(
          searchDoctorsAutocomplete({ query, limit })
        ).unwrap();
        return results;
      } catch (error: any) {
        // Don't show toast for autocomplete errors
        console.error("Autocomplete search failed:", error);
        return [];
      }
    },
    [dispatch]
  );

  const advancedSearch = useCallback(
    async (
      query: string,
      filters?: {
        specializations?: string[];
        hospitals?: string[];
        hasAvailability?: boolean;
      },
      page?: number,
      limit?: number
    ) => {
      try {
        const result = await dispatch(
          searchDoctors({ query, filters, page, limit })
        ).unwrap();
        return result;
      } catch (error: any) {
        toast.error(error || "Search failed");
        throw error;
      }
    },
    [dispatch]
  );

  // ========================
  // STATS & UTILITIES
  // ========================

  const getStats = useCallback(
    async () => {
      try {
        const statsData = await dispatch(fetchDoctorStats()).unwrap();
        return statsData;
      } catch (error: any) {
        toast.error(error || "Failed to fetch doctor statistics");
        throw error;
      }
    },
    [dispatch]
  );

  const toggleAvailability = useCallback(
    async (id: string) => {
      try {
        const result = await dispatch(toggleDoctorAvailability(id)).unwrap();
        const newStatus = currentDoctor?.id === id ? !currentDoctor.isActive : undefined;
        toast.success(
          newStatus !== undefined
            ? `Doctor ${newStatus ? 'activated' : 'deactivated'} successfully`
            : result.message || "Availability toggled successfully"
        );
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to toggle doctor availability");
        throw error;
      }
    },
    [dispatch, currentDoctor]
  );

  // ========================
  // UTILITIES
  // ========================

  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentDoctor());
  }, [dispatch]);

  const clearDoctorsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: DoctorFilters) => {
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

  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const clearAutocomplete = useCallback(() => {
    dispatch(clearAutocompleteResults());
  }, [dispatch]);

  const clearDoctorSchedule = useCallback(() => {
    dispatch(clearSchedule());
  }, [dispatch]);

  const optimisticUpdate = useCallback(
    (doctor: Doctor) => {
      dispatch(upsertDoctor(doctor));
    },
    [dispatch]
  );

  const optimisticRemove = useCallback(
    (id: string) => {
      dispatch(removeDoctorFromList(id));
    },
    [dispatch]
  );

  // ========================
  // HELPER FUNCTIONS
  // ========================

  const getFullName = useCallback((doctor: Doctor): string => {
    const title = doctor.title ? `${doctor.title} ` : '';
    return `${title}${doctor.firstName} ${doctor.lastName}`;
  }, []);

  const getSpecialization = useCallback((doctor: Doctor): string => {
    return doctor.specialization || doctor.specialty || 'General Practitioner';
  }, []);

  const formatConsultationFee = useCallback((fee?: string): string => {
    if (!fee) return 'Not specified';
    const amount = parseFloat(fee);
    if (isNaN(amount)) return fee;
    return `$${amount.toFixed(2)}`;
  }, []);

  const getExperienceLevel = useCallback((years?: number): string => {
    if (!years) return 'New';
    if (years < 3) return 'Junior';
    if (years < 10) return 'Experienced';
    if (years < 20) return 'Senior';
    return 'Veteran';
  }, []);

  const getDoctorSummary = useCallback((doctor: Doctor) => {
    return {
      name: getFullName(doctor),
      specialization: getSpecialization(doctor),
      hospital: doctor.hospital || 'Not specified',
      experience: doctor.yearsOfExperience 
        ? `${doctor.yearsOfExperience} years (${getExperienceLevel(doctor.yearsOfExperience)})`
        : 'Not specified',
      consultationFee: formatConsultationFee(doctor.consultationFee),
      status: doctor.isActive ? 'Active' : 'Inactive',
      languages: doctor.languages?.join(', ') || 'English',
      upcomingAppointments: doctor.upcomingAppointments || 0,
      totalAppointments: doctor.totalAppointments || 0,
      appointmentStats: doctor.appointmentStats || {},
    };
  }, [getFullName, getSpecialization, formatConsultationFee, getExperienceLevel]);

  const checkLicenseExpiry = useCallback((doctor: Doctor): { status: 'valid' | 'expired' | 'expiring'; days: number } => {
    if (!doctor.licenseExpiryDate) return { status: 'valid', days: Infinity };
    
    const expiryDate = new Date(doctor.licenseExpiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', days: Math.abs(daysUntilExpiry) };
    if (daysUntilExpiry <= 30) return { status: 'expiring', days: daysUntilExpiry };
    return { status: 'valid', days: daysUntilExpiry };
  }, []);

  const generateDoctorReport = useCallback(async (doctorId: string, period: 'monthly' | 'quarterly' | 'yearly' = 'monthly') => {
    try {
      const response = await api.get(`/api/v1/doctors/${doctorId}/report?period=${period}`);
      
      // Create PDF download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `doctor_report_${doctorId}_${period}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Doctor report generated successfully");
    } catch (error: any) {
      toast.error("Failed to generate doctor report");
      throw error;
    }
  }, []);

  const exportDoctors = useCallback(async (format: 'csv' | 'excel' = 'csv', filters?: DoctorFilters) => {
    try {
      const queryParams = new URLSearchParams({ format });
      
      // Add filters to query params
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get(`/api/v1/doctors/export?${queryParams}`);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `doctors_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Doctors exported successfully as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error("Failed to export doctors");
      throw error;
    }
  }, []);

  const getAvailableTimeSlots = useCallback(async (doctorId: string, date: string | Date) => {
  try {
    // Get doctor's schedule for the day
    const scheduleResult = await getDoctorSchedule(doctorId, date, date);
    const schedule = scheduleResult.schedule; // Extract the schedule array
    
    // Generate available time slots (simplified logic)
    const timeSlots: string[] = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if time slot is available (simplified check)
        const isBooked = schedule.some((app: Appointment) => {
          return app.startTime === time;
        });
        
        if (!isBooked) {
          timeSlots.push(time);
        }
      }
    }
    
    return timeSlots;
  } catch (error: any) {
    console.error("Failed to get available time slots:", error);
    return [];
  }
}, [getDoctorSchedule]);

  return {
    // State
    doctors,
    currentDoctor,
    loading,
    loadingCurrent,
    error,
    pagination,
    filters,
    stats,
    schedule,
    scheduleLoading,
    searchResults,
    autocompleteResults,
    activeDoctors,

    // Filtered data functions
    getDoctorsBySpecialization,
    getDoctorsByHospital,
    getDoctorsWithAvailability,

    // CRUD Operations
    getDoctors,
    getDoctor,
    addDoctor,
    editDoctor,
    removeDoctor,

    // Related Data Operations
    getDoctorAppointments,
    getDoctorSchedule,

    // Search & Filter
    getDoctorsBySpecialty,
    searchAutocomplete,
    advancedSearch,

    // Stats & Utilities
    getStats,
    toggleAvailability,

    // Utilities
    clearCurrent,
    clearError: clearDoctorsError,
    updateFilters,
    resetFilters,
    updatePagination,
    clearSearch,
    clearAutocomplete,
    clearDoctorSchedule,
    optimisticUpdate,
    optimisticRemove,

    // Helper functions
    getFullName,
    getSpecialization,
    formatConsultationFee,
    getExperienceLevel,
    getDoctorSummary,
    checkLicenseExpiry,
    generateDoctorReport,
    exportDoctors,
    getAvailableTimeSlots,
  };
}

export type UseDoctorsReturn = ReturnType<typeof useReduxDoctors>;