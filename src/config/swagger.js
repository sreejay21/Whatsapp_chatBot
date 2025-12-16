const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WhatsApp API',
      version: '1.0.0',
      description: 'WhatsApp OTP & Chat APIs'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
  },
    apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = { swaggerUi, swaggerSpec }
