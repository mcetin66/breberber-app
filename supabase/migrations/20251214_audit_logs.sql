-- Create audit_logs table
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  details jsonb default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.audit_logs enable row level security;

-- Policies
-- Admins can view all logs
create policy "Admins can view audit logs"
  on public.audit_logs
  for select
  using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Only service role or authenticated admins can insert
create policy "Admins can insert audit logs"
  on public.audit_logs
  for insert
  with check (auth.role() = 'authenticated');

-- Indexes for performance
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index if not exists audit_logs_action_idx on public.audit_logs(action);
