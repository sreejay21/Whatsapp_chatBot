const express = require("express");
const router = express.Router();
const whatsAppUser = require("../controllers/whatsappUser.controller");

router.get("/listUser", whatsAppUser.listWhatsappUsers);

module.exports = router;
