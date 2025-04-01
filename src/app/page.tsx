'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import React from 'react'

export default function Home() {
  const { user, supabase } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Jump Scares</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span>Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Welcome to Jump Scares</h2>
          <p className="mb-4">
            A community-driven site to help people find escape rooms that match their comfort level.
          </p>
          <div className="flex gap-4">
            <Link
              href="/rooms"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Browse Rooms
            </Link>
            {user && (
              <Link
                href="/rooms/new"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Room
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
