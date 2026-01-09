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
 *             $ref: '#/components/schemas/TextMessage'
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
 * /api/whatsapp/send-hello-world-template:
 *   post:
 *     summary: Send hello world template
 *     description: Send a predefined hello world template message
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
 *     responses:
 *       200:
 *         description: Hello world template sent successfully
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
  "/send-hello-world-template",
  whatsAppController.sendHelloWorldTemplate,
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
 *     description: Send image, document, video, or audio by uploading a file
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - media_type
 *               - file
 *             properties:
 *               to:
 *                 type: string
 *                 description: Encrypted recipient phone number
 *               media_type:
 *                 type: string
 *                 enum: [image, document, video, audio]
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
