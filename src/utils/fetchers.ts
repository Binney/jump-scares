import { createBrowserClient } from "@supabase/ssr";
import {
  Room,
  RoomWarning,
  WarningType,
  WarningWithWarningType,
  NewRoomWarning,
} from "@/types/database.types";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchRoom(id: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      "id, name, company, address, city, country, location, description, website_url, created_at, updated_at"
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Room;
}

export async function fetchWarnings(
  roomId: string
): Promise<WarningWithWarningType[]> {
  const { data, error } = await supabase
    .from("warning_types")
    .select(
      `
      id,
      name,
      description,
      room_warnings:room_warnings!inner (
        id,
        room_id,
        user_id,
        warning_type_id,
        severity,
        timestamp,
        description
      )
    `
    )
    .eq("room_warnings.room_id", roomId);

  if (error) throw error;
  return data as WarningWithWarningType[];
}

export async function insertRoom(args: {
  name: string;
  company: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  description?: string;
  website_url?: string;
}) {
  const { data: room, error } = await supabase
    .from("rooms")
    .insert([args])
    .select()
    .single();

  if (error) throw error;
  return room as Room;
}

export async function insertWarningType(args: {
  name: string;
  description?: string;
}) {
  const { data: warningType, error } = await supabase
    .from("warning_types")
    .insert([args])
    .select()
    .single();

  if (error) throw error;
  return warningType as WarningType;
}

export async function fetchTopRooms() {
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select(
      "id, name, company, address, city, country, location, description, website_url, created_at, updated_at"
    )
    .order("name")
    .limit(3);

  if (error) throw error;
  return rooms as Room[];
}

export async function createRoomWarning(args: NewRoomWarning) {
  const { data, error } = await supabase
    .from("room_warnings")
    .insert([args])
    .select();

  if (error) throw error;
  return data[0];
}

export async function fetchRoomsByCountry(country: string): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select(`
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
      updated_at
    `)
    .eq("country", country)
    .order("name");

  if (error) throw error;
  return data as Room[];
}
