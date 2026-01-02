const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'

export class ApiException extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiException'
  }
}

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    let message = 'Request failed'
    try {
      // Try to get error message from response body
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json()
        // Backend error middleware returns { success: false, error: string }
        // Auth controller may return { message: string }
        message = error.error || error.message || message
        
        // If it's an array of messages (validation errors), join them
        if (Array.isArray(message)) {
          message = message.join(', ')
        }
      } else {
        // If not JSON, try to get text
        const text = await response.text()
        message = text || response.statusText || message
      }
    } catch (err) {
      // If we can't parse the response, use status text
      message = response.statusText || `HTTP ${response.status} Error`
      console.error('Failed to parse error response:', err)
    }
    throw new ApiException(message, response.status)
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
}
