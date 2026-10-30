import i18n from '../i18n'

// `message` is already translated by the server; `code` is its stable key.
// status 0 / code null means the request never reached the server.
export class ApiError extends Error {
  constructor(message, status, code = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// Relative URLs: Vite proxies /api to the server in dev, so requests are
// same-origin and the httpOnly auth cookie goes along automatically.
export async function request(path, options = {}) {
  let response
  try {
    response = await fetch(path, {
      ...options,
      // The server replies with messages in this language.
      headers: { ...options.headers, 'Accept-Language': i18n.language },
    })
  } catch {
    throw new ApiError('Network request failed', 0)
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Request failed', response.status, data?.code ?? null)
  }

  return data
}

// Text to show for a failed request: the server's (already translated)
// message, or a local one when the server couldn't be reached at all.
export function getErrorMessage(error, t) {
  return error instanceof ApiError && error.status > 0 ? error.message : t('errors.network')
}

export function sendJson(path, method, body) {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
