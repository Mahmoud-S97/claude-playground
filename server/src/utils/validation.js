// Keep in sync with client/src/components/auth/validation.js.
export const MAX_FIELD_LENGTH = 25;

// Starts with a letter, then letters/digits/underscores, 7–25 characters total.
export const USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{6,24}$/;

export function isValidPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 6 &&
    password.length <= MAX_FIELD_LENGTH &&
    !/\s/.test(password)
  );
}
