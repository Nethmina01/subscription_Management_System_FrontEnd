import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function LoadingSkeleton({ 
  className, 
  variant = 'rectangular' 
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <LoadingSkeleton className="h-6 w-3/4 mb-4" variant="text" />
      <LoadingSkeleton className="h-4 w-full mb-2" variant="text" />
      <LoadingSkeleton className="h-4 w-5/6" variant="text" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <LoadingSkeleton className="h-4 w-1/4" variant="text" />
          <LoadingSkeleton className="h-4 w-1/4" variant="text" />
          <LoadingSkeleton className="h-4 w-1/4" variant="text" />
          <LoadingSkeleton className="h-4 w-1/4" variant="text" />
        </div>
      ))}
    </div>
  )
}

