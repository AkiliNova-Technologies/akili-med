// store/slices/paymentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Payment, PaymentFilterParams, PaymentStats } from '@/types/payments';
import api from '@/utils/api';

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  stats: PaymentStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  stats: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks using api utility
export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async (params: PaymentFilterParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/payments', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/payments/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/create',
  async (paymentData: Partial<Payment>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/payments', paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const processPayment = createAsyncThunk(
  'payments/process',
  async (paymentData: Partial<Payment>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/payments/process', paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/update',
  async ({ id, data }: { id: string; data: Partial<Payment> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/payments/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/payments/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payments/refund',
  async ({ id, refundData }: { id: string; refundData: any }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/payments/refund/${id}`, refundData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'payments/updateStatus',
  async ({ id, status, notes }: { id: string; status: string; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/payments/${id}/status`, { status, notes });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  'payments/fetchStats',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/payments/stats/summary', { 
        params: { startDate, endDate } 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const processBulkPayments = createAsyncThunk(
  'payments/processBulk',
  async (paymentsData: any[], { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/payments/bulk/process', { payments: paymentsData });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch payment by ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload.data;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.unshift(action.payload.data);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.unshift(action.payload.data);
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update payment
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.payments[index] = action.payload.data;
        }
        if (state.currentPayment?.id === action.payload.data.id) {
          state.currentPayment = action.payload.data;
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete payment
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter(p => p.id !== action.payload);
        if (state.currentPayment?.id === action.payload) {
          state.currentPayment = null;
        }
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch stats
      .addCase(fetchPaymentStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchPaymentStats.rejected, (state) => {
        state.loading = false;
      })
      
      // Update status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.payments.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.payments[index] = action.payload.data;
        }
        if (state.currentPayment?.id === action.payload.data.id) {
          state.currentPayment = action.payload.data;
        }
      })
      
      // Refund payment
      .addCase(refundPayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.payments[index] = action.payload.data;
        }
        if (state.currentPayment?.id === action.payload.data.id) {
          state.currentPayment = action.payload.data;
        }
      })
      
      // Process bulk payments
      .addCase(processBulkPayments.fulfilled, (state, action) => {
        // Add successful payments to the list
        if (action.payload.data && Array.isArray(action.payload.data.successful)) {
          action.payload.data.successful.forEach((payment: any) => {
            if (payment.id) {
              state.payments.unshift(payment);
            }
          });
        }
      });
  },
});

export const { clearCurrentPayment, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;