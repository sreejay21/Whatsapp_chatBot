const router = require("express").Router();
const {
  createGroupValidator,
} = require("../validator/whatsappGroup.validator");
const validateRequest = require("../middleware/validateRequest");
const whatsAppGroupController = require("../controllers/whatsappGroup.controller");
const upload = require("../middleware/multer");
const authenticate = require("../middleware/auth");
const whatsappGroupMessageController = require("../controllers/whatsappGroupMessage.controller");

router.post(
  "/create-groupChat",
  authenticate,
  upload.single("logo"),
  createGroupValidator,
  validateRequest,
  whatsAppGroupController.createGroup,
);

router.get("/list-groups", whatsAppGroupController.listAllGroups);

router.post(
  "/send-group-message",
  upload.single("file"),
  whatsappGroupMessageController.sendMessageToGroup,
);

router.get(
  "/list-group-messages",
  whatsappGroupMessageController.getGroupMessages,
);

module.exports = router;
