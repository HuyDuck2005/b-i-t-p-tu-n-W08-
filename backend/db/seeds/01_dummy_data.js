/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // 1. Xóa dữ liệu cũ (Xóa courses trước vì dính khóa ngoại)
  await knex('courses').del();
  await knex('instructors').del();

  // 2. Insert Instructors (Giữ nguyên ID để khớp với db.sql)
  await knex('instructors').insert([
    { instructor_id: 1, name: 'Yash Thakker', bio: 'Expert in AI-powered research and document analysis' },
    { instructor_id: 2, name: 'Scott Duffy', total_students: 1000000, bio: 'Renowned instructor with over 1 million students worldwide' },
    { instructor_id: 3, name: 'Tracey Barron', bio: 'Specialist in artificial intelligence and content creation' },
    { instructor_id: 4, name: 'DFA Course Academy', bio: 'Professional course creation academy' },
    { instructor_id: 5, name: 'Gopaluni Sai Karthik', bio: 'Google NotebookLM and AI tools expert' },
    { instructor_id: 6, name: 'Anton Voroniuk', bio: 'Productivity and AI research specialist' },
    { instructor_id: 7, name: 'Start-Tech Academy', bio: 'Leading technology education platform' }
  ]);

  // 3. Insert Courses
  await knex('courses').insert([
    {
      title: 'Complete Google NotebookLM Course 2025: Beginner to Pro',
      description: 'Unlock AI-Powered Research: Practical Guide to Document Analysis & Insights',
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      instructor_id: 1, rating: 4.7, total_reviews: 337, total_hours: 1.0, total_lectures: 11,
      level: 'All Levels', current_price: 279000, original_price: 399000, is_bestseller: false
    },
    {
      title: 'NotebookLM : Generative AI Interacting with Your Own Data',
      description: 'NotebookLM is an interactive AI playground for data analysis and machine learning from the Google Gemini team',
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      instructor_id: 2, rating: 4.3, total_reviews: 337, total_hours: 1.0, total_lectures: 15,
      level: 'Beginner', current_price: 279000, original_price: 399000, is_bestseller: true
    },
    {
      title: 'Google NotebookLM: Complete Beginners Guide',
      description: 'Use artificial intelligence to conduct research and create content',
      image_url: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&h=300&fit=crop',
      instructor_id: 3, rating: 4.4, total_reviews: 273, total_hours: 0.5, total_lectures: 6,
      level: 'Beginner', current_price: 279000, original_price: 399000, is_bestseller: false
    },
    {
      title: 'NotebookLM Masterclass: Transform Your Learning with AI',
      description: 'Learn NotebookLM From Start To Finish, Use AI To Create Podcasts, Analyze Documents, Manage Notes Easily with NotebookLM',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      instructor_id: 4, rating: 4.1, total_reviews: 166, total_hours: 7.0, total_lectures: 62,
      level: 'All Levels', current_price: 279000, original_price: 909000, is_bestseller: false
    },
    {
      title: 'Mastering Google NotebookLM: An AI-Powered Research Tool',
      description: 'Unlock the Power of AI for Smarter Research, Content Creation, and Productivity with Google NotebookLM',
      image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      instructor_id: 5, rating: 4.1, total_reviews: 134, total_hours: 1.0, total_lectures: 11,
      level: 'All Levels', current_price: 279000, original_price: 399000, is_bestseller: false
    },
    {
      title: 'NotebookLM Mastery: Organize, Analyze, and Optimize with AI',
      description: 'Master AI-Powered Research and Productivity with NotebookLM for Smarter Workflows and Better Insights',
      image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop',
      instructor_id: 6, rating: 4.4, total_reviews: 120, total_hours: 3.5, total_lectures: 36,
      level: 'All Levels', current_price: 279000, original_price: 699000, is_bestseller: false
    },
    {
      title: 'Google NotebookLM',
      description: 'Master Google NotebookLM: AI-Powered Research, Productivity Enhancement & Real-World Applications',
      image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      instructor_id: 7, rating: 4.5, total_reviews: 104, total_hours: 1.0, total_lectures: 12,
      level: 'All Levels', current_price: 279000, original_price: 399000, is_bestseller: false
    }
  ]);
}