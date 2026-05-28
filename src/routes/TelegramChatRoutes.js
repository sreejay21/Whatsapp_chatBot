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

// Sync selected chats and their messages to the database

/**
 * @swagger
 * /api/chats/syncSelectedChats:
 *   post:
 *     summary: Sync selected Telegram chats
 *     description: Saves messages from selected Telegram chats into database
 *     tags:
 *       - Telegram Chats
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatIds
 *             properties:
 *               chatIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "-1002066419811"
 *                   - "-1001080367092"
 *                   - "1012531793"
 *     responses:
 *       200:
 *         description: Chats synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 responsecode:
 *                   type: number
 *                   example: 200
 *                 result:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Chats synced successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/syncSelectedChats",authenticateMiddleware,telegramChatController.syncSelectedChats);



module.exports = router;