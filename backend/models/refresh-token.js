// Nếu file kết nối DB của bạn nằm ở config/db.js thì nhớ sửa đường dẫn lại cho đúng nhé
import db from '../db/db.js';

const TABLE_NAME = 'refresh_tokens';
const dbInstance = db(TABLE_NAME);

export default {
  // Tạo mới một refresh token
  create: async (tokenData) => {
    const [newToken] = await dbInstance.clone().insert(tokenData).returning('*');
    return newToken;
  },

  // Tìm token theo chuỗi hashed token
  findByToken: async (hashedToken) => {
    return dbInstance.clone()
      .where({ token: hashedToken, is_revoked: false })
      .first();
  },

  // Tìm token theo id
  findById: async (id) => {
    return dbInstance.clone().where({ id }).first();
  },

  // Tìm tất cả tokens của một user
  findByUserId: async (userId) => {
    return dbInstance.clone()
      .where({ user_id: userId, is_revoked: false });
  },

  // Thu hồi một token theo id
  revokeById: async (id) => {
    return dbInstance.clone()
      .where({ id })
      .update({ is_revoked: true, revoked_at: new Date() });
  },

  // Thu hồi một token theo chuỗi hashed token
  revokeByToken: async (hashedToken) => {
    return dbInstance.clone()
      .where({ token: hashedToken })
      .update({ is_revoked: true, revoked_at: new Date() });
  },

  // Thu hồi tất cả tokens trong cùng một family
  revokeFamily: async (family) => {
    return dbInstance.clone()
      .where({ family })
      .update({ is_revoked: true, revoked_at: new Date() });
  },

  // Thu hồi tất cả tokens của một user (Dùng khi Logout All)
  revokeAllByUserId: async (userId) => {
    return dbInstance.clone()
      .where({ user_id: userId, is_revoked: false })
      .update({ is_revoked: true, revoked_at: new Date() });
  },

  // Xóa các tokens đã hết hạn
  deleteExpired: async () => {
    return dbInstance.clone()
      .where('expires_at', '<', new Date())
      .del();
  },

  // Kiểm tra token đã bị thu hồi chưa
  isRevoked: async (hashedToken) => {
    const token = await dbInstance.clone()
      .where({ token: hashedToken })
      .first();
    return token ? token.is_revoked : true;
  },

  // Đếm số lượng active tokens của user
  countActiveByUserId: async (userId) => {
    const result = await dbInstance.clone()
      .where({ user_id: userId, is_revoked: false })
      .where('expires_at', '>', new Date())
      .count('id as count')
      .first();
    return parseInt(result.count);
  }
};