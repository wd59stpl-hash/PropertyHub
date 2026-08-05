const socketUtil = require('../utils/socket'); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../model/Payment');
const paymentService = require('../services/paymentService');
const io = require('../utils/socket');
const Notification = require('../model/Notification');
exports.processPayment = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const session = await paymentService.createCheckoutSession(
            propertyId, 
            req.user.id, 
            req.user.email
        );
        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await paymentService.fulfillOrder(session);
    }

    res.json({ received: true });
};


exports.getPaymentDetails = async (req, res) => {
    try {
        const payment = await Payment.findOne({ stripeSessionId: req.params.sessionId })
            .populate('property', 'name price category description')
            .populate('buyer', 'name email');

        if (!payment) return res.status(404).json({ message: "Payment not found" });
        
        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.fulfillOrder = async (session) => {
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();
    try {
        const payment = await Payment.findOneAndUpdate(
            { stripeSessionId: session.id }, 
            { paymentStatus: 'completed' }, 
            { session: mongoSession, new: true }
        );

        if (!payment) throw new Error("Payment record not found");
        const property = await Property.findByIdAndUpdate(
            payment.property, 
            { isSold: true }, 
            { session: mongoSession, new: true }
        ).populate('owner');
        const notificationMsg = `Great news! Your property "${property.name}" has been sold successfully!`;
        const newNotif = await Notification.create([{
            recipient: property.owner._id, 
            message: notificationMsg,
            type: 'PROPERTY_SOLD', 
            link: `/seller/dashboard`,
            propertyId: property._id
        }], { session: mongoSession });

        await mongoSession.commitTransaction();
        mongoSession.endSession();
        
        io.emitToUser(property.owner._id, 'new_notification', {
            title: "Property Sold!",
            message: notificationMsg,
            type: 'PROPERTY_SOLD',
            propertyId: property._id,
            createdAt: new Date()
        });

    } catch (error) {
        await mongoSession.abortTransaction();
        mongoSession.endSession();
    }
};

exports.downloadInvoice = async (req, res) => {
    try {
        await paymentService.generateInvoicePDF(req.params.id, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};