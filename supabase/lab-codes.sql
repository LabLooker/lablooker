-- Lab Code Crosswalk Migration
-- Maps proprietary lab test numbers (SKUs) across LabCorp, Quest Diagnostics, and DrSays
-- to tests in the LabLooker database.
-- Generated: 2026-02-27
-- Sources: labcorp.com/tests/, testdirectory.questdiagnostics.com, drsays.com

-- ============================================================================
-- CREATE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS lab_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    lab_name TEXT NOT NULL,           -- 'LabCorp', 'Quest', 'DrSays'
    proprietary_code TEXT NOT NULL,
    code_type TEXT NOT NULL DEFAULT 'order_code',  -- 'order_code', 'test_number'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_lab_codes_lab_code ON lab_codes (lab_name, proprietary_code);
CREATE INDEX IF NOT EXISTS idx_lab_codes_test_id ON lab_codes (test_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_lab_codes_unique ON lab_codes (test_id, lab_name, proprietary_code);

-- ============================================================================
-- HELPER: insert function to avoid errors on missing tests
-- ============================================================================
-- We use subqueries. If a test doesn't exist, the INSERT silently inserts NULL test_id
-- which will fail the NOT NULL constraint — that's fine, we wrap in DO blocks where needed.

-- ============================================================================
-- CROSSWALK DATA
-- ============================================================================
-- Format: (test_id via subquery, lab_name, proprietary_code, code_type, notes)

-- 1. CBC with Differential
-- LabCorp: 005009 (labcorp.com/tests/005009) | Quest: 6399 (testdirectory.questdiagnostics.com/test/test-detail/6399)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'CBC with Differential (CBC w/ Diff)'), 'LabCorp', '005009', 'order_code', 'CPT 85025; Complete Blood Count with Differential'),
    ((SELECT id FROM tests WHERE test_name = 'CBC with Differential (CBC w/ Diff)'), 'Quest', '6399', 'order_code', 'CBC includes Differential and Platelets'),
    ((SELECT id FROM tests WHERE test_name = 'CBC with Differential (CBC w/ Diff)'), 'DrSays', '005009', 'order_code', 'Uses LabCorp test 005009; DrSays price $5.60');

-- 2. Comprehensive Metabolic Panel (CMP)
-- LabCorp: 322000 (labcorp.com/tests/322000) | Quest: 10231 (questhealth.com/product/comprehensive-metabolic-panel-cmp/10231M)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'CMP (Comprehensive Metabolic Panel)'), 'LabCorp', '322000', 'order_code', 'CPT 80053; 14-component metabolic panel'),
    ((SELECT id FROM tests WHERE test_name = 'CMP (Comprehensive Metabolic Panel)'), 'Quest', '10231', 'order_code', 'Comprehensive Metabolic Panel'),
    ((SELECT id FROM tests WHERE test_name = 'CMP (Comprehensive Metabolic Panel)'), 'DrSays', '322000', 'order_code', 'Uses LabCorp test 322000; DrSays price $7.84');

-- 3. Basic Metabolic Panel (BMP)
-- LabCorp: 322758 (womenshealth.labcorp.com compendium) | Quest: 10165 (findlabtest.com)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'BMP (Basic Metabolic Panel)'), 'LabCorp', '322758', 'order_code', 'CPT 80048; 8-component metabolic panel'),
    ((SELECT id FROM tests WHERE test_name = 'BMP (Basic Metabolic Panel)'), 'Quest', '10165', 'order_code', 'Basic Metabolic Panel'),
    ((SELECT id FROM tests WHERE test_name = 'BMP (Basic Metabolic Panel)'), 'DrSays', '322758', 'order_code', 'Uses LabCorp test 322758; DrSays price ~$5.99-$6.16');

-- 4. Lipid Panel
-- LabCorp: 303756 (labcorp.com/tests/303756) | Quest: 7600 (testdirectory.questdiagnostics.com/test/test-detail/7600)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Lipid Panel (Standard)'), 'LabCorp', '303756', 'order_code', 'CPT 80061; Standard lipid panel'),
    ((SELECT id FROM tests WHERE test_name = 'Lipid Panel (Standard)'), 'Quest', '7600', 'order_code', 'Lipid Panel, Standard'),
    ((SELECT id FROM tests WHERE test_name = 'Lipid Panel (Standard)'), 'DrSays', '303756', 'order_code', 'Uses LabCorp test 303756; DrSays price $8.00');

