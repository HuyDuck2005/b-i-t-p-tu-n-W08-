import db from './db.js';

export default {
    // Hàm này dùng cho Sidebar (Đếm số lượng khóa học của từng GV)
    allInstructors: async () => {
        return await db('instructors')
            .select(
                'instructors.instructor_id',
                'instructors.name',
                'instructors.total_students',
                'instructors.bio'
            )
            .count('courses.course_id as total_courses')
            .leftJoin('courses', 'instructors.instructor_id', 'courses.instructor_id')
            .groupBy('instructors.instructor_id', 'instructors.name', 'instructors.total_students', 'instructors.bio')
            .orderBy('instructors.name', 'asc');
    },

    // Hàm đếm tổng số dòng (để tính số trang)
    count: async (instructorId) => {
        const query = db('courses');
        if (instructorId && instructorId !== 'all') {
            query.where('instructor_id', instructorId);
        }
        const result = await query.count('course_id as total').first();
        return parseInt(result.total);
    },

    // --- QUAN TRỌNG: Hàm lấy dữ liệu CÓ PHÂN TRANG ---
    page: async (limit, offset, instructorId) => {
        const query = db('courses')
            .join('instructors', 'courses.instructor_id', 'instructors.instructor_id')
            .select('courses.*', 'instructors.name as instructor_name')
            .orderBy('courses.created_at', 'desc'); // Sắp xếp mới nhất

        // Lọc theo giảng viên nếu có
        if (instructorId && instructorId !== 'all') {
            query.where('courses.instructor_id', instructorId);
        }
        
        // --- CHỖ NÀY QUYẾT ĐỊNH VIỆC CẮT DỮ LIỆU ---
        query.limit(limit).offset(offset);
        
        return await query;
    },

    add: async (course) => {
        return await db('courses').insert(course);
    },

    getById: async (id) => {
        return await db('courses')
            .join('instructors', 'courses.instructor_id', 'instructors.instructor_id')
            .select('courses.*', 'instructors.name as instructor_name')
            .where('courses.course_id', id)
            .first();
    },

    update: async (id, data) => {
        return await db('courses').where('course_id', id).update(data);
    },

    delete: async (id) => {
        return await db('courses').where('course_id', id).del();
    }
};