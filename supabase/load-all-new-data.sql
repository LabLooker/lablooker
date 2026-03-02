-- ============================================================================
-- UNIFIED DATA LOAD: Lab Codes + DTC Pricing
-- Generated: 2026-03-02
-- Safe to run multiple times (idempotent via ON CONFLICT DO NOTHING)
-- ============================================================================

-- ============================================================================
-- SECTION 1: LAB_CODES — Quest Diagnostics, LabCorp, ARUP, Mayo Clinic Labs
-- Source: lab-codes-expanded.sql (~200 rows)
-- ============================================================================

-- QUEST DIAGNOSTICS
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '6399', 'order_code', 'CBC with Differential/Platelet; CPT 85025'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' OR LOWER(t.test_name) LIKE '%complete blood count%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '10231', 'order_code', 'Comprehensive Metabolic Panel; CPT 80053'
FROM tests t WHERE LOWER(t.test_name) LIKE '%comprehensive metabolic%' OR LOWER(t.test_name) LIKE '%cmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '10165', 'order_code', 'Basic Metabolic Panel; CPT 80048'
FROM tests t WHERE LOWER(t.test_name) LIKE '%basic metabolic%' OR LOWER(t.test_name) LIKE '%bmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '899', 'order_code', 'TSH; CPT 84443'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '34429', 'order_code', 'Free T3; CPT 84481'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '866', 'order_code', 'Free T4; CPT 84439'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '7600', 'order_code', 'Lipid Panel; CPT 80061'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '496', 'order_code', 'HbA1c; CPT 83036'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%hemoglobin a1c%' OR LOWER(t.test_name) LIKE '%a1c%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '17306', 'order_code', 'Vitamin D 25-Hydroxy Total; CPT 82306'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%25%' OR LOWER(t.test_name) LIKE '%25-hydroxy%vitamin d%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '457', 'order_code', 'Ferritin; CPT 82728'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '7573', 'order_code', 'Iron and TIBC; CPT 83540, 83550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '10124', 'order_code', 'hs-CRP; CPT 86141'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '809', 'order_code', 'ESR/Sed Rate; CPT 85652'
FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' OR LOWER(t.test_name) LIKE '%sedimentation%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '249', 'order_code', 'ANA with Reflex Titer; CPT 86235'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '15983', 'order_code', 'Testosterone Total LC/MS-MS; CPT 84403'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' OR LOWER(t.test_name) LIKE '%total testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '36170', 'order_code', 'Testosterone Free (Dialysis); CPT 84402'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '4021', 'order_code', 'Estradiol; CPT 82670'
FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '746', 'order_code', 'Progesterone; CPT 84144'
FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '7137', 'order_code', 'FSH; CPT 83001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' OR LOWER(t.test_name) LIKE '%follicle%stimulating%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '8663', 'order_code', 'LH; CPT 83002'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '402', 'order_code', 'DHEA-Sulfate; CPT 82627'
FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '959', 'order_code', 'IGF-1; CPT 84305'
FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '367', 'order_code', 'Cortisol AM; CPT 82533'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '561', 'order_code', 'Insulin Fasting; CPT 83525'
FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '927', 'order_code', 'Vitamin B12; CPT 82607'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '466', 'order_code', 'Folate; CPT 82746'
FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' OR LOWER(t.test_name) LIKE '%folic acid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '622', 'order_code', 'Magnesium; CPT 83735'
FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '718', 'order_code', 'Phosphorus; CPT 84100'
FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '16244', 'order_code', 'PTH Intact; CPT 83970'
FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '935', 'order_code', 'Calcium Ionized; CPT 82330'
FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium%ionized%' OR LOWER(t.test_name) LIKE '%ionized calcium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '8463', 'order_code', 'Urinalysis Complete; CPT 81001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '905', 'order_code', 'Uric Acid; CPT 84550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '330', 'order_code', 'GGT; CPT 82977'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' OR LOWER(t.test_name) LIKE '%gamma%glutamyl%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '31789', 'order_code', 'Homocysteine; CPT 83090'
FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '825', 'order_code', 'Fibrinogen Activity; CPT 85384'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '5363', 'order_code', 'PSA Total; CPT 84153'
FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '498', 'order_code', 'Hepatitis B Surface Antibody; CPT 86706'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b%surface%' OR LOWER(t.test_name) LIKE '%hbsag%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '8472', 'order_code', 'Hepatitis C Antibody; CPT 86803'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '91431', 'order_code', 'HIV 1/2 Ag/Ab 4th Gen; CPT 87389'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '795', 'order_code', 'RPR Syphilis Screen; CPT 86592'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '5765', 'order_code', 'Thyroid Peroxidase Ab; CPT 86376'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '267', 'order_code', 'Thyroglobulin Antibody; CPT 86800'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '19513', 'order_code', 'Celiac Panel (tTG IgA + Total IgA)'
FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '802', 'order_code', 'Reticulocyte Count; CPT 85045'
FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '915', 'order_code', 'Hemoglobin Electrophoresis; CPT 83020'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hemoglobin electrophoresis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '36498', 'order_code', 'Soluble Transferrin Receptor (sTfR); CPT 84110'
FROM tests t WHERE LOWER(t.test_name) LIKE '%soluble transferrin%' OR LOWER(t.test_name) LIKE '%stfr%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '329', 'order_code', 'Gastrin; CPT 82941'
FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '746', 'order_code', 'Prolactin; CPT 84146'
FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%'
ON CONFLICT DO NOTHING;

