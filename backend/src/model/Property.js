
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Property name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    type: {
        type: String,
        required: true,
        enum: ['apartment', 'villa', 'plot', 'commercial', 'office', 'shop', 'studio']
    },
    category: {
        type: String,
        required: true,
        enum: ['sale', 'rent']
    },
    price: { type: Number, required: [true, 'Price is required'] },
    discount: { type: Number, default: 0 },
    area: { type: Number, required: [true, 'Area is required'] },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    kitchen: { type: Number, default: 1 },
    balcony: { type: Number, default: 0 },
    furnishedStatus: {
        type: String,
        required: true,
        enum: ['unfurnished', 'semi', 'fully']
    },
    facing: { type: String, default: 'East' },
    parking: { type: Boolean, default: false },
    readyToMove: { type: Boolean, default: true },
    newProject: { type: Boolean, default: false },
    reraId: { type: String, trim: true },
    possessionDate: { type: String },
    constructionStatus: {
        type: String,
        enum: ['Newly Launched', 'Under Construction', 'Ready to Move', 'N/A'],
        default: 'N/A'
    },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true, index: true },
        state: { type: String, required: true },
        country: { type: String, default: 'India' },
        pincode: { type: String, required: true },
        geo: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true }
        }
    },
    images: {
        type: [String],
        validate: [v => v.length > 0, 'At least one image is required']
    },
    video: { type: String },
    amenities: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false }
}, { timestamps: true });

propertySchema.index({ 
    "name": "text", 
    "description": "text",
    "location.city": "text", 
    "location.address": "text", 
    "location.state": "text", 
    "location.pincode": "text" 
}, {
    weights: { 
        name: 10, 
        "location.city": 7, 
        "location.address": 5,
        "location.state": 4,
        description: 1 
    },
    name: "PropertySearchIndex"
});
propertySchema.index({ "location.geo": "2dsphere" });
propertySchema.index({ price: 1, bedrooms: 1, isApproved: 1, newProject: 1 });

module.exports = mongoose.model('Property', propertySchema);