/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 1. Tạo bảng "users"
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // 2. Tạo bảng "todos"
  // Bao gồm: id, user_id, title, description, status, due_date, created_at, updated_at
  await knex.schema.createTable('todos', (table) => {
    table.increments('id').primary();
    
    // Khóa ngoại liên kết với bảng users
    table.integer('user_id').unsigned().notNullable()
         .references('id').inTable('users')
         .onDelete('CASCADE'); // Khi xóa user sẽ tự động xóa hết todo của user đó
    
    table.string('title').notNullable();
    table.text('description').nullable();
    
    // Trạng thái chỉ được là PENDING hoặc DONE, mặc định là PENDING
    table.enu('status', ['PENDING', 'DONE']).defaultTo('PENDING');
    
    // Ngày hết hạn (có thể để trống)
    table.date('due_date').nullable();
    
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Xóa bảng theo thứ tự ngược lại (xóa bảng có khóa ngoại trước)
  await knex.schema.dropTableIfExists('todos');
  await knex.schema.dropTableIfExists('users');
}