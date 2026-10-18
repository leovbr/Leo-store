-- LEOOSTORE Live Chat — jalankan sekali di Supabase SQL Editor.
-- Supabase Dashboard > Authentication > Providers > Anonymous Sign-Ins: ENABLED.
create extension if not exists pgcrypto;

create table if not exists public.store_chat_conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null default 'Customer LEOOSTORE',
  status text not null default 'open' check (status in ('open','pending','closed')),
  last_message text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.store_chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.store_chat_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('customer','admin')),
  body text not null check (char_length(body) between 1 and 1500),
  created_at timestamptz not null default now()
);
create index if not exists store_chat_conversations_customer_idx on public.store_chat_conversations(customer_id, last_message_at desc);
create index if not exists store_chat_messages_conversation_idx on public.store_chat_messages(conversation_id, created_at);

alter table public.store_chat_conversations enable row level security;
alter table public.store_chat_messages enable row level security;
grant select, insert, update on public.store_chat_conversations to authenticated;
grant select, insert on public.store_chat_messages to authenticated;

drop policy if exists "chat customer reads own conversation or admin reads all" on public.store_chat_conversations;
create policy "chat customer reads own conversation or admin reads all" on public.store_chat_conversations for select to authenticated
using (customer_id = auth.uid() or auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid);

drop policy if exists "chat customer creates own conversation" on public.store_chat_conversations;
create policy "chat customer creates own conversation" on public.store_chat_conversations for insert to authenticated
with check (customer_id = auth.uid() and status in ('open','pending'));

drop policy if exists "chat admin updates conversation" on public.store_chat_conversations;
create policy "chat admin updates conversation" on public.store_chat_conversations for update to authenticated
using (auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid)
with check (auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid);

drop policy if exists "chat participants read messages" on public.store_chat_messages;
create policy "chat participants read messages" on public.store_chat_messages for select to authenticated
using (
  exists (select 1 from public.store_chat_conversations c
    where c.id = conversation_id
      and (c.customer_id = auth.uid() or auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid))
);

drop policy if exists "chat customer sends own messages" on public.store_chat_messages;
create policy "chat customer sends own messages" on public.store_chat_messages for insert to authenticated
with check (
 sender_id = auth.uid() and sender_role = 'customer'
 and exists(select 1 from public.store_chat_conversations c where c.id=conversation_id and c.customer_id=auth.uid() and c.status <> 'closed')
);

drop policy if exists "chat admin sends replies" on public.store_chat_messages;
create policy "chat admin sends replies" on public.store_chat_messages for insert to authenticated
with check (
 auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid
 and sender_id = auth.uid() and sender_role = 'admin'
 and exists(select 1 from public.store_chat_conversations c where c.id=conversation_id)
);

-- Enable realtime delivery for chat tables.
do $$ begin
  alter publication supabase_realtime add table public.store_chat_conversations;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.store_chat_messages;
exception when duplicate_object then null; when undefined_object then null; end $$;


-- Keep inbox previews and sorting current whenever a message is sent.
create or replace function public.store_chat_touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.store_chat_conversations
     set last_message = left(new.body, 180),
         last_message_at = new.created_at,
         updated_at = now()
   where id = new.conversation_id;
  return new;
end;
$$;
drop trigger if exists store_chat_message_touch_conversation on public.store_chat_messages;
create trigger store_chat_message_touch_conversation
after insert on public.store_chat_messages
for each row execute function public.store_chat_touch_conversation();


-- Allow authenticated chat participants to upload media only under chat/<conversation-id>/<uploader-id>/...
-- Customer uploads are restricted to their own conversation. Admin may upload to a conversation folder.
drop policy if exists "chat participants upload chat media" on storage.objects;
create policy "chat participants upload chat media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'leo-store-images'
  and (storage.foldername(name))[1] = 'chat'
  and (
    (
      auth.uid() <> '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid
      and (storage.foldername(name))[3] = auth.uid()::text
      and exists (
        select 1 from public.store_chat_conversations c
        where c.id::text = (storage.foldername(name))[2]
          and c.customer_id = auth.uid()
          and c.status <> 'closed'
      )
    )
    or auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid
  )
);

