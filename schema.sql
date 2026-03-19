-- ========================================
-- Enable UUID generator
-- ========================================
create extension if not exists "pgcrypto";


-- ========================================
-- Create bookings table
-- ========================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),

  name text not null
    check (length(trim(name)) > 0),

  email text not null
    check (
      length(trim(email)) > 0
      and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),

  service text not null
    check (
      service in (
        'Hair',
        'Hair Treatments & Color',
        'Lips & Brows',
        'Lashes & Eyes',
        'Facials & Spa',
        'Makeup'
      )
    ),

  package text not null
    check (
      package in (
        'Standard',
        'Enhanced',
        'Special / Occasion'
      )
    ),

  date date not null,
  time time not null,

  created_at timestamptz not null default now(),

  -- Prevent same service being booked at same date & time
  constraint unique_booking_slot
  unique (service, date, time)
);


-- ========================================
-- Performance Index (helps date queries)
-- ========================================
create index if not exists idx_bookings_date
on public.bookings(date);


-- ========================================
-- Enable Row Level Security
-- ========================================
alter table public.bookings
enable row level security;


-- ========================================
-- Allow public booking submissions
-- ========================================
drop policy if exists "Allow public insert" on public.bookings;

create policy "Allow public insert"
on public.bookings
for insert
to public
with check (true);