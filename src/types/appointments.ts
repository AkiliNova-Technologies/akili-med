// ========================
// ENUMS (Local Definitions)
// ========================

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  WAITING = "WAITING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED"
}

export enum PriorityLevel {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  EMERGENCY = "EMERGENCY"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  INSURANCE = "INSURANCE",
  WAIVED = "WAIVED"
}

export enum AppointmentType {
  CONSULTATION = "CONSULTATION",
  FOLLOW_UP = "FOLLOW_UP",
  ROUTINE_CHECKUP = "ROUTINE_CHECKUP",
  EMERGENCY = "EMERGENCY",
  VACCINATION = "VACCINATION",
  LAB_TEST = "LAB_TEST",
  SURGERY = "SURGERY",
  THERAPY_SESSION = "THERAPY_SESSION"
}

export enum ReminderPreference {
  NONE = "NONE",
  ONE_HOUR_BEFORE = "ONE_HOUR_BEFORE",
  SIX_HOURS_BEFORE = "SIX_HOURS_BEFORE",
  ONE_DAY_BEFORE = "ONE_DAY_BEFORE",
  TWO_DAYS_BEFORE = "TWO_DAYS_BEFORE",
  ONE_WEEK_BEFORE = "ONE_WEEK_BEFORE"
}

// ========================
// INTERFACES
// ========================

// Core Appointment Type matching your Prisma schema
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  roomId?: string;
  appointmentType: AppointmentType;
  date: string; // ISO string format
  startTime: string;
  endTime: string;
  reason: string;
  symptoms?: string;
  notes?: string;
  status: AppointmentStatus;
  priority: PriorityLevel;
  reminderPreference: ReminderPreference;
  paymentStatus: PaymentStatus;
  estimatedCost?: string; // Decimal as string
  paymentNotes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related data (optional, for populated queries)
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dateOfBirth?: string;
    gender?: string;
  };
  
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialization?: string;
    email?: string;
    phone?: string;
  };
  
  room?: {
    id: string;
    name: string;
    type?: string;
    isAvailable?: boolean;
  };
}

// Create Appointment DTO
export interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  roomId?: string;
  appointmentType: AppointmentType;
  date: string | Date;
  startTime: string;
  endTime: string;
  reason: string;
  symptoms?: string;
  notes?: string;
  priority?: PriorityLevel;
  reminderPreference?: ReminderPreference;
  paymentStatus?: PaymentStatus;
  estimatedCost?: string | number;
}

// Update Appointment DTO
export interface UpdateAppointmentData {
  patientId?: string;
  doctorId?: string;
  roomId?: string;
  appointmentType?: AppointmentType;
  date?: string | Date;
  startTime?: string;
  endTime?: string;
  reason?: string;
  symptoms?: string;
  notes?: string;
  status?: AppointmentStatus;
  priority?: PriorityLevel;
  reminderPreference?: ReminderPreference;
  paymentStatus?: PaymentStatus;
  estimatedCost?: string | number;
  paymentNotes?: string;
}

// Filter options for appointments
export interface AppointmentFilters {
  status?: AppointmentStatus;
  priority?: PriorityLevel;
  dateFrom?: string;
  dateTo?: string;
  doctorId?: string;
  patientId?: string;
  appointmentType?: AppointmentType;
  paymentStatus?: PaymentStatus;
  search?: string; // General search across patient/doctor names
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// State interface
export interface AppointmentsState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  loadingCurrent: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: AppointmentFilters;
}

// ========================
// TYPE GUARDS AND HELPERS
// ========================

// Type guard to check if a string is valid AppointmentStatus
export function isAppointmentStatus(status: string): status is AppointmentStatus {
  return Object.values(AppointmentStatus).includes(status as AppointmentStatus);
}

// Type guard to check if a string is valid PriorityLevel
export function isPriorityLevel(priority: string): priority is PriorityLevel {
  return Object.values(PriorityLevel).includes(priority as PriorityLevel);
}

// Type guard to check if a string is valid AppointmentType
export function isAppointmentType(type: string): type is AppointmentType {
  return Object.values(AppointmentType).includes(type as AppointmentType);
}

// Type guard to check if a string is valid PaymentStatus
export function isPaymentStatus(status: string): status is PaymentStatus {
  return Object.values(PaymentStatus).includes(status as PaymentStatus);
}

// Type guard to check if a string is valid ReminderPreference
export function isReminderPreference(preference: string): preference is ReminderPreference {
  return Object.values(ReminderPreference).includes(preference as ReminderPreference);
}

