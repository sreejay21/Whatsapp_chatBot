/**
 * Swagger Schemas Definition
 * Central location for all API request/response schemas
 * 
 * This file aggregates all schema definitions from individual schema files
 * organized by feature. Each schema file exports a set of related schemas.
 */

const {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  AuthErrorResponse
} = require('./swaggerSchemas/authUserSchema');

const {
  Chat,
  GetChatsResponse,
  ChatErrorResponse
} = require('./swaggerSchemas/chatSchema');

const {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  InternalServerErrorResponse,
  TooManyRequestsResponse
} = require('./swaggerSchemas/commonSchema');

/**
 * Centralized schemas object
 * All schema definitions are collected here for easy reference and usage
 */
const schemas = {
  // Authentication Schemas
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  AuthErrorResponse,

  // Chat Schemas
  Chat,
  GetChatsResponse,
  ChatErrorResponse,

  // Common Schemas
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  InternalServerErrorResponse,
  TooManyRequestsResponse
};

module.exports = schemas;
