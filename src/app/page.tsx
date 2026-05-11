"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { fetchTopRooms } from "@/utils/fetchers";
import RoomCard from "@/components/RoomCard";
import InlineLink from "@/components/InlineLink";

export default function Home() {
  const { user } = useAuth();
  const { data: topRooms = [] } = useSWR("top-rooms", fetchTopRooms, {
    revalidateOnFocus: false,
  });

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-semibold mb-4">&ldquo;Are there <span className="text-orange-500">jumpscares</span>?&rdquo;</h2>
        <p className="mb-4">
          Audience-sourced content advisory for escape rooms and live experiences.
        </p>
        <p className="mb-4 text-sm">
          (Also known as &ldquo;<InlineLink href="https://www.doesthedogdie.com/">Does The Dog Die?</InlineLink> but for escape rooms&rdquo;)
        </p>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recently rated</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRooms.length === 0 ? (
              <p className="text-gray-500">To follow</p>
            ) : (
              topRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            )}
          </div>
        </div>
        <div className="border-t border-gray-300 pt-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently viewed content advisory</h2>
          <p className="mb-4">
            To follow
          </p>
        </div>

        <div className="border-t border-gray-300 pt-8">
          <h2 className="text-2xl font-semibold mb-4">Popular accessibility information</h2>
          <p className="mb-4">
            To follow
          </p>
        </div>

        <div className="border-t border-gray-300 pt-8">
          <h2 id="about" className="text-2xl font-semibold mb-4">What is this?</h2>
          <p className="mb-4">
            <span className="font-semibold text-orange-500">jumpscares</span>{" "}
            is a crowd-sourced database of content advisory for escape rooms, immersive theatre and live experiences.
          </p>
          <p className="mb-4">
            We exist to make these experiences more accessible for everyone, whatever your needs.
          </p>
          <p className="mb-4">
            You can search only on a specific tag or warning, so you can find out if an experience is a good fit for you without seeing additional spoilers.
          </p>
          <p className="mb-4">
            We welcome contributions! You can rate an escape room or immersive experience against our existing list of trigger warnings and tags, or submit your own.
          </p>
        </div>

      </main>
    </div>
  );
}
