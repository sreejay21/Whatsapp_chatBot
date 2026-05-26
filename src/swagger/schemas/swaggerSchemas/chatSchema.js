/**
 * Telegram Chat Schemas
 * Contains all request and response schemas for chat endpoints
 */

const Chat = {
  type: 'object',
  title: 'Chat',
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
};

const GetChatsResponse = {
  type: 'object',
  title: 'GetChatsResponse',
  properties: {
    success: {
      type: 'boolean',
      default: true
    },
    responsecode: {
      type: 'number',
      default: 200
    },
    message: {
      type: 'string',
      example: 'Chats retrieved successfully'
    },
    result: {
      type: 'object',
      properties: {
        totalCount: {
          type: 'number'
        },
        data: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Chat'
          }
        }
      }
    }
  }
};

const ChatErrorResponse = {
  type: 'object',
  title: 'ChatErrorResponse',
  properties: {
    success: {
      type: 'boolean',
      default: false
    },
    responsecode: {
      type: 'number',
      example: 400
    },
    message: {
      type: 'string',
      example: 'Error message'
    }
  }
};

module.exports = {
  Chat,
  GetChatsResponse,
  ChatErrorResponse
};
