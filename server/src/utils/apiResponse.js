import { translate } from "./messages.js";

// All API responses with a message go through these, so every one carries a
// stable `code` and a `message` in the requester's language (req.lang).

export function sendError(req, res, status, code, params) {
  return res.status(status).json({ code, message: translate(code, req.lang, params) });
}

export function sendSuccess(req, res, status, code, data = {}) {
  return res.status(status).json({ code, message: translate(code, req.lang), ...data });
}
