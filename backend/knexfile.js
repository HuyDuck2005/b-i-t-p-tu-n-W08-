import 'dotenv/config';

/**
 * Cấu hình Knex cho môi trường Docker PostgreSQL
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 54232,
      user: process.env.DB_USER || 'suser',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'mydb',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};