const bookingService = require('../services/bookingService');

exports.createBooking = async (req, res) => {
    try {
        const booking = await bookingService.requestVisit(req.body, req.user.id);
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getSellerInquiries = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await bookingService.getSellerInquiries(req.user.id, { 
            page: page || 1, 
            limit: limit || 5 
        });
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBuyerBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getBuyerBookings(req.user.id);
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await bookingService.updateStatus(req.params.id, req.user.id, status);
        res.status(200).json({ 
            success: true, 
            message: `Booking ${status} successfully`,
            data: booking 
        });
    } catch (error) {
        const statusCode = error.message === 'Unauthorized to update this booking' ? 401 : 404;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};