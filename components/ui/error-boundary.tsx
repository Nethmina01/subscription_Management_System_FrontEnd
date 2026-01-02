'use client'

import { Component, ReactNode } from 'react'
import { ApiException } from '@/lib/api'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error)
      }
      return <DefaultErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error }: { error: Error }) {
  const isApiError = error instanceof ApiException

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[400px] p-6"
      role="alert"
    >
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {isApiError
            ? error.message
            : 'An unexpected error occurred. Please try again later.'}
        </p>
        {isApiError && error.status === 401 && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            You may need to log in again.
          </p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}

