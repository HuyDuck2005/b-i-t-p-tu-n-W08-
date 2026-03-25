import db from '../db/db.js';
const TABLE_NAME = 'todos';
const dbInstance = db(TABLE_NAME);

// Hàm bổ trợ để lọc dữ liệu
function applyFilters(qb, { userId, status, q, dueFrom, dueTo, createdFrom, createdTo }) {
  qb.where("user_id", userId); // Chỉ lấy todo của chính mình

  if (status) qb.andWhere("status", status); // Lọc theo PENDING/DONE

  if (q) { // Tìm kiếm theo từ khóa trong tiêu đề hoặc mô tả
    qb.andWhere((inner) => {
      inner.whereRaw("title ILIKE ?", [`%${q}%`]).orWhereRaw("description ILIKE ?", [`%${q}%`]);
    });
  }

  // Lọc theo khoảng ngày
  if (dueFrom) qb.andWhere("due_date", ">=", dueFrom);
  if (dueTo) qb.andWhere("due_date", "<=", dueTo);
  if (createdFrom) qb.andWhere("created_at", ">=", createdFrom);
  if (createdTo) qb.andWhere("created_at", "<=", createdTo);
}

// Hàm bổ trợ để sắp xếp
function applySort(qb, sort) {
  const s = sort || "-created_at"; // Mặc định mới nhất lên đầu
  const desc = s.startsWith("-");
  const col = desc ? s.slice(1) : s;
  qb.orderBy(col, desc ? "desc" : "asc");
}

export default {
  // Tạo mới Todo
  create: async ({ userId, data }) => {
    const [newTodo] = await db(TABLE_NAME).insert({ ...data, user_id: userId }).returning('*');
    return newTodo;
  },

  // Tìm Todo theo ID và UserID (để bảo mật)
  findByIdAndUserId: async ({ id, userId }) => {
    return db(TABLE_NAME).where({ id, user_id: userId }).first();
  },

  // Cập nhật Todo
  update: async ({ id, data }) => {
    const [updatedTodo] = await db(TABLE_NAME).where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return updatedTodo;
  },

  // Xóa Todo
  delete: async (id) => db(TABLE_NAME).where({ id }).del(),

  // Phân trang kiểu Offset (Page 1, 2, 3...)
  listOffset: async ({ userId, filters, sort, fields, limit, offset }) => {
    const base = db(TABLE_NAME).clone().modify(applyFilters, { userId, ...filters });
    
    const [{ count }] = await base.clone().count({ count: "*" }); // Đếm tổng số để tính số trang
    const items = await base.clone().select(fields || ["*"]).modify(applySort, sort).limit(limit).offset(offset);
    
    return { items, total: Number(count) || 0 };
  }
};