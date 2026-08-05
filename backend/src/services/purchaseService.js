const Payment = require('../model/Payment');

exports.getPurchasedProperties = async (userId) => {
    const purchases = await Payment.find({ buyer: userId, paymentStatus: 'completed' })
        .populate('property')
        .sort('-createdAt');
    
    return purchases;
};