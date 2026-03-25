import express from 'express';
import * as todoController from '../controllers/todo-c.js';
import { protect } from '../middlewares/auth-mw.js';
import { validate } from '../middlewares/validate-mw.js';
import { todoIdParamSchema, updateTodoSchema } from '../validators/todo-schema.js';

const router = express.Router();

/**
 * @openapi
 * /todos/health:
 *   get:
 *     tags:
 *       - Todos
 *     summary: Health Check
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', (req, res) => {
  return res.status(200).json({ status: 'Todo router is healthy!' });
});

router.use(protect);

/**
 * @openapi
 * /todos:
 *   get:
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     summary: Lấy danh sách
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 */
router.get('/', todoController.getAllTodos);

/**
 * @openapi
 * /todos/{id}:
 *   get:
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     summary: Lấy chi tiết
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Không tìm thấy công việc
 */
router.get(
  '/:id',
  validate(todoIdParamSchema, 'params'),
  todoController.getTodo
);
/**
 * @openapi
 * /todos:
 *   post:
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     summary: Tạo Todo mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Làm bài tập Web"
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, DONE]
 *                 default: PENDING
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
router.post('/', todoController.createTodo);

/**
 * @openapi
 * /todos/{id}:
 *   put:
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     summary: Cập nhật Todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Làm bài tập Web"
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, DONE]
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
router.put(
  '/:id',
  validate(todoIdParamSchema, 'params'),
  validate(updateTodoSchema, 'body'),
  todoController.updateTodo
);

/**
 * @openapi
 * /todos/{id}:
 *   delete:
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     summary: Xóa Todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete(
  '/:id',
  validate(todoIdParamSchema, 'params'),
  todoController.deleteTodo
);

export default router;
