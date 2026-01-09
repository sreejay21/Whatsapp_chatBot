const express = require("express");
const router = express.Router();
const whatsAppUser = require("../controllers/whatsappUser.controller");

/**
 * @swagger
 * /api/whatsapp-users/listUser:
 *   get:
 *     summary: List all WhatsApp users
 *     description: Retrieve a list of all registered WhatsApp users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/listUser", whatsAppUser.listWhatsappUsers);

module.exports = router;
