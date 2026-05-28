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
      example: '121212'
    },

    name: {
      type: 'string',
      example: 'John Doe'
    },

    lastMessage: {
      type: 'string',
      example: 'Last message text'
    },

    messageId: {
      type: 'integer',
      example: 15725
    },

    lastMessageTime: {
      type: 'integer',
      example: 1779298260
    },

    hasMedia: {
      type: 'boolean',
      example: true
    },

    mediaType: {
      type: 'string',
      nullable: true,
      example: 'MessageMediaDocument'
    },

    avatar: {
      type: 'string',
      nullable: true,
      example: null
    },

    isOnline: {
      type: 'boolean',
      example: false
    },

    hasUnreadMessages: {
      type: 'boolean',
      example: false
    },

    isUser: {
      type: 'boolean',
      example: true
    },

    isGroup: {
      type: 'boolean',
      example: false
    },

    isChannel: {
      type: 'boolean',
      example: false
    },

    unreadCount: {
      type: 'integer',
      example: 0
    }
  }
}

const Pagination = {
  type: 'object',
  title: 'Pagination',

  properties: {

    total: {
      type: 'integer',
      example: 278
    },

    page: {
      type: 'integer',
      example: 1
    },

    limit: {
      type: 'integer',
      example: 20
    },

    totalPages: {
      type: 'integer',
      example: 14
    }
  }
}

const GetChatsResponse = {
  type: 'object',
  title: 'GetChatsResponse',

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

        chats: {
          type: 'array',

          items: {
            $ref: '#/components/schemas/Chat'
          }
        },

        pagination: {
          $ref: '#/components/schemas/Pagination'
        }
      }
    }
  }
}

const ChatErrorResponse = {
  type: 'object',
  title: 'ChatErrorResponse',

  properties: {

    status: {
      type: 'boolean',
      default: false
    },

    responsecode: {
      type: 'number',
      example: 400
    },

    error: {
      type: 'string',
      example: 'Error message'
    }
  }
}

module.exports = {
  Chat,
  Pagination,
  GetChatsResponse,
  ChatErrorResponse
}