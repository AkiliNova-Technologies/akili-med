import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  fetchInvoices,
  fetchInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  fetchInvoiceStats,
  duplicateInvoice,
  sendInvoice
} from '@/redux/slices/invoiceSlice';
import type { 
  Invoice, 
  InvoiceFilterParams,
  } from '@/types/invoice';
import type { AppDispatch, RootState } from '@/redux/store';

export const useReduxInvoices = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const invoices = useSelector((state: RootState) => state.invoices.invoices);
  const currentInvoice = useSelector((state: RootState) => state.invoices.currentInvoice);
  const stats = useSelector((state: RootState) => state.invoices.stats);
  const loading = useSelector((state: RootState) => state.invoices.loading);
  const error = useSelector((state: RootState) => state.invoices.error);
  const pagination = useSelector((state: RootState) => state.invoices.pagination);

  const getInvoices = useCallback(async (params: InvoiceFilterParams = {}) => {
    return dispatch(fetchInvoices(params));
  }, [dispatch]);

  const getInvoiceById = useCallback(async (id: string) => {
    return dispatch(fetchInvoiceById(id));
  }, [dispatch]);

  const addInvoice = useCallback(async (invoiceData: Partial<Invoice>) => {
    return dispatch(createInvoice(invoiceData));
  }, [dispatch]);

  const editInvoice = useCallback(async (id: string, invoiceData: Partial<Invoice>) => {
    return dispatch(updateInvoice({ id, data: invoiceData }));
  }, [dispatch]);

  const removeInvoice = useCallback(async (id: string) => {
    return dispatch(deleteInvoice(id));
  }, [dispatch]);

  const changeStatus = useCallback(async (id: string, status: string, notes?: string) => {
    return dispatch(updateInvoiceStatus({ id, status, notes }));
  }, [dispatch]);

  const getStats = useCallback(async (startDate?: string, endDate?: string) => {
    return dispatch(fetchInvoiceStats({ startDate, endDate }));
  }, [dispatch]);

  const duplicate = useCallback(async (id: string, newInvoiceData?: Partial<Invoice>) => {
    return dispatch(duplicateInvoice({ id, newInvoiceData }));
  }, [dispatch]);

  const send = useCallback(async (id: string, sendEmail: boolean = false) => {
    return dispatch(sendInvoice({ id, sendEmail }));
  }, [dispatch]);

  return {
    // State
    invoices,
    currentInvoice,
    stats,
    loading,
    error,
    pagination,
    
    // Actions
    getInvoices,
    getInvoiceById,
    addInvoice,
    editInvoice,
    removeInvoice,
    changeStatus,
    getStats,
    duplicate,
    send,
    
    // Helper getters
    totalInvoices: pagination?.total || 0,
    totalPages: pagination?.pages || 0,
  };
};