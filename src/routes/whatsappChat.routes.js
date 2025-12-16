const express = require('express')
const chatController = require('../controllers/whatsappChat.controller')

const router = express.Router()

/**
 * @swagger
 * /api/whatsapp/chats:
 *   get:
 *     summary: Get WhatsApp chat list
 *     description: Returns list of chats ordered by last message time (WhatsApp inbox view)
 *     tags:
 *       - WhatsApp Chats
 *     responses:
 *       200:
 *         description: Chat list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: "919876543210"
 *                   lastMessage:
 *                     type: string
 *                     example: "Hi"
 *                   lastMessageAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to fetch chat list
 */
router.get('/chats', chatController.listChats)

module.exports = router
