'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/date-utils'
import { LoadingSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton'
import { ErrorMessage } from '@/components/ui/error-message'

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface ProfileContentProps {
  user: User
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function handleLogout() {
    setLoading(true)
    setError(null)

    try {
      await api.post('/api/v1/auth/logout', {})
      router.push('/login')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'))
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings
          </p>
        </div>

        {error && <ErrorMessage error={error} className="mb-6" />}

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account Information
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Account Created
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDate(user.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Notification Preferences
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Email reminder preferences will be available soon.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Coming soon: Customize when and how you receive subscription renewal reminders.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Actions
          </h2>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </span>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

