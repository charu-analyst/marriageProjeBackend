import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marriage Template Platform API',
      version: '1.0.0',
      description: `
        Complete API documentation for Marriage Template Platform.
        
        A template marketplace platform for marriage-related documents including biodata, 
        resumes, cover letters, wedding cards, and invitations with AI-powered customization.
        
        ### Authentication
        Use JWT tokens for protected endpoints. Include in header: \`Authorization: Bearer <token>\`
        
        ### Base URL
        \`http://localhost:8046/api/v1\`
      `,
      contact: {
        name: 'API Support',
        email: 'support@marriagetemplate.com'
      },
      license: {
        name: 'ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:8046',
        description: 'Development Server'
      },
      {
        url: 'https://api.marriagetemplate.com',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
          description: 'Basic authentication with username and password. Default: admin / admin123'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token. Get token from /auth/signup or /auth/login'
        }
      },
      schemas: {
        // User Schema
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            profilePicture: {
              type: 'string',
              description: 'User profile picture URL'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'User date of birth'
            },
            gender: {
              type: 'string',
              enum: ['MALE', 'FEMALE', 'OTHER'],
              description: 'User gender'
            },
            userType: {
              type: 'string',
              enum: ['USER', 'PREMIUM', 'ADMIN'],
              description: 'User account type'
            },
            isPremium: {
              type: 'boolean',
              description: 'Premium account status'
            },
            premiumExpiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'Premium expiration date'
            },
            authProvider: {
              type: 'string',
              enum: ['LOCAL', 'GOOGLE'],
              description: 'Authentication provider'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },

        // Template Schema
        Template: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Template ID'
            },
            title: {
              type: 'string',
              description: 'Template title'
            },
            description: {
              type: 'string',
              description: 'Template description'
            },
            category: {
              type: 'string',
              enum: ['BIODATA', 'RESUME', 'COVER_LETTER', 'WEDDING_CARD', 'INVITATION'],
              description: 'Template category'
            },
            content: {
              type: 'object',
              description: 'Template content/structure'
            },
            previewUrl: {
              type: 'string',
              description: 'Preview image URL'
            },
            isPaid: {
              type: 'boolean',
              description: 'Is template paid'
            },
            price: {
              type: 'number',
              description: 'Template price (if paid)'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Template tags for searching'
            },
            createdBy: {
              $ref: '#/components/schemas/User',
              description: 'Template creator'
            },
            views: {
              type: 'number',
              description: 'Number of template views'
            },
            downloads: {
              type: 'number',
              description: 'Number of template downloads'
            },
            rating: {
              type: 'number',
              description: 'Average template rating (1-5)'
            },
            ratings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  score: { type: 'number' },
                  review: { type: 'string' },
                  createdAt: { type: 'string' }
                }
              },
              description: 'User ratings and reviews'
            },
            isFeatured: {
              type: 'boolean',
              description: 'Is template featured'
            },
            isActive: {
              type: 'boolean',
              description: 'Is template active'
            },
            version: {
              type: 'number',
              description: 'Template version'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Template creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },

        // Error Schema
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },

        // Response Schema
        Response: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Request success status'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Response message'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints (signup, login, token refresh)'
      },
      {
        name: 'Templates',
        description: 'Template management endpoints (CRUD, search, rate)'
      },
      {
        name: 'Purchases',
        description: 'Template purchase endpoints (buy, history, downloads)'
      }
    ]
  },
  apis: [
    './server/api/v1/routes/authRoutes.js',
    './server/api/v1/routes/templateRoutes.js',
    './server/api/v1/routes/purchaseRoutes.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
