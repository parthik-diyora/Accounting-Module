import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slices/customerSlice';
import invoiceReducer from './slices/invoiceSlice';

export const store = configureStore({
    reducer: {
        customers: customerReducer,
        invoices: invoiceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
