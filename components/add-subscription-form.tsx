'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiException } from '@/lib/api'
import { ErrorMessage } from '@/components/ui/error-message'

export default function AddSubscriptionForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'Rs',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    category: '',
    paymentMethod: '',
    startDate: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Ensure all required fields are present and properly formatted
    // Define payload outside try block so it's accessible in catch block
    const payload = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      currency: formData.currency,
      frequency: formData.frequency, // Required for pre-save hook calculation
      category: formData.category,
      paymentMethod: formData.paymentMethod.trim(),
      startDate: new Date(formData.startDate).toISOString(), // Convert to ISO string for backend
    }

    try {
      // Backend returns { success, data: subscription }
      const response = await api.post<any>('/api/v1/subscription', payload)
      // Response is already handled by api.post, but we can access response.data if needed
      router.push('/subscriptions')
      router.refresh()
    } catch (err) {
      // Handle the case where subscription might have been created but workflow failed
      // The backend creates the subscription first, then tries to trigger workflow
      // If workflow fails, we get a 500 error but subscription is already saved
      if (err instanceof ApiException && err.status === 500) {
        console.warn('Subscription creation returned 500, checking if subscription was created...')
        
        // Wait a moment for the database to be updated
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Try to verify if the subscription was created by fetching user's subscriptions
        try {
          const user = await api.get<any>('/api/v1/user/me')
          const userId = user.data?._id || user.data?.id || user._id || user.id
          
          if (userId) {
            const subscriptionsRes = await api.get<any[]>(`/api/v1/subscription/user/${userId}`)
            const subscriptions = subscriptionsRes.data || subscriptionsRes
            
            // Check if a subscription with the same name and similar details was just created
            const justCreated = subscriptions.find(
              (sub: any) => {
                const nameMatch = sub.name === payload.name
                const priceMatch = Math.abs(sub.price - payload.price) < 0.01
                const createdRecently = sub.createdAt 
                  ? Math.abs(new Date(sub.createdAt).getTime() - Date.now()) < 10000
                  : true // If no createdAt, assume it's recent
                return nameMatch && priceMatch && createdRecently
              }
            )
            
            if (justCreated) {
              // Subscription was created successfully, workflow just failed
              console.log('Subscription created successfully, but workflow trigger failed')
              // Successfully created, redirect to subscriptions page
              router.push('/subscriptions')
              router.refresh()
              return
            }
          }
        } catch (verifyErr) {
          console.error('Failed to verify subscription creation:', verifyErr)
          // If verification fails, continue to show error
        }
      }
      
      // Extract error message from backend response if available
      let errorMessage = 'Failed to create subscription'
      if (err instanceof ApiException) {
        errorMessage = err.message
        console.error('Subscription creation error:', err.message, 'Status:', err.status)
      } else if (err instanceof Error) {
        errorMessage = err.message
        console.error('Subscription creation error:', err)
      } else {
        console.error('Unknown error:', err)
      }
      setError(new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section - Responsive */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Add Subscription
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Add a new subscription to track
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {error && <ErrorMessage error={error} className="mb-4 sm:mb-6" />}

          {/* Basic Information Card - Responsive */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              Basic Information
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subscription Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  placeholder="Netflix, Spotify, etc."
                  disabled={loading}
                />
              </div>

              {/* Price and Currency - Stack on mobile, side-by-side on tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="price" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    placeholder="9.99"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="currency" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    required
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                    disabled={loading}
                  >
                    <option value="Rs">Rs</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="frequency" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Billing Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  required
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly' })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  disabled={loading}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information Card - Responsive */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              Additional Information
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  <option value="sports">Sports</option>
                  <option value="news">News</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="politics">Politics</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <input
                  id="paymentMethod"
                  name="paymentMethod"
                  type="text"
                  required
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  placeholder="Credit Card, PayPal, etc."
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons - Stack on mobile, side-by-side on tablet+ */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Subscription'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

