'use client'

import { cn } from '@/lib/utils'

export type Status = 'active' | 'expired' | 'pending' | 'inactive' | 'cancelled'

interface StatusBadgeProps {
  status: Status | string | undefined
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  expired: {
    label: 'Expired',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Handle undefined or unknown status values
  const normalizedStatus = status || 'inactive'
  const config = statusConfig[normalizedStatus] || statusConfig.inactive

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  )
}

