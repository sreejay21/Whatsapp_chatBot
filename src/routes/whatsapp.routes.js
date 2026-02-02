const express = require("express");
const whatsAppController = require("../controllers/whatsappOutgoing.controller");
const upload = require("../middleware/multer");

const router = express.Router();

/**
 * @swagger
 * /api/whatsapp/send-text:
 *   post:
 *     summary: Send a text message
 *     description: Send a text message to a WhatsApp user
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/DirectText'
 *               - $ref: '#/components/schemas/GroupText'
 *           examples:
 *             directMessage:
 *               summary: Direct one-to-one message
 *               value:
 *                 to: "encrypted_phone_number"
 *                 message: "Hello, how are you?"
 *             groupMessage:
 *               summary: Group message payload
 *               value:
 *                 groupId: "encrypted_group_id"
 *                 senderId: "encrypted_sender_id"
 *                 message: "Hello team, standup at 10am"
 *     responses:
 *       200:
 *         description: Message sent successfully
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
 *         description: Bad request - missing required fields
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
router.post("/send-text", whatsAppController.sendTextMessage);

/**
 * @swagger
 * /api/whatsapp/send-template:
 *   post:
 *     summary: Send a template message
 *     description: Send a pre-defined template message to a WhatsApp user
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateMessage'
 *     responses:
 *       200:
 *         description: Template message sent successfully
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
 *         description: Bad request
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
router.post("/send-template", whatsAppController.sendTemplateMessage);

/**
 * @swagger
 * /api/whatsapp/sendwelcomeMessageTemplate:
 *   post:
 *     summary: Send Welcome Message Template
 *     description: Send a predefined welcome template message to a WhatsApp user. Creates user if they don't exist.
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *             properties:
 *               to:
 *                 type: string
 *                 description: Encrypted recipient phone number
 *                 example: "encrypted_phone_number"
 *               name:
 *                 type: string
 *                 description: User's name to include in the welcome message
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Welcome template message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: WhatsApp API response with message ID
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *       400:
 *         description: Bad request - missing required field (to)
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
router.post(
  "/sendwelcomeMessageTemplate",
  whatsAppController.sendwelcomeMessageTemplate,
);

/**
 * @swagger
 * /api/whatsapp/send-media:
 *   post:
 *     summary: Send media message via URL
 *     description: Send image, document, video, or audio via URL
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MediaMessage'
 *     responses:
 *       200:
 *         description: Media sent successfully
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
 *         description: Bad request
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
router.post("/send-media", whatsAppController.sendMediaController);

/**
 * @swagger
 * /api/whatsapp/send-media-upload:
 *   post:
 *     summary: Send media message via file upload
 *     description: Send image or document to a user or a group by uploading a file
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               # Direct message
 *               to:
 *                 type: string
 *                 description: Encrypted recipient phone number (for direct messages)
 *               # Group message
 *               groupId:
 *                 type: string
 *                 description: Encrypted group ID (for group messages)
 *               senderId:
 *                 type: string
 *                 description: Encrypted sender ID (required for group messages)
 *               type:
 *                 type: string
 *                 enum: [image, document]
 *                 description: Type of media
 *               caption:
 *                 type: string
 *                 description: Optional caption for media
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: Media uploaded and sent successfully
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
 *         description: Bad request
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
router.post(
  "/send-media-upload",
  upload.single("file"),
  whatsAppController.sendMediaController,
);

module.exports = router;
