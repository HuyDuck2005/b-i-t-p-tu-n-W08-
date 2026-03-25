import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import AppError from '../utils/app-error.js';

export default {
  register: async (userData) => {
    const { email, password, name } = userData;

    if (!email || !password) {
      throw new AppError('Email và mật khẩu là bắt buộc', 400);
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) throw new AppError('Email đã tồn tại', 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await userModel.create({ name, email, password: hashedPassword });

    delete newUser.password;
    return newUser;
  },

  login: async (email, password) => {
    const user = await userModel.findByEmail(email);
    
    // Kiểm tra user và mật khẩu
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Email hoặc mật khẩu không chính xác', 401);
    }

    // SỬA LỖI DÒNG 27: Thêm giá trị dự phòng nếu file .env chưa có
    const secret = process.env.JWT_SECRET || 'CHƯA_CÓ_SECRET_KEY_MẶC_ĐỊNH';
    const expires = process.env.JWT_EXPIRES_IN || '1d'; 

    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: expires
    });

    delete user.password;
    // Đổi tên thành accessToken để khớp với Swagger chúng ta đã viết
    return { user, accessToken: token }; 
  }
};