const express = require("express");

const whatsappController = require("../controllers/whatsapp.controller");

const router = express.Router();

// Webhook verification
router.get("/webhook", whatsappController.verifyWebhook);

// Incoming messages
router. post("/webhook", whatsappController.receiveMessage);

// Internal API to send message
router.post("/send", whatsappController.sendMessage);

module.exports = router;
