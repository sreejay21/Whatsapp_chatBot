const express = require('express')
const whatsappController = require('../controllers/whatsapp.controller')

const router = express.Router()

/**
 * @swagger
 * /api/whatsapp/webhook:
 *   get:
 *     summary: Verify WhatsApp webhook
 *     description: Meta calls this endpoint once to verify webhook ownership.
 *     tags:
 *       - WhatsApp
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: hub.verify_token
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: hub.challenge
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Webhook verified successfully
 *       403:
 *         description: Verification failed
 */
router.get('/webhook', whatsappController.verifyWebhook)

/**
 * @swagger
 * /api/whatsapp/webhook:
 *   post:
 *     summary: Receive incoming WhatsApp messages
 *     description: Meta sends incoming WhatsApp messages to this webhook.
 *     tags:
 *       - WhatsApp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Message received successfully
 */
router.post('/webhook', whatsappController.receiveMessage)

/**
 * @swagger
 * /api/whatsapp/send:
 *   post:
 *     summary: Send WhatsApp message (template / OTP)
 *     description: Internal API to send WhatsApp template messages such as OTP.
 *     tags:
 *       - WhatsApp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - template
 *             properties:
 *               to:
 *                 type: string
 *                 example: "919876543210"
 *               template:
 *                 type: object
 *                 example:
 *                   name: otp_template
 *                   language:
 *                     code: en_US
 *                   components:
 *                     - type: body
 *                       parameters:
 *                         - type: text
 *                           text: "123456"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       500:
 *         description: Failed to send message
 */
router.post('/send', whatsappController.sendMessage)

module.exports = router
