const express = require("express");
const router = express.Router();
const whatsappChat = require("../controllers/whatsappChat.controller");


/**
 * @swagger
 * /api/whatsapp-chats/chatWindowStatus:
 *   get:
 *     summary: Get WhatsApp chat window status
 *     description: >
 *       Check whether the WhatsApp 24-hour chat window is OPEN or CLOSED.
 *       Works for both direct chat (userId) and group chat (groupId).
 *     tags:
 *       - Chat
 *     parameters:
 *       - name: encryptedPhone
 *         in: query
 *         required: false
 *         description: User ID for direct WhatsApp chat
 *         schema:
 *           type: string
 *       - name: groupId
 *         in: query
 *         required: false
 *         description: WhatsApp group ID for group chat
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat window status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Direct chat response
 *                   properties:
 *                     userId:
 *                       type: string
 *                     window:
 *                       type: string
 *                       example: OPEN
 *                     lastUserMessageAt:
 *                       type: string
 *                       format: date-time
 *                     reason:
 *                       type: string
 *                 - type: object
 *                   description: Group chat response
 *                   properties:
 *                     groupId:
 *                       type: string
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           window:
 *                             type: string
 *                             example: CLOSED
 *                           lastUserMessageAt:
 *                             type: string
 *                             format: date-time
 *                           reason:
 *                             type: string
 *       400:
 *         description: Bad request - userId or groupId is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/chatWindowStatus",
  whatsappChat.getWhatsappChatWindowStatus
);

/**
 * @swagger
 * /api/whatsapp-chats/validateWhatsappNumber:
 *   post:
 *     summary: Validate WhatsApp number
 *     description: Check if a given phone number is registered on WhatsApp
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number to validate
 *     responses:
 *       200:
 *         description: WhatsApp number validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - invalid phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/validateWhatsappNumber", whatsappChat.validateWhatsappNumber);

/**
 * @swagger
 * /api/whatsapp-chats/{userId}:
 *   get:
 *     summary: Get chat history for a user
 *     description: Retrieve chat history for a specific user with pagination
 *     tags:
 *       - Chat
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: Encrypted user phone number
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (default 1)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of chats per page (default 20)
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatHistory'
 *       400:
 *         description: Bad request - invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:userId", whatsappChat.getWhatsappChatHistory);




module.exports = router;
