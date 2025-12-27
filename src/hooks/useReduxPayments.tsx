// hooks/useReduxPayments.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { 
  fetchPayments,
  fetchPaymentById,
  createPayment,
  processPayment,
  updatePayment,
  deletePayment,
  refundPayment,
  updatePaymentStatus,
  fetchPaymentStats,
  processBulkPayments
} from '@/redux/slices/paymentSlice';
import type { 
  Payment, 
  PaymentFilterParams,
} from '@/types/payments';

export const useReduxPayments = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const payments = useSelector((state: RootState) => state.payments.payments);
  const currentPayment = useSelector((state: RootState) => state.payments.currentPayment);
  const stats = useSelector((state: RootState) => state.payments.stats);
  const loading = useSelector((state: RootState) => state.payments.loading);
  const error = useSelector((state: RootState) => state.payments.error);
  const pagination = useSelector((state: RootState) => state.payments.pagination);

  const getPayments = useCallback(async (params: PaymentFilterParams = {}) => {
    return dispatch(fetchPayments(params));
  }, [dispatch]);

  const getPaymentById = useCallback(async (id: string) => {
    return dispatch(fetchPaymentById(id));
  }, [dispatch]);

  const addPayment = useCallback(async (paymentData: Partial<Payment>) => {
    return dispatch(createPayment(paymentData));
  }, [dispatch]);

  const process = useCallback(async (paymentData: Partial<Payment>) => {
    return dispatch(processPayment(paymentData));
  }, [dispatch]);

  const editPayment = useCallback(async (id: string, paymentData: Partial<Payment>) => {
    return dispatch(updatePayment({ id, data: paymentData }));
  }, [dispatch]);

  const removePayment = useCallback(async (id: string) => {
    return dispatch(deletePayment(id));
  }, [dispatch]);

  const refund = useCallback(async (id: string, refundData: any) => {
    return dispatch(refundPayment({ id, refundData }));
  }, [dispatch]);

  const changeStatus = useCallback(async (id: string, status: string, notes?: string) => {
    return dispatch(updatePaymentStatus({ id, status, notes }));
  }, [dispatch]);

  const getStats = useCallback(async (startDate?: string, endDate?: string) => {
    return dispatch(fetchPaymentStats({ startDate, endDate }));
  }, [dispatch]);

  const bulkProcess = useCallback(async (paymentsData: any[]) => {
    return dispatch(processBulkPayments(paymentsData));
  }, [dispatch]);

  return {
    // State
    payments,
    currentPayment,
    stats,
    loading,
    error,
    pagination,
    
    // Actions
    getPayments,
    getPaymentById,
    addPayment,
    process,
    editPayment,
    removePayment,
    refund,
    changeStatus,
    getStats,
    bulkProcess,
    
    // Helper getters
    totalPayments: pagination?.total || 0,
    totalPages: pagination?.pages || 0,
  };
};