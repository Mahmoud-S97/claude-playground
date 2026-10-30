import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { clearAuthCookie, issueAuthCookie } from "../utils/authCookie.js";
import { isValidPassword, USERNAME_PATTERN } from "../utils/validation.js";

const SALT_ROUNDS = 10;

function toPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    createdAt: user.createdAt,
  };
}

export async function signUp(req, res) {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return sendError(req, res, 400, "AUTH_FIELDS_REQUIRED");
  }
  if (!USERNAME_PATTERN.test(username)) {
    return sendError(req, res, 400, "AUTH_USERNAME_INVALID");
  }
  if (!isValidPassword(password)) {
    return sendError(req, res, 400, "AUTH_PASSWORD_INVALID");
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendError(req, res, 409, "AUTH_USERNAME_TAKEN");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username, password: hashedPassword });

    issueAuthCookie(res, user._id);
    return sendSuccess(req, res, 201, "AUTH_SIGNED_UP", { user: toPublicUser(user) });
  } catch (error) {
    console.error("Sign up failed:", error);
    return sendError(req, res, 500, "SERVER_ERROR");
  }
}

export async function logIn(req, res) {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return sendError(req, res, 400, "AUTH_FIELDS_REQUIRED");
  }

  try {
    const user = await User.findOne({ username }).select("+password");
    // Same message for unknown user and wrong password, so usernames can't be probed.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendError(req, res, 401, "AUTH_INVALID_CREDENTIALS");
    }

    issueAuthCookie(res, user._id);
    return sendSuccess(req, res, 200, "AUTH_LOGGED_IN", { user: toPublicUser(user) });
  } catch (error) {
    console.error("Login failed:", error);
    return sendError(req, res, 500, "SERVER_ERROR");
  }
}

// A plain read: returns just the user, no message.
export function getMe(req, res) {
  return res.status(200).json(toPublicUser(req.user));
}

export function logOut(req, res) {
  clearAuthCookie(res);
  return sendSuccess(req, res, 200, "AUTH_LOGGED_OUT");
}
