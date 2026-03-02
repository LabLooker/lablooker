-- ============================================================
-- Lab Tracker Schema
-- Apply via: https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/sql/new
-- ============================================================

-- -------------------------------------------------------
-- lab_results: stores each individual lab result entry
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id),
  value NUMERIC NOT NULL,
  unit TEXT,
  drawn_at DATE NOT NULL,
  lab_name TEXT,
  ref_range_low NUMERIC,
  ref_range_high NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lab results"
  ON lab_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab results"
  ON lab_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab results"
  ON lab_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lab results"
  ON lab_results FOR DELETE
  USING (auth.uid() = user_id);


-- -------------------------------------------------------
-- lab_goals: personal targets per test per user
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id),
  target_value NUMERIC,
  target_direction TEXT DEFAULT 'above', -- 'above' | 'below' | 'range'
  target_low NUMERIC,
  target_high NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, test_id)
);

ALTER TABLE lab_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lab goals"
  ON lab_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab goals"
  ON lab_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab goals"
  ON lab_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lab goals"
  ON lab_goals FOR DELETE
  USING (auth.uid() = user_id);


-- -------------------------------------------------------
-- lab_shares: tokenized share links
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  test_ids UUID[],
  title TEXT,
  note TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lab_shares ENABLE ROW LEVEL SECURITY;

-- Owner can manage their shares
CREATE POLICY "Users can view own lab shares"
  ON lab_shares FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab shares"
  ON lab_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab shares"
  ON lab_shares FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lab shares"
  ON lab_shares FOR DELETE
  USING (auth.uid() = user_id);

-- Public can read active shares by token (for share link pages)
CREATE POLICY "Public can read active lab shares"
  ON lab_shares FOR SELECT
  USING (is_active = true);


-- -------------------------------------------------------
-- Indexes for performance
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS lab_results_user_id_idx ON lab_results(user_id);
CREATE INDEX IF NOT EXISTS lab_results_test_id_idx ON lab_results(test_id);
CREATE INDEX IF NOT EXISTS lab_results_drawn_at_idx ON lab_results(drawn_at DESC);
CREATE INDEX IF NOT EXISTS lab_goals_user_test_idx ON lab_goals(user_id, test_id);
CREATE INDEX IF NOT EXISTS lab_shares_token_idx ON lab_shares(share_token);
