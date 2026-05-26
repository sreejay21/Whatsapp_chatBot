const router =require('express').Router()

const TelegramAuthRoutes =require('./TelegramAuthRoutes')
const TelegramChatRoutes =require('./TelegramChatRoutes')
const WhatsappRoutes =require('./whatsapp.routes')
const WhatsappWebhookRoutes =require('./whatsappWebhook.route')
const WhatsappUserRoutes =require('./whatsappUser.routes')
const WhatsappChatRoutes =require('./whatsAppChat.routes')
const WhatsappGroupRoutes =require('./whatsappGroup.routes')


//
router.use('/auth',TelegramAuthRoutes)
router.use('/chats',TelegramChatRoutes)
router.use('/whatsapp',WhatsappRoutes)
router.use('/whatsapp/webhook',WhatsappWebhookRoutes)
router.use('/whatsapp/users',WhatsappUserRoutes)
router.use('/whatsapp/chats',WhatsappChatRoutes)
router.use('/whatsapp/groups',WhatsappGroupRoutes)


module.exports = router