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
    .from('room_warnings')
    .select(`
      id,
      room_id,
      user_id,
      warning_type_id,
      severity,
      timestamp,
      description,
      created_at,
      warning_types (
        id,
        name,
        description
      )
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
