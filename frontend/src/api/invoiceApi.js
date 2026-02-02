import apiClient from './client';

export const invoiceApi = {
    getAllInvoices: async (params = {}) => {
        const response = await apiClient.get('/invoices', { params });
        return response.data;
    },
    getInvoiceById: async (id) => {
        const response = await apiClient.get(`/invoices/${id}`);
        return response.data;
    },
    createInvoice: async (invoiceData) => {
        const response = await apiClient.post('/invoices', invoiceData);
        return response.data;
    },
};
