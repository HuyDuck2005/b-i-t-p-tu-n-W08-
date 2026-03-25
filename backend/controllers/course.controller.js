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
    }
};