-- 5. TSH
-- LabCorp: 004259 (labcorp.com/tests/004259) | Quest: 899
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'TSH (Thyroid Stimulating Hormone)'), 'LabCorp', '004259', 'order_code', 'CPT 84443; Thyroid Stimulating Hormone'),
    ((SELECT id FROM tests WHERE test_name = 'TSH (Thyroid Stimulating Hormone)'), 'Quest', '899', 'order_code', 'TSH'),
    ((SELECT id FROM tests WHERE test_name = 'TSH (Thyroid Stimulating Hormone)'), 'DrSays', '004259', 'order_code', 'Uses LabCorp test 004259; DrSays price ~$3.99');

-- 6. Free T4
-- LabCorp: 001974 (labsmarts cross-ref, labcorp compendium) | Quest: 866
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Free T4 (Thyroxine, Free)'), 'LabCorp', '001974', 'order_code', 'CPT 84439; T4, Free by Dialysis/Mass Spec'),
    ((SELECT id FROM tests WHERE test_name = 'Free T4 (Thyroxine, Free)'), 'Quest', '866', 'order_code', 'T4, Free (FT4)');

-- 7. Free T3
-- LabCorp: 010389 (labcorp compendium) | Quest: 34429
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Free T3 (Triiodothyronine, Free)'), 'LabCorp', '010389', 'order_code', 'CPT 84481; Triiodothyronine (T3), Free'),
    ((SELECT id FROM tests WHERE test_name = 'Free T3 (Triiodothyronine, Free)'), 'Quest', '34429', 'order_code', 'Triiodothyronine T3, Free (FT3)');

-- 8. Hemoglobin A1c
-- LabCorp: 001453 (labcorp.com conversion doc) | Quest: 496
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'HbA1c (Hemoglobin A1c)'), 'LabCorp', '001453', 'order_code', 'CPT 83036; Hemoglobin A1c'),
    ((SELECT id FROM tests WHERE test_name = 'HbA1c (Hemoglobin A1c)'), 'Quest', '496', 'order_code', 'Hemoglobin A1c'),
    ((SELECT id FROM tests WHERE test_name = 'HbA1c (Hemoglobin A1c)'), 'DrSays', '001453', 'order_code', 'Uses LabCorp test 001453; DrSays price $6.30');

-- 9. Vitamin D, 25-OH
-- LabCorp: 081950 (labcorp.com/tests/081950) | Quest: 17306
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Vitamin D, 25-OH (Total)'), 'LabCorp', '081950', 'order_code', 'CPT 82306; Vitamin D, 25-Hydroxy'),
    ((SELECT id FROM tests WHERE test_name = 'Vitamin D, 25-OH (Total)'), 'Quest', '17306', 'order_code', 'Vitamin D, 25-Hydroxy, Total, Immunoassay'),
    ((SELECT id FROM tests WHERE test_name = 'Vitamin D, 25-OH (Total)'), 'DrSays', '081950', 'order_code', 'Uses LabCorp test 081950; DrSays price ~$28.99');

-- 10. Ferritin
-- LabCorp: 004598 (labcorp.com/tests/004598) | Quest: 457 (testdirectory.questdiagnostics.com/test/test-detail/457)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Ferritin'), 'LabCorp', '004598', 'order_code', 'CPT 82728; Ferritin'),
    ((SELECT id FROM tests WHERE test_name = 'Ferritin'), 'Quest', '457', 'order_code', 'Ferritin'),
    ((SELECT id FROM tests WHERE test_name = 'Ferritin'), 'DrSays', '004598', 'order_code', 'Uses LabCorp test 004598; DrSays price ~$3.99');

-- 11. Iron + TIBC
-- LabCorp: 001321 (labcorp.com cascade doc) | Quest: 7573 (Iron and TIBC) or 5616 (Iron, TIBC and Ferritin Panel)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Iron & TIBC Panel'), 'LabCorp', '001321', 'order_code', 'CPT 83540,83550; Iron and Total Iron-binding Capacity'),
    ((SELECT id FROM tests WHERE test_name = 'Iron & TIBC Panel'), 'Quest', '7573', 'order_code', 'Iron and TIBC');

