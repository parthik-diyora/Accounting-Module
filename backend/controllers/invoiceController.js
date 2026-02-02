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
        const skip = (page - 1) * limit;

        const pipeline = [
            ...(customerId ? [{
                $match: { customer: new mongoose.Types.ObjectId(customerId) }
            }] : []),

            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },

            { $unwind: '$customer' },

            { $sort: { createdAt: -1 } },

            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skip }, { $limit: parseInt(limit) }]
                }
            }
        ];

        const result = await Invoice.aggregate(pipeline);

        const total = result[0].metadata[0]?.total || 0;
        const invoices = result[0].data;

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

exports.getInvoiceById = async (req, res) => {
    try {
        const pipeline = [
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: '$customer' }
        ];

        const result = await Invoice.aggregate(pipeline);

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result[0]
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
