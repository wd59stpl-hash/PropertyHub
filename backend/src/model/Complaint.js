const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    property: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property',
        default: null 
    },
    subject: { 
        type: String, 
        required: [true, 'Subject is required'],
        enum: ['Fraudulent Listing', 'Incorrect Information', 'Misleading Information', 'Payment Issue', 'Seller Behavior', 'Other'] 
    },
     message: { 
        type: String, 
        required: [true, 'Message cannot be empty'] 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'In-Progress', 'Resolved'], 
        default: 'Pending' 
    },
    adminRemarks: { 
        type: String, 
        default: '' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);