CREATE TABLE IF NOT EXISTS todos (
  id bigint generated by default as identity primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table todos enable row level security;

-- Create a policy that allows all operations (optional, depending on your security needs)
create policy "Allow public access to todos" on todos for all using (true); 