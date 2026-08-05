const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    property: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property', 
        required: true 
    },
    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    visitDate: { 
        type: String, 
        required: true 
    },
    visitTime: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);