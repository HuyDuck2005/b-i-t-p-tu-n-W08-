import dotenv from 'dotenv/config';
import https from 'https';
import fs from 'fs';
import path from 'path';
import app from './app.js';
import db from './db/db.js';

const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Hàm đọc file chứng chỉ bảo mật
function readTlsOptions() {
  const keyPath = path.resolve(process.env.SSL_KEY_PATH);
  const certPath = path.resolve(process.env.SSL_CERT_PATH);
  
  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

// Tạo HTTPS Server
const httpsServer = https.createServer(readTlsOptions(), app);

async function startServer() {
  try {
    // Kiểm tra kết nối Database trước khi chạy server
    await db.raw('SELECT 1+1 AS result');
    console.log('Database connection established successfully.');

    // QUAN TRỌNG: Thêm '0.0.0.0' để Docker có thể truyền tín hiệu ra ngoài máy thật
    httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`HTTPS server listening on port ${HTTPS_PORT}`);
      console.log(`URL: https://localhost:${HTTPS_PORT}/api/v1`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Thoát nếu không kết nối được DB
  }
}

startServer();