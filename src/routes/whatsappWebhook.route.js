const express = require("express");
const whatsappController = require("../controllers/whatsappWebhook.controller");

const router = express.Router();

// Verification
router.get("/", whatsappController.verifyWebhook);

// Events
router.post("/", whatsappController.handleWebhook);

module.exports = router;
