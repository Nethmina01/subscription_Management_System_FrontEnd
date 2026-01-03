'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiException } from '@/lib/api'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

  function validateEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  function getPasswordStrength(password: string): { strength: string; color: string } {
    if (password.length === 0) return { strength: '', color: '' }
    if (password.length < 6) return { strength: 'Weak', color: 'text-red-600 dark:text-red-400' }
    if (password.length < 10) return { strength: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' }
    return { strength: 'Strong', color: 'text-green-600 dark:text-green-400' }
  }

  const passwordStrength = getPasswordStrength(password)

  function handleNameChange(value: string) {
    setName(value)
    setNameError(null)
    setError(null)
    if (value.trim().length === 0 && value.length > 0) {
      setNameError('Name cannot be empty')
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value)
    setEmailError(null)
    setError(null)
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    setPasswordError(null)
    setError(null)
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
    } else if (confirmPassword) {
      setConfirmPasswordError(null)
    }
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value)
    setConfirmPasswordError(null)
    setError(null)
    if (password && value !== password) {
      setConfirmPasswordError('Passwords do not match')
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNameError(null)
    setEmailError(null)
    setPasswordError(null)
    setConfirmPasswordError(null)

    // Client-side validation
    if (!name.trim()) {
      setNameError('Name is required')
      setLoading(false)
      return
    }
    if (!email) {
      setEmailError('Email address is required')
      setLoading(false)
      return
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setLoading(false)
      return
    }
    if (!password) {
      setPasswordError('Password is required')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await api.post<any>('/api/v1/auth/sign-up', { name, email, password })

      const token = response.data?.token
      if (!token) {
        throw new Error('Authentication token missing')
      }

      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      let errorMessage = 'Registration failed'
      if (err instanceof ApiException) {
        errorMessage = err.message
        if (err.status === 409 || err.message.toLowerCase().includes('already exists')) {
          setEmailError('An account with this email already exists')
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    name.trim() &&
    email &&
    validateEmail(email) &&
    password &&
    password.length >= 6 &&
    confirmPassword &&
    password === confirmPassword &&
    !loading

  return (
    <div className="min-h-screen flex">
      {/* Left side - Value proposition (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 lg:relative lg:overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 max-w-lg mx-auto">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                Start managing your subscriptions
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Join thousands of users who are taking control of their recurring payments. Get started in seconds and never lose track of a subscription again.
              </p>
            </div>
            <div className="space-y-6 pt-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">Quick setup</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get started in under a minute</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">Never miss a renewal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get reminders before subscriptions renew</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">Track spending</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">See exactly where your money goes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo/Wordmark */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-block text-xl font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 rounded"
              aria-label="Home"
            >
              SaaS App
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start tracking and managing all your subscriptions in one place.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={() => {
                  if (!name.trim()) {
                    setNameError('Name is required')
                  }
                }}
                disabled={loading}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'name-error' : undefined}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  nameError
                    ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-gray-900 dark:focus:ring-gray-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="John Doe"
              />
              {nameError && (
                <p
                  id="name-error"
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {nameError}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={() => {
                  if (email && !validateEmail(email)) {
                    setEmailError('Please enter a valid email address')
                  }
                }}
                disabled={loading}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  emailError
                    ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-gray-900 dark:focus:ring-gray-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="you@example.com"
              />
              {emailError && (
                <p
                  id="email-error"
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => {
                    if (password && password.length < 6) {
                      setPasswordError('Password must be at least 6 characters long')
                    }
                  }}
                  disabled={loading}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : password ? 'password-strength' : undefined}
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    passwordError
                      ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-gray-900 dark:focus:ring-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 rounded p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a9.97 9.97 0 01.877-.878m0 0l4.242 4.242M7.29 7.29l4.242 4.242" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {password && passwordStrength.strength && (
                <p
                  id="password-strength"
                  className={`mt-1.5 text-xs font-medium ${passwordStrength.color}`}
                >
                  Password strength: {passwordStrength.strength}
                </p>
              )}
              {passwordError && (
                <p
                  id="password-error"
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!confirmPasswordError}
                  aria-describedby={confirmPasswordError ? 'confirm-password-error' : undefined}
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    confirmPasswordError
                      ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-100 focus:ring-gray-900 dark:focus:ring-gray-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 rounded p-1 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a9.97 9.97 0 01.877-.878m0 0l4.242 4.242M7.29 7.29l4.242 4.242" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p
                  id="confirm-password-error"
                  className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* General error message */}
            {error && !nameError && !emailError && !passwordError && !confirmPasswordError && (
              <div
                className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>

            {/* Sign in prompt */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-gray-900 dark:text-gray-100 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-100 rounded"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          {/* Security reassurance */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your data is encrypted and secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

