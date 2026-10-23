const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function signUp(username, password) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
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
