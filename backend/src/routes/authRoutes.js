const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Registration, Login, and Password Management
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (OTP will be sent)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [buyer, seller] }
 */
router.post('/register', authController.registerUser);

/**
 * @openapi
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email using OTP
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               otp: { type: string }
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user and get tokens
 *     tags: [Auth]
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout and clear cookies
 *     tags: [Auth]
 */
router.post('/logout', authController.logout);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset link to email
 *     tags: [Auth]
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @openapi
 * /api/auth/reset-password/{token}:
 *   put:
 *     summary: Reset password with token from email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 */
router.put('/reset-password/:token', authController.resetPassword);

/**
 * @openapi
 * /api/auth/change-password:
 *   put:
 *     summary: Change password while logged in
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.put('/change-password', protect, authController.changePassword);

module.exports = router;