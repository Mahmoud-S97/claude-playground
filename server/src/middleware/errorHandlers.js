// Mounted after every API router: any /api request that no route matched.
export function apiNotFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Last-resort handler so errors are always JSON, never Express's HTML page
// (which also leaked stack traces). Express only treats it as an error handler
// because it declares all 4 arguments, so `next` stays even though it's unused.
export function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Something went wrong, please try again" });
}
