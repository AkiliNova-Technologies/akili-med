import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import patientsReducer from "./slices/patientSlice";
import doctorsReducer from './slices/doctorSlice';
import invoiceReducer from './slices/invoiceSlice';
import contactReducer from './slices/contactSlice';
import paymentReducer from './slices/paymentSlice'

import appointmentsReducer from "./slices/appointmentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    patients: patientsReducer,
    doctors: doctorsReducer,
    invoices: invoiceReducer,
    contacts: contactReducer,
    payments: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["products/uploadMedia"],
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["products.detectedChanges"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
