'use client'

import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="mb-6">
          There was a problem with your authentication. This could be because:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>The authentication link has expired</li>
          <li>You&apos;ve already used this authentication link</li>
          <li>There was a problem with the authentication provider</li>
        </ul>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
