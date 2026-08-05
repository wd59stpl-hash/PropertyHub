const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    slug: { 
        type: String, 
        lowercase: true,
        unique: true 
    },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
    this.slug = this.name.split(' ').join('-').toLowerCase();
    next();
});

module.exports = mongoose.model('Category', categorySchema);