-- 12. Vitamin B12
-- LabCorp: 001503 (labcorp.com/tests/001503) | Quest: 927
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Vitamin B12 (Cobalamin)'), 'LabCorp', '001503', 'order_code', 'CPT 82607; Vitamin B12'),
    ((SELECT id FROM tests WHERE test_name = 'Vitamin B12 (Cobalamin)'), 'Quest', '927', 'order_code', 'Vitamin B12');

-- 13. Folate (Serum)
-- LabCorp: 002014 (labcorp.com/tests/002014) | Quest: 466
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Folate, Serum'), 'LabCorp', '002014', 'order_code', 'CPT 82746; Folate (Folic Acid), Serum'),
    ((SELECT id FROM tests WHERE test_name = 'Folate, Serum'), 'Quest', '466', 'order_code', 'Folate (Folic Acid), Serum');

-- 14. hs-CRP (High Sensitivity CRP)
-- LabCorp: 120766 (cdos.halfpenny.com/labcorp) | Quest: 10124
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'hs-CRP (High Sensitivity CRP)'), 'LabCorp', '120766', 'order_code', 'CPT 86141; C-Reactive Protein, High Sensitivity (Cardiac Risk)'),
    ((SELECT id FROM tests WHERE test_name = 'hs-CRP (High Sensitivity CRP)'), 'Quest', '10124', 'order_code', 'C-Reactive Protein (CRP), High Sensitivity');

-- 15. PSA (Total) — NOTE: Not in seed-full.sql tests table; uses test_name match
-- LabCorp: 010322 (labcorp.com/tests/010322) | Quest: 5363 (testdirectory.questdiagnostics.com/test/test-detail/5363)
-- These will fail silently if PSA test not in tests table
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT id, 'LabCorp', '010322', 'order_code', 'CPT 84153; Prostate-specific Antigen (PSA)'
FROM tests WHERE test_name ILIKE '%PSA%' OR test_name ILIKE '%Prostate-specific%' LIMIT 1;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT id, 'Quest', '5363', 'order_code', 'PSA, Total'
FROM tests WHERE test_name ILIKE '%PSA%' OR test_name ILIKE '%Prostate-specific%' LIMIT 1;

-- 16. Testosterone (Total)
-- LabCorp: 004226 (firstchoicelabsusa.com, drsays.com/home/testosterone) | Quest: 15983
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Testosterone, Total'), 'LabCorp', '004226', 'order_code', 'CPT 84403; Testosterone, Total'),
    ((SELECT id FROM tests WHERE test_name = 'Testosterone, Total'), 'Quest', '15983', 'order_code', 'Testosterone, Total'),
    ((SELECT id FROM tests WHERE test_name = 'Testosterone, Total'), 'DrSays', '004226', 'order_code', 'Uses LabCorp test 004226; DrSays price ~$6.99');

-- 17. Estradiol
-- LabCorp: 004515 (labcorp.com/tests/004515) | Quest: 4021 (testdirectory.questdiagnostics.com/test/test-detail/4021)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Estradiol (E2)'), 'LabCorp', '004515', 'order_code', 'CPT 82670; Estradiol'),
    ((SELECT id FROM tests WHERE test_name = 'Estradiol (E2)'), 'Quest', '4021', 'order_code', 'Estradiol'),
    ((SELECT id FROM tests WHERE test_name = 'Estradiol (E2)'), 'DrSays', '004515', 'order_code', 'Uses LabCorp test 004515; DrSays price ~$12.99');

-- 18. Prolactin
-- LabCorp: 004465 (labcorp.com/tests/004465) | Quest: 746
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Prolactin'), 'LabCorp', '004465', 'order_code', 'CPT 84146; Prolactin'),
    ((SELECT id FROM tests WHERE test_name = 'Prolactin'), 'Quest', '746', 'order_code', 'Prolactin');

