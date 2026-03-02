CREATE TABLE IF NOT EXISTS saved_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nickname TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  practice_name TEXT,
  fax_number TEXT,
  npi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE saved_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own providers"
  ON saved_providers FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_saved_providers_user_id ON saved_providers(user_id);
