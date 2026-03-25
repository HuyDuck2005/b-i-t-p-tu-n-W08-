import crypto from "node:crypto";
import { createLogger } from "../logging/logger.js";

const REQUEST_ID_HEADER = "x-request-id";

const rootLogger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  base: {
    service: process.env.SERVICE_NAME || "todo-api",
    env: process.env.NODE_ENV || "development",
  },
});

export function requestContext() {
  return (req, res, next) => {
    const incoming = req.headers["x-request-id"];
    const requestId = (typeof incoming === "string" && incoming.trim()) || crypto.randomUUID();

    req.requestId = requestId;
    res.setHeader("x-request-id", requestId);

    // Gán logger riêng cho từng request để dễ truy vết
    req.log = rootLogger.child({ requestId });
    req._startAtNs = process.hrtime.bigint();

    next();
  };
}