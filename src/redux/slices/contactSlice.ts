// store/slices/contactSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Contact, ContactFilterParams, ContactStats } from '@/types/contacts';
import api from '@/utils/api'; // Import your API utility

interface ContactState {
  contacts: Contact[];
  currentContact: Contact | null;
  stats: ContactStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: ContactState = {
  contacts: [],
  currentContact: null,
  stats: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks using your API utility
export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (params: ContactFilterParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/contacts', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/contacts/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createContact = createAsyncThunk(
  'contacts/create',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/contacts', contactData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/update',
  async ({ id, data }: { id: string; data: Partial<Contact> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/contacts/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/contacts/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchContactStats = createAsyncThunk(
  'contacts/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/contacts/stats/summary');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleContactActive = createAsyncThunk(
  'contacts/toggleActive',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/contacts/${id}/toggle-active`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addContactTag = createAsyncThunk(
  'contacts/addTag',
  async ({ id, tag }: { id: string; tag: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/contacts/${id}/add-tag`, { tag });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeContactTag = createAsyncThunk(
  'contacts/removeTag',
  async ({ id, tag }: { id: string; tag: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/contacts/${id}/remove-tag`, { 
        data: { tag } 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const searchContacts = createAsyncThunk(
  'contacts/search',
  async ({ query, filters }: { query: string; filters?: any }, { rejectWithValue }) => {
    try {
      const params = { q: query, ...filters };
      const response = await api.get('/api/v1/contacts/search', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const findByType = createAsyncThunk(
  'contacts/findByType',
  async ({ type, page = 1, limit = 10 }: { type: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/contacts/type/${type}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const findByCategory = createAsyncThunk(
  'contacts/findByCategory',
  async ({ category, page = 1, limit = 10 }: { category: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/contacts/category/${category}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const findEmergencyContacts = createAsyncThunk(
  'contacts/findEmergencyContacts',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/contacts/emergency-contacts', {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const autocompleteSearch = createAsyncThunk(
  'contacts/autocomplete',
  async ({ query, limit = 10 }: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/contacts/search/autocomplete', {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data || action.payload.contacts || action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch contact by ID
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContact = action.payload.data || action.payload;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        const newContact = action.payload.data || action.payload;
        state.contacts.unshift(newContact);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const updatedContact = action.payload.data || action.payload;
        const index = state.contacts.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) {
          state.contacts[index] = updatedContact;
        }
        if (state.currentContact?.id === updatedContact.id) {
          state.currentContact = updatedContact;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(c => c.id !== action.payload);
        if (state.currentContact?.id === action.payload) {
          state.currentContact = null;
        }
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch stats
      .addCase(fetchContactStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContactStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data || action.payload;
      })
      .addCase(fetchContactStats.rejected, (state) => {
        state.loading = false;
      })
      
      // Toggle active
      .addCase(toggleContactActive.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleContactActive.fulfilled, (state, action) => {
        state.loading = false;
        const updatedContact = action.payload.data || action.payload;
        const index = state.contacts.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) {
          state.contacts[index] = updatedContact;
        }
        if (state.currentContact?.id === updatedContact.id) {
          state.currentContact = updatedContact;
        }
      })
      .addCase(toggleContactActive.rejected, (state) => {
        state.loading = false;
      })
      
      // Add tag
      .addCase(addContactTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(addContactTag.fulfilled, (state, action) => {
        state.loading = false;
        const updatedContact = action.payload.data || action.payload;
        const index = state.contacts.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) {
          state.contacts[index] = updatedContact;
        }
        if (state.currentContact?.id === updatedContact.id) {
          state.currentContact = updatedContact;
        }
      })
      .addCase(addContactTag.rejected, (state) => {
        state.loading = false;
      })
      
      // Remove tag
      .addCase(removeContactTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeContactTag.fulfilled, (state, action) => {
        state.loading = false;
        const updatedContact = action.payload.data || action.payload;
        const index = state.contacts.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) {
          state.contacts[index] = updatedContact;
        }
        if (state.currentContact?.id === updatedContact.id) {
          state.currentContact = updatedContact;
        }
      })
      .addCase(removeContactTag.rejected, (state) => {
        state.loading = false;
      })
      
      // Search contacts
      .addCase(searchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data || action.payload.contacts || action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Find by type
      .addCase(findByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findByType.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data || action.payload.contacts || action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(findByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Find by category
      .addCase(findByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data || action.payload.contacts || action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(findByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Find emergency contacts
      .addCase(findEmergencyContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findEmergencyContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data || action.payload.contacts || action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(findEmergencyContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Autocomplete search
      .addCase(autocompleteSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(autocompleteSearch.fulfilled, (state) => {
        state.loading = false;
        // Note: Autocomplete results might be stored differently
        // You might want to add a separate state for autocomplete results
      })
      .addCase(autocompleteSearch.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearCurrentContact, clearError, setLoading } = contactSlice.actions;
export default contactSlice.reducer;