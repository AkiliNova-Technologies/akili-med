// types/payments.ts
export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceAmount: number;
  amount: number;
  remainingBalance: number;
  isFullPayment: boolean;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  transactionId?: string | null;
  receiptNumber?: string | null;
  payerId: string;
  payerEmail: string;
  payerPhone?: string | null;
  patientId?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface PaymentFilterParams {
  page?: number;
  limit?: number;
  status?: string[];
  paymentMethod?: string[];
  payerId?: string;
  invoiceId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface PaymentStats {
  summary: {
    totalPayments: number;
    totalAmount: number;
    averagePayment: number;
  };
  byStatus: Record<string, { count: number; amount: number }>;
  byMethod: Record<string, { count: number; amount: number }>;
  monthlyStats: any[];
  dailyStats: any[];
  topPayers: Array<{
    payerId: string;
    payerName: string;
    paymentCount: number;
    totalAmount: number;
  }>;
}

