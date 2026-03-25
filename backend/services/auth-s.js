import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AppError from '../utils/app-error.js'; // Nhớ đảm bảo bạn có file này từ tuần 4
import User from '../models/user.js';
import RefreshToken from '../models/refresh-token.js';

// Constants cho token expiry
const ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS) || 7;

// Tạo Access Token (JWT)
const signAccessToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
};

// Tạo Refresh Token (Chuỗi ngẫu nhiên, an toàn hơn JWT cho token dài hạn)
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Hash refresh token để lưu vào DB
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Tạo cặp Access Token và Refresh Token
export async function generateTokenPair(userId, family = null) {
  const accessToken = signAccessToken(userId);
  const refreshToken = generateRefreshToken();
  const hashedRefreshToken = hashToken(refreshToken);

  // Nếu không có family, tạo mới (first login)
  // Nếu có family, sử dụng lại (token rotation)
  const tokenFamily = family || crypto.randomBytes(16).toString('hex');

  // Tính thời gian hết hạn của refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  // Lưu refresh token vào database
  await RefreshToken.create({
    user_id: userId,
    token: hashedRefreshToken,
    family: tokenFamily,
    expires_at: expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES,
  };
}

export async function signup(userData) {
  // Kiểm tra user đã tồn tại
  const existingUser = await User.findByEmail(userData.email);
  if (existingUser) {
    throw AppError.badRequest('USER_EXISTS', 'User with this email already exists');
  }
  delete userData.passwordConfirm;

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  // Tạo user mới
  const newUser = await User.create({ ...userData, password: hashedPassword });

  // Tạo token pair
  const tokens = await generateTokenPair(newUser.id);

  // Xóa password khỏi response
  delete newUser.password;

  return { user: newUser, ...tokens };
}

export async function login(email, password) {
  // Tìm user
  const user = await User.findByEmail(email);
  if (!user) {
    throw AppError.unauthorized('INVALID_CREDENTIALS', 'Incorrect email or password');
  }

  // Kiểm tra password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw AppError.unauthorized('INVALID_CREDENTIALS', 'Incorrect email or password');
  }

  // Tạo token pair
  const tokens = await generateTokenPair(user.id);

  // Xóa password khỏi response
  delete user.password;

  return { user, ...tokens };
}

/**
 * Refresh Token - Tạo access token mới từ refresh token
 * Implements Token Rotation: mỗi lần refresh sẽ tạo refresh token mới
 */
export async function refreshTokens(refreshToken) {
  const hashedToken = hashToken(refreshToken);

  // Tìm refresh token trong database
  const storedToken = await RefreshToken.findByToken(hashedToken);

  if (!storedToken) {
    // Token không tồn tại hoặc đã bị revoke -> Nghi vấn hack, xử lý Token Reuse
    try {
        await handleTokenReuse(refreshToken); // Gọi hàm kiểm tra Reuse
    } catch(err) {
        throw err;
    }
    throw AppError.unauthorized('INVALID_TOKEN', 'Invalid or expired refresh token');
  }

  // Kiểm tra token đã hết hạn chưa
  if (new Date(storedToken.expires_at) < new Date()) {
    await RefreshToken.revokeById(storedToken.id);
    throw AppError.unauthorized('TOKEN_EXPIRED', 'Refresh token has expired');
  }

  // Kiểm tra user vẫn tồn tại
  const user = await User.findById(storedToken.user_id);
  if (!user) {
    await RefreshToken.revokeFamily(storedToken.family);
    throw AppError.unauthorized('USER_NOT_FOUND', 'User no longer exists');
  }

  // Token Rotation: Thu hồi token cũ và tạo token mới trong cùng family
  await RefreshToken.revokeById(storedToken.id);

  // Tạo token pair mới với cùng family
  const tokens = await generateTokenPair(user.id, storedToken.family);

  // Xóa password khỏi response
  delete user.password;

  return { user, ...tokens };
}

// Logout - Thu hồi refresh token hiện tại
export async function logout(refreshToken) {
  if (!refreshToken) {
    return { message: 'Logged out successfully' };
  }
  const hashedToken = hashToken(refreshToken);
  await RefreshToken.revokeByToken(hashedToken);
  return { message: 'Logged out successfully' };
}

// Logout từ tất cả thiết bị - Thu hồi tất cả refresh tokens của user
export async function logoutAll(userId) {
  await RefreshToken.revokeAllByUserId(userId);
  return { message: 'Logged out from all devices successfully' };
}

export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'access') {
      throw AppError.unauthorized('INVALID_TOKEN', 'Invalid token type');
    }
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw AppError.unauthorized('TOKEN_EXPIRED', 'Access token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw AppError.unauthorized('INVALID_TOKEN', 'Invalid access token');
    }
    throw error;
  }
}

/**
 * Detect token reuse và revoke family
 * Gọi khi phát hiện refresh token đã bị revoke nhưng vẫn được sử dụng
 */
export async function handleTokenReuse(refreshToken) {
  const hashedToken = hashToken(refreshToken);
  
  // Tìm token (kể cả đã revoke)
  const token = await RefreshToken.findById(hashedToken); // Lưu ý: hàm này cần tìm bằng field 'token', nếu theo ID thì sẽ không đúng. Ở đây code mẫu bài bạn dùng findById, nhưng logic đúng là cần tìm record dựa trên hashedToken.
  
  // Sửa lại logic chuẩn: Tìm record bằng hashedToken (bỏ qua is_revoked)
  // Giả sử ta lấy trực tiếp:
  const tokenRecord = await db('refresh_tokens').where({ token: hashedToken }).first();

  if (tokenRecord) {
    // Revoke toàn bộ family - ngăn chặn attacker
    await RefreshToken.revokeFamily(tokenRecord.family);
  }
  
  throw AppError.unauthorized('TOKEN_REUSE', 'Token reuse detected. Please login again.');
}