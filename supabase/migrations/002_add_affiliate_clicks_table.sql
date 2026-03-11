-- Migration: Add affiliate_clicks table for tracking outbound clicks
-- Apply via: https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/sql/new

-- -------------------------------------------------------
-- affiliate_clicks: tracks clicks to affiliate providers
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL,
  test_name text,
  page_path text,
  page_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert clicks" ON affiliate_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS affiliate_clicks_provider_idx ON affiliate_clicks(provider);
CREATE INDEX IF NOT EXISTS affiliate_clicks_created_at_idx ON affiliate_clicks(created_at DESC);