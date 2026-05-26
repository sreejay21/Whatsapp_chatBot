const express = require('express');
const router = express.Router();

const telegramChatController = require('../controllers/TelegramChatController');

/**
 * @swagger
 * /api/chats/chats:
 *   get:
 *     summary: Get all user chats
 *     description: Retrieves a list of all chats for the authenticated user
 *     tags:
 *       - Chats
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetChatsResponse'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.get('/chats', telegramChatController.getChats);

module.exports = router;