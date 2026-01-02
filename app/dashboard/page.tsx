import { requireAuth } from '@/lib/auth'
import { api, ApiException } from '@/lib/api'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import DashboardContent from '@/components/dashboard-content'
import { redirect } from 'next/navigation'

async function getSubscriptions(userId: string) {
  try {
    const subscriptions = await api.get<any[]>(`/api/v1/subscription/${userId}`)
    return subscriptions
  } catch (error) {
    if (error instanceof ApiException && error.status === 401) {
      redirect('/login')
    }
    throw error
  }
}

export default async function DashboardPage() {
  const user = await requireAuth()
  const subscriptions = await getSubscriptions(user.id)

  return (
    <ErrorBoundary>
      <DashboardContent subscriptions={subscriptions} />
    </ErrorBoundary>
  )
}

