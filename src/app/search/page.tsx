'use client'

import { createClient } from '@/utils/supabase/client'
import { Room } from '@/types/database.types'
import RoomCard from '@/components/Rooms/RoomCard'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

const ITEMS_PER_PAGE = 12

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  
  const supabase = createClient()

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    try {
      // Build query
      let query = supabase
        .from('rooms')
        .select('*', { count: 'exact' })
        
      // Add search if present
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }
      
      // Add pagination
      const start = (page - 1) * ITEMS_PER_PAGE
      query = query
        .range(start, start + ITEMS_PER_PAGE - 1)
        .order('name')

      const { data, count, error } = await query

      if (error) throw error
      
      setRooms(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, page, search])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchTerm = formData.get('search') as string
    
    // Update URL with search params
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    params.set('page', '1') // Reset to first page on new search
    router.push(`/rooms?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Find a room</h1>
        {user && (
          <div className="space-x-4">
            <Link
              href="/rooms/add"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Room
            </Link>
          </div>
        )}
      </div>
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search rooms..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Results count */}
          <p className="mb-4 text-gray-600">
            {totalCount} room{totalCount !== 1 ? 's' : ''} found
          </p>

          {/* Grid of rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.set('page', (page - 1).toString())
                    router.push(`/rooms?${params.toString()}`)
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Previous
                </button>
              )}
              
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              
              {page < totalPages && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.set('page', (page + 1).toString())
                    router.push(`/rooms?${params.toString()}`)
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
