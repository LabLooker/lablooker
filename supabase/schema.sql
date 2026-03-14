-- profiles (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  stripe_customer_id text,
  plan text default 'free', -- free | pro | business
  plan_status text default 'active', -- active | canceled | past_due
  trial_ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Run in Supabase SQL editor:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Enable RLS
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- LabLooker domain tables
-- ============================================================

-- tests: the core lab test catalog
create table tests (
  id uuid primary key default gen_random_uuid(),
  test_name text not null,
  description text,
  cpt_codes text[] not null default '{}',
  category text,
  fasting_required boolean not null default false,
  turnaround text,
  related_tests uuid[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_tests_name on tests using gin (to_tsvector('english', test_name));

-- labs: lab companies and intermediaries
create table labs (
  id uuid primary key default gen_random_uuid(),
  lab_name text not null,
  website text,
  ordering_type text not null check (ordering_type in ('direct', 'intermediary', 'at_home', 'regional')),
  uses_network text,
  affiliate_link text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- pricing: self-pay prices per test per lab
create table pricing (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references tests(id) on delete cascade,
  lab_id uuid not null references labs(id) on delete cascade,
  price numeric(10,2) not null,
  requires_rx boolean not null default false,
  last_updated timestamptz default now(),
  created_at timestamptz default now(),
  unique (test_id, lab_id)
);

create index idx_pricing_test on pricing(test_id);
create index idx_pricing_lab on pricing(lab_id);

-- icd10_codes: diagnosis codes
create table icd10_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null,
  created_at timestamptz default now()
);

-- test_icd10_codes: many-to-many link between tests and ICD-10 codes
create table test_icd10_codes (
  test_id uuid not null references tests(id) on delete cascade,
  icd10_code_id uuid not null references icd10_codes(id) on delete cascade,
  primary key (test_id, icd10_code_id)
);

-- states: DTC (direct-to-consumer) testing legality by state
create table states (
  state_code text primary key check (length(state_code) = 2),
  state_name text not null,
  dtc_allowed text not null check (dtc_allowed in ('allowed', 'restricted', 'prohibited')),
  notes text,
  created_at timestamptz default now()
);

-- symptoms: patient-facing symptom clusters mapped to tests
create table symptoms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  keywords text[] not null default '{}',
  related_test_ids uuid[] not null default '{}',
  created_at timestamptz default now()
);

-- RLS policies: tests, labs, icd10_codes, states, and symptoms are public read
alter table tests enable row level security;
create policy "Public read access" on tests for select using (true);

alter table labs enable row level security;
create policy "Public read access" on labs for select using (true);

alter table pricing enable row level security;
create policy "Public read access" on pricing for select using (true);

alter table icd10_codes enable row level security;
create policy "Public read access" on icd10_codes for select using (true);

alter table test_icd10_codes enable row level security;
create policy "Public read access" on test_icd10_codes for select using (true);

alter table states enable row level security;
create policy "Public read access" on states for select using (true);

alter table symptoms enable row level security;
create policy "Public read access" on symptoms for select using (true);
