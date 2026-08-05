/**
 * @openapi
 * tags:
 *   name: User
 *   description: Personal profile and account settings management
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary'); 
const userController = require('../controllers/userController');

/**
 * @openapi
 * /api/users/profile:
 *   put:
 *     summary: Update user profile details and profile picture
 *     tags: [User]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               bio: { type: string }
 *               address: { type: string }
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', protect, upload.single('profilePic'), userController.updateProfile);

module.exports = router;