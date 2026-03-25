// middlewares/access-logger.js

/**
 * Hàm tính toán thời gian xử lý request (miliseconds)
 * @param {Object} req 
 * @returns {number|undefined}
 */
function durationMs(req) {
  if (!req._startAtNs) return undefined;
  // Tính khoảng cách thời gian từ lúc bắt đầu (trong request-context) đến khi kết thúc
  const durationNs = process.hrtime.bigint() - req._startAtNs;
  return Number(durationNs / 1_000_000n); // Chuyển đổi từ nanoseconds sang miliseconds
}

/**
 * Hàm lọc các request không cần ghi log (ví dụ: OPTIONS hoặc file tĩnh)
 */
function shouldLog({ req, statusCode, dMs }) {
  if (req.method === "OPTIONS") return false;
  return true;
}

/**
 * Middleware ghi nhật ký truy cập (Access Logger)
 */
export function accessLogger() {
  return (req, res, next) => {
    // Lắng nghe sự kiện khi request kết thúc thành công hoặc thất bại
    res.on("finish", () => {
      const statusCode = res.statusCode || 0;
      const dMs = durationMs(req);

      // Kiểm tra xem request này có nằm trong danh sách cần ghi log không
      if (!shouldLog({ req, statusCode, dMs })) return;

      const entry = {
        type: "access",
        requestId: req.requestId, // Lấy requestId từ middleware request-context
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode,
        durationMs: dMs,
      };

      // Sử dụng logger đã được gắn vào req để ghi log
      if (req.log) {
        if (statusCode >= 500) {
          req.log.error(entry, "HTTP request failed");
        } else if (statusCode >= 400) {
          req.log.warn(entry, "HTTP request rejected");
        } else {
          req.log.info(entry, "HTTP request completed");
        }
      }
    });

    next();
  };
}