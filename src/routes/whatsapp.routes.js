const express = require("express");
const whatAppController = require("../controllers/whatsappOutgoing.controller");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/send-text", whatAppController.sendTextMessage);
router.post("/send-template", whatAppController.sendTemplateMessage);
router.post("/send-media", whatAppController.sendMediaMessage);
router.post("/send-image", whatAppController.sendImageViaLink);

router.post(
  "/upload-image",
  upload.single("file"),
  whatAppController.uploadImageController,
);

router.post(
  "/send-hello-world-template",
  whatAppController.sendHelloWorldTemplate,
);

router.post(
  "/send-uploaded-image",
  upload.single("file"),
  whatAppController.uploadAndSendImageController,
);

module.exports = router;
