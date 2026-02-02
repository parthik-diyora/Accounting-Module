const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    rate: {
        type: Number,
        required: [true, 'Rate is required'],
        min: [0, 'Rate must be a positive number']
    },
    amount: {
        type: Number,
        required: true
    }
});

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'Customer reference is required']
    },
    invoiceDate: {
        type: Date,
        required: [true, 'Invoice date is required'],
        default: Date.now
    },
    items: {
        type: [invoiceItemSchema],
        validate: {
            validator: function (items) {
                return items && items.length > 0;
            },
            message: 'At least one item is required'
        }
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 18
    },
    taxAmount: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

invoiceSchema.pre('validate', async function (next) {
    if (!this.invoiceNumber) {
        const count = await mongoose.model('Invoice').countDocuments();
        this.invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
