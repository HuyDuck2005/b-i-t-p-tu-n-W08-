// logging/logger.js
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

export function createLogger(options = {}) {
  const {
    level = process.env.LOG_LEVEL || "info",
    base = {},
    destination = process.stdout,
    maxDepth = 6,
  } = options;

  const minLevelValue = LEVELS[level] ?? LEVELS.info;

  function shouldLog(lv) {
    return (LEVELS[lv] ?? 999) >= minLevelValue;
  }

  function write(entry) {
    destination.write(JSON.stringify(entry) + "\n");
  }

  function log(lv, msg, meta = undefined) {
    if (!shouldLog(lv)) return;

    const time = new Date().toISOString();
    let safeMeta = meta;

    const entry = {
      time,
      level: lv,
      message: msg,
      ...base,
      ...(meta !== undefined ? { meta: safeMeta } : {}),
    };

    write(entry);
  }

  return {
    // Hàm child để tạo logger con kế thừa cấu hình cũ
    child(childBase = {}) {
      return createLogger({
        level,
        base: { ...base, ...childBase },
        destination,
        maxDepth,
      });
    },
    debug(meta, msg = "debug") {
      if (typeof meta === "string") return log("debug", meta);
      return log("debug", msg, meta);
    },
    info(meta, msg = "info") {
      if (typeof meta === "string") return log("info", meta);
      return log("info", msg, meta);
    },
    warn(meta, msg = "warn") {
      if (typeof meta === "string") return log("warn", meta);
      return log("warn", msg, meta);
    },
    error(meta, msg = "error") {
      if (typeof meta === "string") return log("error", meta);
      return log("error", msg, meta);
    },
  };
}