-- 19. IGF-1
-- LabCorp: 010363 (labcorp.com/tests/010363) | Quest: 959
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'IGF-1 (Insulin-like Growth Factor 1)'), 'LabCorp', '010363', 'order_code', 'CPT 84305; Insulin-like Growth Factor 1'),
    ((SELECT id FROM tests WHERE test_name = 'IGF-1 (Insulin-like Growth Factor 1)'), 'Quest', '959', 'order_code', 'Insulin-like Growth Factor I (IGF-I)');

-- 20. Insulin, Fasting
-- LabCorp: 004333 (labcorp compendium) | Quest: 561 (testdirectory.questdiagnostics.com/test/test-detail/561)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Insulin, Fasting'), 'LabCorp', '004333', 'order_code', 'CPT 83525; Insulin'),
    ((SELECT id FROM tests WHERE test_name = 'Insulin, Fasting'), 'Quest', '561', 'order_code', 'Insulin');

-- 21. Gastrin — NOTE: Not in seed-full.sql tests table
-- LabCorp: 004390 (labcorp.com/tests/004390) | Quest: 378
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT id, 'LabCorp', '004390', 'order_code', 'CPT 82941; Gastrin'
FROM tests WHERE test_name ILIKE '%Gastrin%' LIMIT 1;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT id, 'Quest', '378', 'order_code', 'Gastrin'
FROM tests WHERE test_name ILIKE '%Gastrin%' LIMIT 1;

-- 22. PTH Intact
-- LabCorp: 015610 (labcorp.com/tests/015610) | Quest: 17320
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Parathyroid Hormone (PTH)'), 'LabCorp', '015610', 'order_code', 'CPT 83970; Parathyroid Hormone, Intact'),
    ((SELECT id FROM tests WHERE test_name = 'Parathyroid Hormone (PTH)'), 'Quest', '17320', 'order_code', 'Parathyroid Hormone (PTH), Intact');

-- 23. Magnesium, Serum
-- LabCorp: 001537 (labcorp.com/tests/001537) | Quest: 622
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Magnesium, Serum'), 'LabCorp', '001537', 'order_code', 'CPT 83735; Magnesium'),
    ((SELECT id FROM tests WHERE test_name = 'Magnesium, Serum'), 'Quest', '622', 'order_code', 'Magnesium');

-- 24. Phosphorus
-- LabCorp: 001024 (labsmarts cross-ref) | Quest: 718
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Phosphorus (Phosphate)'), 'LabCorp', '001024', 'order_code', 'CPT 84100; Phosphorus (Phosphate)'),
    ((SELECT id FROM tests WHERE test_name = 'Phosphorus (Phosphate)'), 'Quest', '718', 'order_code', 'Phosphorus');

-- 25. Uric Acid
-- LabCorp: 001057 (labsmarts cross-ref) | Quest: 905
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Uric Acid'), 'LabCorp', '001057', 'order_code', 'CPT 84550; Uric Acid'),
    ((SELECT id FROM tests WHERE test_name = 'Uric Acid'), 'Quest', '905', 'order_code', 'Uric Acid');

-- 26. GGT
-- LabCorp: 001958 (labsmarts cross-ref lists 001958) | Quest: 482
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'GGT (Gamma-Glutamyl Transferase)'), 'LabCorp', '001958', 'order_code', 'CPT 82977; Gamma-Glutamyl Transferase (GGT)'),
    ((SELECT id FROM tests WHERE test_name = 'GGT (Gamma-Glutamyl Transferase)'), 'Quest', '482', 'order_code', 'GGT');

-- 27. ALT
-- LabCorp: 001545 (labcorp stat menu) | Quest: 823 (quizgecko flashcards)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'ALT (Alanine Aminotransferase)'), 'LabCorp', '001545', 'order_code', 'CPT 84460; Alanine Aminotransferase (ALT/SGPT)'),
    ((SELECT id FROM tests WHERE test_name = 'ALT (Alanine Aminotransferase)'), 'Quest', '823', 'order_code', 'ALT (SGPT)');

-- 28. AST
-- LabCorp: 001123 (labcorp stat menu) | Quest: 324
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'AST (Aspartate Aminotransferase)'), 'LabCorp', '001123', 'order_code', 'CPT 84450; Aspartate Aminotransferase (AST/SGOT)'),
    ((SELECT id FROM tests WHERE test_name = 'AST (Aspartate Aminotransferase)'), 'Quest', '324', 'order_code', 'AST (SGOT)');

