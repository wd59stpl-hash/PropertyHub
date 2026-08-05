const mongoose = require('mongoose');
const User = require('../model/User'); 
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const adminData = {
                name: "System Admin",
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: "admin",
                isVerified: true 
            };

            await User.create(adminData);
        } else {
            console.log(" Admin already exists in database.");
        }
    } catch (error) {
        console.error(`Admin Seeding Error: ${error.message}`);
    }
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedAdmin();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;