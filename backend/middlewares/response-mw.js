import { successResponse } from '../utils/response.js';
import AppError from '../utils/app-error.js';

export default function responseFormatter() {
  return (req, res, next) => {
    // Helper gửi thành công
    res.ok = (data, meta = {}) => {
      return successResponse(res, data, 200, meta);
    };
    
    // Helper tạo mới thành công
    res.created = (data, meta = {}) => {
      return successResponse(res, data, 201, meta);
    };

    // Helper lỗi
    res.error = (error, statusCode = 500) => {
      if (!(error instanceof AppError)) {
        error = new AppError(error.message || 'Internal Server Error', statusCode);
      }
      return next(error);
    };
    next();
  };
}