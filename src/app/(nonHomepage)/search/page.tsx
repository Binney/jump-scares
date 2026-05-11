"use client";

import { Room } from "@/types/database.types";
import RoomCard from "@/components/Rooms/RoomCard";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Search from "@/components/Search/searchForm";
import { createClient } from "@/lib/supabase/client";

const ITEMS_PER_PAGE = 12;
const supabase = createClient();

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const country = searchParams.get("country") || "";
  const [rooms, setRooms] = useState<Room[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [warningTypes, setWarningTypes] = useState<string[]>([]);
  const [debouncedWarningTypes, setDebouncedWarningTypes] = useState<string[]>([]);

  // Debounce warning type changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedWarningTypes(warningTypes);
    }, 300);

    return () => clearTimeout(timer);
  }, [warningTypes]);

  const fetchRooms = useCallback(async (page: number, country: string, search: string, excludedWarningTypes: string[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select(
          `
          id,
          name,
          company,
          address,
          city,
          country,
          location,
          description,
          website_url,
          created_at,
          updated_at,
          room_warnings:room_warnings!inner (
            warning_type_id
          )
        `
        )
        .order("name");

      if (error) throw error;

      let filteredData = data as Room[];

      // Apply search filter
      if (search) {
        filteredData = filteredData.filter((room: Room) =>
          room.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply country filter
      if (country) {
        filteredData = filteredData.filter(
          (room: Room) => room.country === country
        );
      }

      // Apply warning type filters
      if (excludedWarningTypes.length > 0) {
        filteredData = filteredData.filter((room: Room) => {
          const roomWarningTypes = room.room_warnings.map(
            (warning: { warning_type_id: string }) => warning.warning_type_id
          );
          return !excludedWarningTypes.some((warningType) =>
            roomWarningTypes.includes(warningType)
          );
        });
      }

      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginatedData = filteredData.slice(start, end);

      setRooms(paginatedData);
      setTotalCount(filteredData.length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms(page, country, search, debouncedWarningTypes);
  }, [fetchRooms, page, country, search, debouncedWarningTypes]);

  const handleSearch = useCallback(
    (search: string, country: string, excludedWarningTypes: string[]) => {
      // Update URL with search params
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (country) params.set("country", country);
      if (excludedWarningTypes.length > 0)
        params.set("excludedWarningTypes", excludedWarningTypes.join(","));
      params.set("page", "1"); // Reset to first page on new search
      router.push(`/search?${params.toString()}`);
    },
    [router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Find a room</h1>
      </div>

      <Search
        search={search}
        country={country}
        onSearchChanged={handleSearch}
        warningTypes={warningTypes}
        onWarningTypeChange={(warningTypeId) => {
          setWarningTypes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(warningTypeId)) {
              newSet.delete(warningTypeId);
            } else {
              newSet.add(warningTypeId);
            }
            return Array.from(newSet);
          });
        }}
      />

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-8">No rooms found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room: Room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      {rooms.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="mx-4 text-gray-600">
            Page {page} of {Math.ceil(totalCount / ITEMS_PER_PAGE)}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * ITEMS_PER_PAGE >= totalCount}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