// Helper to get display names for enums
export const AppointmentTypeLabels: Record<AppointmentType, string> = {
  [AppointmentType.CONSULTATION]: "Consultation",
  [AppointmentType.FOLLOW_UP]: "Follow Up",
  [AppointmentType.ROUTINE_CHECKUP]: "Routine Checkup",
  [AppointmentType.EMERGENCY]: "Emergency",
  [AppointmentType.VACCINATION]: "Vaccination",
  [AppointmentType.LAB_TEST]: "Lab Test",
  [AppointmentType.SURGERY]: "Surgery",
  [AppointmentType.THERAPY_SESSION]: "Therapy Session"
};

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: "Scheduled",
  [AppointmentStatus.CONFIRMED]: "Confirmed",
  [AppointmentStatus.WAITING]: "Waiting",
  [AppointmentStatus.IN_PROGRESS]: "In Progress",
  [AppointmentStatus.COMPLETED]: "Completed",
  [AppointmentStatus.CANCELLED]: "Cancelled",
  [AppointmentStatus.NO_SHOW]: "No Show",
  [AppointmentStatus.RESCHEDULED]: "Rescheduled"
};

export const PriorityLevelLabels: Record<PriorityLevel, string> = {
  [PriorityLevel.LOW]: "Low",
  [PriorityLevel.NORMAL]: "Normal",
  [PriorityLevel.HIGH]: "High",
  [PriorityLevel.EMERGENCY]: "Emergency"
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Pending",
  [PaymentStatus.PARTIAL]: "Partial",
  [PaymentStatus.PAID]: "Paid",
  [PaymentStatus.INSURANCE]: "Insurance",
  [PaymentStatus.WAIVED]: "Waived"
};

export const ReminderPreferenceLabels: Record<ReminderPreference, string> = {
  [ReminderPreference.NONE]: "No Reminder",
  [ReminderPreference.ONE_HOUR_BEFORE]: "1 Hour Before",
  [ReminderPreference.SIX_HOURS_BEFORE]: "6 Hours Before",
  [ReminderPreference.ONE_DAY_BEFORE]: "1 Day Before",
  [ReminderPreference.TWO_DAYS_BEFORE]: "2 Days Before",
  [ReminderPreference.ONE_WEEK_BEFORE]: "1 Week Before"
};

// Helper function to get appointment type label
export function getAppointmentTypeLabel(type: AppointmentType): string {
  return AppointmentTypeLabels[type] || type;
}

// Helper function to get appointment status label
export function getAppointmentStatusLabel(status: AppointmentStatus): string {
  return AppointmentStatusLabels[status] || status;
}

// Helper function to get priority level label
export function getPriorityLevelLabel(priority: PriorityLevel): string {
  return PriorityLevelLabels[priority] || priority;
}

// Helper function to get payment status label
export function getPaymentStatusLabel(status: PaymentStatus): string {
  return PaymentStatusLabels[status] || status;
}

// Helper function to get reminder preference label
export function getReminderPreferenceLabel(preference: ReminderPreference): string {
  return ReminderPreferenceLabels[preference] || preference;
}

// ========================
// CONSTANTS
// ========================

// Time slots for appointments
export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00"
];

// Default appointment duration in minutes
export const DEFAULT_APPOINTMENT_DURATION = 30;

// Appointment status colors (for UI)
export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: "bg-blue-100 text-blue-800",
  [AppointmentStatus.CONFIRMED]: "bg-green-100 text-green-800",
  [AppointmentStatus.WAITING]: "bg-yellow-100 text-yellow-800",
  [AppointmentStatus.IN_PROGRESS]: "bg-purple-100 text-purple-800",
  [AppointmentStatus.COMPLETED]: "bg-gray-100 text-gray-800",
  [AppointmentStatus.CANCELLED]: "bg-red-100 text-red-800",
  [AppointmentStatus.NO_SHOW]: "bg-orange-100 text-orange-800",
  [AppointmentStatus.RESCHEDULED]: "bg-indigo-100 text-indigo-800"
};

// Priority level colors (for UI)
export const PRIORITY_LEVEL_COLORS: Record<PriorityLevel, string> = {
  [PriorityLevel.LOW]: "bg-green-100 text-green-800",
  [PriorityLevel.NORMAL]: "bg-blue-100 text-blue-800",
  [PriorityLevel.HIGH]: "bg-yellow-100 text-yellow-800",
  [PriorityLevel.EMERGENCY]: "bg-red-100 text-red-800"
};