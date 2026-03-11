-- Migration: Add lab_reports table for tracking import batches
-- Apply via: https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/sql/new

-- -------------------------------------------------------
-- lab_reports: tracks import batches (PDF, CSV, Manual)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_lab text,
  panel_title text,
  import_method text DEFAULT 'manual' CHECK (import_method IN ('pdf', 'csv', 'manual')),
  drawn_at date,
  marker_count int DEFAULT 0,
  unmatched_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reports" ON lab_reports FOR ALL USING (auth.uid() = user_id);

-- Add report_id to lab_results table (nullable for backward compatibility)
ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS report_id uuid REFERENCES lab_reports(id) ON DELETE CASCADE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS lab_reports_user_id_idx ON lab_reports(user_id);
CREATE INDEX IF NOT EXISTS lab_reports_created_at_idx ON lab_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS lab_results_report_id_idx ON lab_results(report_id);