// types/contact.ts
export enum ContactType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
  DOCTOR = 'DOCTOR',
  SUPPLIER = 'SUPPLIER',
  PATIENT = 'PATIENT',
  EMPLOYEE = 'EMPLOYEE',
  OTHER = 'OTHER'
}

export enum ContactCategory {
  MEDICAL_CONTACTS = 'MEDICAL_CONTACTS',
  BUSINESS_CONTACTS = 'BUSINESS_CONTACTS',
  PERSONAL_CONTACTS = 'PERSONAL_CONTACTS',
  EMERGENCY_CONTACTS = 'EMERGENCY_CONTACTS',
  SUPPLIERS = 'SUPPLIERS',
  PARTNERS = 'PARTNERS',
  OTHER = 'OTHER'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  jobTitle?: string;
  contactType: ContactType;
  category?: ContactCategory;
  gender?: Gender;
  dateOfBirth?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  medicalLicense?: string;
  hospital?: string;
  medicalSpecialty?: string;
  emergencyRelationship?: string;
  isActive: boolean;
  isPrimaryContact: boolean;
  isEmergencyContact: boolean;
  allowMarketing: boolean;
  shareDetails: boolean;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  
  // Counts (optional in listing)
  _count?: {
    sentCommunications: number;
    receivedCommunications: number;
    vendorExpenses: number;
    clientInvoices: number;
    madePayments: number;
  };
  communicationsCount?: number;
  financialCount?: number;
  [key: string]: any;
}

export interface ContactFilterParams {
  page?: number;
  limit?: number;
  contactType?: ContactType;
  category?: ContactCategory;
  isActive?: boolean;
  isEmergencyContact?: boolean;
  isPrimaryContact?: boolean;
  gender?: Gender;
  country?: string;
  search?: string;
  tags?: string[];
}

export interface ContactStats {
  summary: {
    totalContacts: number;
    activeContacts: number;
    emergencyContacts: number;
    companies: number;
    doctors: number;
    suppliers: number;
  };
  byType: Record<ContactType, number>;
  byCategory: Record<ContactCategory | 'uncategorized', number>;
}