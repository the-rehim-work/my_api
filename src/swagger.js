const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const spec = {
  openapi: '3.0.0',
  info: {
    title: 'My API - Earthquakes',
    version: '1.0.0',
    description: 'REST API for USGS earthquake data with JWT auth and Redis cache'
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          201: { description: 'User created' },
          409: { description: 'Email already taken' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive token cookie',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Logged in' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and clear token cookie',
        responses: {
          200: { description: 'Logged out' }
        }
      }
    },
    '/api/earthquakes': {
      get: {
        tags: ['Earthquakes'],
        summary: 'Get paginated list of earthquakes',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }
        ],
        responses: {
          200: { description: 'Paginated earthquake list' }
        }
      },
      post: {
        tags: ['Earthquakes'],
        summary: 'Create a new earthquake record',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  place: { type: 'string' },
                  magnitude: { type: 'number' },
                  depth: { type: 'number' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  occurredAt: { type: 'string', format: 'date-time' }
                },
                required: ['place', 'magnitude', 'depth', 'latitude', 'longitude', 'occurredAt']
              }
            }
          }
        },
        responses: {
          201: { description: 'Created' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/earthquakes/{id}': {
      get: {
        tags: ['Earthquakes'],
        summary: 'Get single earthquake by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Earthquake record' },
          404: { description: 'Not found' }
        }
      },
      put: {
        tags: ['Earthquakes'],
        summary: 'Update earthquake record',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  place: { type: 'string' },
                  magnitude: { type: 'number' },
                  depth: { type: 'number' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  occurredAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' }
        }
      },
      delete: {
        tags: ['Earthquakes'],
        summary: 'Delete earthquake record',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' }
        }
      }
    }
  }
}

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
}