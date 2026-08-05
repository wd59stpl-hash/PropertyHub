const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    property: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String, 
        default: 'inr' 
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    },
    stripeSessionId: { 
        type: String, 
        required: true,
        unique: true 
    },
    paymentIntentId: { 
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);