-- Drop the old tables and their dependencies
drop table if exists review_warnings;
drop table if exists reviews;

-- Create the new warnings table
create table room_warnings (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  warning_type_id uuid references warning_types(id) on delete cascade,
  severity int check (severity between 1 and 5),
  timestamp text,
  description text,
  created_at timestamp with time zone default now(),
  unique(room_id, user_id, warning_type_id)
);

-- Create index for efficient querying
create index room_warnings_room_warning_idx on room_warnings(room_id, warning_type_id);

-- Enable row level security
alter table room_warnings enable row level security;

-- Create policies
-- Allow anyone to read warnings
create policy "Anyone can read room warnings"
  on room_warnings
  for select
  using (true);

-- Only allow users to insert their own warnings
create policy "Users can insert their own warnings"
  on room_warnings
  for insert
  with check (auth.uid() = user_id);

-- Only allow users to update their own warnings
create policy "Users can update their own warnings"
  on room_warnings
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Only allow users to delete their own warnings
create policy "Users can delete their own warnings"
  on room_warnings
  for delete
  using (auth.uid() = user_id);
