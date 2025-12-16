const express = require('express')
const messageController = require('../controllers/whatsappMessage.controller')

const router = express.Router()

/**
 * @swagger
 * /api/whatsapp/createMessages:
 *   post:
 *     summary: Create/save a WhatsApp message
 *     description: Save an incoming or outgoing WhatsApp message to the database
 *     tags:
 *       - WhatsApp Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - message
 *               - direction
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "919876543210"
 *               message:
 *                 type: string
 *                 example: "Hello"
 *               direction:
 *                 type: string
 *                 enum: [IN, OUT]
 *                 example: "IN"
 *     responses:
 *       200:
 *         description: Message created successfully
 *       500:
 *         description: Failed to create message
 */
router.post('/createMessage', messageController.createMessage)

/**
 * @swagger
 * /api/whatsapp/messages/{phone}:
 *   get:
 *     summary: Get WhatsApp messages by phone
 *     description: Returns all chat messages for a specific phone number
 *     tags:
 *       - WhatsApp Messages
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         example: "919876543210"
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   message:
 *                     type: string
 *                   direction:
 *                     type: string
 *                     example: IN
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to fetch messages
 */
router.get('/messages/:phone', messageController.listMessagesByPhone)

module.exports = router
