const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WhatsApp ChatBot API",
      version: "1.0.0",
      description: "API documentation for WhatsApp ChatBot application",
      contact: {
        name: "API Support",
      },
    },

    // ✅ Server controlled by ENV (localhost by default)
    servers: [
      {
        url: "http://localhost:3000",
        description: "Active API server",
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token for authentication",
        },
      },

      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },

        TextMessage: {
          type: "object",
          required: ["to", "message"],
          properties: {
            to: {
              type: "string",
              description: "Encrypted recipient phone number",
              example: "encrypted_phone_number",
            },
            message: {
              type: "string",
              description: "Message body",
              example: "Hello, how are you?",
            },
          },
        },

        TemplateMessage: {
          type: "object",
          required: ["to", "template_name", "language_code"],
          properties: {
            to: {
              type: "string",
              description: "Encrypted recipient phone number",
              example: "encrypted_phone_number",
            },
            template_name: {
              type: "string",
              description: "Template name",
              example: "hello_world",
            },
            language_code: {
              type: "string",
              description: "Language code for template",
              example: "en_US",
            },
            parameters: {
              type: "array",
              description: "Template parameters",
              items: {
                type: "object",
              },
            },
          },
        },

        MediaMessage: {
          type: "object",
          required: ["to", "media_url", "media_type"],
          properties: {
            to: {
              type: "string",
              description: "Encrypted recipient phone number",
            },
            media_url: {
              type: "string",
              description: "URL or file to send",
              format: "uri",
            },
            media_type: {
              type: "string",
              enum: ["image", "document", "video", "audio"],
              description: "Type of media",
            },
            caption: {
              type: "string",
              description: "Optional caption for media",
            },
          },
        },

        Group: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
              example: "Team Chat",
            },
            members: {
              type: "array",
              items: {
                type: "string",
              },
            },
            logo: {
              type: "string",
              format: "uri",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        GroupMessage: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            groupId: {
              type: "string",
            },
            senderId: {
              type: "string",
            },
            message: {
              type: "string",
            },
            mediaUrl: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ChatHistory: {
          type: "object",
          properties: {
            chats: {
              type: "array",
              items: {
                type: "object",
              },
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "number",
                },
                limit: {
                  type: "number",
                },
                total: {
                  type: "number",
                },
                pages: {
                  type: "number",
                },
              },
            },
          },
        },

        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            phoneNumber: {
              type: "string",
            },
            name: {
              type: "string",
            },
            profilePicture: {
              type: "string",
              format: "uri",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },

  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
