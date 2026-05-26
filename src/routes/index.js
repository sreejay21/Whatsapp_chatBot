const router =require('express').Router()

const TelegramAuthRoutes =require('./TelegramAuthRoutes')
const TelegramChatRoutes =require('./TelegramChatRoutes')

router.use('/auth',TelegramAuthRoutes)
router.use('/chats',TelegramChatRoutes)


module.exports = router