-- DrSays Pricing Data
-- DrSays (drsays.com) is a discount DTC lab ordering service that uses LabCorp for draws.
-- Prices researched Feb 2026 from drsays.com product pages.
-- NOTE: DrSays charges a $9.99 collection fee per order (one-time, not per test).
-- Generated: 2026-02-27

-- ============================================================================
-- ADD DRSAYS AS A LAB PROVIDER
-- ============================================================================
INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES (
    'b0000011-0000-0000-0000-000000000000',
    'DrSays',
    'https://www.drsays.com',
    'intermediary',
    'Labcorp',
    NULL,
    'Uses LabCorp for specimen collection; very low test prices; $9.99 collection fee per order; requires DrSays membership'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PRICING DATA
-- Prices are per-test costs (collection fee is separate)
-- Sources: drsays.com product pages (titles include prices)
-- ============================================================================

-- CBC with Differential — $5.60 (drsays.com/home/cbc-with-differential)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000061-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 5.60, false);

-- Lipid Panel — $8.00 (drsays.com/home/lipid-panel)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000139-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 8.00, false);

-- HbA1c — $6.30 (drsays.com/home/hemoglobin-a1c)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000117-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 6.30, false);

-- CMP (Comprehensive Metabolic Panel) — $7.84 (drsays.com/home/test-cmp-14)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000110-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 7.84, false);

-- BMP (Basic Metabolic Panel) — $5.99 (drsays.com/home/bmp-basic-metabolic-panel)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000111-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 5.99, false);

-- TSH — $3.99 (drsays.com/home/thyroid, starting price)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000001-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 3.99, false);

-- Ferritin — $3.99 (drsays.com/home/ferritin-iron-tibc, starting price)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000072-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 3.99, false);

-- Testosterone (Total) — $6.99 (drsays.com/home/testosterone)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000022-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 6.99, false);

-- Estradiol — $12.99 (drsays.com/home/estradiol)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000028-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 12.99, false);

-- PSA — $8.99 (drsays.com/home/psa-prostate-specific-antigen)
-- NOTE: PSA not in current tests table; this insert will fail if test doesn't exist
-- INSERT INTO pricing (test_id, lab_id, price, requires_rx)
-- SELECT id, 'b0000011-0000-0000-0000-000000000000', 8.99, false
-- FROM tests WHERE test_name ILIKE '%PSA%' LIMIT 1;

-- Vitamin D, 25-OH — $28.99 (drsays.com/home/vitamin-d)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000174-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 28.99, false);

-- Cortisol — $12.04 (drsays.com/home/test-cortisol)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES
    ('a0000040-0000-0000-0000-000000000000', 'b0000011-0000-0000-0000-000000000000', 12.04, false);

-- ============================================================================
-- NOTE: All DrSays orders have an additional $9.99 collection fee per order.
-- This is a flat fee regardless of how many tests are in the order.
-- The prices above are test-only prices; total cost = sum(test prices) + $9.99
-- ============================================================================
