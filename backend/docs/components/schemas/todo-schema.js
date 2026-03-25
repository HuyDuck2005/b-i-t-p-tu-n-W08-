// File này chỉ để hiện mẫu trên trang web Swagger
export const TodoSchemas = {
  Todo: {
    type: "object",
    required: ["id", "user_id", "title", "status"],
    properties: {
      id: { type: "integer", format: "int32" },
      user_id: { type: "integer" },
      title: { type: "string", minLength: 3 },
      description: { type: "string", nullable: true },
      status: { type: "string", enum: ["PENDING", "DONE"] },
      due_date: { type: "string", format: "date-time" },
      created_at: { type: "string", format: "date-time" },
      updated_at: { type: "string", format: "date-time" }
    },
    example: {
      id: 1,
      user_id: 10,
      title: "Học tập tuần 4",
      status: "PENDING"
    }
  }
};