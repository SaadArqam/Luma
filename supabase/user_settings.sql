-- Run this in the Supabase SQL Editor before using the migration banner dismissal

create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  migration_banner_dismissed boolean not null default false,
  updated_at timestamptz default now()
);
