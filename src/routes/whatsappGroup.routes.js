const router = require("express").Router();
const {
  createGroupValidator,
} = require("../validator/whatsappGroup.validator");
const validateRequest = require("../middleware/validateRequest");
const whatsAppGroupController = require("../controllers/whatsappGroup.controller");
const upload = require("../middleware/multer");
const authenticate = require("../middleware/auth");
const whatsappGroupMessageController = require("../controllers/whatsappGroupMessage.controller");

/**
 * @swagger
 * /api/whatsapp-groups/create-groupChat:
 *   post:
 *     summary: Create a new group
 *     description: Create a new WhatsApp/Slack/Telegram group with members and optional logo
 *     tags:
 *       - Groups
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - members
 *             properties:
 *               name:
 *                 type: string
 *                 description: Group name
 *                 example: Team Chat
 *
 *               members:
 *                 type: array
 *                 description: List of members to be added to the group
 *                 items:
 *                   type: object
 *                   required:
 *                     - userId
 *                     - name
 *                     - source
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: External user identifier (WhatsApp/Slack/etc)
 *                       example: U0A1L9VE9B3
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     source:
 *                       type: string
 *                       enum: [WHATSAPP, TELEGRAM, SLACK]
 *                       example: WHATSAPP
 *
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Optional group logo image
 *
 *     responses:
 *       200:
 *         description: Group created successfully
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
 *                   properties:
 *                     groupId:
 *                       type: string
 *                       example: 65b1c9f2e3a4c9a12a34abcd
 *                     name:
 *                       type: string
 *                       example: Team Chat
 *                     membersCount:
 *                       type: integer
 *                       example: 3
 *
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create-groupChat",
  authenticate,
  upload.single("logo"),
  createGroupValidator,
  validateRequest,
  whatsAppGroupController.createGroup,
);

/**
 * @swagger
 * /api/whatsapp-groups/list-groups:
 *   get:
 *     summary: List all groups
 *     description: Retrieve a list of all WhatsApp groups
 *     tags:
 *       - Groups
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/list-groups", whatsAppGroupController.listAllGroups);

/**
 * @swagger
 * /api/whatsapp-groups/send-group-message:
 *   post:
 *     summary: Send a message to a group
 *     description: Send a text or media message to a WhatsApp group
 *     tags:
 *       - Group Messages
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *               - senderId
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: Encrypted group ID
 *               senderId:
 *                 type: string
 *                 description: Encrypted sender ID
 *               message:
 *                 type: string
 *                 description: Text message content
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional media file to send
 *               mediaType:
 *                 type: string
 *                 enum: [image, document, video, audio]
 *                 description: Type of media if file is provided
 *     responses:
 *       200:
 *         description: Message sent to group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
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
router.post(
  "/send-group-message",
  upload.single("file"),
  whatsappGroupMessageController.sendMessageToGroup,
);

/**
 * @swagger
 * /api/whatsapp-groups/list-group-messages:
 *   get:
 *     summary: Get group messages
 *     description: Retrieve all messages from a specific group
 *     tags:
 *       - Group Messages
 *     parameters:
 *       - name: groupId
 *         in: query
 *         required: true
 *         description: Encrypted group ID
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of messages per page
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: Group messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GroupMessage'
 *       400:
 *         description: Bad request - missing groupId
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
  "/list-group-messages",
  whatsappGroupMessageController.getGroupMessages,
);

module.exports = router;
