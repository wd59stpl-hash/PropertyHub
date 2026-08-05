const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const Payment = require('../model/Payment');
const Property = require('../model/Property');

exports.createCheckoutSession = async (propertyId, buyerId, buyerEmail) => {
    const property = await Property.findById(propertyId);
    
    if (!property) throw new Error('Property not found');
    if (property.isSold) throw new Error('Property already sold');
    if (!property.isApproved) throw new Error('Property not approved by admin yet');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: { 
                    name: property.name,
                    description: property.description.substring(0, 100)
                },
                unit_amount: property.price * 100,
            },
            quantity: 1,
        }],
        mode: 'payment',
        client_reference_id: propertyId.toString(),
        customer_email: buyerEmail,
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
        metadata: { buyerId: buyerId.toString() }
    });

    await Payment.create({
        buyer: buyerId,
        property: propertyId,
        amount: property.price,
        stripeSessionId: session.id
    });

    return session;
};

exports.fulfillOrder = async (session) => {
    const propertyId = session.client_reference_id;
    const stripeSessionId = session.id;
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        const payment = await Payment.findOneAndUpdate(
            { stripeSessionId: stripeSessionId },
            { 
                paymentStatus: 'completed', 
                paymentIntentId: session.payment_intent 
            },
            { session: dbSession, new: true }
        );

        const property = await Property.findByIdAndUpdate(
            propertyId,
            { isSold: true },
            { session: dbSession, new: true }
        );

        if (!payment || !property) {
            throw new Error("Transaction Integrity Failed - Rolling back");
        }
        await dbSession.commitTransaction();
    } catch (error) {
        await dbSession.abortTransaction();
    } finally {
        dbSession.endSession();
    }
};


exports.generateInvoicePDF = async (paymentId, res) => {
    const payment = await Payment.findById(paymentId).populate('property buyer');
    if (!payment) throw new Error('Payment not found');
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${paymentId}.pdf`);
    doc.pipe(res); 
    doc.fontSize(25).text('PropertyHub - Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice Number: ${payment.stripeSessionId}`);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Buyer Name: ${payment.buyer.name}`);
    doc.text(`Property: ${payment.property.name}`);
    doc.text(`Amount Paid: INR ${payment.amount}`);
    doc.text(`Status: ${payment.paymentStatus.toUpperCase()}`);
    doc.moveDown();
    doc.text('Thank you for your purchase!', { align: 'center', oblique: true });
    doc.end();
};