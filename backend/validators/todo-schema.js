import { z } from 'zod';

const STATUS = ['PENDING', 'DONE'];
const SORT_ALLOW = ['id', 'created_at', 'updated_at', 'due_date', 'title', 'status'];

// 1. Schema kiểm tra ID trong params (phải là số dương)
export const todoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// 2. Schema kiểm tra dữ liệu khi TẠO mới Todo
export const createTodoSchema = z.object({
  title: z.string().min(3, 'Tiêu đề tối thiểu 3 ký tự').max(120),
  description: z.string().max(2000).optional(),
  status: z.enum(STATUS).default('PENDING'),
  due_date: z.coerce.date().optional(), // Tự động chuyển chuỗi sang Date object
});

// 3. Schema kiểm tra dữ liệu khi CẬP NHẬT (tất cả các trường là tùy chọn)
export const updateTodoSchema = createTodoSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: 'Phải gửi ít nhất 1 trường để cập nhật' }
);

// 4. Schema phục vụ Tìm kiếm, Lọc và Phân trang
export const listTodoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  status: z.enum(STATUS).optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
  sort: z.string().optional(),
  q: z.string().max(100).optional(), // Tìm kiếm từ khóa
}).superRefine((q, ctx) => {
  // Kiểm tra logic ngày tháng: ngày bắt đầu phải <= ngày kết thúc
  if (q.dueFrom && q.dueTo && q.dueFrom > q.dueTo) {
    ctx.addIssue({
      code: 'custom',
      path: ['dueFrom'],
      message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc',
    });
  }
});

// Helper để xử lý cursor pagination
export function encodeCursor({ id }) {
  return Buffer.from(JSON.stringify({ id }), 'utf8').toString('base64');
}

export function decodeCursorOrThrow(cursor) {
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf8');
    const obj = JSON.parse(json);
    return { id: Number(obj.id) };
  } catch (e) {
    throw new Error('Mã cursor không hợp lệ');
  }
}