import { requireAuth } from '@/lib/auth'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import EditSubscriptionForm from '@/components/edit-subscription-form'
import { redirect } from 'next/navigation'

async function getSubscription(id: string, userId: string) {
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get('token')

  if (!tokenCookie) {
    redirect('/login')
  }

  // Get all user subscriptions and find the one with matching ID
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
    throw new Error('Failed to fetch subscription')
  }

  const json = await res.json()
  const subscriptions = json.data || []
  
  // Normalize subscription data and find the matching one
  const normalizedSubscriptions = subscriptions.map((sub: any) => ({
    ...sub,
    id: sub._id || sub.id,
    renewalDate: sub.renewaltDate || sub.renewalDate,
  }))
  
  const subscription = normalizedSubscriptions.find(
    (sub: any) => sub.id === id || sub._id === id
  )

  if (!subscription) {
    redirect('/subscriptions')
  }

  return subscription
}

export default async function EditSubscriptionPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireAuth()
  const subscription = await getSubscription(params.id, user.id)

  return (
    <ErrorBoundary>
      <EditSubscriptionForm subscription={subscription} />
    </ErrorBoundary>
  )
}

