// types/invoice.ts
export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  productId?: string;
  productName?: string;
  sku?: string;
}

export interface InvoicePayment {
  id: string;
  paymentNumber: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  paymentMethod: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  reference?: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  clientId: string;
  patientId?: string;
  appointmentId?: string;
  
  // Client information
  clientEmail: string;
  clientPhone?: string;
  billingAddress?: string;
  
  // Totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  discountAmount: number;
  total: number;
  
  // Additional fields
  currency: string;
  paymentTerms?: string;
  notes?: string;
  internalNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Relationships (optional in listing)
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    email: string;
    phone?: string;
  };
  
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  
  appointment?: {
    id: string;
    date: string;
    appointmentType: string;
  };
  
  items?: InvoiceItem[];
  payments?: InvoicePayment[];
  
  // Calculated fields
  paidAmount?: number;
  balance?: number;
  isPaid?: boolean;
  isOverdue?: boolean;
  daysOverdue?: number;
  [key: string]: any;
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export interface InvoiceFilterParams {
  page?: number;
  limit?: number;
  status?: InvoiceStatus[];
  clientId?: string;
  patientId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  overdueAmount: number;
  outstandingAmount: number;
}

export interface InvoiceStats {
  summary: InvoiceSummary;
  byStatus: Record<InvoiceStatus, { count: number; amount: number }>;
  monthlyStats: any[];
  topClients: any[];
}