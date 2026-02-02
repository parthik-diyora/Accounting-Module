import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import CustomersPage from '../pages/CustomersPage';
import InvoicesPage from '../pages/InvoicesPage';
import InvoiceCreatePage from '../pages/InvoiceCreatePage';
import InvoiceDetailPage from '../pages/InvoiceDetailPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/customers" replace />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/invoices/create" element={<InvoiceCreatePage />} />
                <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
