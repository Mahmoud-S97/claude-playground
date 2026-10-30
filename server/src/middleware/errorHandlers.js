import { sendError } from "../utils/apiResponse.js";

// Mounted after every API router: any /api request that no route matched.
export function apiNotFound(req, res) {
  return sendError(req, res, 404, "ROUTE_NOT_FOUND", { method: req.method, path: req.originalUrl });
}

// Last-resort handler so errors are always JSON, never Express's HTML page
// (which also leaked stack traces). Express only treats it as an error handler
// because it declares all 4 arguments, so `next` stays even though it's unused.
export function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return sendError(req, res, 400, "INVALID_JSON");
  }
  if (err.type === "entity.too.large") {
    return sendError(req, res, 413, "BODY_TOO_LARGE");
  }

  console.error("Unhandled error:", err);
  return sendError(req, res, 500, "SERVER_ERROR");
}
