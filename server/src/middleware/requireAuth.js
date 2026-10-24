import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AUTH_COOKIE_NAME, issueAuthCookie, shouldRenew } from "../utils/authCookie.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
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
