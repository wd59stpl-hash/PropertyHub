/**
 * @openapi
 * tags:
 *   name: Property Types
 *   description: Management of property types (Apartment, Villa, Plot, etc.)
 */

const express = require('express');
const router = express.Router();
const propertyTypeController = require('../controllers/propertyTypeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/property-types:
 *   get:
 *     summary: Fetch all active property types for dropdowns
 *     tags: [Property Types]
 */
router.get('/', propertyTypeController.getAllTypes); 

/**
 * @openapi
 * /api/property-types:
 *   post:
 *     summary: Create a new property type (Admin Only)
 *     tags: [Property Types]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Studio Apartment" }
 *               icon: { type: string, description: "Lucide icon name or image URL" }
 */
router.post('/', protect, authorize('admin'), propertyTypeController.addPropertyType);

/**
 * @openapi
 * /api/property-types/{id}:
 *   delete:
 *     summary: Delete a property type (Admin Only)
 *     tags: [Property Types]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.delete('/:id', protect, authorize('admin'), propertyTypeController.deletePropertyType);

module.exports = router;