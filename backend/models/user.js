import db from '../db/db.js';
const TABLE_NAME = 'users';

export default {
  // Hàm tìm user theo ID (Quan trọng cho Middleware protect)
  findById: async (id) => {
    return db(TABLE_NAME).where({ id }).first();
  },

  // Hàm tìm user theo email (Dùng cho Login)
  findByEmail: async (email) => {
    return db(TABLE_NAME).where({ email }).first();
  },

  // Hàm tạo user mới
  create: async (data) => {
    const [newUser] = await db(TABLE_NAME).insert(data).returning('*');
    return newUser;
  }
};