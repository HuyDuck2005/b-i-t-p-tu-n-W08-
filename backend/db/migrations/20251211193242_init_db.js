export function up(knex) {
  return knex.schema
    .createTable('instructors', (table) => {
      table.increments('instructor_id').primary();
      table.string('name').notNullable();
      table.integer('total_students').defaultTo(0);
      table.text('bio');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('courses', (table) => {
      table.increments('course_id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.string('image_url');
      table.integer('instructor_id').references('instructors.instructor_id').onDelete('CASCADE');
      table.decimal('rating', 3, 1).defaultTo(0);
      table.integer('total_reviews').defaultTo(0);
      table.decimal('total_hours', 5, 1);
      table.integer('total_lectures');
      table.string('level');
      table.decimal('current_price', 10, 2);
      table.decimal('original_price', 10, 2);
      table.boolean('is_bestseller').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('courses').dropTableIfExists('instructors');
}