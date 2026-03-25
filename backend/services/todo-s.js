import AppError from '../utils/app-error.js';
import Todo from '../models/todo.js';

// Quy tắc: Ngày hết hạn không được nhỏ hơn hôm nay
function assertDueDateNotPast(dueDate) {
  if (!dueDate) return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(dueDate) < today) {
    throw AppError.badRequest("BUSINESS_RULE_VIOLATION", "due_date must be today or later");
  }
}

// 1. Hàm lấy chi tiết Todo (ĐỂ SỬA LỖI 500 CỦA BẠN)
export async function getTodoById(id, userId) {
  // Tìm todo theo id và kiểm tra quyền sở hữu của user
  const todo = await Todo.findByIdAndUserId({ id, userId });
  
  if (!todo) {
    throw AppError.notFound("TODO_NOT_FOUND", "Không tìm thấy công việc hoặc bạn không có quyền xem");
  }
  return todo;
}

// 2. Hàm tạo mới Todo
export async function createTodo({ userId, data }) {
  assertDueDateNotPast(data.due_date); 
  return Todo.create({ userId, data });
}

// 3. Hàm lấy danh sách Todo (Dùng cái này để biết có những ID nào)
export async function listTodos({ userId, query }) {
  const limit = parseInt(query.limit) || 20;
  const page = parseInt(query.page) || 1;
  const offset = (page - 1) * limit;

  const { items, total } = await Todo.listOffset({
    userId,
    filters: query,
    sort: query.sort,
    fields: query.fields,
    limit,
    offset
  });

  return {
    mode: "offset",
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 0 }
  };
}

// 4. Hàm cập nhật Todo
export async function updateTodo({ userId, id, data }) {
  const todo = await Todo.findByIdAndUserId({ id, userId });
  if (!todo) throw AppError.notFound("TODO_NOT_FOUND", "Todo not found or not yours");

  if (data.due_date) assertDueDateNotPast(data.due_date);
  return Todo.update({ id, data });
}