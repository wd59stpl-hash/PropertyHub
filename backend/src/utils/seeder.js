const mongoose = require('mongoose');
const Category = require('../model/Category');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

const categories = [
    { name: 'Apartment' },
    { name: 'Villa' },
    { name: 'Commercial Office' },
    { name: 'Studio' },
    { name: 'Plot/Land' },
    { name: 'Warehouse' }
];

const seedData = async () => {
    try {
        await Category.deleteMany(); 
        await Category.insertMany(categories);
        process.exit();
    } catch (error) {
        process.exit(1);
    }
};

seedData();