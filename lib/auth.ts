import { api } from './api'
import { redirect } from 'next/navigation'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await api.get<User>('/api/v1/user/me')
    return user
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

