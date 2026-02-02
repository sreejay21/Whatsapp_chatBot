# Swagger API Documentation

This document describes the Swagger/OpenAPI documentation setup for the WhatsApp ChatBot API.

## Overview

Swagger documentation has been integrated into the WhatsApp ChatBot API using:
- **swagger-jsdoc**: Generates OpenAPI specifications from JSDoc comments
- **swagger-ui-express**: Provides a web UI for the API documentation

## Accessing the Documentation

Once the server is running, you can access the Swagger UI at:
```
http://localhost:3000/api-docs
```

The raw OpenAPI specification in JSON format is available at:
```
http://localhost:3000/api-docs/swagger.json
```

## API Endpoints Documentation

### Messages Endpoints (`/api/whatsapp`)

#### 1. Send Text Message
- **POST** `/api/whatsapp/send-text`
- **Description**: Send a text message to a WhatsApp user
- **Body**:
  ```json
  {
    "to": "encrypted_phone_number",
    "message": "Hello, how are you?"
  }
  ```

#### 2. Send Template Message
- **POST** `/api/whatsapp/send-template`
- **Description**: Send a pre-defined template message
- **Body**:
  ```json
  {
    "to": "encrypted_phone_number",
    "template_name": "hello_world",
    "language_code": "en_US",
    "parameters": []
  }
  ```

#### 3. Send Welcome Message Template
- **POST** `/api/whatsapp/sendwelcomeMessageTemplate`
- **Description**: Send a predefined welcome template message to a WhatsApp user. Creates user if they don't exist.
- **Body**:
  ```json
  {
    "to": "encrypted_phone_number",
    "name": "John Doe"
  }
  ```
- **Parameters**:
  - `to` (required): Encrypted recipient phone number
  - `name` (optional): User's name to include in the welcome message (default: "User")
- **Response**: Message sent confirmation with encrypted contact info

#### 4. Send Media via URL
- **POST** `/api/whatsapp/send-media`
- **Description**: Send image, document, video, or audio via URL
- **Body**:
  ```json
  {
    "to": "encrypted_phone_number",
    "media_url": "https://example.com/image.jpg",
    "media_type": "image",
    "caption": "Optional caption"
  }
  ```

#### 5. Send Media via File Upload
- **POST** `/api/whatsapp/send-media-upload`
- **Description**: Send media by uploading a file
- **Body** (multipart/form-data):
  - `to`: Encrypted recipient phone number
  - `media_type`: Type of media (image, document, video, audio)
  - `caption`: Optional caption
  - `file`: Binary file to upload

### Chat Endpoints (`/api/whatsapp-chats`)

#### Get Chat History
- **GET** `/api/whatsapp-chats/{userId}`
- **Description**: Retrieve chat history for a specific user with pagination
- **Parameters**:
  - `userId` (path): Encrypted user phone number
  - `page` (query, optional): Page number (default: 1)
  - `limit` (query, optional): Messages per page (default: 20)
- **Response**: Returns paginated chat history with metadata

### User Endpoints (`/api/whatsapp-users`)

#### List All Users
- **GET** `/api/whatsapp-users/listUser`
- **Description**: Retrieve a list of all registered WhatsApp users
- **Response**: Array of user objects with details

### Group Endpoints (`/api/whatsapp-groups`)

#### 1. Create Group
- **POST** `/api/whatsapp-groups/create-groupChat`
- **Authentication**: Requires Bearer token
- **Description**: Create a new WhatsApp group
- **Body** (multipart/form-data):
  - `name`: Group name (required)
  - `members`: Array of encrypted member IDs (required)
  - `logo`: Optional group logo image
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "groupId": "encrypted_group_id",
      "name": "Team Chat",
      "membersCount": 5
    }
  }
  ```

#### 2. List All Groups
- **GET** `/api/whatsapp-groups/list-groups`
- **Description**: Retrieve all WhatsApp groups
- **Response**: Array of group objects

#### 3. Send Group Message
- **POST** `/api/whatsapp-groups/send-group-message`
- **Description**: Send a message to a group
- **Body** (multipart/form-data):
  - `groupId`: Encrypted group ID (required)
  - `senderId`: Encrypted sender ID (required)
  - `message`: Text message content
  - `file`: Optional media file
  - `mediaType`: Type of media if file provided
- **Response**: Message sent confirmation

#### 4. Get Group Messages
- **GET** `/api/whatsapp-groups/list-group-messages`
- **Description**: Retrieve messages from a group
- **Parameters**:
  - `groupId` (query, required): Encrypted group ID
  - `page` (query, optional): Page number
  - `limit` (query, optional): Messages per page
- **Response**: Array of group messages with pagination

### Webhook Endpoints (`/webhook`)

#### 1. Verify Webhook
- **GET** `/webhook`
- **Description**: Verify webhook endpoint with WhatsApp (for initial setup)
- **Parameters**:
  - `hub.mode`: Verification mode (usually "subscribe")
  - `hub.challenge`: Challenge token from WhatsApp
  - `hub.verify_token`: Verification token
- **Response**: Challenge token if verification succeeds

#### 2. Handle Webhook Events
- **POST** `/webhook`
- **Description**: Receive and process WhatsApp webhook events
- **Body**: WhatsApp webhook payload
  ```json
  {
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "entry_id",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp"
            },
            "field": "messages"
          }
        ]
      }
    ]
  }
  ```
- **Response**: Processing confirmation

## Authentication

The following endpoints require authentication:

- **POST** `/api/whatsapp-groups/create-groupChat` - Requires Bearer token

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Testing with Swagger UI

1. Open http://localhost:3000/api-docs in your browser
2. Explore the available endpoints
3. Click "Try it out" on any endpoint to test it
4. Fill in required parameters and request body
5. Click "Execute" to send the request
6. View the response below

## File Structure

- `src/config/swagger.js` - Swagger configuration and schema definitions
- `src/routes/*.js` - All route files with JSDoc comments
- `app.js` - Main application file with Swagger middleware setup

## Adding New Routes

To add Swagger documentation to new routes:

1. Add JSDoc comments to the route definition:
```javascript
/**
 * @swagger
 * /api/path:
 *   post:
 *     summary: Brief description
 *     tags:
 *       - Category Name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field: { type: string }
 *     responses:
 *       200:
 *         description: Success response
 */
router.post('/path', controller.handler);
```

2. The Swagger specification will automatically update based on the JSDoc comments

## Environment Variables

Ensure your `.env` file includes necessary configuration for the API. The Swagger documentation assumes your server is running on the configured port.

## Troubleshooting

- **Swagger UI not loading**: Ensure `swagger-ui-express` and `swagger-jsdoc` are installed
- **Routes not appearing in docs**: Check JSDoc syntax in route files
- **Port mismatch**: Update server URL in swagger.js configuration
