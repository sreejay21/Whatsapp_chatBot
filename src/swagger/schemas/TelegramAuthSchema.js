/**
 * Telegram Authentication Schemas
 */

const TelegramAuthSchema = {
  SendOtpRequest: {
    type: 'object',
    required: ['phoneNumber','countryCode'],
    properties: {
      phoneNumber: {
        type: 'string',
        description: 'User phone number',
        example: '+1234567890'
      },
      countryCode: {
        type: 'string',
        description: 'User country code',
        example: 'US'
      }
    }
  },
  SendOtpResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'OTP sent successfully'
      },
      data: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            example: 'session_12345'
          }
        }
      }
    }
  },
  VerifyOtpRequest: {
    type: 'object',
    required: ['phoneNumber', 'otp', 'sessionId'],
    properties: {
      phoneNumber: {
        type: 'string',
        description: 'User phone number',
        example: '+1234567890'
      },
      otp: {
        type: 'string',
        description: 'OTP code received by user',
        example: '123456'
      },
      sessionId: {
        type: 'string',
        description: 'Session ID from send-otp endpoint',
        example: 'session_12345'
      }
    }
  },
  VerifyOtpResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'OTP verified successfully'
      },
      data: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            example: 'user_12345'
          },
          token: {
            type: 'string',
            example: 'jwt_token_here'
          }
        }
      }
    }
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      message: {
        type: 'string',
        example: 'Error message'
      }
    }
  }
};

module.exports = TelegramAuthSchema;
