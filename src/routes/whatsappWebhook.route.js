const express = require("express");
const whatsappController = require("../controllers/whatsappWebhook.controller");

const router = express.Router();

/**
 * @swagger
 * /webhook:
 *   get:
 *     summary: Verify webhook
 *     description: Verify the webhook endpoint with WhatsApp. Used for initial webhook setup.
 *     tags:
 *       - Webhook
 *     parameters:
 *       - name: hub.mode
 *         in: query
 *         required: true
 *         description: Mode for verification
 *         schema:
 *           type: string
 *           example: subscribe
 *       - name: hub.challenge
 *         in: query
 *         required: true
 *         description: Challenge token from WhatsApp
 *         schema:
 *           type: string
 *       - name: hub.verify_token
 *         in: query
 *         required: true
 *         description: Verification token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook verification successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       403:
 *         description: Forbidden - invalid verification token
 *       400:
 *         description: Bad request - missing parameters
 */
router.get("/", whatsappController.verifyWebhook);

/**
 * @swagger
 * /webhook:
 *   post:
 *     summary: Handle webhook events
 *     description: Receive and process WhatsApp webhook events such as incoming messages, message status updates, etc.
 *     tags:
 *       - Webhook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               object:
 *                 type: string
 *                 example: whatsapp_business_account
 *               entry:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     changes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: object
 *                           field:
 *                             type: string
 *     responses:
 *       200:
 *         description: Webhook event processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - invalid payload
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
router.post("/", whatsappController.handleWebhook);

module.exports = router;
