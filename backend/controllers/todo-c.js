import * as todoService from '../services/todo-s.js';

/**
 * Lấy danh sách Todo (Hàm này tên là getAllTodos)
 */
export const getAllTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    // Gọi service
    const result = await todoService.listTodos({ userId, query: filters });

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết Todo
 */
export const getTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const todo = await todoService.getTodoById(id, userId);
    
    if (!todo) {
      return res.status(404).json({ message: 'Không tìm thấy công việc này' });
    }

    return res.status(200).json({
      status: 'success',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo mới Todo
 */
export const createTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = { ...req.body };

    const newTodo = await todoService.createTodo({ userId, data });
    return res.status(201).json({
      status: 'success',
      data: newTodo
    });
  } catch (error) {
    next(error);
  }
};