import bcrypt from "bcryptjs";
import User from "../models/User.js";
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
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!USERNAME_PATTERN.test(username)) {
    return res.status(400).json({
      message:
        "Username must start with a letter and contain only letters, numbers, or underscores (7–25 characters)",
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Password must be 6–25 characters, with no spaces" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username, password: hashedPassword });

    issueAuthCookie(res, user._id);
    return res.status(201).json(toPublicUser(user));
  } catch (error) {
    console.error("Sign up failed:", error);
    return res.status(500).json({ message: "Something went wrong, please try again" });
  }
}

export async function logIn(req, res) {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    issueAuthCookie(res, user._id);
    return res.status(200).json(toPublicUser(user));
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Something went wrong, please try again" });
  }
}

export function getMe(req, res) {
  return res.status(200).json(toPublicUser(req.user));
}

export function logOut(req, res) {
  clearAuthCookie(res);
  return res.status(204).end();
}
