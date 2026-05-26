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
      example: '91'
    },
    phoneNumber: {
      type: 'string',
      description: 'User phone number',
      example: '8412980663'
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
