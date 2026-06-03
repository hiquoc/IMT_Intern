import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo & Auth API Documentation',
      version: '1.0.0',
      description: 'API specifications for Auth (JWT & Redis sessions) and Todo management.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Input your Bearer JWT token in the field below.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
          },
        },
        AuthData: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success' },
            data: { $ref: '#/components/schemas/AuthData' },
          },
        },
        Response: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success' },
            data: { type: 'object' },
          },
        },
        Session: {
          type: 'object',
          properties: {
            jti: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            ip: { type: 'string', example: '127.0.0.1' },
            deviceName: { type: 'string', example: 'Chrome on Windows' },
            isCurrent: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2026-06-03T02:00:00.000Z' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        Attachment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            todoId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            name: { type: 'string', example: 'invoice.pdf' },
            url: { type: 'string', example: 'https://cloudinary.com/...' },
            publicId: { type: 'string', example: 'todo_attachments/...' },
            resourceType: { type: 'string', example: 'image' },
            format: { type: 'string', nullable: true, example: 'png' },
            bytes: { type: 'integer', nullable: true, example: 1048576 },
            createdAt: { type: 'string', format: 'date-time', example: '2026-06-03T02:00:00.000Z' },
          },
        },
        Todo: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            userId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            title: { type: 'string', example: 'Buy groceries' },
            completed: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time', example: '2026-06-03T02:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-06-03T02:00:00.000Z' },
            attachments: { type: 'array', items: { $ref: '#/components/schemas/Attachment' } },
          },
        },
        CreateTodoInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Buy groceries' },
            completed: { type: 'boolean', default: false, example: false },
          },
        },
        UpdateTodoInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Buy groceries and cook dinner' },
            completed: { type: 'boolean', example: true },
          },
        },
      },
    },
  },
  apis: [
    './routes/*.route.js',
    './backend/routes/*.route.js',
    '../routes/*.route.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
