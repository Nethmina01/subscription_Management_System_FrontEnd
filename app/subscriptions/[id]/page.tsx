import { requireAuth } from '@/lib/auth'
import { api, ApiException } from '@/lib/api'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import SubscriptionDetails from '@/components/subscription-details'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

async function getSubscription(id: string) {
  try {
    const subscription = await api.get<any>(`/api/v1/subscription/${id}`)
    return subscription
  } catch (error) {
    if (error instanceof ApiException) {
      if (error.status === 401) {
        redirect('/login')
      }
      if (error.status === 404) {
        notFound()
      }
    }
    throw error
  }
}

export default async function SubscriptionDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAuth()
  const subscription = await getSubscription(params.id)

  return (
    <ErrorBoundary>
      <SubscriptionDetails subscription={subscription} />
    </ErrorBoundary>
  )
}