-- LABCORP
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '005009', 'order_code', 'CBC with Differential; CPT 85025'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' OR LOWER(t.test_name) LIKE '%complete blood count%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '322000', 'order_code', 'Comprehensive Metabolic Panel (14); CPT 80053'
FROM tests t WHERE LOWER(t.test_name) LIKE '%comprehensive metabolic%' OR LOWER(t.test_name) LIKE '%cmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '303739', 'order_code', 'Basic Metabolic Panel (8); CPT 80048'
FROM tests t WHERE LOWER(t.test_name) LIKE '%basic metabolic%' OR LOWER(t.test_name) LIKE '%bmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004259', 'order_code', 'TSH; CPT 84443'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '010389', 'order_code', 'Free T3; CPT 84481'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001974', 'order_code', 'Free T4 Direct; CPT 84439'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '303756', 'order_code', 'Lipid Panel; CPT 80061'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001453', 'order_code', 'Hemoglobin A1c; CPT 83036'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%hemoglobin a1c%' OR LOWER(t.test_name) LIKE '%a1c%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '081950', 'order_code', 'Vitamin D 25-Hydroxy; CPT 82306'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%25%' OR LOWER(t.test_name) LIKE '%25-hydroxy%vitamin d%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004598', 'order_code', 'Ferritin; CPT 82728'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001321', 'order_code', 'Iron and TIBC; CPT 83540, 83550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '120766', 'order_code', 'hs-CRP Cardiac; CPT 86141'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '005215', 'order_code', 'ESR Westergren; CPT 85652'
FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' OR LOWER(t.test_name) LIKE '%sedimentation%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '164922', 'order_code', 'ANA Screen IFA; CPT 86235'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004226', 'order_code', 'Testosterone Total; CPT 84403'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' OR LOWER(t.test_name) LIKE '%total testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004515', 'order_code', 'Testosterone Free; CPT 84402'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004549', 'order_code', 'Estradiol; CPT 82670'
FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004317', 'order_code', 'Progesterone; CPT 84144'
FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004309', 'order_code', 'FSH; CPT 83001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' OR LOWER(t.test_name) LIKE '%follicle%stimulating%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004333', 'order_code', 'LH; CPT 83002'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004020', 'order_code', 'DHEA-Sulfate; CPT 82627'
FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004465', 'order_code', 'Prolactin; CPT 84146'
FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '010363', 'order_code', 'IGF-1; CPT 84305'
FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004051', 'order_code', 'Cortisol AM; CPT 82533'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004564', 'order_code', 'Insulin Fasting; CPT 83525'
FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '000810', 'order_code', 'Vitamin B12 and Folates; CPT 82607, 82746'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001537', 'order_code', 'Magnesium; CPT 83735'
FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001610', 'order_code', 'Phosphorus; CPT 84100'
FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '015610', 'order_code', 'PTH Intact; CPT 83970'
FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004101', 'order_code', 'Calcium Ionized; CPT 82330'
FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium%ionized%' OR LOWER(t.test_name) LIKE '%ionized calcium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '003772', 'order_code', 'Urinalysis Complete; CPT 81001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001057', 'order_code', 'Uric Acid; CPT 84550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001172', 'order_code', 'GGT; CPT 82977'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' OR LOWER(t.test_name) LIKE '%gamma%glutamyl%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '706994', 'order_code', 'Homocysteine; CPT 83090'
FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '010322', 'order_code', 'PSA Total; CPT 84153'
FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006510', 'order_code', 'Hepatitis B Surface Antibody; CPT 86706'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b%surface%' OR LOWER(t.test_name) LIKE '%hbsag%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006149', 'order_code', 'Hepatitis C Antibody; CPT 86803'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '083935', 'order_code', 'HIV 1/2 Ag/Ab 4th Gen; CPT 87389'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006072', 'order_code', 'RPR Syphilis Screen; CPT 86592'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006676', 'order_code', 'Thyroid Peroxidase Ab; CPT 86376'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006684', 'order_code', 'Thyroglobulin Antibody; CPT 86800'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '164756', 'order_code', 'Celiac Disease Panel; CPT 86364, 82784'
FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '005300', 'order_code', 'Reticulocyte Count; CPT 85045'
FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '005041', 'order_code', 'Hemoglobin Evaluation; CPT 83020'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hemoglobin electrophoresis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '143123', 'order_code', 'Soluble Transferrin Receptor; CPT 84110'
FROM tests t WHERE LOWER(t.test_name) LIKE '%soluble transferrin%' OR LOWER(t.test_name) LIKE '%stfr%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001594', 'order_code', 'Gastrin; CPT 82941'
FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001610', 'order_code', 'Fibrinogen Activity; CPT 85384'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%'
ON CONFLICT DO NOTHING;

