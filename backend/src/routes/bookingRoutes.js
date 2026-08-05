/**
 * @openapi
 * tags:
 *   name: Bookings
 *   description: Property visit scheduling and management
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { 
    createBooking, 
    getSellerInquiries, 
    getBuyerBookings, 
    updateBookingStatus 
} = require('../controllers/bookingController');

/**
 * @openapi
 * /api/bookings/request:
 *   post:
 *     summary: Request a property visit (Buyer Only)
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, date, time]
 *             properties:
 *               propertyId: { type: string }
 *               date: { type: string, format: date }
 *               time: { type: string }
 */
router.post('/request', protect, authorize('buyer'), createBooking);

/**
 * @openapi
 * /api/bookings/my-visits:
 *   get:
 *     summary: Get all visits scheduled by the buyer
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/my-visits', protect, authorize('buyer'), getBuyerBookings);

/**
 * @openapi
 * /api/bookings/seller-inquiries:
 *   get:
 *     summary: Get all visit requests for seller's properties
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/seller-inquiries', protect, authorize('seller'), getSellerInquiries);

/**
 * @openapi
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (Accept/Reject) - Seller Only
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [Accepted, Rejected, Completed] }
 */
router.patch('/:id/status', protect, authorize('seller'), updateBookingStatus);

module.exports = router;