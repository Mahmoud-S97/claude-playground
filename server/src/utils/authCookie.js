import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "auth_token";

const TOKEN_LIFETIME_SECONDS = 30 * 24 * 60 * 60;
// Sliding renewal: an authenticated request re-issues the token once it's
// this old, so anyone active at least once every 30 days stays logged in.
const RENEW_AFTER_SECONDS = 24 * 60 * 60;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function issueAuthCookie(res, userId) {
  const token = jwt.sign({ userId: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_LIFETIME_SECONDS,
  });
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: TOKEN_LIFETIME_SECONDS * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
}

export function shouldRenew(payload) {
  return Date.now() / 1000 - payload.iat > RENEW_AFTER_SECONDS;
}