-- ARUP LABORATORIES
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040003', 'order_code', 'CBC with Differential; CPT 85025'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020421', 'order_code', 'CMP; CPT 80053'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020408', 'order_code', 'BMP; CPT 80048'
FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070106', 'order_code', 'TSH; CPT 84443'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070104', 'order_code', 'Free T3; CPT 84481'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070105', 'order_code', 'Free T4; CPT 84439'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020415', 'order_code', 'Lipid Panel; CPT 80061'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070095', 'order_code', 'HbA1c; CPT 83036'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070215', 'order_code', 'Vitamin D 25-OH; CPT 82306; LC-MS/MS'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070065', 'order_code', 'Ferritin; CPT 82728'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020036', 'order_code', 'Iron and TIBC; CPT 83540, 83550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070049', 'order_code', 'hs-CRP; CPT 86141'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040060', 'order_code', 'ESR; CPT 85652'
FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050370', 'order_code', 'ANA Screen IFA; CPT 86235'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070130', 'order_code', 'Testosterone Total; CPT 84403'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070131', 'order_code', 'Free Testosterone; CPT 84402'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0093247', 'order_code', 'Estradiol (MS); CPT 82670'
FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070100', 'order_code', 'Progesterone; CPT 84144'
FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070067', 'order_code', 'FSH; CPT 83001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070082', 'order_code', 'LH; CPT 83002'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070051', 'order_code', 'DHEA-Sulfate; CPT 82627'
FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070099', 'order_code', 'Prolactin; CPT 84146'
FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070079', 'order_code', 'IGF-1; CPT 84305'
FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070047', 'order_code', 'Cortisol AM; CPT 82533'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070080', 'order_code', 'Insulin; CPT 83525'
FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070214', 'order_code', 'Vitamin B12; CPT 82607'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070066', 'order_code', 'Folate; CPT 82746'
FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020034', 'order_code', 'Magnesium; CPT 83735'
FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020039', 'order_code', 'Phosphorus; CPT 84100'
FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070098', 'order_code', 'PTH Intact; CPT 83970'
FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020019', 'order_code', 'Calcium Ionized; CPT 82330'
FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium%ionized%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020468', 'order_code', 'Urinalysis; CPT 81001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020044', 'order_code', 'Uric Acid; CPT 84550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020026', 'order_code', 'GGT; CPT 82977'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070078', 'order_code', 'Homocysteine; CPT 83090'
FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040050', 'order_code', 'Fibrinogen Activity; CPT 85384'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070101', 'order_code', 'PSA Total; CPT 84153'
FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050126', 'order_code', 'Hep B Surface Ab; CPT 86706'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b%surface%' OR LOWER(t.test_name) LIKE '%hbsag%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050189', 'order_code', 'Hep C Ab; CPT 86803'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0051339', 'order_code', 'HIV 1/2 4th Gen; CPT 87389'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050233', 'order_code', 'RPR; CPT 86592'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050550', 'order_code', 'TPO Ab; CPT 86376'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050548', 'order_code', 'Thyroglobulin Ab; CPT 86800'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '2002650', 'order_code', 'Celiac Disease Panel'
FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040012', 'order_code', 'Reticulocyte Count; CPT 85045'
FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040019', 'order_code', 'Hemoglobin Evaluation; CPT 83020'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hemoglobin electrophoresis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '2002283', 'order_code', 'sTfR; CPT 84110'
FROM tests t WHERE LOWER(t.test_name) LIKE '%soluble transferrin%' OR LOWER(t.test_name) LIKE '%stfr%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070068', 'order_code', 'Gastrin; CPT 82941'
FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- MAYO CLINIC LABS
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CBC/9109', 'order_code', 'CBC; CPT 85025'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CMP/85021', 'order_code', 'CMP; CPT 80053'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'BMP/85014', 'order_code', 'BMP; CPT 80048'
FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'STSH/8939', 'order_code', 'TSH; CPT 84443'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FT3/8945', 'order_code', 'Free T3; CPT 84481'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FT4/8942', 'order_code', 'Free T4; CPT 84439'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'LPDP/8309', 'order_code', 'Lipid Panel; CPT 80061'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'A1C/82105', 'order_code', 'HbA1c; CPT 83036'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'DHVIT/83670', 'order_code', 'Vitamin D 25-OH; CPT 82306'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FERR1/619953', 'order_code', 'Ferritin; CPT 82728'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'TIBC/2501', 'order_code', 'Iron/TIBC; CPT 83540,83550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HSCRP/82047', 'order_code', 'hs-CRP; CPT 86141'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'SEDRT/2462', 'order_code', 'ESR; CPT 85652'
FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FANA/83165', 'order_code', 'ANA IFA; CPT 86235'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'TTST/83686', 'order_code', 'Testosterone Total; CPT 84403'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'TFTST/9324', 'order_code', 'Testosterone Free; CPT 84402'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'EEST/31599', 'order_code', 'Estradiol; CPT 82670'
FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'PRGN/8141', 'order_code', 'Progesterone; CPT 84144'
FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FSH/8670', 'order_code', 'FSH; CPT 83001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'LH/8283', 'order_code', 'LH; CPT 83002'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'DHEA/9429', 'order_code', 'DHEA-S; CPT 82627'
FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'PRL/8690', 'order_code', 'Prolactin; CPT 84146'
FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'IGF1/80601', 'order_code', 'IGF-1; CPT 84305'
FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CORT/8545', 'order_code', 'Cortisol AM; CPT 82533'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'INSF/8684', 'order_code', 'Insulin; CPT 83525'
FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'B12/31789', 'order_code', 'Vitamin B12; CPT 82607'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FOL/31408', 'order_code', 'Folate; CPT 82746'
FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'MG/8622', 'order_code', 'Magnesium; CPT 83735'
FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'PHOS/8507', 'order_code', 'Phosphorus; CPT 84100'
FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'IPTH/82798', 'order_code', 'PTH Intact; CPT 83970'
FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CAIO/9281', 'order_code', 'Calcium Ionized; CPT 82330'
FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium%ionized%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'UAM/8599', 'order_code', 'Urinalysis; CPT 81001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'UA/8509', 'order_code', 'Uric Acid; CPT 84550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'GGT/8677', 'order_code', 'GGT; CPT 82977'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HCYSP/9068', 'order_code', 'Homocysteine; CPT 83090'
FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FIB/9346', 'order_code', 'Fibrinogen; CPT 85384'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'PSA/8598', 'order_code', 'PSA Total; CPT 84153'
FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HBSAB/8361', 'order_code', 'Hep B Surface Ab; CPT 86706'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b%surface%' OR LOWER(t.test_name) LIKE '%hbsag%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HCVAB/82539', 'order_code', 'Hep C Ab; CPT 86803'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HIVCA/62693', 'order_code', 'HIV 1/2 4th Gen; CPT 87389'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'RPR/9028', 'order_code', 'RPR; CPT 86592'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'ATPO/8336', 'order_code', 'TPO Ab; CPT 86376'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'APTS/8344', 'order_code', 'Thyroglobulin Ab; CPT 86800'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CELI/63246', 'order_code', 'Celiac Disease Panel'
FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'RETIC/9788', 'order_code', 'Reticulocyte Count; CPT 85045'
FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HEVP/84158', 'order_code', 'Hemoglobin Evaluation; CPT 83020'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hemoglobin electrophoresis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'STFR/80089', 'order_code', 'sTfR; CPT 84110'
FROM tests t WHERE LOWER(t.test_name) LIKE '%soluble transferrin%' OR LOWER(t.test_name) LIKE '%stfr%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'GAST/8204', 'order_code', 'Gastrin; CPT 82941'
FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 2: LAB_CODES — CPL (Clinical Pathology Laboratories)
-- Source: cpl-codes.sql (~50 rows)
-- ============================================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1000', 'order_code', 'CBC W/AUTO DIFF WITH PLATELETS' FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '9179', 'order_code', 'COMPREHENSIVE METABOLIC PANEL' FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '142', 'order_code', 'BASIC METABOLIC PANEL' FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4274', 'order_code', 'ULTRASENSITIVE TSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4273', 'order_code', 'FREE T3' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2823', 'order_code', 'FREE T4' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '173', 'order_code', 'LIPID PANEL' FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2708', 'order_code', 'HEMOGLOBIN A1c' FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4958', 'order_code', 'VITAMIN D, 25 OH' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2090', 'order_code', 'FERRITIN' FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2118', 'order_code', 'IRON BINDING CAPACITY' FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '5083', 'order_code', 'HIGH SENSITIVITY CRP' FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1055', 'order_code', 'SEDIMENTATION RATE' FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '3550', 'order_code', 'ANA WITH REFLEX TITER' FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '414300', 'order_code', 'TESTOSTERONE, TOTAL' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4937', 'order_code', 'TESTOSTERONE, FREE/TOTAL WITH SHBG' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2675', 'order_code', 'ESTRADIOL' FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2790', 'order_code', 'PROGESTERONE' FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '438', 'order_code', 'FSH + LH PROFILE' FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2776', 'order_code', 'LUTEINIZING HORMONE' FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4225', 'order_code', 'DHEA SULFATE' FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2800', 'order_code', 'PROLACTIN' FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4920', 'order_code', 'IGF-I' FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2655', 'order_code', 'CORTISOL' FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2760', 'order_code', 'INSULIN' FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2840', 'order_code', 'VITAMIN B-12' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2695', 'order_code', 'FOLIC ACID' FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2130', 'order_code', 'MAGNESIUM' FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2227', 'order_code', 'PHOSPHORUS' FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2814', 'order_code', 'INTACT PTH' FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2236', 'order_code', 'CALCIUM, IONIZED' FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium%ionized%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1501', 'order_code', 'URINALYSIS W/REFLEX MICRO' FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2226', 'order_code', 'URIC ACID' FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2216', 'order_code', 'GGT' FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4288', 'order_code', 'HOMOCYSTEINE' FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2092', 'order_code', 'FIBRINOGEN' FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2606', 'order_code', 'PSA, TOTAL' FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4675', 'order_code', 'HEPATITIS C ANTIBODY' FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '3540', 'order_code', 'HIV 1/2 4TH GEN' FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '3500', 'order_code', 'RPR' FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4513', 'order_code', 'THYROID PEROXIDASE AB' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4516', 'order_code', 'THYROGLOBULIN AB' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4725', 'order_code', 'TTG IgA' FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '1051', 'order_code', 'RETICULOCYTE WITH ABSOLUTE' FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '2720', 'order_code', 'HEMOGLOBIN ELECTROPHORESIS' FROM tests t WHERE LOWER(t.test_name) LIKE '%hemoglobin electrophoresis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'CPL', '4231', 'order_code', 'GASTRIN' FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 3: LAB_CODES — Clinical Labs of Hawaii (Sonic Healthcare)
-- Source: sonic-codes.sql, transformed from lab_test_codes to lab_codes
-- ============================================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0360', 'order_code', 'CBC Complete Blood Count w/ Diff' FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '2053', 'order_code', 'Comprehensive Metabolic Chemistry Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '2048', 'order_code', 'Basic Metabolic Chemistry BMP Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0261', 'order_code', 'TSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '2554', 'order_code', 'T3, Free' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0268', 'order_code', 'Free T4' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0242', 'order_code', 'Lipid Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '2712', 'order_code', 'Hemoglobin A1C' FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '4187', 'order_code', '25-OH Vitamin D2 D3' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0075', 'order_code', 'Ferritin' FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0019', 'order_code', 'Iron Profile w/ TIBC & % Sat' FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '1666', 'order_code', 'CRP Highly Sensitive' FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0382', 'order_code', 'ESR (Westergren)' FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '4766', 'order_code', 'Testosterone Free & Total by MS' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0258', 'order_code', 'Estradiol' FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '3249', 'order_code', 'Progesterone' FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0252', 'order_code', 'FSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0253', 'order_code', 'LH' FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '8018', 'order_code', 'DHEA Sulfate' FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0257', 'order_code', 'Prolactin' FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '4824', 'order_code', 'IGF-1' FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '2543', 'order_code', 'Cortisol Baseline' FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '2555', 'order_code', 'Insulin Fasting' FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '7320', 'order_code', 'Folate and B12' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0076', 'order_code', 'Folate' FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0101', 'order_code', 'Magnesium' FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0104', 'order_code', 'Phosphorus' FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0797', 'order_code', 'PTH Intact' FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '4380', 'order_code', 'Ionized Calcium' FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium%ionized%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0300', 'order_code', 'Urinalysis Complete' FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0165', 'order_code', 'Uric Acid' FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0077', 'order_code', 'GGTP (GGT)' FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '6828', 'order_code', 'Homocysteine Total' FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0357', 'order_code', 'Fibrinogen' FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '0481', 'order_code', 'PSA Total' FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '4394', 'order_code', 'HIV 1/2 Qualitative' FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '2491', 'order_code', 'RPR with Reflex' FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Clinical Labs of Hawaii', '2816', 'order_code', 'Gastrin' FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 4: LAB_CODES — American Esoteric Labs (AEL, Sonic Healthcare)
-- Source: sonic-codes.sql, transformed
-- ============================================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'H010', 'order_code', 'CBC with Differential; CBCD' FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C010', 'order_code', 'CMP with eGFR; CMPGFR' FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C011', 'order_code', 'BMP; BMPGFR' FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E423', 'order_code', 'TSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E426', 'order_code', 'Free T3; FT3' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E429', 'order_code', 'Free T4; FT4' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C014', 'order_code', 'Lipid Panel; LPP' FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C114', 'order_code', 'HbA1c; HA1C' FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E751', 'order_code', '25-OH Vitamin D; VD' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E278', 'order_code', 'Ferritin; FERR' FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C133', 'order_code', 'Iron/TIBC; IRO' FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C180', 'order_code', 'hs-CRP; CCRP' FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'H214', 'order_code', 'ESR; ESR' FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'F226', 'order_code', 'ANA; FANA' FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E572', 'order_code', 'Testosterone Total; TESTOS' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E501', 'order_code', 'Testosterone Free LC-MS/MS; FTESMS' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E523', 'order_code', 'Estradiol; E26III' FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E548', 'order_code', 'Progesterone; BPROG' FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E498', 'order_code', 'FSH; BFSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E538', 'order_code', 'LH; BLH' FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E485', 'order_code', 'DHEA-S; DHES' FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E550', 'order_code', 'Prolactin; BPRL' FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E216', 'order_code', 'IGF-1; SOMC' FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E482', 'order_code', 'Cortisol; COR' FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E521', 'order_code', 'Insulin; INS' FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E747', 'order_code', 'Vitamin B12; B12' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E736', 'order_code', 'Folate Serum; FOL' FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C132', 'order_code', 'Magnesium; MAG' FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C130', 'order_code', 'Phosphorus; PHOS' FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E188', 'order_code', 'PTH Intact; PTH' FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'K004', 'order_code', 'Urinalysis w/Micro; URM' FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C191', 'order_code', 'Uric Acid; URA' FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'C153', 'order_code', 'GGT' FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E047', 'order_code', 'Homocysteine; HCYS' FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'I206', 'order_code', 'Fibrinogen Quantitative; QF' FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E594', 'order_code', 'PSA Total' FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'F740', 'order_code', 'HIV 1/2 4th Gen; HIVS' FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'F235', 'order_code', 'RPR Screen; RPR' FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'F803', 'order_code', 'TPO Ab; TPO' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'F801', 'order_code', 'Thyroglobulin Ab Panel; THYA' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'American Esoteric Labs', 'E041', 'order_code', 'Gastrin' FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 5: LAB_CODES — Interpath Laboratory (Regional, Pacific NW)
-- Source: regional-lab-codes.sql, transformed
-- ============================================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '3002', 'order_code', 'CBC with ANC' FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '1943', 'order_code', 'CMP' FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '1942', 'order_code', 'BMP' FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2090', 'order_code', 'TSH 3rd Gen' FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2296', 'order_code', 'Free T3' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2146', 'order_code', 'Free T4' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '1454', 'order_code', 'Lipid Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2051', 'order_code', 'HbA1c Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2655', 'order_code', 'Vitamin D 25-OH' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2074', 'order_code', 'Ferritin' FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2040', 'order_code', 'Iron and TIBC' FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2560', 'order_code', 'hs-CRP' FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '3105', 'order_code', 'ESR' FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '1747', 'order_code', 'ANA' FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2179', 'order_code', 'Testosterone Total' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '5025', 'order_code', 'Testosterone Free/Total' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2231', 'order_code', 'Estradiol' FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2300', 'order_code', 'Progesterone' FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2166', 'order_code', 'FSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2167', 'order_code', 'LH' FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2214', 'order_code', 'DHEA-S' FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2131', 'order_code', 'Prolactin' FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2738', 'order_code', 'IGF-1' FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2880', 'order_code', 'Cortisol' FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2227', 'order_code', 'Insulin Fasting' FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2126', 'order_code', 'Vitamin B12' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2127', 'order_code', 'Folate' FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2042', 'order_code', 'Magnesium' FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '1012', 'order_code', 'Phosphorus' FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '5026', 'order_code', 'PTH Intact' FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '3300', 'order_code', 'Urinalysis' FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '1013', 'order_code', 'Uric Acid' FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2019', 'order_code', 'GGT' FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2224', 'order_code', 'Homocysteine' FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2054', 'order_code', 'Fibrinogen' FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2147', 'order_code', 'PSA' FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2845', 'order_code', 'HIV 1/2 4th Gen' FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '1003', 'order_code', 'Syphilis Screening Cascade' FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2754', 'order_code', 'Anti-TPO' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2755', 'order_code', 'Anti-Thyroglobulin' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '2752', 'order_code', 'tTG IgA (Celiac)' FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '3120', 'order_code', 'Reticulocyte Count' FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Interpath Laboratory', '91108', 'order_code', 'Gastrin' FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 6: LAB_CODES — Cleveland Clinic (Hospital, mnemonic codes)
-- Source: hospital-codes.sql, transformed
-- ============================================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'CBC', 'mnemonic', 'CBC' FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'CMP', 'mnemonic', 'Comprehensive Metabolic Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'BMP', 'mnemonic', 'Basic Metabolic Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'TSH', 'mnemonic', 'TSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'FREET3', 'mnemonic', 'Free T3' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'FT4', 'mnemonic', 'Free T4' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'LIPB', 'mnemonic', 'Lipid Panel Fasting' FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'HBA1C', 'mnemonic', 'HbA1c' FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'VITD', 'mnemonic', 'Vitamin D 25-OH' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'FERR', 'mnemonic', 'Ferritin' FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'FETIBC', 'mnemonic', 'Iron/TIBC' FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'HSCRP', 'mnemonic', 'hs-CRP' FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'WSR', 'mnemonic', 'ESR/Sed Rate' FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'ANAS', 'mnemonic', 'ANA' FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'TESTOS', 'mnemonic', 'Testosterone Total' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'FTESTO', 'mnemonic', 'Testosterone Free' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'ESTDL', 'mnemonic', 'Estradiol' FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'PROG', 'mnemonic', 'Progesterone' FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'FSH', 'mnemonic', 'FSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'LH', 'mnemonic', 'LH' FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'DHEAS', 'mnemonic', 'DHEA-S' FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'PROL', 'mnemonic', 'Prolactin' FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'ILG', 'mnemonic', 'IGF-1 with Z-Score' FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'CORT', 'mnemonic', 'Cortisol' FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'INS', 'mnemonic', 'Insulin' FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'B12', 'mnemonic', 'Vitamin B12' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'FOL', 'mnemonic', 'Folate' FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'MG', 'mnemonic', 'Magnesium' FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'PHOS', 'mnemonic', 'Phosphorus' FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'PTHI', 'mnemonic', 'PTH Intact' FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'UA', 'mnemonic', 'Urinalysis' FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'URIC', 'mnemonic', 'Uric Acid' FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'GGT', 'mnemonic', 'GGT' FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'HOMO', 'mnemonic', 'Homocysteine' FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'FIB', 'mnemonic', 'Fibrinogen' FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'PSA', 'mnemonic', 'PSA' FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'HIV', 'mnemonic', 'HIV 1/2 Ag/Ab' FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'RPR', 'mnemonic', 'RPR' FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'MICRO', 'mnemonic', 'TPO Ab' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'TGAB', 'mnemonic', 'Thyroglobulin Ab' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'TTG', 'mnemonic', 'tTG IgA (Celiac)' FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'RETIC', 'mnemonic', 'Reticulocyte Count' FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Cleveland Clinic', 'GAST', 'mnemonic', 'Gastrin' FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 7: LAB_CODES — Geisinger Medical Labs (Hospital, LABxxxx codes)
-- Source: hospital-codes.sql, transformed
-- ============================================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB1961', 'lab_id', 'CBC' FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2069', 'lab_id', 'CMP' FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB1826', 'lab_id', 'BMP' FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3204', 'lab_id', 'TSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3123', 'lab_id', 'Free T3' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3128', 'lab_id', 'Free T4' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2613', 'lab_id', 'Lipid Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2415', 'lab_id', 'HbA1c' FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB1489', 'lab_id', 'Vitamin D 25-OH' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2275', 'lab_id', 'Ferritin' FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2556', 'lab_id', 'Iron/TIBC' FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2101', 'lab_id', 'hs-CRP' FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2234', 'lab_id', 'ESR' FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB1767', 'lab_id', 'ANA' FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3139', 'lab_id', 'Testosterone Total' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3137', 'lab_id', 'Testosterone Free' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%free%' OR LOWER(t.test_name) LIKE '%free testosterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2236', 'lab_id', 'Estradiol' FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2923', 'lab_id', 'Progesterone' FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2318', 'lab_id', 'FSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2608', 'lab_id', 'LH' FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2180', 'lab_id', 'DHEA-S' FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2925', 'lab_id', 'Prolactin' FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2542', 'lab_id', 'IGF-1' FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2080', 'lab_id', 'Cortisol' FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2538', 'lab_id', 'Insulin' FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3256', 'lab_id', 'Vitamin B12' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2302', 'lab_id', 'Folate' FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2644', 'lab_id', 'Magnesium' FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2846', 'lab_id', 'Phosphorus' FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2950', 'lab_id', 'PTH' FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3219', 'lab_id', 'Urinalysis' FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3214', 'lab_id', 'Uric Acid' FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2350', 'lab_id', 'GGT' FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2493', 'lab_id', 'Homocysteine' FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2283', 'lab_id', 'Fibrinogen' FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2944', 'lab_id', 'PSA' FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2467', 'lab_id', 'HIV 1/2' FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2976', 'lab_id', 'RPR' FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3160', 'lab_id', 'TPO Ab' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3158', 'lab_id', 'Thyroglobulin Ab' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3165', 'lab_id', 'tTG IgA (Celiac)' FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB3006', 'lab_id', 'Reticulocyte' FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Geisinger Medical Labs', 'LAB2340', 'lab_id', 'Gastrin' FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 8: LAB_CODES — Northwell Health Labs
-- Source: bioreference-acl-codes.sql, transformed
-- ============================================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5500290', 'order_code', 'CBC with Differential' FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5302006', 'order_code', 'COMPMETA (CMP)' FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5302000', 'order_code', 'METABOLIC (BMP)' FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300435', 'order_code', 'TSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5910011', 'order_code', 'Free Triiodothyronine (Free T3)' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300445', 'order_code', 'Thyroxine-Free (Free T4)' FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '1453599', 'order_code', 'LIPIDX' FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5302212', 'order_code', 'A1C Estimated Average Glucose' FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5901360', 'order_code', 'Vitamin D 25 Hydroxy' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300315', 'order_code', 'Ferritin' FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300335', 'order_code', 'Iron' FROM tests t WHERE LOWER(t.test_name) LIKE '%iron%tibc%' OR LOWER(t.test_name) LIKE '%iron panel%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5901702', 'order_code', 'CRP Cardiac (hs-CRP)' FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5500316', 'order_code', 'ESR' FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5700066', 'order_code', 'ANA' FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5302950', 'order_code', 'Testosterone Total' FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5302160', 'order_code', 'Estradiol' FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5302495', 'order_code', 'Progesterone' FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300405', 'order_code', 'FSH' FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300410', 'order_code', 'LH' FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5900535', 'order_code', 'DHEA-S' FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300375', 'order_code', 'Prolactin' FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5900868', 'order_code', 'IGF-1' FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300325', 'order_code', 'Cortisol AM' FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5302970', 'order_code', 'Insulin' FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300385', 'order_code', 'Vitamin B12' FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300390', 'order_code', 'Folate' FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300255', 'order_code', 'Magnesium' FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300065', 'order_code', 'Phosphorus' FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5902666', 'order_code', 'PTH Intact with Calcium' FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5600046', 'order_code', 'Urinalysis with Rflx Culture' FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300240', 'order_code', 'Uric Acid' FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5300140', 'order_code', 'GGT' FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5900785', 'order_code', 'Homocysteine' FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5500571', 'order_code', 'Fibrinogen Clauss' FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5302500', 'order_code', 'PSA' FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5308002', 'order_code', 'HIV AG/AB Screen' FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5963017', 'order_code', 'Syphilis Titer' FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%syphilis%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5915422', 'order_code', 'TPO Ab' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%' OR LOWER(t.test_name) LIKE '%anti-tpo%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5900117', 'order_code', 'Thyroglobulin' FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5711044', 'order_code', 'Celiac Panel' FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5500355', 'order_code', 'Reticulocyte Count' FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%' ON CONFLICT DO NOTHING;
INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Northwell Health Labs', '5900160', 'order_code', 'Gastrin' FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%' ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 9: DTC LAB PROVIDERS (labs table)
-- Source: dtc-pricing-expanded.sql
-- NOTE: DTC pricing uses hardcoded UUID test/lab IDs from the original file.
-- These will only work if tests were seeded with matching UUIDs.
-- The pricing inserts below reference those same IDs.
-- ============================================================================

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, notes) VALUES
('b0000001-0000-0000-0000-000000000000', 'Ulta Lab Tests', 'https://www.ultalabtests.com', 'intermediary', 'Quest', '$12.95 requisition fee per order; blacklisted: NY,NJ,RI'),
('b0000002-0000-0000-0000-000000000000', 'Walk-In Lab', 'https://www.walkinlab.com', 'intermediary', 'Quest + LabCorp', '$0 req fee; blacklisted: NY,NJ,RI (Quest), +MA,MD (LabCorp)'),
('b0000003-0000-0000-0000-000000000000', 'HealthLabs', 'https://www.healthlabs.com', 'intermediary', 'Quest + LabCorp', '$0 req fee; blacklisted: MD,NJ,NY,RI'),
('b0000004-0000-0000-0000-000000000000', 'Request A Test', 'https://requestatest.com', 'intermediary', 'Quest + LabCorp', '$4 req fee per order; blacklisted: NY,NJ,RI (Quest), +MA,MD (LabCorp)'),
('b0000005-0000-0000-0000-000000000000', 'Private MD Labs', 'https://www.privatemdlabs.com', 'intermediary', 'Quest + LabCorp', '$0 req fee; blacklisted: NY,NJ,MA,MD,RI'),
('b0000006-0000-0000-0000-000000000000', 'DirectLabs', 'https://www.directlabs.com', 'intermediary', 'Quest', '$0 req fee; blacklisted: MD,NJ,NY,RI'),
('b0000007-0000-0000-0000-000000000000', 'Personalabs', 'https://www.personalabs.com', 'intermediary', 'Quest + LabCorp', '$0 req fee; blacklisted: NJ,RI,NY'),
('b0000008-0000-0000-0000-000000000000', 'Life Extension', 'https://www.lifeextension.com/lab-testing', 'intermediary', 'LabCorp', '$0 req fee; LabCorp only; blacklisted: NY,NJ,RI,MA'),
('b0000009-0000-0000-0000-000000000000', 'Jason Health', 'https://www.jasonhealth.com', 'intermediary', 'Quest', '$18 req fee per order; lowest base prices; blacklisted: NY,NJ,RI'),
('b0000010-0000-0000-0000-000000000000', 'LabsMD', 'https://www.labsmd.com', 'intermediary', 'Quest', '$0 req fee; blacklisted: NY,NJ,MA,MD,RI')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 10: DTC PRICING DATA
-- Source: dtc-pricing-expanded.sql (~490 rows across 10 platforms)
-- NOTE: These use hardcoded UUID format test_id and lab_id.
-- If your tests table uses different UUIDs, these will fail silently
-- due to FK constraints. In that case, replace with test_name lookups.
-- ============================================================================

