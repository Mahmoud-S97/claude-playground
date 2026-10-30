import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from "../utils/apiResponse.js";
import { AUTH_COOKIE_NAME, issueAuthCookie, shouldRenew } from "../utils/authCookie.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    return sendError(req, res, 401, "AUTH_NOT_AUTHENTICATED");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return sendError(req, res, 401, "AUTH_NOT_AUTHENTICATED");
  }

  try {
    const user = await User.findById(payload.userId);
    if (!user) {
      return sendError(req, res, 401, "AUTH_NOT_AUTHENTICATED");
    }

    if (shouldRenew(payload)) {
      issueAuthCookie(res, user._id);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}
