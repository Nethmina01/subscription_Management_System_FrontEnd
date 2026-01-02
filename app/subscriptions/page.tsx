import { requireAuth } from '@/lib/auth'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import SubscriptionsList from '@/components/subscriptions-list'
import { redirect } from 'next/navigation'

async function getSubscriptions(userId: string) {
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get('token')

  if (!tokenCookie) {
    redirect('/login')
  }

  // Backend endpoint is /api/v1/subscription/user/:id
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'}/api/v1/subscription/user/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${tokenCookie.value}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    if (res.status === 401) {
      redirect('/login')
    }
    throw new Error('Failed to fetch subscriptions')
  }

  const json = await res.json()
  // Backend returns { success, data: subscriptions }
  const subscriptions = json.data || []
  
  // Normalize subscription data: map _id to id, and handle renewaltDate typo
  return subscriptions.map((sub: any) => ({
    ...sub,
    id: sub._id || sub.id,
    renewalDate: sub.renewaltDate || sub.renewalDate, // Handle backend typo
  }))
}

export default async function SubscriptionsPage() {
  const user = await requireAuth()
  // Use id since requireAuth() normalizes _id to id
  const subscriptions = await getSubscriptions(user.id)

  return (
    <ErrorBoundary>
      <SubscriptionsList subscriptions={subscriptions} />
    </ErrorBoundary>
  )
}

