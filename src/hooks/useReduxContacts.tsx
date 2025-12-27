// hooks/useReduxContacts.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { 
  fetchContacts,
  fetchContactById,
  createContact,
  updateContact,
  deleteContact,
  fetchContactStats,
  toggleContactActive,
  addContactTag,
  removeContactTag,
  searchContacts,
  findByType,
  findByCategory,
  findEmergencyContacts,
  autocompleteSearch,
  clearCurrentContact,
  clearError,
  setLoading
} from '@/redux/slices/contactSlice';
import type { 
  Contact, 
  ContactFilterParams,
} from '@/types/contacts';

export const useReduxContacts = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const currentContact = useSelector((state: RootState) => state.contacts.currentContact);
  const stats = useSelector((state: RootState) => state.contacts.stats);
  const loading = useSelector((state: RootState) => state.contacts.loading);
  const error = useSelector((state: RootState) => state.contacts.error);
  const pagination = useSelector((state: RootState) => state.contacts.pagination);

  // Action creators
  const getContacts = useCallback(async (params: ContactFilterParams = {}) => {
    return dispatch(fetchContacts(params));
  }, [dispatch]);

  const getContactById = useCallback(async (id: string) => {
    return dispatch(fetchContactById(id));
  }, [dispatch]);

  const addContact = useCallback(async (contactData: Partial<Contact>) => {
    return dispatch(createContact(contactData));
  }, [dispatch]);

  const editContact = useCallback(async (id: string, contactData: Partial<Contact>) => {
    return dispatch(updateContact({ id, data: contactData }));
  }, [dispatch]);

  const removeContact = useCallback(async (id: string) => {
    return dispatch(deleteContact(id));
  }, [dispatch]);

  const getStats = useCallback(async () => {
    return dispatch(fetchContactStats());
  }, [dispatch]);

  const toggleActive = useCallback(async (id: string) => {
    return dispatch(toggleContactActive(id));
  }, [dispatch]);

  const addTag = useCallback(async (id: string, tag: string) => {
    return dispatch(addContactTag({ id, tag }));
  }, [dispatch]);

  const removeTag = useCallback(async (id: string, tag: string) => {
    return dispatch(removeContactTag({ id, tag }));
  }, [dispatch]);

  const search = useCallback(async (query: string, filters?: any) => {
    return dispatch(searchContacts({ query, filters }));
  }, [dispatch]);

  // New actions from updated slice
  const getContactsByType = useCallback(async (
    type: string, 
    page: number = 1, 
    limit: number = 10
  ) => {
    return dispatch(findByType({ type, page, limit }));
  }, [dispatch]);

  const getContactsByCategory = useCallback(async (
    category: string, 
    page: number = 1, 
    limit: number = 10
  ) => {
    return dispatch(findByCategory({ category, page, limit }));
  }, [dispatch]);

  const getEmergencyContacts = useCallback(async (
    page: number = 1, 
    limit: number = 10
  ) => {
    return dispatch(findEmergencyContacts({ page, limit }));
  }, [dispatch]);

  const quickSearch = useCallback(async (
    query: string, 
    limit: number = 10
  ) => {
    return dispatch(autocompleteSearch({ query, limit }));
  }, [dispatch]);

  // State management actions
  const clearContact = useCallback(() => {
    dispatch(clearCurrentContact());
  }, [dispatch]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setContactsLoading = useCallback((isLoading: boolean) => {
    dispatch(setLoading(isLoading));
  }, [dispatch]);

  // Helper functions
  const getContactFullName = useCallback((contact: Contact | null): string => {
    if (!contact) return '';
    return `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  }, []);

  const getContactDisplayName = useCallback((contact: Contact | null): string => {
    if (!contact) return '';
    
    if (contact.companyName) {
      return contact.companyName;
    }
    
    const fullName = getContactFullName(contact);
    if (fullName) return fullName;
    
    return contact.email || contact.phone || 'Unknown Contact';
  }, [getContactFullName]);

  const filterContactsByType = useCallback((type: string): Contact[] => {
    return contacts.filter(contact => contact.contactType === type);
  }, [contacts]);

  const filterContactsByActive = useCallback((isActive: boolean = true): Contact[] => {
    return contacts.filter(contact => contact.isActive === isActive);
  }, [contacts]);

  const getContactByIdLocal = useCallback((id: string): Contact | undefined => {
    return contacts.find(contact => contact.id === id);
  }, [contacts]);

  return {
    // State
    contacts,
    currentContact,
    stats,
    loading,
    error,
    pagination,
    
    // Actions
    getContacts,
    getContactById,
    addContact,
    editContact,
    removeContact,
    getStats,
    toggleActive,
    addTag,
    removeTag,
    search,
    getContactsByType,
    getContactsByCategory,
    getEmergencyContacts,
    quickSearch,
    clearContact,
    dismissError,
    setContactsLoading,
    
    // Helper getters
    totalContacts: pagination?.total || contacts.length,
    totalPages: pagination?.pages || 1,
    currentPage: pagination?.page || 1,
    itemsPerPage: pagination?.limit || 10,
    hasNextPage: pagination ? pagination.page < pagination.pages : false,
    hasPreviousPage: pagination ? pagination.page > 1 : false,
    
    // Helper functions
    getContactFullName,
    getContactDisplayName,
    filterContactsByType,
    filterContactsByActive,
    getContactByIdLocal,
    
    // Computed values
    activeContacts: contacts.filter(contact => contact.isActive),
    inactiveContacts: contacts.filter(contact => !contact.isActive),
    emergencyContacts: contacts.filter(contact => contact.isEmergencyContact),
    primaryContacts: contacts.filter(contact => contact.isPrimaryContact),
    
    // Grouped contacts
    contactsByType: contacts.reduce((acc, contact) => {
      const type = contact.contactType || 'UNKNOWN';
      if (!acc[type]) acc[type] = [];
      acc[type].push(contact);
      return acc;
    }, {} as Record<string, Contact[]>),
    
    // Stats helpers
    contactStats: {
      total: contacts.length,
      active: contacts.filter(c => c.isActive).length,
      inactive: contacts.filter(c => !c.isActive).length,
      emergency: contacts.filter(c => c.isEmergencyContact).length,
      primary: contacts.filter(c => c.isPrimaryContact).length,
      byType: contacts.reduce((acc, contact) => {
        const type = contact.contactType || 'UNKNOWN';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    }
  };
};

// Optional: Create a simplified version for basic operations
export const useContacts = () => {
  const {
    contacts,
    currentContact,
    loading,
    error,
    getContacts,
    getContactById,
    addContact,
    editContact,
    removeContact,
    clearContact,
    dismissError
  } = useReduxContacts();

  return {
    contacts,
    currentContact,
    loading,
    error,
    getContacts,
    getContactById,
    addContact,
    editContact,
    removeContact,
    clearContact,
    dismissError
  };
};

// Optional: Create a version for search operations
export const useContactSearch = () => {
  const {
    contacts,
    loading,
    error,
    search,
    quickSearch,
    filterContactsByType,
    filterContactsByActive,
    getContactByIdLocal
  } = useReduxContacts();

  return {
    searchResults: contacts,
    loading,
    error,
    search,
    quickSearch,
    filterContactsByType,
    filterContactsByActive,
    getContactByIdLocal
  };
};

// Optional: Create a version for stats/analytics
export const useContactStats = () => {
  const {
    stats,
    loading,
    error,
    getStats,
    contactStats
  } = useReduxContacts();

  return {
    stats,
    loading,
    error,
    getStats,
    contactStats
  };
};