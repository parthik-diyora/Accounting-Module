const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

exports.createInvoice = async (req, res) => {
    try {
        const { customer, invoiceDate, items } = req.body;

        const customerExists = await Customer.findById(customer);
        if (!customerExists) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        const processedItems = items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate
        }));

        const subtotal = processedItems.reduce((sum, item) => sum + item.amount, 0);

        const tax = 18;
        const taxAmount = (subtotal * tax) / 100;

        const totalAmount = subtotal + taxAmount;

        const invoice = new Invoice({
            customer,
            invoiceDate: invoiceDate || new Date(),
            items: processedItems,
            subtotal,
            tax,
            taxAmount,
            totalAmount
        });

        await invoice.save();

        await invoice.populate('customer');

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: invoice
        });
    } catch (error) {
        console.error('Error creating invoice:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating invoice',
            error: error.message
        });
    }
};

exports.getAllInvoices = async (req, res) => {
    try {
        const { page = 1, limit = 10, customerId } = req.query;

        // Build query filter
        const filter = {};
        if (customerId) {
            filter.customer = customerId;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch invoices with customer details
        const invoices = await Invoice.find(filter)
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Invoice.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: invoices.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: invoices
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching invoices',
            error: error.message
        });
    }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('customer', 'name email phone');

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching invoice',
            error: error.message
        });
    }
};
