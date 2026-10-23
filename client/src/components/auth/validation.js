// Starts with a letter, then only letters/underscores, 7+ characters total.
export const USERNAME_PATTERN = /^[A-Za-z][A-Za-z_]{6,}$/

export function isValidPassword(password) {
  return password.length >= 6 && !/\s/.test(password)
}
