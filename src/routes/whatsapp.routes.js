const express = require("express");
const whatsAppController = require("../controllers/whatsappOutgoing.controller");
const upload = require("../middleware/multer");

const router = express.Router();

// Text & Template messages
router.post("/send-text", whatsAppController.sendTextMessage);
router.post("/send-template", whatsAppController.sendTemplateMessage);
router.post(
  "/send-hello-world-template",
  whatsAppController.sendHelloWorldTemplate,
);

// Media messages via link (image or document)
router.post("/send-media", whatsAppController.sendMediaController);

// Media messages via file upload
router.post(
  "/send-media-upload",
  upload.single("file"),
  whatsAppController.sendMediaController,
);

module.exports = router;
