import courseModel from '../models/course.model.js';

export default {
    index: async (req, res) => {
        try {
            const instructorId = req.query.instructor_id || 'all';
            
            // --- CẤU HÌNH PHÂN TRANG ---
            const page = parseInt(req.query.page) || 1; 
            const limit = 3; // Giới hạn đúng 3 dòng
            const offset = (page - 1) * limit;

            // 1. Lấy tổng số dòng để tính số trang
            const total = await courseModel.count(instructorId);

            // 2. GỌI HÀM PAGE (Thay vì hàm all cũ)
            const listCourses = await courseModel.page(limit, offset, instructorId);
            
            // 3. Lấy danh sách Sidebar
            const listInstructors = await courseModel.allInstructors();

            // 4. Tính toán số trang
            const nPages = Math.ceil(total / limit);
            const pageNumbers = [];
            for (let i = 1; i <= nPages; i++) {
                pageNumbers.push({ value: i, isActive: i === page });
            }

            // 5. Text hiển thị: "Showing 1-3 of 7..."
            const start = total > 0 ? (page - 1) * limit + 1 : 0;
            const end = Math.min(page * limit, total);
            const showingText = `Showing ${start}-${end} of ${total} (page ${page}/${nPages})`;

            res.render('home', {
                courses: listCourses,
                instructors: listInstructors,
                selectedInstructor: instructorId,
                pagination: {
                    pageNumbers: pageNumbers,
                    page: page,
                    prev: page > 1 ? page - 1 : null,
                    next: page < nPages ? page + 1 : null,
                    can_go_prev: page > 1,
                    can_go_next: page < nPages
                },
                showingText: showingText,
                total: total
            });
        } catch (err) {
            console.error(err);
            res.status(500).render('500');
        }
    },

    create: async (req, res) => {
        const listInstructors = await courseModel.allInstructors();
        res.render('add', { instructors: listInstructors });
    },

    store: async (req, res) => {
        const entity = req.body;
        entity.is_bestseller = entity.is_bestseller === 'on';
        try {
            await courseModel.add(entity);
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Lỗi khi thêm dữ liệu');
        }
    },

    // API methods
    listCourses: async (req, res) => {
        try {
            const instructorId = req.query.instructor_id || 'all';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const total = await courseModel.count(instructorId);
            const courses = await courseModel.page(limit, offset, instructorId);

            res.status(200).json({
                status: 'success',
                data: {
                    items: courses,
                    meta: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    getCourse: async (req, res) => {
        try {
            const { id } = req.params;
            const course = await courseModel.getById(id);
            if (!course) {
                return res.status(404).json({ status: 'error', message: 'Course not found' });
            }
            res.status(200).json({ status: 'success', data: course });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    createCourse: async (req, res) => {
        try {
            const courseData = req.body;
            courseData.is_bestseller = courseData.is_bestseller || false;
            const [courseId] = await courseModel.add(courseData);
            const course = await courseModel.getById(courseId);
            res.status(201).json({ status: 'success', data: course });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    updateCourse: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            await courseModel.update(id, updateData);
            const course = await courseModel.getById(id);
            res.status(200).json({ status: 'success', data: course });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    deleteCourse: async (req, res) => {
        try {
            const { id } = req.params;
            await courseModel.delete(id);
            res.status(200).json({ status: 'success', message: 'Course deleted successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};