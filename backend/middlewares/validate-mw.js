import AppError from '../utils/app-error.js';

/**
 * Middleware validate dữ liệu đầu vào bằng Zod schema
 * @param {ZodSchema} schema - Schema định nghĩa quy tắc kiểm tra
 * @param {string} source - Nguồn dữ liệu (body, query, hoặc params)
 */
export const validate = (schema, source = "body") => (req, res, next) => {
  // Thực hiện parse dữ liệu
  const result = schema.safeParse(req[source]);

  // Nếu validate thất bại
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join("."),
      issue: i.message,
    }));
    // Trả về lỗi 400 Bad Request kèm chi tiết lỗi
    return next(AppError.badRequest("VALIDATION_ERROR", "Invalid request data", details));
  }

  // Nếu thành công, lưu dữ liệu "sạch" vào req.validated
  if (!req.validated) {
    req.validated = {};
  }
  req.validated[source] = result.data;

  next();
};