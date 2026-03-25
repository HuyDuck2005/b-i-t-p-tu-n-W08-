import express from 'express';
import cors from 'cors';

// Import các Middleware hệ thống
import { requestContext } from './middlewares/request-context.js';
import { accessLogger } from './middlewares/access-logger.js';
import responseFormatter from './middlewares/response-mw.js';
import errorMW from './middlewares/error-mw.js';

// Import các Router
import userRouter from './routers/user.route.js';
import todoRouter from './routers/todo-r.js';
import courseApiRouter from './routers/course-api.route.js';

// Import Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger-config.js';
import authRouter from './routers/auth-r.js';

// Khởi tạo swagger-jsdoc
const specs = swaggerJsdoc(swaggerOptions);
const app = express();

// 1. Cấu hình cơ bản
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 2. Gài hệ thống Logging & Request Context
app.use(requestContext()); 
app.use(accessLogger());   

// 3. Định dạng Response trả về
app.use(responseFormatter());

// --- BƯỚC QUAN TRỌNG: ĐẶT SWAGGER TRƯỚC CÁC ROUTE VÀ ERROR HANDLER ---
// Thiết lập giao diện Swagger UI tại đường dẫn /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// Thêm một route phụ để gõ /docs cũng vào được cho tiện
app.get('/docs', (req, res) => res.redirect('/api-docs'));

// 4. Định nghĩa các tuyến đường (Routes)
app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter); 
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/courses', courseApiRouter);
// 5. Xử lý lỗi (LUÔN PHẢI ĐỂ CUỐI CÙNG)
app.use((req, res) => res.error({ message: `Đường dẫn ${req.originalUrl} không tồn tại` }, 404));
app.use(errorMW);

export default app;