import express from 'express';
import * as authController from '../controllers/auth-c.js';
import { protect } from '../middlewares/auth-mw.js';
import { validate } from '../middlewares/validate-mw.js';
import {
  signupSchema,
  loginSchema,
  refreshTokensSchema,
  logoutSchema
} from '../validators/auth-schema.js';

const router = express.Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "HUYDUCK"
 *               email:
 *                 type: string
 *                 example: "duck@umt.edu.vn"
 *               password:
 *                 type: string
 *                 example: "Duck@123"
 *               passwordConfirm:
 *                 type: string
 *                 example: "Duck@123"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post('/signup', validate(signupSchema), authController.signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "duck@umt.edu.vn"
 *               password:
 *                 type: string
 *                 example: "Duck@123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Làm mới Access Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Chuỗi refresh token
 *     responses:
 *       200:
 *         description: Cấp token mới thành công
 */
router.post('/refresh-token', validate(refreshTokensSchema), authController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng xuất
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.post('/logout', validate(logoutSchema), authController.logout);

/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng xuất khỏi TẤT CẢ thiết bị
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất toàn bộ thành công
 */
router.post('/logout-all', protect, authController.logoutAll);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Lấy thông tin cá nhân
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/me', protect, authController.me);

export default router;
