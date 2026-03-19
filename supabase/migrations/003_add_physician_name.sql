-- Migration: Add physician_name column to lab_results
-- Apply via: https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/sql/new

ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS physician_name TEXT;
