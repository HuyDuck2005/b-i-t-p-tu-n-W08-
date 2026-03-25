import express from 'express';
import courseController from '../controllers/course.controller.js';

const router = express.Router();

router.get('/', courseController.index);
router.get('/courses/new', courseController.create);
router.post('/courses/store', courseController.store);

export default router;