// src/redux/slices/doctors/types.ts
import type { Appointment, AppointmentStatus } from "./patients";

// Communication Status Enum
export enum CommunicationStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  UNSPECIFIED = "UNSPECIFIED",
}

// Simplified Communication Interface for doctor communications
export interface Communication {
  id: string;
  communicationDate: string;
  communicationType: string;
  subject?: string;
  content: string;
  status: CommunicationStatus;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  from?: {
    id: string;
    firstName: string;
    lastName: string;
    contactType: string;
  };
  to?: {
    id: string;
    firstName: string;
    lastName: string;
    contactType: string;
  };
  appointment?: {
    id: string;
    date: string;
  };
}

// Core Doctor Interface matching your backend API
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  title?: string;
  specialization?: string;
  specialty?: string;
  medicalLicense?: string;
  licenseExpiryDate?: string;
  hospital?: string;
  department?: string;
  yearsOfExperience?: number;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  bio?: string;
  consultationFee?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Related data (optional, for populated queries)
  appointments?: Appointment[];
  communications?: Communication[];
  _count?: {
    appointments: number;
    communications: number;
  };
  appointmentStats?: Record<string, number>;
  upcomingAppointments?: number;
  totalAppointments?: number;
  [key: string]: any;
}

// Doctor Statistics Interface
export interface DoctorStats {
  summary: {
    totalDoctors: number;
    upcomingAppointments: number;
    completedAppointmentsLast30Days: number;
  };
  bySpecialization: Record<string, number>;
  appointmentStatus: Record<string, number>;
}

// Create Doctor DTO
export interface CreateDoctorData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string | Date;
  gender?: Gender;
  title?: string;
  specialization?: string;
  specialty?: string;
  medicalLicense?: string;
  licenseExpiryDate?: string | Date;
  hospital?: string;
  department?: string;
  yearsOfExperience?: number;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  bio?: string;
  consultationFee?: string | number;
  isActive?: boolean;
}

// Update Doctor DTO
export interface UpdateDoctorData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string | Date;
  gender?: Gender;
  title?: string;
  specialization?: string;
  specialty?: string;
  medicalLicense?: string;
  licenseExpiryDate?: string | Date;
  hospital?: string;
  department?: string;
  yearsOfExperience?: number;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  bio?: string;
  consultationFee?: string | number;
  isActive?: boolean;
}

// Filter options for doctors
export interface DoctorFilters {
  search?: string;
  isActive?: boolean;
  gender?: Gender;
  specialization?: string;
  specialty?: string;
  hospital?: string;
  department?: string;
  hasAvailability?: boolean;
  minExperience?: number;
  maxExperience?: number;
  sortBy?: 'name' | 'createdAt' | 'experience' | 'consultationFee';
  sortOrder?: 'asc' | 'desc';
}

// Schedule filter options
export interface ScheduleFilters {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus[];
  appointmentType?: string;
  includeAllDay?: boolean;
}

// Pagination response
export interface DoctorPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: DoctorPagination;
  message?: string;
}

// State interface
export interface DoctorsState {
  doctors: Doctor[];
  currentDoctor: Doctor | null;
  loading: boolean;
  loadingCurrent: boolean;
  error: string | null;
  pagination: DoctorPagination;
  filters: DoctorFilters;
  stats: DoctorStats | null;
  schedule: Appointment[];
  scheduleLoading: boolean;
  searchResults: Doctor[];
  autocompleteResults: Doctor[];
}