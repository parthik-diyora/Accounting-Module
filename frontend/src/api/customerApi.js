import apiClient from './client';

export const customerApi = {
    getAllCustomers: async (params = {}) => {
        const response = await apiClient.get('/customers', { params });
        return response.data;
    },
    getCustomerById: async (id) => {
        const response = await apiClient.get(`/customers/${id}`);
        return response.data;
    },
    createCustomer: async (customerData) => {
        const response = await apiClient.post('/customers', customerData);
        return response.data;
    },
};