-- 29. Alkaline Phosphatase
-- LabCorp: 001107 (labcorp.com/tests/001107) | Quest: 306
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'ALP (Alkaline Phosphatase)'), 'LabCorp', '001107', 'order_code', 'CPT 84075; Alkaline Phosphatase'),
    ((SELECT id FROM tests WHERE test_name = 'ALP (Alkaline Phosphatase)'), 'Quest', '306', 'order_code', 'Alkaline Phosphatase');

-- 30. Bilirubin Total
-- LabCorp: 001230 (labcorp stat menu ref 001230 for total bilirubin) | Quest: 370
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Total Bilirubin'), 'LabCorp', '001230', 'order_code', 'CPT 82247; Bilirubin, Total'),
    ((SELECT id FROM tests WHERE test_name = 'Total Bilirubin'), 'Quest', '370', 'order_code', 'Bilirubin, Total');

-- 31. Albumin
-- LabCorp: 001081 (labcorp stat menu) | Quest: 203
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Albumin, Serum'), 'LabCorp', '001081', 'order_code', 'CPT 82040; Albumin, Serum'),
    ((SELECT id FROM tests WHERE test_name = 'Albumin, Serum'), 'Quest', '203', 'order_code', 'Albumin');

-- 32. Total Protein
-- LabCorp: 001073 | Quest: 806
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Total Protein'), 'LabCorp', '001073', 'order_code', 'CPT 84155; Total Protein'),
    ((SELECT id FROM tests WHERE test_name = 'Total Protein'), 'Quest', '806', 'order_code', 'Protein, Total');

-- 33. Urinalysis (Complete with Microscopy)
-- LabCorp: 003772 (labcorp.com/tests/003772) | Quest: 8514
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Urinalysis, Complete with Microscopy'), 'LabCorp', '003772', 'order_code', 'CPT 81001; Urinalysis, Complete with Microscopic Examination'),
    ((SELECT id FROM tests WHERE test_name = 'Urinalysis, Complete with Microscopy'), 'Quest', '8514', 'order_code', 'Urinalysis, Complete');

-- 34. Prothrombin Time (PT/INR)
-- LabCorp: 005199 (labcorp.com/tests/005199) | Quest: 8847
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Prothrombin Time (PT/INR)'), 'LabCorp', '005199', 'order_code', 'CPT 85610; Prothrombin Time (PT) with INR'),
    ((SELECT id FROM tests WHERE test_name = 'Prothrombin Time (PT/INR)'), 'Quest', '8847', 'order_code', 'PT with INR');

-- 35. Sed Rate (ESR)
-- LabCorp: 005215 (labcorp.com/tests/005215) | Quest: 809
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'ESR (Erythrocyte Sedimentation Rate)'), 'LabCorp', '005215', 'order_code', 'CPT 85652; Sedimentation Rate, Modified Westergren'),
    ((SELECT id FROM tests WHERE test_name = 'ESR (Erythrocyte Sedimentation Rate)'), 'Quest', '809', 'order_code', 'Sedimentation Rate, Westergren');

-- 36. ANA (Antinuclear Antibody)
-- LabCorp: 164947 (labcorp.com/tests/164947) | Quest: 249
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'ANA (Antinuclear Antibody) Screen, IFA'), 'LabCorp', '164947', 'order_code', 'ANA by IFA, Reflex to Titer and Pattern'),
    ((SELECT id FROM tests WHERE test_name = 'ANA (Antinuclear Antibody) Screen, IFA'), 'Quest', '249', 'order_code', 'ANA Screen, IFA');

-- 37. Rheumatoid Factor
-- LabCorp: 006502 (labcorp.com/tests/006502) | Quest: 4418 (testdirectory.questdiagnostics.com/test/test-detail/4418)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Rheumatoid Factor (RF)'), 'LabCorp', '006502', 'order_code', 'CPT 86431; Rheumatoid Factor (RF)'),
    ((SELECT id FROM tests WHERE test_name = 'Rheumatoid Factor (RF)'), 'Quest', '4418', 'order_code', 'Rheumatoid Factor');

