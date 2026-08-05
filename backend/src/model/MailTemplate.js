const mongoose = require('mongoose');

const mailTemplateSchema = new mongoose.Schema({
    templateName: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    subject: { 
        type: String, 
        required: true 
    },
    htmlBody: { 
        type: String, 
        required: true 
    },
    textBody: { 
        type: String 
    },
    active: { 
        type: Boolean, 
        default: true 
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('MailTemplate', mailTemplateSchema);