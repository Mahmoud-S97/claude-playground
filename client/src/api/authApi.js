export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Relative URLs: Vite proxies /api to the server in dev, so requests are
// same-origin and the httpOnly auth cookie goes along automatically.
async function request(path, options = {}) {
  let response
  try {
    response = await fetch(path, options)
  } catch {
    throw new ApiError('Network request failed', 0)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Request failed', response.status)
  }

  return data
}

function postJson(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function signUp(username, password) {
  return postJson('/api/auth/signup', { username, password })
}

export function login(username, password) {
  return postJson('/api/auth/login', { username, password })
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
