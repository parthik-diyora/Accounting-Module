require('dotenv').config({ path: './.env' });
const Customer = require('../models/Customer');
const connectDB = require('../config/db');

const firstNames = [
    'Amit', 'Rahul', 'Rohit', 'Suresh', 'Ankit',
    'Priya', 'Neha', 'Pooja', 'Kavita', 'Sneha'
];

const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Mehta', 'Patel',
    'Singh', 'Kumar', 'Agarwal', 'Jain', 'Malhotra'
];

const generateIndianPhone = () => {
    const firstDigit = Math.floor(Math.random() * 4) + 6; // 6–9
    const remaining = Math.floor(100000000 + Math.random() * 900000000);
    return `${firstDigit}${remaining}`;
};

const seedCustomers = async () => {
    try {
        await connectDB();

        console.log('Seeding 20 customers with unique emails and Indian numbers...');

        const customers = [];
        const usedEmails = new Set();

        while (customers.length < 20) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const timestamp = Date.now(); // guarantees uniqueness

            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@example.com`;

            if (usedEmails.has(email)) continue;

            usedEmails.add(email);

            customers.push({
                name: `${firstName} ${lastName}`,
                email,
                phone: generateIndianPhone()
            });
        }

        await Customer.insertMany(customers, { ordered: false });

        console.log('✅ Successfully seeded 20 unique customers!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding customers:', error);
        process.exit(1);
    }
};

seedCustomers();
