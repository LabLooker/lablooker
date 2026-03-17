-- Fix: Move parathyroid tests out of 'thyroid' category into their own 'parathyroid' category
-- Run this in Supabase SQL Editor

UPDATE tests
SET category = 'parathyroid'
WHERE category = 'thyroid'
  AND (
    test_name ILIKE '%parathyroid%'
    OR test_name ILIKE '%PTH%'
    OR test_name ILIKE '% PTH%'
    OR test_name ILIKE 'PTH %'
  );

-- Verify what changed:
SELECT test_name, category, cpt_codes
FROM tests
WHERE category = 'parathyroid'
ORDER BY test_name;
