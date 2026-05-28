/**
 * Telegram Authentication Schemas
 * Contains all request and response schemas for authentication endpoints
 */

const SendOtpRequest = {
  type: 'object',
  title: 'SendOtpRequest',
  required: ['countryCode', 'phoneNumber'],
  properties: {
    countryCode: {
      type: 'string',
      description: 'Country code',
      example: '+91'
    },
    phoneNumber: {
      type: 'string',
      description: 'User phone number',
      example: '1234567891'
    }
  }
};

const SendOtpResponse = {
  type: 'object',
  title: 'SendOtpResponse',
  properties: {
    status: {
      type: 'boolean',
      default: true
    },
    responsecode: {
      type: 'number',
      default: 200
    },
    result: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'OTP sent successfully'
        },
        data: {
          type: 'object',
          properties: {
            phoneNumber: {
              type: 'string',
              description: 'Encrypted phone number',
              example: 'encrypted_phone_number'
            },  
            phoneCodeHash: {
              type: 'string',
              description: 'Encrypted phone code hash',
              example: 'encrypted_phone_code_hash'
            }
          }
        }
      }
    }
  }
};

const VerifyOtpRequest = {
  type: 'object',
  title: 'VerifyOtpRequest',
  required: ['code'],
  properties: {
    code: {
      type: 'string',
      description: 'OTP code received by user',
      example: '12345'
    },
    phoneNumber: {
      type: 'string',
      description: 'Encrypted phone number from send OTP response',
      example: 'encrypted_phone_number'
    },
    phoneCodeHash: {
      type: 'string',
      description: 'Encrypted phone code hash from send OTP response',
      example: 'encrypted_phone_code_hash'
    }
  }
};

const VerifyOtpResponse = {
  type: 'object',
  title: 'VerifyOtpResponse',
  properties: {
    status: {
      type: 'boolean',
      default: true
    },
    responsecode: {
      type: 'number',
      default: 200
    },
    result: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'OTP verified successfully'
        },
        token: {
          type: 'string',
          description: 'JWT token for authenticated user'
        } 
      }
    }
  }
};

const AuthErrorResponse = {
  type: 'object',
  title: 'AuthErrorResponse',
  properties: {
    status: {
      type: 'boolean',
      default: false
    },
    responsecode: {
      type: 'number',
      example: 400
    },
    result: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Error message'
        }
      }
    }
  }
};

module.exports = {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  AuthErrorResponse
};
