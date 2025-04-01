-- Enable PostGIS for location-based queries
create extension if not exists postgis;

-- Create tables
create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  address text not null,
  city text not null,
  country text not null,
  latitude float not null,
  longitude float not null,
  location geometry(Point, 4326) generated always as (st_setsrid(st_makepoint(longitude, latitude), 4326)) stored,
  description text,
  website_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table warning_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating int check (rating between 1 and 5),
  review_text text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table review_warnings (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references reviews(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,
  warning_type_id uuid references warning_types(id) on delete cascade,
  severity int check (severity between 1 and 5),
  timestamp text,
  description text,
  created_at timestamp with time zone default now()
);

-- Create indexes for efficient querying
create index review_warnings_room_warning_idx on review_warnings(room_id, warning_type_id);
create index rooms_location_idx on rooms using btree (city, country);
create index rooms_geom_idx on rooms using gist(location);

-- Insert initial warning types
insert into warning_types (name, description) values
  ('Jump Scares', 'Sudden, startling events designed to frighten'),
  ('Loud Noises', 'Unexpected or sustained loud sounds'),
  ('Flashing Lights', 'Strobe effects or rapid light changes'),
  ('Darkness', 'Periods of complete or near-complete darkness'),
  ('Confined Spaces', 'Very small or cramped spaces'),
  ('Physical Activity', 'Climbing, crawling, or other physical demands'),
  ('Gore/Blood', 'Artificial blood or gore effects'),
  ('Actors', 'Live actors that interact with players'),
  ('Water Effects', 'Water or liquid effects'),
  ('Fog/Smoke', 'Artificial fog or smoke effects');

-- Enable Row Level Security (RLS)
alter table rooms enable row level security;
alter table warning_types enable row level security;
alter table reviews enable row level security;
alter table review_warnings enable row level security;

-- Create policies
-- Rooms: anyone can view, only authenticated users can insert
create policy "Rooms are viewable by everyone"
  on rooms for select
  to authenticated, anon
  using (true);

create policy "Authenticated users can create rooms"
  on rooms for insert
  to authenticated
  with check (true);

-- Warning types: anyone can view, only authenticated users can insert
create policy "Warning types are viewable by everyone"
  on warning_types for select
  to authenticated, anon
  using (true);

-- Reviews: anyone can view, authenticated users can create their own
create policy "Reviews are viewable by everyone"
  on reviews for select
  to authenticated, anon
  using (true);

create policy "Users can create their own reviews"
  on reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Review warnings: anyone can view, authenticated users can create with their reviews
create policy "Review warnings are viewable by everyone"
  on review_warnings for select
  to authenticated, anon
  using (true);

create policy "Users can create warnings for their reviews"
  on review_warnings for insert
  to authenticated
  with check (
    exists (
      select 1 from reviews
      where id = review_id
      and user_id = auth.uid()
    )
  );
