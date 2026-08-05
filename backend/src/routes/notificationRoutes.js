/**
 * @openapi
 * tags:
 *   name: Notifications
 *   description: User alerts and real-time notifications
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// Sabhi routes ke liye Login zaroori hai
router.use(protect);

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', notificationController.getNotifications);

/**
 * @openapi
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a specific notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.put('/:id/read', notificationController.markAsRead);

/**
 * @openapi
 * /api/notifications/clear-all:
 *   delete:
 *     summary: Delete all notifications for the user
 *     tags: [Notifications]
 */
router.delete('/clear-all', notificationController.clearAll);

/**
 * @openapi
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a single notification
 *     tags: [Notifications]
 */
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;