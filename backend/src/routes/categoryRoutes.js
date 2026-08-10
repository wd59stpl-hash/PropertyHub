/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Property classification management (Sale, Rent, etc.)
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Fetch all active property categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 */
router.get('/', categoryController.getCategories);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Add a new category (Admin Only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Luxury Villa" }
 *               description: { type: string, example: "Premium high-end properties" }
 */
router.post('/', protect, authorize('admin'), categoryController.addCategory);

module.exports = router;