import { Room } from '@/types/database.types';
import Link from 'next/link';
import React from 'react';

type Props = {
  room: Room
}

export default function RoomCard({ room }: Props) {
  return (
    <Link 
      href={`/rooms/${room.id}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
      <p className="text-gray-600 mb-2">{room.company}</p>
      <div className="text-sm text-gray-500">
        <p>{room.city}, {room.country}</p>
        {room.website_url && (
          <a 
            href={room.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Visit website
          </a>
        )}
      </div>
    </Link>
  )
}
