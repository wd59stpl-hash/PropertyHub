/**
 * @openapi
 * tags:
 *   name: Seller
 *   description: Seller specific operations, dashboard analytics and reviews
 */

const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { authorize, protect } = require('../middlewares/authMiddleware');

router.use(protect, authorize('seller'));

/**
 * @openapi
 * /api/seller/dashboard:
 *   get:
 *     summary: Get seller's business overview and analytics
 *     tags: [Seller]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved (Total properties, views, sold count, etc.)
 */
router.get('/dashboard', sellerController.getSellerDashboard);

/**
 * @openapi
 * /api/seller/reviews:
 *   get:
 *     summary: Get all reviews for properties owned by this seller
 *     tags: [Seller]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/reviews', sellerController.getMyReviews);

module.exports = router;