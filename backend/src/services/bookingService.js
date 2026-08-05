const bookingRepository = require('../repositories/bookingRepository');
const Property = require('../model/Property');
const socketUtil = require('../utils/socket');
const notifHelper = require('../utils/notificationHelper');

exports.requestVisit = async (bookingData, buyerId) => {
    const property = await Property.findById(bookingData.propertyId);
    if (!property) throw new Error('Property not found');
    const data = {
        property: bookingData.propertyId,
        buyer: buyerId,
        seller: property.owner,
        visitDate: bookingData.visitDate,
        visitTime: bookingData.visitTime,
        message: bookingData.message
    };
    const booking = await bookingRepository.create(data); 
    await notifHelper.createAndSendNotification(property.owner, {
        title: "New Visit Request!",
        message: `A buyer wants to visit "${property.name}".`,
        type: 'VISIT_REQUESTED',
        propertyId: property._id,
        senderId: buyerId
    });
    return booking;
};

exports.getSellerInquiries = async (sellerId, params) => {
    return await bookingRepository.findForSeller(sellerId, params);
};

exports.getBuyerBookings = async (buyerId) => {
    return await bookingRepository.findForBuyer(buyerId);
};

exports.updateStatus = async (bookingId, sellerId, status) => {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.seller.toString() !== sellerId.toString()) {
        throw new Error('Unauthorized to update this booking');
    }
    const updatedBooking = await bookingRepository.updateStatus(bookingId, status);
    socketUtil.emitToUser(booking.buyer.toString(), 'new_notification', {
        title: status === 'Accepted' ? "Visit Confirmed!" : "Visit Rejected",
        message: status === 'Accepted' 
            ? `Your visit request has been approved.`
            : `Sorry, your visit request was declined.`,
        type: 'VISIT_STATUS_UPDATED',
        bookingId: booking._id,
        createdAt: new Date()
    });

    return updatedBooking;
};