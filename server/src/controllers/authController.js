import bcrypt from "bcryptjs";
import User from "../models/User.js";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 6;

export async function signUp(req, res) {
  const username = req.body.username?.trim();
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username, password: hashedPassword });

    return res.status(201).json({
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Sign up failed:", error);
    return res.status(500).json({ message: "Something went wrong, please try again" });
  }
}

export async function logIn(req, res) {
  const username = req.body.username?.trim();
  const password = req.body.password;

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

    return res.status(200).json({
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Something went wrong, please try again" });
  }
}
