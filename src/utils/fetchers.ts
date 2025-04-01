import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function fetchRoom(id: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      id,
      name,
      company,
      address,
      city,
      country,
      website_url,
      description
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function fetchWarnings(roomId: string) {
  const { data, error } = await supabase
    .from('warning_types')
    .select(`
      name,
      description,
      room_warnings:room_warnings!inner (
        user_id,
        description,
        created_at
      )
    `)
    .eq('room_warnings.room_id', roomId)
  
  if (error) throw error
  return data
}
