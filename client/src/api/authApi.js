const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function postJson(path, body) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Network request failed', 0)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Request failed', response.status)
  }

  return data
}

export function signUp(username, password) {
  return postJson('/api/auth/signup', { username, password })
}

export function login(username, password) {
  return postJson('/api/auth/login', { username, password })
}
