import { logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
  const start = Date.now();

   res.on("finish", () => {
    const duration = Date.now() - start;

    if (res.statusCode >= 500) {
      logger.error(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`);
    } else if (res.statusCode >= 400) {
      logger.warn(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`);
    } else {
      logger.info(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`);
    }
  });
  next();
};


export const errorHandler = (err, req, res, next) => {
  logger.error("API Error", {
    method: req.method,
    url: req.originalUrl,
    status: err.statusCode || 500,
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query
  });

  res.status(500).json({ success:false,message: "Internal Server Error" });
};
