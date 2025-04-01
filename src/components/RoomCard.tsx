"use client";

import Link from "next/link";
import { Room } from "@/types/database.types";

export default function RoomCard({ room }: { room: Room }) {
  return (
    <Link href={`/rooms/${room.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
        <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{room.company}</p>
        <p className="text-gray-500 text-sm">
          {[room.city, room.country].filter(Boolean).join(", ")}
        </p>
        {room.description && (
          <p className="text-gray-600 mt-2 line-clamp-2">{room.description}</p>
        )}
      </div>
    </Link>
  );
}
