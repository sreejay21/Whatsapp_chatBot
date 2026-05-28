const express = require('express');
const router = express.Router();
const telegramChatController = require('../controllers/TelegramChatController');
const  authenticateMiddleware  = require('../middleware/authendicationMiddleware')

/**
 * @swagger
 * /api/chats/listChats:
 *   get:
 *     summary: Get all user chats
 *     description: Retrieves a list of all chats for the authenticated user
 *     tags:
 *       - Telegram Chats
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           description: Number of chats per page for pagination
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
router.get('/listChats', authenticateMiddleware, telegramChatController.getChats);

module.exports = router;