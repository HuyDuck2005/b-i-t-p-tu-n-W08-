export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo List API Documentation',
      version: '1.0.0',
      description: 'Tài liệu API cho dự án quản lý công việc (Todo List) - Tuần 4',
    },
    servers: [
      {
        url: 'https://localhost:3443/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        /**
         * @openapi
         * components:
         *   schemas:
         *     Todo:
         *       type: object
         *       properties:
         *         id:
         *           type: integer
         *           example: 1
         *         title:
         *           type: string
         *           example: "Làm bài tập về nhà"
         *         status:
         *           type: string
         *           enum: [pending, completed]
         *           example: "pending"
         *         created_at:
         *           type: string
         *           format: date-time
         */
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            title: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed'],
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  },
apis: ['./routers/todo-r.js', './routers/user.route.js', './routers/auth-r.js'],
};