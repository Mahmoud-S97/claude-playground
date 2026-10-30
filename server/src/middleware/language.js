import { resolveLanguage } from "../utils/messages.js";

// Sets req.lang ("en" | "ar") from the Accept-Language header the client sends.
export function detectLanguage(req, res, next) {
  req.lang = resolveLanguage(req.get("Accept-Language"));
  res.set("Content-Language", req.lang);
  res.vary("Accept-Language");
  next();
}
