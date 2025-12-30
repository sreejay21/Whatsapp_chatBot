# WhatsApp Chatbot API

This project provides a robust backend for a WhatsApp Chatbot using the WhatsApp Business API.

## Table of Contents
- [Setup](#setup)
- [Base URL](#base-url)
- [API Endpoints](#api-endpoints)
  - [Webhook](#webhook)
  - [Outgoing Messages](#outgoing-messages)
  - [User Management](#user-management)
- [Response Format](#response-format)

---

## Setup
Ensure you have your environment variables configured in a `.env` file:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: Your MongoDB connection string
- `WHATSAPP_TOKEN`: Your WhatsApp Business API access token
- `PHONE_NUMBER_ID`: Your WhatsApp Phone Number ID
- `WEBHOOK_VERIFY_TOKEN`: Token for webhook verification
- `CRYPTO_SECRET`: Secret key for phone number encryption

---

## Base URL
`http://localhost:5000` (or your deployed URL)

---

## API Endpoints

### Webhook
#### Verify Webhook
`GET /webhook`
Used by Meta to verify your webhook endpoint.

#### Handle Webhook Events
`POST /webhook`
Receives incoming messages and status updates from WhatsApp.

---

### Outgoing Messages

#### Send Text Message
`POST /api/whatsapp/send-text`

**Request Body:**
```json
{
  "to": "1234567890",
  "message": "Hello from the chatbot!"
}
```

#### Send Template Message
`POST /api/whatsapp/send-template`

**Request Body:**
```json
{
  "to": "1234567890",
  "name": "John Doe",
  "discount": "20%"
}
```

#### Send Hello World Template
`POST /api/whatsapp/send-hello-world-template`

**Request Body:**
```json
{
  "to": "1234567890"
}
```

#### Send Media (Link)
`POST /api/whatsapp/send-media`

**Request Body:**
```json
{
  "to": "1234567890",
  "mediaId": "MEDIA_ID_OR_URL",
  "caption": "Check this out!"
}
```

#### Send Media (File Upload)
`POST /api/whatsapp/send-media-upload`
*Content-Type: multipart/form-data*

**Form Data:**
- `file`: (Binary File)
- `to`: 1234567890

---

### User Management

#### List WhatsApp Users
`GET /api/whatsapp-user/listUser`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Users per page (default: 20)

**Response Example:**
```json
{
  "status": true,
  "responsecode": 200,
  "result": {
    "success": true,
    "data": [
      {
        "_id": "ENCRYPTED_ID",
        "name": "John Doe",
        "encryptedPhone": "ENCRYPTED_PHONE"
      }
    ],
    "pagination": {
      "totalUsers": 1,
      "totalPages": 1,
      "currentPage": 1
    }
  }
}
```

---

## Response Format
All API responses follow a consistent format managed by `src/utils/response.handler.js`:

**Success Response:**
```json
{
  "status": true,
  "responsecode": 200,
  "result": { ... }
}
```

**Error Response:**
```json
{
  "status": false,
  "responsecode": 500,
  "error": "Error message details"
}
```
