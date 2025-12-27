const express = require("express");
const whatAppController = require("../controllers/whatsappOutgoing.controller");

const router = express.Router();

router.post("/send-text", whatAppController.sendTextMessage);
router.post("/send-template", whatAppController.sendTemplateMessage);
router.post("/send-media", whatAppController.sendMediaMessage);
router.post("/send-image", whatAppController.sendImage);
router.post("/upload-image", whatAppController.uploadImageController);
router.post(
  "/send-hello-world-template",
  whatAppController.sendHelloWorldTemplate,
);

module.exports = router;
