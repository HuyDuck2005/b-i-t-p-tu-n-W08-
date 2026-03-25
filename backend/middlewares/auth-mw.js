import AppError from '../utils/app-error.js';
import User from '../models/user.js';
import { verifyAccessToken } from '../services/auth-s.js';

/**
 * Middleware bảo vệ route - yêu cầu Access Token hợp lệ
 */
export async function protect(req, res, next) {
  try {
    let token;

    // Lấy token từ Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw AppError.unauthorized('NO_TOKEN', 'You are not logged in! Please log in to get access.');
    }

    // Xác thực Access Token
    const decoded = verifyAccessToken(token);

    // Kiểm tra user vẫn tồn tại
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw AppError.unauthorized('USER_NOT_FOUND', 'The user belonging to this token does no longer exist.');
    }

    // Gắn user vào request
    req.user = currentUser;
    next();
  } catch (error) {
    return res.error(error);
  }
}

/**
 * Middleware kiểm tra quyền (role-based)
 */
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.error(AppError.forbidden('FORBIDDEN', 'You do not have permission to perform this action'));
    }
    next();
  };
}

/**
 * Middleware optional authentication - không bắt buộc đăng nhập
 */
export async function optionalAuth(req, res, next) {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        const currentUser = await User.findById(decoded.id);
        if (currentUser) {
          req.user = currentUser;
        }
      } catch (err) {
        // Token không hợp lệ, bỏ qua
      }
    }
    next();
  } catch (error) {
    next();
  }
}