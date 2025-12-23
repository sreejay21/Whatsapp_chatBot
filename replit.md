# WhatsApp Chatbot

## Overview
A Node.js Express server for WhatsApp Business API integration. Provides webhook endpoints to receive and send WhatsApp messages using Meta's Graph API with MongoDB for data persistence.

## Project Structure
```
├── server.js          # Entry point - starts Express server with MongoDB
├── app.js             # Express app configuration and route mounting
├── src/
│   ├── config/        # Environment configuration
│   ├── controllers/   # Request handlers
│   ├── models/        # Mongoose schemas
│   ├── repositories/  # Database operations
│   └── routes/        # API route definitions
```

## Running the Project
The server runs on port 5000 and provides:
- `GET /` - Health check (returns welcome message)
- `/api/whatsapp` - WhatsApp message sending routes
- `/api/whatsapp/webhook` - Webhook verification and message receiving

## Environment Variables
- `PORT` - Server port (5000)
- `MONGO_URI` - MongoDB connection string
- `WHATSAPP_TOKEN` - Meta WhatsApp Business API token
- `WHATSAPP_PHONE_NUMBER_ID` - WhatsApp phone number ID
- `WHATSAPP_API_VERSION` - API version (v20.0)
- `WHATSAPP_BASE_URL` - Graph API base URL
- `WEBHOOK_VERIFY_TOKEN` - Token for webhook verification

## Dependencies
- express - Web framework
- mongoose - MongoDB ODM
- dotenv - Environment variable management
- axios - HTTP client for WhatsApp API calls
- body-parser - Request body parsing
