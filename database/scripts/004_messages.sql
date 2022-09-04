DROP table IF EXISTS public.messages;

create table public.messages (
  message_id uuid unique not null primary key default uuid_generate_v4(),
  creator_id uuid references auth.users not null default auth.uid(),
  message varchar(400) not null,
  updated_at timestamp default CURRENT_TIMESTAMP not null
);

-- This trigger will set the "updated_at" column to the current timestamp for every update
create trigger messages_handle_updated_at before update on public.messages
  for each row execute procedure moddatetime (updated_at);

insert into public.messages (creator_id, message) values ('a66e306c-ed99-42a3-9667-9635e7294d7c', 'Test Message');

-- 2. Enable RLS
alter table public.messages
  enable row level security;

-- 3. Create Policy
create policy "Messages profiles are viewable by themselves."
  on public.messages for select using (
    auth.uid() = creator_id
);
