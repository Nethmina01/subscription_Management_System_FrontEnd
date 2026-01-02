'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function logout() {
      try {
        await api.post('/api/v1/auth/logout', {})
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout error:', error)
      } finally {
        router.push('/login')
        router.refresh()
      }
    }

    logout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">Signing out...</p>
      </div>
    </div>
  )
}

