const router = require("express").Router();
const {
  createGroupValidator,
} = require("../validator/whatsappGroup.validator");
const validateRequest = require("../middleware/validateRequest");
const whatsAppGroupController = require("../controllers/whatsappGroup.controller");
const upload = require("../middleware/multer");

router.post(
  "/create-groupChat",
  upload.single("logo"),
  createGroupValidator,
  validateRequest,
  whatsAppGroupController.createGroup,
);

router.get("/list-groups", whatsAppGroupController.listAllGroups);

module.exports = router;
