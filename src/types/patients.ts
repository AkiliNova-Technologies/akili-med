// Gender Enum
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  UNSPECIFIED = "UNSPECIFIED",
}

// Appointment Status Enum (for related data)
export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED",
  WAITING = "WAITING",
}

// Invoice Status Enum (for related data)
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

// Simplified Appointment Interface for patient appointments
export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason: string;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialization?: string;
  };
  room?: {
    id: string;
    name: string;
    type?: string;
  };
}

// Simplified Invoice Interface for patient invoices
export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: string;
  status: InvoiceStatus;
  description?: string;
}

// Simplified Communication Interface
export interface Communication {
  id: string;
  communicationDate: string;
  communicationType: string;
  subject?: string;
  content: string;
  status: string;
}

// Core Patient Interface matching your backend API
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Related data (optional, for populated queries)
  appointments?: Appointment[];
  invoices?: Invoice[];
  communications?: Communication[];
  _count?: {
    appointments: number;
    invoices: number;
    communications: number;
  };
  [key: string]: any;
}

// Patient Statistics Interface
export interface PatientStats {
  total: number;
  active: number;
  newThisMonth: number;
  upcomingAppointments: number;
  pendingInvoices: number;
  byGender: Record<string, number>;
  byAgeGroup: Record<string, number>;
}

// Create Patient DTO
export interface CreatePatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string | Date;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  notes?: string;
  isActive?: boolean;
}

// Update Patient DTO
export interface UpdatePatientData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string | Date;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  notes?: string;
  isActive?: boolean;
}

// Filter options for patients
export interface PatientFilters {
  search?: string;
  isActive?: boolean;
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  city?: string;
  state?: string;
  hasInsurance?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'createdAt' | 'lastAppointment';
  sortOrder?: 'asc' | 'desc';
}

// Pagination response
export interface PatientPagination {
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
  pagination: PatientPagination;
  message?: string;
}

// State interface
export interface PatientsState {
  patients: Patient[];
  currentPatient: Patient | null;
  loading: boolean;
  loadingCurrent: boolean;
  error: string | null;
  pagination: PatientPagination;
  filters: PatientFilters;
  stats: PatientStats | null;
  searchResults: Patient[];
}