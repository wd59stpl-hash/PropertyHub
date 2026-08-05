/**
 * @openapi
 * tags:
 *   name: Properties
 *   description: Property listings, search, and management
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');
const propertyController = require('../controllers/propertyController');

/**
 * @openapi
 * /api/properties:
 *   get:
 *     summary: Get all properties with advanced filters
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, city, or address
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [apartment, villa, plot, commercial] }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: bedrooms
 *         schema: { type: string }
 *         description: "1, 2, 3, or 4+"
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', propertyController.getAllProperties);

/**
 * @openapi
 * /api/properties/details/{id}:
 *   get:
 *     summary: Get full details of a single property
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
router.get('/details/:id', propertyController.getProperty);

/**
 * @openapi
 * /api/properties/my-listings:
 *   get:
 *     summary: Get properties listed by the logged-in seller
 *     tags: [Properties]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/my-listings', protect, authorize('seller'), propertyController.getMyListings);

/**
 * @openapi
 * /api/properties/add:
 *   post:
 *     summary: List a new property (with Multiple Images & Video)
 *     tags: [Properties]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               type: { type: string }
 *               city: { type: string }
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               video:
 *                 type: string, format: binary
 */
router.post('/add', protect, authorize('seller'), upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]), propertyController.createProperty);

/**
 * @openapi
 * /api/properties/{id}:
 *   put:
 *     summary: Update an existing property
 *     tags: [Properties]
 *     security: [{ bearerAuth: [] }]
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/:id', protect, authorize('seller'), upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]), propertyController.updateProperty);
router.delete('/:id', protect, authorize('seller'), propertyController.deleteProperty);

module.exports = router;