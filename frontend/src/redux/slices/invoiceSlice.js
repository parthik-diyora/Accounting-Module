import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceApi } from '../../api/invoiceApi';

export const fetchInvoices = createAsyncThunk(
    'invoices/fetchInvoices',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getAllInvoices(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
        }
    }
);

export const createInvoice = createAsyncThunk(
    'invoices/createInvoice',
    async (invoiceData, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.createInvoice(invoiceData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.errors?.[0] ||
                'Failed to create invoice'
            );
        }
    }
);

export const fetchInvoiceById = createAsyncThunk(
    'invoices/fetchInvoiceById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await invoiceApi.getInvoiceById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice details');
        }
    }
);

const invoiceSlice = createSlice({
    name: 'invoices',
    initialState: {
        invoices: [],
        currentInvoice: null,
        loading: false,
        error: null,
        success: false,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        },
        filters: {
            customerId: null,
        },
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearCurrentInvoice: (state) => {
            state.currentInvoice = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.invoices = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: state.pagination.limit,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages,
                };
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create invoice
            .addCase(createInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.invoices.unshift(action.payload);
                state.success = true;
            })
            .addCase(createInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Fetch invoice by ID
            .addCase(fetchInvoiceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentInvoice = action.payload;
            })
            .addCase(fetchInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccess, setFilters, setPagination, clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
