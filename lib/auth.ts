import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface User {
  id: string
  _id?: string // MongoDB uses _id, but we normalize it to id
  name: string
  email: string
  createdAt: string
}

/**
 * Get current user without redirecting
 * Returns null if user is not authenticated
 * Used when you want to check auth status without forcing a redirect
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get('token')
  
  if (!tokenCookie) {
    return null
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'}/api/v1/user/me`,
      {
        headers: {
          'Authorization': `Bearer ${tokenCookie.value}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      return null
    }

    const json = await res.json()

    // 🔥 IMPORTANT: backend returns { success, data }
    const user = json.data
    
    // Normalize user data: ensure id field exists
    return {
      ...user,
      id: user._id || user.id,
    } as User
  } catch {
    return null
  }
}

/**
 * Server-only auth guard
 * Used in Server Components (Dashboard, Layouts, etc.)
 * Redirects to /login if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  // Get token from cookies (if stored as cookie) or we'll need to use a different approach
  // Since backend uses Bearer token, we need to get it from somewhere
  // For server components, we can't access localStorage, so we'll use a cookie-based approach
  // But the backend expects Bearer token, so we need to check if token is in cookies
  
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get('token')
  
  // Try to get token from cookie first, if not available, we'll need to redirect to login
  if (!tokenCookie) {
    redirect('/login')
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'}/api/v1/user/me`,
    {
      headers: {
        'Authorization': `Bearer ${tokenCookie.value}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    redirect('/login')
  }

  const json = await res.json()

  // 🔥 IMPORTANT: backend returns { success, data }
  const user = json.data
  
  // Normalize user data: ensure id field exists
  return {
    ...user,
    id: user._id || user.id,
  } as User
}
