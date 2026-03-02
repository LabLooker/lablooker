-- CPL (Clinical Pathology Laboratories) Order Codes
-- Source: https://pgms.sonichealthcareusa.com/Common/TCM/cpl/
-- Generated: 2026-03-01

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1000', 'order_code', 'CBC W/AUTO DIFF WITH PLATELETS'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '9179', 'order_code', 'COMPREHENSIVE METABOLIC PANEL'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '142', 'order_code', 'BASIC METABOLIC PANEL'
FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4274', 'order_code', 'ULTRASENSITIVE TSH'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4273', 'order_code', 'FREE T3'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2823', 'order_code', 'FREE T4 (THYROXINE)'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '173', 'order_code', 'LIPID PANEL'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2708', 'order_code', 'HEMOGLOBIN A1c'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4958', 'order_code', 'VITAMIN D, 25 OH'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2090', 'order_code', 'FERRITIN'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2222', 'order_code', 'IRON, SERUM'
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2118', 'order_code', 'IRON BINDING CAPACITY AND IRON AND % SATURATION'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tibc%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '3545', 'order_code', 'C-REACTIVE PROTEIN'
FROM tests t WHERE LOWER(t.test_name) LIKE '%crp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '5083', 'order_code', 'HIGH SENSITIVITY CRP'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1055', 'order_code', 'SEDIMENTATION RATE'
FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '3550', 'order_code', 'ANA (ANTI-NUCLEAR AB) WITH REFLEX TITER'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '414300', 'order_code', 'TESTOSTERONE, TOTAL'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone total%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4937', 'order_code', 'TESTOSTERONE, FREE/TOTAL WITH SHBG'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone free%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2675', 'order_code', 'ESTRADIOL'
FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2790', 'order_code', 'PROGESTERONE'
FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '438', 'order_code', 'FSH + LH PROFILE'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2776', 'order_code', 'LUTEINIZING HORMONE'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4225', 'order_code', 'DHEA SULFATE'
FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea-s%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2800', 'order_code', 'PROLACTIN'
FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4920', 'order_code', 'IGF-I'
FROM tests t WHERE LOWER(t.test_name) LIKE '%igf-1%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2655', 'order_code', 'CORTISOL, RANDOM'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2760', 'order_code', 'INSULIN'
FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2840', 'order_code', 'VITAMIN B-12'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2695', 'order_code', 'FOLIC ACID'
FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2130', 'order_code', 'MAGNESIUM'
FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2227', 'order_code', 'PHOSPHORUS'
FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2814', 'order_code', 'INTACT PTH'
FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2236', 'order_code', 'CALCIUM, IONIZED'
FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium ionized%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1501', 'order_code', 'URINALYSIS W/REFLEX MICRO'
FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2226', 'order_code', 'URIC ACID'
FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2216', 'order_code', 'GGT'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4288', 'order_code', 'HOMOCYSTEINE'
FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2092', 'order_code', 'FIBRINOGEN'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2606', 'order_code', 'PSA, TOTAL'
FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2737', 'order_code', 'HEPATITIS B SURFACE AB'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b surface antibody%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4675', 'order_code', 'HEPATITIS C ANTIBODY'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c antibody%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '3540', 'order_code', 'HIV 1/2 4TH GEN, RFLX CONF'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '3500', 'order_code', 'RPR'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4513', 'order_code', 'THYROID PEROXIDASE AB'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase antibody%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4516', 'order_code', 'THYROGLOBULIN AB'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin antibody%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4725', 'order_code', 'TTG IgA'
FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1055', 'order_code', 'SEDIMENTATION RATE'
FROM tests t WHERE LOWER(t.test_name) LIKE '%sed rate%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1051', 'order_code', 'RETICULOCYTE WITH ABSOLUTE'
FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2720', 'order_code', 'HEMOGLOBIN ELECTROPHORESIS'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hemoglobin electrophoresis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4231', 'order_code', 'GASTRIN'
FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%'
ON CONFLICT DO NOTHING;