-- Ulta Lab Tests (b0000001) — prices include $12.95 req fee
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 28.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 28.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 28.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%bmp%' OR LOWER(t.test_name) LIKE '%basic metabolic%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 30.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 28.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 33.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 58.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 33.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 55.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 48.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 55.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 37.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 44.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000001-0000-0000-0000-000000000000'::uuid, 55.85, false FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' LIMIT 1 ON CONFLICT DO NOTHING;

-- Walk-In Lab (b0000002) — $0 req fee
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 26.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 28.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 29.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 29.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 29.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 59.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 29.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 55.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 49.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 59.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 39.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000002-0000-0000-0000-000000000000'::uuid, 59.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' LIMIT 1 ON CONFLICT DO NOTHING;

-- Jason Health (b0000009) — $18 req fee (prices shown are BASE, add $18)
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 5.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 8.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 10.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 10.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 15.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 40.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 15.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 35.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 30.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 40.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 25.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000009-0000-0000-0000-000000000000'::uuid, 40.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' LIMIT 1 ON CONFLICT DO NOTHING;

-- Life Extension (b0000008) — $0 req fee, LabCorp only
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 30.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 35.75, false FROM tests t WHERE LOWER(t.test_name) LIKE '%cmp%' OR LOWER(t.test_name) LIKE '%comprehensive metabolic%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 30.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 30.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 33.75, false FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%a1c%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 36.75, false FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 30.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 42.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone%total%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 42.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 56.25, false FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 42.00, false FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%' LIMIT 1 ON CONFLICT DO NOTHING;
INSERT INTO pricing (test_id, lab_id, price, requires_rx) SELECT t.id, 'b0000008-0000-0000-0000-000000000000'::uuid, 56.25, false FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%' LIMIT 1 ON CONFLICT DO NOTHING;

-- NOTE: The full DTC pricing data (all 10 platforms × 49 tests = ~490 rows)
-- is available in dtc-pricing-expanded.sql with hardcoded UUIDs.
-- Above is a representative subset using test_name lookups for the most
-- popular platforms (Ulta, Walk-In Lab, Jason Health, Life Extension).
-- To load the FULL pricing data, use the original dtc-pricing-expanded.sql
-- directly IF your test IDs match the hardcoded UUIDs in that file.

-- ============================================================================
-- END OF UNIFIED LOAD
-- ============================================================================
