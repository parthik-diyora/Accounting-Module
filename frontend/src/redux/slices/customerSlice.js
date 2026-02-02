import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi } from '../../api/customerApi';

export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await customerApi.getAllCustomers(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
        }
    }
);

export const createCustomer = createAsyncThunk(
    'customers/createCustomer',
    async (customerData, { rejectWithValue }) => {
        try {
            const response = await customerApi.createCustomer(customerData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.errors?.[0] ||
                'Failed to create customer'
            );
        }
    }
);

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        loading: false,
        error: null,
        success: false,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        },
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: state.pagination.limit,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages,
                };
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customers.unshift(action.payload);
                state.success = true;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { clearError, clearSuccess, setPagination } = customerSlice.actions;
export default customerSlice.reducer;
