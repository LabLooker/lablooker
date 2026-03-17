ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS import_session_id uuid;
CREATE INDEX IF NOT EXISTS lab_results_import_session_idx ON lab_results(import_session_id);
