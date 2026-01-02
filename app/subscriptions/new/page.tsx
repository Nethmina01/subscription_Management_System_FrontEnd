import { requireAuth } from '@/lib/auth'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import AddSubscriptionForm from '@/components/add-subscription-form'

export default async function AddSubscriptionPage() {
  await requireAuth()

  return (
    <ErrorBoundary>
      <AddSubscriptionForm />
    </ErrorBoundary>
  )
}

