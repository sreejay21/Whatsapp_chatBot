const router = require('express').Router();
const TelegramAuthController = require('../controllers/TelegramAuthController');
const { sendOtpValidation, verifyOtpValidation } = require('../middleware/TelegramAuthMiddleware');
const ValidationMiddleware = require('../middleware/ValidationMiddleware');
const { otpLimiter } = require('../middleware/RateLimitMiddleware');

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to user's phone number
 *     description: Sends a one-time password (OTP) to the provided phone number for authentication
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendOtpResponse'
 *       400:
 *         description: Invalid phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestResponse'
 *       429:
 *         description: Too many requests - rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TooManyRequestsResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post('/send-otp', otpLimiter, sendOtpValidation, ValidationMiddleware, TelegramAuthController.sendOtp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and authenticate user
 *     description: Verifies the OTP sent to user's phone number and returns authentication token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyOtpResponse'
 *       400:
 *         description: Invalid OTP or phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestResponse'
 *       401:
 *         description: OTP expired or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post('/verify-otp', verifyOtpValidation, ValidationMiddleware, TelegramAuthController.verifyOtp);

module.exports = router;