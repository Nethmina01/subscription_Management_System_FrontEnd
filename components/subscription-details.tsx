'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate, formatDateTime } from '@/lib/date-utils'
import { StatusBadge } from '@/components/ui/status-badge'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { ErrorMessage } from '@/components/ui/error-message'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import { api, ApiException } from '@/lib/api'

interface Subscription {
  id: string
  name: string
  price: number
  currency: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  renewalDate?: string | null
  status: 'active' | 'expired' | 'pending' | 'inactive' | 'cancelled'
  category?: string
  paymentMethod?: string
  startDate?: string
  nextReminderDate?: string
}

interface SubscriptionDetailsProps {
  subscription: Subscription
}

export default function SubscriptionDetails({ subscription }: SubscriptionDetailsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <LoadingSkeleton className="h-8 w-64 mb-6" />
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <LoadingSkeleton className="h-4 w-full mb-4" />
            <LoadingSkeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage error={error} />
      </div>
    )
  }

  // Calculate next reminder dates (7, 5, 2, 1 days before renewal)
  const renewalDate = subscription.renewalDate ? new Date(subscription.renewalDate) : null
  const reminderDates = renewalDate && !isNaN(renewalDate.getTime())
    ? [7, 5, 2, 1].map((days) => {
        const date = new Date(renewalDate)
        date.setDate(date.getDate() - days)
        return { days, date }
      }).filter(({ date }) => date > new Date())
    : []

  async function handleDelete() {
    setDeleting(true)
    setError(null)

    try {
      // Backend endpoint: DELETE /api/v1/subscription/:id
      await api.delete(`/api/v1/subscription/${subscription.id}`)
      router.push('/subscriptions')
      router.refresh()
    } catch (err) {
      let errorMessage = 'Failed to delete subscription'
      if (err instanceof ApiException) {
        errorMessage = err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(new Error(errorMessage))
      setShowDeleteDialog(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {subscription.name}
            </h1>
            <StatusBadge status={subscription.status} />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/subscriptions/${subscription.id}/edit`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading || deleting}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
            <Link
              href="/subscriptions"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Subscription Details
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Price
              </dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {subscription.currency} {subscription.price} / {subscription.frequency}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Billing Frequency
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 capitalize">
                {subscription.frequency}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Renewal Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDate(subscription.renewalDate)}
              </dd>
            </div>
            {subscription.category && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Category
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {subscription.category}
                </dd>
              </div>
            )}
            {subscription.paymentMethod && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Payment Method
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {subscription.paymentMethod}
                </dd>
              </div>
            )}
            {subscription.startDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Start Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(subscription.startDate)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Reminder Information
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Email reminders are sent 7, 5, 2, and 1 day before renewal.
          </p>
          {reminderDates.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Upcoming Reminders:
              </p>
              {reminderDates.map(({ days, date }) => (
                <div
                  key={days}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {days} day{days !== 1 ? 's' : ''} before renewal
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              No upcoming reminders. The renewal date has passed or is within 1 day.
            </p>
          )}
          {subscription.nextReminderDate && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                Next Reminder
              </p>
              <p className="text-sm text-blue-900 dark:text-blue-200">
                {formatDateTime(subscription.nextReminderDate)}
              </p>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Subscription"
        message="Are you sure you want to delete this subscription? This action cannot be undone."
        itemName={subscription.name}
        loading={deleting}
      />
    </div>
  )
}

