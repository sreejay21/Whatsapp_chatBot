const express = require('express')
const whatsappController = require('../controllers/whatsappWebhook.controller')

const router = express.Router()


router.get('/verifyWebhook', whatsappController.verifyWebhook)

router.post('/webhook', whatsappController.handleWebhook)

module.exports = router
