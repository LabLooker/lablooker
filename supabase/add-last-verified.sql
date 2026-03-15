-- Add last_verified to pricing table
ALTER TABLE pricing 
  ADD COLUMN IF NOT EXISTS last_verified TIMESTAMPTZ DEFAULT NOW();

-- Backfill: set all existing rows to now (first verification baseline)
UPDATE pricing SET last_verified = NOW() WHERE last_verified IS NULL;

-- Index for finding stale prices
CREATE INDEX IF NOT EXISTS idx_pricing_last_verified ON pricing(last_verified);
