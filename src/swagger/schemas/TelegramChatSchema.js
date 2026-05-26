/**
 * Telegram Chat Schemas
 */

const TelegramChatSchema = {
  Chat: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'chat_12345'
      },
      title: {
        type: 'string',
        example: 'General Chat'
      },
      type: {
        type: 'string',
        enum: ['private', 'group', 'supergroup', 'channel'],
        example: 'private'
      },
      lastMessage: {
        type: 'string',
        example: 'Last message text'
      },
      unreadCount: {
        type: 'integer',
        example: 5
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-05-26T10:30:00Z'
      }
    }
  },
  GetChatsResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Chats retrieved successfully'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Chat'
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

module.exports = TelegramChatSchema;
