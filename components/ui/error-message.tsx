'use client'

import { ApiException } from '@/lib/api'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  error: Error | ApiException | unknown
  className?: string
}

function AlertIcon() {
  return (
    <svg
      className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  )
}

export function ErrorMessage({ error, className }: ErrorMessageProps) {
  let message = 'An unexpected error occurred'
  let status: number | undefined

  if (error instanceof ApiException) {
    message = error.message
    status = error.status
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <AlertIcon />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
          Error
        </h3>
        <p className="text-sm text-red-700 dark:text-red-400">
          {message}
        </p>
        {status && (
          <p className="text-xs text-red-600 dark:text-red-500 mt-1">
            Status code: {status}
          </p>
        )}
      </div>
    </div>
  )
}

