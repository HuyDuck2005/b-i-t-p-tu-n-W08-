/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Tạo bảng "refresh_tokens" để lưu trữ refresh tokens
  await knex.schema.createTable('refresh_tokens', (table) => {
    table.increments('id').primary();
    
    // Khóa ngoại liên kết với bảng users (Tự động xóa token nếu user bị xóa)
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.string('token', 512).notNullable().unique(); // Lưu Token đã được băm (Hashed token)
    table.string('family', 64).notNullable(); // Token family để phát hiện hành vi dùng lại (detect reuse)
    table.timestamp('expires_at').notNullable(); // Thời gian hết hạn của token
    table.boolean('is_revoked').defaultTo(false); // Đánh dấu token đã bị thu hồi hay chưa
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('revoked_at').nullable(); // Thời điểm bị thu hồi

    // Index để tìm kiếm nhanh trong DB
    table.index(['user_id', 'is_revoked']);
    table.index(['family']);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
}