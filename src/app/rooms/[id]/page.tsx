"use client";

import useSWR from "swr";
import { use } from "react";
import { fetchRoom, fetchWarnings } from "@/utils/fetchers";
import { Room, WarningWithWarningType } from "@/types/database.types";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import AddWarningForm from "@/components/Rooms/AddWarningForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function RoomPage(props: PageProps) {
  const { id } = use(props.params);
  const { data: room, error: roomError } = useSWR<Room>(id, fetchRoom, {
    revalidateOnFocus: false,
  });
  const { data: warnings = [], error: warningsError, mutate: mutateWarnings } = useSWR<
    WarningWithWarningType[]
  >(id ? `warnings-${id}` : null, () => fetchWarnings(id));
  const { user } = useAuth();

  const isLoading = !room && !roomError;
  const error = roomError || warningsError;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Room
          </h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Room Not Found
          </h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
              <p className="text-gray-600">
                {room.company} • {room.city}, {room.country}
              </p>
            </div>
            {user && (
              <Link
                href={`/rooms/${id}/edit`}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Room
              </Link>
            )}
          </div>

          {room.description && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{room.description}</p>
            </div>
          )}

          {room.website_url && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Website</h2>
              <a
                href={room.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {room.website_url}
              </a>
            </div>
          )}
        </div>

        {user && (
          <AddWarningForm 
            roomId={id} 
            onWarningAdded={() => {
              // Refresh the warnings list
              mutateWarnings();
            }} 
          />
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Warnings</h2>

          {warnings.map((warning) => (
            <div
              key={warning.id}
              className="border-l-4 border-red-500 pl-4 py-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{warning.name}</h3>
                <p>{warning.description}</p>
                <span className="text-sm text-gray-500">
                  Overall severity:{" "}
                  {warning.room_warnings.reduce<number>(
                    (acc, review) => acc + (review.severity || 0),
                    0
                  ) /
                    warning.room_warnings.filter(
                      (review) => review.severity !== null
                    ).length || "?"}
                  /5
                </span>
              </div>
              {warning.room_warnings.map((review, index: number) => (
                <p className="mt-1 text-gray-700" key={index}>
                  &ldquo;{review.description}&rdquo; {review.severity || "?"}/5
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
