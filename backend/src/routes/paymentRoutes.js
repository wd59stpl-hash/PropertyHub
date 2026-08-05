/**
 * @openapi
 * tags:
 *   name: Payments
 *   description: Property purchase and invoice management using Stripe
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/payments/create-checkout:
 *   post:
 *     summary: Create Stripe Checkout Session for property booking
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId: { type: string }
 */
router.post('/create-checkout', protect, authorize('buyer'), paymentController.processPayment);

/**
 * @openapi
 * /api/payments/session/{sessionId}:
 *   get:
 *     summary: Get payment details using Stripe Session ID
 *     tags: [Payments]
 */
router.get('/session/:sessionId', protect, paymentController.getPaymentDetails);

/**
 * @openapi
 * /api/payments/download-invoice/{id}:
 *   get:
 *     summary: Generate and download PDF Invoice (Buyer/Admin only)
 *     tags: [Payments]
 */
router.get('/download-invoice/:id', protect, authorize('buyer', 'admin'), paymentController.downloadInvoice);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

module.exports = router;