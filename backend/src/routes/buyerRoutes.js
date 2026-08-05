/**
 * @openapi
 * tags:
 *   name: Buyer
 *   description: Buyer specific operations like wishlist, reviews and dashboard
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const buyerController = require('../controllers/buyerController');
const reviewController = require('../controllers/reviewController');
const complaintController = require('../controllers/complaintController');
const { upload } = require('../config/cloudinary');

// Sabhi routes ke liye Buyer protection
router.use(protect, authorize('buyer'));

/**
 * @openapi
 * /api/buyer/dashboard:
 *   get:
 *     summary: Get buyer's dashboard overview (wishlist count, visits, etc.)
 *     tags: [Buyer]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/dashboard', buyerController.getDashboard);

/**
 * @openapi
 * /api/buyer/wishlist:
 *   get:
 *     summary: Get buyer's saved properties
 *     tags: [Buyer]
 */
router.get('/wishlist', buyerController.getMyWishlist);

/**
 * @openapi
 * /api/buyer/wishlist/toggle:
 *   post:
 *     summary: Add or Remove property from wishlist
 *     tags: [Buyer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId: { type: string }
 */
router.post('/wishlist/toggle', buyerController.handleWishlist);

/**
 * @openapi
 * /api/buyer/purchases:
 *   get:
 *     summary: Get list of properties purchased by buyer
 *     tags: [Buyer]
 */
router.get('/purchases', buyerController.getMyPurchases);

/**
 * @openapi
 * /api/buyer/reviews/add:
 *   post:
 *     summary: Add a review for a property (with images)
 *     tags: [Buyer]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId: { type: string }
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 */
router.post('/reviews/add', upload.array('images', 5), reviewController.createReview);

/**
 * @openapi
 * /api/buyer/reviews/{propertyId}:
 *   get:
 *     summary: Get reviews for a specific property
 *     tags: [Buyer]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 */
router.get('/reviews/:propertyId', reviewController.getPropertyReviews);

/**
 * @openapi
 * /api/buyer/complaints:
 *   post:
 *     summary: File a new complaint
 *     tags: [Buyer]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject: { type: string }
 *               description: { type: string }
 */
router.post('/complaints', complaintController.createComplaint);

module.exports = router;