'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { use } from 'react'
import { fetchRoom, fetchWarnings } from '@/utils/fetchers'
import { Room, RoomWarning } from '@/types/database.types'

type WarningWithWarningType = Omit<RoomWarning, 'warning_types'> & {
  warningName?: string;
  warningDescription?: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function RoomPage(props: PageProps) {
  const { id } = use(props.params)
  const { data: room, error: roomError } = useSWR<Room>(
    id,
    fetchRoom
  )
  const { data: warnings = [], error: warningsError } = useSWR<WarningWithWarningType[]>(
    id ? `warnings-${id}` : null,
    () => fetchWarnings(id).then(data => 
      data.map(warning => ({
        ...warning,
        warning_types: undefined,
        warningName: warning.warning_types?.name,
        warningDescription: warning.warning_types?.description,
      }))
    )
  )

  const isLoading = !room && !roomError
  const error = roomError || warningsError

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Room</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Room Not Found</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Room Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
          <p className="text-lg text-gray-600 mb-4">{room.company}</p>
          <div className="text-gray-500 space-y-1">
            <p>{room.address}</p>
            <p>{`${room.city}, ${room.country}`}</p>
          </div>
          {room.website_url && (
            <a
              href={room.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Visit Website
            </a>
          )}
          {room.description && (
            <p className="mt-4 text-gray-700">{room.description}</p>
          )}
        </div>

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Warnings</h2>
            <div className="space-y-4">
              {warnings.map((warning) => (
                <div
                  key={warning.id}
                  className="border-l-4 border-red-500 pl-4 py-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      {warning.warningName}
                    </h3>
                    <p>{warning.warningDescription}</p>
                    <span className="text-sm text-gray-500">
                      Severity: {warning.severity || "?"}/5
                    </span>
                  </div>
                  {warning.timestamp && (
                    <p className="text-sm text-gray-500">
                      Timestamp: {warning.timestamp}
                    </p>
                  )}
                  {warning.description && (
                    <p className="mt-1 text-gray-700">{warning.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