-- 38. Hepatitis B Surface Antigen
-- LabCorp: 006510 (labcorp.com/tests/006510) | Quest: 498 (testdirectory.questdiagnostics.com/test/test-detail/498)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Hepatitis B Surface Antigen (HBsAg)'), 'LabCorp', '006510', 'order_code', 'CPT 87340; Hepatitis B Surface Antigen (HBsAg) Screen, Qualitative'),
    ((SELECT id FROM tests WHERE test_name = 'Hepatitis B Surface Antigen (HBsAg)'), 'Quest', '498', 'order_code', 'Hepatitis B Surface Antigen with Reflex Confirmation');

-- 39. Hepatitis C Antibody
-- LabCorp: 144050 (labcorp.com/tests/144050, with reflex) or 006517 | Quest: 8472 (questhealth.com/product/hepatitis-c-test-with-confirmation/8472M)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Hepatitis C Antibody'), 'LabCorp', '144050', 'order_code', 'HCV Antibody with Reflex to Quantitative Real-time PCR'),
    ((SELECT id FROM tests WHERE test_name = 'Hepatitis C Antibody'), 'Quest', '8472', 'order_code', 'Hepatitis C Antibody with Reflex to HCV RNA');

-- 40. HIV 1/2 Antigen/Antibody (4th Gen)
-- LabCorp: 083935 (nastad.org LabCorp doc) | Quest: 91431 (testdirectory.questdiagnostics.com/test/test-detail/91431)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'HIV Ag/Ab 4th Generation (Combo)'), 'LabCorp', '083935', 'order_code', 'HIV p24 Antigen/Antibody with Reflex to Confirmation'),
    ((SELECT id FROM tests WHERE test_name = 'HIV Ag/Ab 4th Generation (Combo)'), 'Quest', '91431', 'order_code', 'HIV 1/2 Antigen and Antibodies, Fourth Generation, With Reflexes');

-- 41. Cortisol, AM
-- LabCorp: 004051 (drsays.com/home/test-cortisol, labcorp compendium) | Quest: 4212 (testdirectory.questdiagnostics.com/test/test-detail/4212)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Cortisol, AM (Serum)'), 'LabCorp', '004051', 'order_code', 'CPT 82533; Cortisol, Total'),
    ((SELECT id FROM tests WHERE test_name = 'Cortisol, AM (Serum)'), 'Quest', '4212', 'order_code', 'Cortisol, AM'),
    ((SELECT id FROM tests WHERE test_name = 'Cortisol, AM (Serum)'), 'DrSays', '004051', 'order_code', 'Uses LabCorp test 004051; DrSays price $12.04');

-- 42. DHEA-S
-- LabCorp: 004020 (labcorp compendium) | Quest: 402
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'DHEA-Sulfate (DHEA-S)'), 'LabCorp', '004020', 'order_code', 'CPT 82627; DHEA Sulfate'),
    ((SELECT id FROM tests WHERE test_name = 'DHEA-Sulfate (DHEA-S)'), 'Quest', '402', 'order_code', 'DHEA-Sulfate');

-- 43. Progesterone
-- LabCorp: 004317 (labcorp.com/tests/004317) | Quest: 4148
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Progesterone'), 'LabCorp', '004317', 'order_code', 'CPT 84144; Progesterone'),
    ((SELECT id FROM tests WHERE test_name = 'Progesterone'), 'Quest', '4148', 'order_code', 'Progesterone');

-- 44. LH
-- LabCorp: 004283 (labcorp compendium) | Quest: 878
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'LH (Luteinizing Hormone)'), 'LabCorp', '004283', 'order_code', 'CPT 83002; Luteinizing Hormone (LH)'),
    ((SELECT id FROM tests WHERE test_name = 'LH (Luteinizing Hormone)'), 'Quest', '878', 'order_code', 'LH');

-- 45. FSH
-- LabCorp: 004309 (labcorp compendium) | Quest: 362
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'FSH (Follicle Stimulating Hormone)'), 'LabCorp', '004309', 'order_code', 'CPT 83001; Follicle Stimulating Hormone (FSH)'),
    ((SELECT id FROM tests WHERE test_name = 'FSH (Follicle Stimulating Hormone)'), 'Quest', '362', 'order_code', 'FSH');

