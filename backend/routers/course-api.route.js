import express from 'express';
import courseController from '../controllers/course.controller.js';
import { protect } from '../middlewares/auth-mw.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/v1/courses - List courses with pagination and filtering
router.get('/', courseController.listCourses);

// GET /api/v1/courses/:id - Get single course
router.get('/:id', courseController.getCourse);

// POST /api/v1/courses - Create new course
router.post('/', courseController.createCourse);

// PUT /api/v1/courses/:id - Update course
router.put('/:id', courseController.updateCourse);

// DELETE /api/v1/courses/:id - Delete course
router.delete('/:id', courseController.deleteCourse);

export default router;