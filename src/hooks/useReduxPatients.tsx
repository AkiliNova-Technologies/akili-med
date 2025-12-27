// src/hooks/usePatients.ts
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPatients,
  fetchPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  fetchPatientAppointments,
  fetchPatientInvoices,
  searchPatients,
  fetchPatientStats,
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
  selectPatients,
  selectCurrentPatient,
  selectPatientsLoading,
  selectCurrentPatientLoading,
  selectPatientsError,
  selectPatientsPagination,
  selectPatientsFilters,
  selectPatientStats,
  selectSearchResults,
  selectActivePatients,
  selectPatientsByGender,
  selectPatientsByAgeRange,
  selectPatientsWithUpcomingAppointments,
} from "@/redux/slices/patientSlice";
import type {
  Patient,
  CreatePatientData,
  UpdatePatientData,
  PatientFilters,
} from "@/types/patients";
import api from "@/utils/api";
import { useCallback } from "react";
import { toast } from "sonner";

export function useReduxPatients() {
  const dispatch = useAppDispatch();

  // Selectors
  const patients = useAppSelector(selectPatients);
  const currentPatient = useAppSelector(selectCurrentPatient);
  const loading = useAppSelector(selectPatientsLoading);
  const loadingCurrent = useAppSelector(selectCurrentPatientLoading);
  const error = useAppSelector(selectPatientsError);
  const pagination = useAppSelector(selectPatientsPagination);
  const filters = useAppSelector(selectPatientsFilters);
  const stats = useAppSelector(selectPatientStats);
  const searchResults = useAppSelector(selectSearchResults);

  // Helper selectors
  const activePatients = useAppSelector(selectActivePatients);
  const getPatientsByGender = useCallback(
    (gender: string) => selectPatientsByGender(gender as any)({ patients: { patients, currentPatient, loading, loadingCurrent, error, pagination, filters, stats, searchResults } as any }),
    [patients]
  );
  const getPatientsByAgeRange = useCallback(
    (minAge: number, maxAge: number) => selectPatientsByAgeRange(minAge, maxAge)({ patients: { patients, currentPatient, loading, loadingCurrent, error, pagination, filters, stats, searchResults } as any }),
    [patients]
  );
  const patientsWithUpcomingAppointments = useAppSelector(selectPatientsWithUpcomingAppointments);

  // ========================
  // CRUD OPERATIONS
  // ========================

  const getPatients = useCallback(
    async (params?: { page?: number; limit?: number; filters?: PatientFilters }) => {
      try {
        const result = await dispatch(fetchPatients(params || {})).unwrap();
        toast.success("Patients loaded successfully");
        return result;
      } catch (error: any) {
        toast.error(error || "Failed to load patients");
        throw error;
      }
    },
    [dispatch]
  );

  const getPatient = useCallback(
    async (id: string) => {
      try {
        const patient = await dispatch(fetchPatientById(id)).unwrap();
        return patient;
      } catch (error: any) {
        toast.error(error || "Failed to load patient");
        throw error;
      }
    },
    [dispatch]
  );

  const addPatient = useCallback(
    async (patientData: CreatePatientData) => {
      try {
        const newPatient = await dispatch(createPatient(patientData)).unwrap();
        toast.success("Patient created successfully");
        return newPatient;
      } catch (error: any) {
        toast.error(error || "Failed to create patient");
        throw error;
      }
    },
    [dispatch]
  );

  const editPatient = useCallback(
    async (id: string, patientData: UpdatePatientData) => {
      try {
        const updatedPatient = await dispatch(updatePatient({ id, patientData })).unwrap();
        toast.success("Patient updated successfully");
        return updatedPatient;
      } catch (error: any) {
        toast.error(error || "Failed to update patient");
        throw error;
      }
    },
    [dispatch]
  );

  const removePatient = useCallback(
    async (id: string) => {
      try {
        await dispatch(deletePatient(id)).unwrap();
        toast.success("Patient deleted successfully");
      } catch (error: any) {
        toast.error(error || "Failed to delete patient");
        throw error;
      }
    },
    [dispatch]
  );

  // ========================
  // RELATED DATA OPERATIONS
  // ========================

  const getPatientAppointments = useCallback(
    async (patientId: string) => {
      try {
        const result = await dispatch(fetchPatientAppointments(patientId)).unwrap();
        dispatch(setCurrentPatientAppointments(result.appointments));
        return result.appointments;
      } catch (error: any) {
        toast.error(error || "Failed to fetch patient appointments");
        throw error;
      }
    },
    [dispatch]
  );

  const getPatientInvoices = useCallback(
    async (patientId: string) => {
      try {
        const result = await dispatch(fetchPatientInvoices(patientId)).unwrap();
        dispatch(setCurrentPatientInvoices(result.invoices));
        return result.invoices;
      } catch (error: any) {
        toast.error(error || "Failed to fetch patient invoices");
        throw error;
      }
    },
    [dispatch]
  );

  // ========================
  // SEARCH & STATS
  // ========================

  const searchPatientsByName = useCallback(
    async (query: string, limit?: number) => {
      try {
        const results = await dispatch(searchPatients({ query, limit })).unwrap();
        return results;
      } catch (error: any) {
        toast.error(error || "Search failed");
        throw error;
      }
    },
    [dispatch]
  );

  const getStats = useCallback(
    async () => {
      try {
        const statsData = await dispatch(fetchPatientStats()).unwrap();
        return statsData;
      } catch (error: any) {
        toast.error(error || "Failed to fetch patient statistics");
        throw error;
      }
    },
    [dispatch]
  );

  // ========================
  // UTILITIES
  // ========================

  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentPatient());
  }, [dispatch]);

  const clearPatientsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: PatientFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]
  );

  const updatePagination = useCallback(
    (page: number, limit: number) => {
      dispatch(setPagination({ page, limit }));
    },
    [dispatch]
  );

  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const optimisticUpdate = useCallback(
    (patient: Patient) => {
      dispatch(upsertPatient(patient));
    },
    [dispatch]
  );

  const optimisticRemove = useCallback(
    (id: string) => {
      dispatch(removePatientFromList(id));
    },
    [dispatch]
  );

  // ========================
  // HELPER FUNCTIONS
  // ========================

  const calculateAge = useCallback((dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, []);

  const getAgeGroup = useCallback((age: number | null): string => {
    if (age === null) return "Unknown";
    if (age < 18) return "Child (<18)";
    if (age < 30) return "Young Adult (18-29)";
    if (age < 50) return "Adult (30-49)";
    if (age < 65) return "Middle Age (50-64)";
    return "Senior (65+)";
  }, []);

  const getFullName = useCallback((patient: Patient): string => {
    return `${patient.firstName} ${patient.lastName}`;
  }, []);

  const formatPhoneNumber = useCallback((phone: string): string => {
    // Simple phone formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }, []);

  const getPatientSummary = useCallback((patient: Patient) => {
    const age = calculateAge(patient.dateOfBirth);
    return {
      name: getFullName(patient),
      age: age,
      ageGroup: getAgeGroup(age),
      contact: {
        email: patient.email,
        phone: formatPhoneNumber(patient.phone),
      },
      insurance: patient.insuranceProvider || "No insurance",
      lastVisit: patient.appointments?.[0]?.date 
        ? new Date(patient.appointments[0].date).toLocaleDateString()
        : "No visits yet",
      upcomingAppointments: patient.appointments?.filter(app => 
        new Date(app.date) >= new Date() && 
        ["SCHEDULED", "CONFIRMED"].includes(app.status)
      ).length || 0,
      pendingInvoices: patient.invoices?.filter(inv => 
        inv.status === "PENDING" // Assuming Invoice type has status field
      ).length || 0,
    };
  }, [calculateAge, getFullName, getAgeGroup, formatPhoneNumber]);

  const exportPatients = useCallback(async (format: 'csv' | 'excel' = 'csv') => {
    try {
      const response = await api.get(`/api/v1/patients/export?format=${format}`);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patients_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Patients exported successfully as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error("Failed to export patients");
      throw error;
    }
  }, []);

  const importPatients = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/api/v1/patients/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success(`Successfully imported ${response.data.importedCount} patients`);
      return response.data;
    } catch (error: any) {
      toast.error("Failed to import patients");
      throw error;
    }
  }, []);

  const generatePatientReport = useCallback(async (patientId: string, type: 'summary' | 'full' = 'summary') => {
    try {
      const response = await api.get(`/api/v1/patients/${patientId}/report?type=${type}`);
      
      // Create PDF download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient_report_${patientId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Patient report generated successfully");
    } catch (error: any) {
      toast.error("Failed to generate patient report");
      throw error;
    }
  }, []);

  return {
    // State
    patients,
    currentPatient,
    loading,
    loadingCurrent,
    error,
    pagination,
    filters,
    stats,
    searchResults,
    activePatients,
    patientsWithUpcomingAppointments,

    // Filtered data functions
    getPatientsByGender,
    getPatientsByAgeRange,

    // CRUD Operations
    getPatients,
    getPatient,
    addPatient,
    editPatient,
    removePatient,

    // Related Data Operations
    getPatientAppointments,
    getPatientInvoices,

    // Search & Stats
    searchPatientsByName,
    getStats,

    // Utilities
    clearCurrent,
    clearError: clearPatientsError,
    updateFilters,
    resetFilters,
    updatePagination,
    clearSearch,
    optimisticUpdate,
    optimisticRemove,

    // Helper functions
    calculateAge,
    getAgeGroup,
    getFullName,
    formatPhoneNumber,
    getPatientSummary,
    exportPatients,
    importPatients,
    generatePatientReport,
  };
}

export type UsePatientsReturn = ReturnType<typeof useReduxPatients>;