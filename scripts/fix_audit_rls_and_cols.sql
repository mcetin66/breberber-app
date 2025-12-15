-- Add user_id column if not exists (in case migration used admin_id)
alter table public.audit_logs add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Drop restrictive policy
drop policy if exists "Enable insert for authenticated users on audit_logs" on public.audit_logs;
drop policy if exists "Admins can insert audit logs" on public.audit_logs;

-- Create permissive policy for INSERT
create policy "Allow authenticated insert on audit_logs"
  on public.audit_logs
  for insert
  with check (auth.role() = 'authenticated');

-- Create permissive policy for SELECT (for dev/debug)
create policy "Allow authenticated select on audit_logs"
  on public.audit_logs
  for select
  using (auth.role() = 'authenticated');

