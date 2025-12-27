// store/slices/invoiceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Invoice, InvoiceFilterParams, InvoiceStats } from '@/types/invoice';
import api from '@/utils/api';

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  stats: InvoiceStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  stats: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks using api utility
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async (params: InvoiceFilterParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/invoices', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/invoices/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (invoiceData: Partial<Invoice>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/invoices', invoiceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/update',
  async ({ id, data }: { id: string; data: Partial<Invoice> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/invoices/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/invoices/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateInvoiceStatus = createAsyncThunk(
  'invoices/updateStatus',
  async ({ id, status, notes }: { id: string; status: string; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/invoices/${id}/status`, { status, notes });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchInvoiceStats = createAsyncThunk(
  'invoices/fetchStats',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/invoices/stats/summary', { 
        params: { startDate, endDate } 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const duplicateInvoice = createAsyncThunk(
  'invoices/duplicate',
  async ({ id, newInvoiceData }: { id: string; newInvoiceData?: Partial<Invoice> }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/invoices/${id}/duplicate`, newInvoiceData || {});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const sendInvoice = createAsyncThunk(
  'invoices/send',
  async ({ id, sendEmail }: { id: string; sendEmail?: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/invoices/${id}/send`, { sendEmail });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload.data;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload.data);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(inv => inv.id === action.payload.data.id);
        if (index !== -1) {
          state.invoices[index] = action.payload.data;
        }
        if (state.currentInvoice?.id === action.payload.data.id) {
          state.currentInvoice = action.payload.data;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(inv => inv.id !== action.payload);
        if (state.currentInvoice?.id === action.payload) {
          state.currentInvoice = null;
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch stats
      .addCase(fetchInvoiceStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoiceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchInvoiceStats.rejected, (state) => {
        state.loading = false;
      })
      
      // Update status
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.data.id);
        if (index !== -1) {
          state.invoices[index] = action.payload.data;
        }
        if (state.currentInvoice?.id === action.payload.data.id) {
          state.currentInvoice = action.payload.data;
        }
      })
      
      // Duplicate invoice
      .addCase(duplicateInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload.data);
      })
      
      // Send invoice
      .addCase(sendInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.data.id);
        if (index !== -1) {
          state.invoices[index] = action.payload.data;
        }
        if (state.currentInvoice?.id === action.payload.data.id) {
          state.currentInvoice = action.payload.data;
        }
      });
  },
});

export const { clearCurrentInvoice, clearError } = invoiceSlice.actions;
export default invoiceSlice.reducer;