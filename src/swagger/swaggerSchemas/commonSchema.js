/**
 * Common Response Schemas
 * Contains shared error and response schemas used across endpoints
 */

const BadRequestResponse = {
  type: 'object',
  title: 'BadRequestResponse',
  properties: {
    success: {
      type: 'boolean',
      default: false
    },
    responsecode: {
      type: 'number',
      default: 400
    },
    message: {
      type: 'string',
      example: 'Bad request'
    }
  }
};

const UnauthorizedResponse = {
  type: 'object',
  title: 'UnauthorizedResponse',
  properties: {
    success: {
      type: 'boolean',
      default: false
    },
    responsecode: {
      type: 'number',
      default: 401
    },
    message: {
      type: 'string',
      example: 'Unauthorized access'
    }
  }
};

const ForbiddenResponse = {
  type: 'object',
  title: 'ForbiddenResponse',
  properties: {
    success: {
      type: 'boolean',
      default: false
    },
    responsecode: {
      type: 'number',
      default: 403
    },
    message: {
      type: 'string',
      example: 'Forbidden access'
    }
  }
};

const NotFoundResponse = {
  type: 'object',
  title: 'NotFoundResponse',
  properties: {
    success: {
      type: 'boolean',
      default: false
    },
    responsecode: {
      type: 'number',
      default: 404
    },
    message: {
      type: 'string',
      example: 'Resource not found'
    }
  }
};

const InternalServerErrorResponse = {
  type: 'object',
  title: 'InternalServerErrorResponse',
  properties: {
    success: {
      type: 'boolean',
      default: false
    },
    responsecode: {
      type: 'number',
      default: 500
    },
    message: {
      type: 'string',
      example: 'Internal server error'
    }
  }
};

const TooManyRequestsResponse = {
  type: 'object',
  title: 'TooManyRequestsResponse',
  properties: {
    success: {
      type: 'boolean',
      default: false
    },
    responsecode: {
      type: 'number',
      default: 429
    },
    message: {
      type: 'string',
      example: 'Too many requests - rate limit exceeded'
    }
  }
};

module.exports = {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  InternalServerErrorResponse,
  TooManyRequestsResponse
};
