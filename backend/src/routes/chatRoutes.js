/**
 * @openapi
 * tags:
 *   name: Chat
 *   description: Real-time messaging and conversation history
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getMessages, getConversations } = require('../controllers/chatController');

router.use(protect);

/**
 * @openapi
 * /api/chat/conversations:
 *   get:
 *     summary: Get list of all recent conversations for the logged-in user
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/conversations', getConversations);

/**
 * @openapi
 * /api/chat/messages/{receiverId}:
 *   get:
 *     summary: Get message history with a specific user
 *     tags: [Chat]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user you are chatting with
 */
router.get('/messages/:receiverId', getMessages);

module.exports = router;