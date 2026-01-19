
alter table public.fix_email enable row level security;
CREATE POLICY "fix_email_read" ON public.fix_email FOR SELECT USING (true);