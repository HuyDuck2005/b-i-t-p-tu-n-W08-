import { TodoSchemas } from './schemas/todo-doc-schema.js'; // Nhớ đổi tên file import tại đây

export const components = {
  schemas: {
    ...TodoSchemas,
  },
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};