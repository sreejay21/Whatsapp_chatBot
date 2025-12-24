const express = require("express");
const router = express.Router();
const whatsappChat = require("../controllers/whatsappChat.controller");

router.get("/:userId", whatsappChat.getWhatsappChatHistory);

module.exports = router;
