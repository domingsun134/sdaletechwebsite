-- Create a table for onboarding submissions
create table if not exists onboarding_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'submitted', -- submitted, reviewed, processed
  
  -- Grouped JSON columns for flexibility
  personal_details jsonb not null default '{}'::jsonb,
  family_details jsonb not null default '{}'::jsonb,
  contact_details jsonb not null default '{}'::jsonb,
  emergency_contacts jsonb not null default '[]'::jsonb,
  
  -- Optional: Link to an application if we know it (nullable)
  application_id uuid references applications(id) on delete set null
);

-- RLS Policies
alter table onboarding_submissions enable row level security;

-- Allow public insert (anyone with the link/form can submit)
create policy "Allow public inserts"
  on onboarding_submissions
  for insert
  with check (true);

-- Allow admins (service role) to read all
create policy "Allow service role read all"
  on onboarding_submissions
  for select
  using (true);

-- Allow admins to update
create policy "Allow service role update"
  on onboarding_submissions
  for update
  using (true);