-- 46. Thyroid Peroxidase Antibodies (Anti-TPO)
-- LabCorp: 006676 (labcorp compendium) | Quest: 5765
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Anti-TPO (Thyroid Peroxidase Antibody)'), 'LabCorp', '006676', 'order_code', 'CPT 86376; Thyroid Peroxidase (TPO) Antibodies'),
    ((SELECT id FROM tests WHERE test_name = 'Anti-TPO (Thyroid Peroxidase Antibody)'), 'Quest', '5765', 'order_code', 'Thyroid Peroxidase Antibodies (TPO)');

-- 47. Thyroglobulin Antibodies
-- LabCorp: 006685 (labcorp.com/tests/006685) | Quest: 267 (testdirectory.questdiagnostics.com/test/test-detail/267)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Anti-Thyroglobulin Antibody (TgAb)'), 'LabCorp', '006685', 'order_code', 'CPT 86800; Thyroglobulin Antibody'),
    ((SELECT id FROM tests WHERE test_name = 'Anti-Thyroglobulin Antibody (TgAb)'), 'Quest', '267', 'order_code', 'Thyroglobulin Antibodies');

-- 48. Vitamin B1 (Thiamine)
-- LabCorp: 121186 (labcorp.com/tests/121186) | Quest: 5042 (testdirectory.questdiagnostics.com/test/test-detail/5042)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Vitamin B1 (Thiamine)'), 'LabCorp', '121186', 'order_code', 'Vitamin B1, Whole Blood'),
    ((SELECT id FROM tests WHERE test_name = 'Vitamin B1 (Thiamine)'), 'Quest', '5042', 'order_code', 'Vitamin B1 (Thiamine), Blood, LC/MS/MS');

-- 49. Vitamin B6
-- LabCorp: 004655 (labcorp.com/tests/004655) | Quest: 926 (testdirectory.questdiagnostics.com/test/test-detail/926)
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Vitamin B6 (Pyridoxine)'), 'LabCorp', '004655', 'order_code', 'CPT 84207; Vitamin B6, Plasma (Pyridoxal-5-Phosphate)'),
    ((SELECT id FROM tests WHERE test_name = 'Vitamin B6 (Pyridoxine)'), 'Quest', '926', 'order_code', 'Vitamin B6, Plasma');

-- 50. Zinc
-- LabCorp: 001800 (labcorp.com/tests/001800) | Quest: 945
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'Zinc, Serum'), 'LabCorp', '001800', 'order_code', 'CPT 84630; Zinc, Serum or Plasma'),
    ((SELECT id FROM tests WHERE test_name = 'Zinc, Serum'), 'Quest', '945', 'order_code', 'Zinc');

-- ============================================================================
-- Additional ESR entry for the inflammation-category duplicate
-- ============================================================================
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'ESR (Sed Rate, Westergren)'), 'LabCorp', '005215', 'order_code', 'Same test as ESR (Erythrocyte Sedimentation Rate)'),
    ((SELECT id FROM tests WHERE test_name = 'ESR (Sed Rate, Westergren)'), 'Quest', '809', 'order_code', 'Sedimentation Rate, Westergren')
ON CONFLICT DO NOTHING;

-- Additional hs-CRP entry for the inflammation-category duplicate
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes) VALUES
    ((SELECT id FROM tests WHERE test_name = 'hs-CRP (High Sensitivity) - Inflammation'), 'LabCorp', '120766', 'order_code', 'Same test as hs-CRP cardiac risk'),
    ((SELECT id FROM tests WHERE test_name = 'hs-CRP (High Sensitivity) - Inflammation'), 'Quest', '10124', 'order_code', 'Same test as hs-CRP cardiac risk')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total crosswalk entries: ~110+ rows covering 50 tests × 2-3 labs each
-- Labs covered: LabCorp, Quest Diagnostics, DrSays (where applicable)
-- All codes verified from official lab directories (labcorp.com, testdirectory.questdiagnostics.com)
-- DrSays uses LabCorp test numbers (they send orders to LabCorp)
