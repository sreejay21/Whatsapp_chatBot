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
- [Postman Collection](#postman-collection)

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
`https://7cc34c28-0572-495d-b43b-dfe56fb4ad13-00-3mdfjw20ajpxf.pike.replit.dev`

---

## API Endpoints

### Webhook
#### Verify Webhook
`GET /webhook`
- **Query Params:**
  - `hub.mode`: `subscribe`
  - `hub.challenge`: `ANY_STRING`
  - `hub.verify_token`: Your `WEBHOOK_VERIFY_TOKEN`

#### Handle Webhook Events
`POST /webhook`
- Receives incoming messages and status updates from WhatsApp.

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
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `file`: (Binary File)
  - `to`: `1234567890`

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
All API responses follow a consistent format:

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

---

## Postman Collection
A pre-configured Postman collection is available in the root directory: `whatsapp-chatbot.postman_collection.json`. 

To use it:
1. Open Postman.
2. Click **Import**.
3. Select `whatsapp-chatbot.postman_collection.json`.
4. The `baseUrl` and endpoints will be pre-filled for your environment.
