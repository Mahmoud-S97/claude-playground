import { ApiError, request, sendJson } from './http'

export { ApiError }

export function signUp(username, password) {
  return sendJson('/api/auth/signup', 'POST', { username, password })
}

export function login(username, password) {
  return sendJson('/api/auth/login', 'POST', { username, password })
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' })
}

// Resolves to the signed-in user, or null when there's no valid session.
export async function getCurrentUser() {
  try {
    return await request('/api/auth/me')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}
