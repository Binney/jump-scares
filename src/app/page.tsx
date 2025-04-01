"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { fetchTopRooms } from "@/utils/fetchers";
import RoomCard from "@/components/RoomCard";

export default function Home() {
  const { user } = useAuth();
  const { data: topRooms = [] } = useSWR("top-rooms", fetchTopRooms);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Welcome to jumpscares</h2>
          <p className="mb-4">
            We are a community-driven site to help people find escape rooms that
            match their comfort level.
          </p>
          <p className="mb-4">
            It&apos;s like Does The Dog Die, but for escape rooms.
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

        <div>
          <h2 className="text-2xl font-semibold mb-4">Top Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
