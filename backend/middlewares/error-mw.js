import { errorResponse } from '../utils/response.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // Log lỗi ra console để debug
  console.error('ERROR:', err);

  return errorResponse(res, err, statusCode); //
};
export default errorHandler;