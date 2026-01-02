import { requireAuth, getCurrentUser } from '@/lib/auth'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import ProfileContent from '@/components/profile-content'

export default async function ProfilePage() {
  const user = await requireAuth()

  return (
    <ErrorBoundary>
      <ProfileContent user={user} />
    </ErrorBoundary>
  )
}

