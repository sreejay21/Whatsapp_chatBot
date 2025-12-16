const router = require('express').Router()
const OTPcontroller = require('../controllers/otp.controller')

/**
 * @swagger
 * /send:
 *   post:
 *     summary: Send OTP via WhatsApp
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "919876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/send', OTPcontroller.send)

/**
 * @swagger
 * /otp/verify:
 *   post:
 *     summary: Verify OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       400:
 *         description: Invalid OTP
 */
router.post('/verify', OTPcontroller.verify)

module.exports = router
