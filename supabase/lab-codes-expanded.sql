-- Lab Codes Expanded Insert
-- Generated 2026-03-01 from public lab test directories
-- Covers: Quest Diagnostics, LabCorp, ARUP Laboratories, Mayo Clinic Labs
-- 50 core tests × 4 labs = ~200 rows

-- ============================================================
-- QUEST DIAGNOSTICS
-- ============================================================

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
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' OR LOWER(t.test_name) LIKE '%thyroid stimulating%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '34429', 'order_code', 'Free T3; CPT 84481'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' OR LOWER(t.test_name) LIKE '%free triiodothyronine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '866', 'order_code', 'Free T4; CPT 84439'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' OR LOWER(t.test_name) LIKE '%free thyroxine%'
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
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron panel%' OR LOWER(t.test_name) LIKE '%iron%tibc%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '4420', 'order_code', 'CRP Quantitative; CPT 86140'
FROM tests t WHERE LOWER(t.test_name) LIKE '%crp%' AND LOWER(t.test_name) NOT LIKE '%hs-crp%' AND LOWER(t.test_name) NOT LIKE '%high%sens%'
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
SELECT t.id, 'Quest Diagnostics', '15983', 'order_code', 'Testosterone Total LC/MS-MS; CPT 84403; CDC-certified'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone total%' OR LOWER(t.test_name) LIKE '%total testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '36170', 'order_code', 'Testosterone Free (Dialysis); CPT 84402, 84403'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone free%' OR LOWER(t.test_name) LIKE '%free testosterone%'
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
SELECT t.id, 'Quest Diagnostics', '746', 'order_code', 'Prolactin; CPT 84146'
FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%'
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
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b%surface%ab%' OR LOWER(t.test_name) LIKE '%hep b%surface%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '8472', 'order_code', 'Hepatitis C Antibody; CPT 86803'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%' OR LOWER(t.test_name) LIKE '%hep c%ab%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '91431', 'order_code', 'HIV 1/2 Ag/Ab 4th Gen; CPT 87389'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '795', 'order_code', 'RPR Syphilis Screen; CPT 86592'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%vdrl%' OR LOWER(t.test_name) LIKE '%syphilis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '5765', 'order_code', 'Thyroid Peroxidase Ab; CPT 86376'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '267', 'order_code', 'Thyroglobulin Antibody; CPT 86800'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%ab%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Quest Diagnostics', '19513', 'order_code', 'Celiac Panel (tTG IgA + Total IgA); CPT 86364, 82784'
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
SELECT t.id, 'Quest Diagnostics', '329', 'order_code', 'Gastrin; CPT 82941; Fasting, off PPI'
FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%'
ON CONFLICT DO NOTHING;

-- ============================================================
-- LABCORP
-- ============================================================

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
SELECT t.id, 'LabCorp', '004259', 'order_code', 'TSH; CPT 84443; ECLIA Roche cobas'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' OR LOWER(t.test_name) LIKE '%thyroid stimulating%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '010389', 'order_code', 'Free T3; CPT 84481'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' OR LOWER(t.test_name) LIKE '%free triiodothyronine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001974', 'order_code', 'Free T4 Direct; CPT 84439'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' OR LOWER(t.test_name) LIKE '%free thyroxine%'
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
SELECT t.id, 'LabCorp', '081950', 'order_code', 'Vitamin D 25-Hydroxy; CPT 82306; ICMA'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%25%' OR LOWER(t.test_name) LIKE '%25-hydroxy%vitamin d%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004598', 'order_code', 'Ferritin; CPT 82728'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '001321', 'order_code', 'Iron and TIBC; CPT 83540, 83550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron panel%' OR LOWER(t.test_name) LIKE '%iron%tibc%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006627', 'order_code', 'CRP Quantitative; CPT 86140'
FROM tests t WHERE LOWER(t.test_name) LIKE '%crp%' AND LOWER(t.test_name) NOT LIKE '%hs-crp%' AND LOWER(t.test_name) NOT LIKE '%high%sens%'
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
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone total%' OR LOWER(t.test_name) LIKE '%total testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '004515', 'order_code', 'Testosterone Free; CPT 84402'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone free%' OR LOWER(t.test_name) LIKE '%free testosterone%'
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
SELECT t.id, 'LabCorp', '000810', 'order_code', 'Folate (B12 and Folates combo); CPT 82746'
FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' OR LOWER(t.test_name) LIKE '%folic acid%'
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
SELECT t.id, 'LabCorp', '001610', 'order_code', 'Fibrinogen Activity; CPT 85384'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '010322', 'order_code', 'PSA Total; CPT 84153'
FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006510', 'order_code', 'Hepatitis B Surface Antibody; CPT 86706'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b%surface%ab%' OR LOWER(t.test_name) LIKE '%hep b%surface%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006149', 'order_code', 'Hepatitis C Antibody; CPT 86803'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%' OR LOWER(t.test_name) LIKE '%hep c%ab%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '083935', 'order_code', 'HIV 1/2 Ag/Ab 4th Gen; CPT 87389'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006072', 'order_code', 'RPR Syphilis Screen; CPT 86592'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%vdrl%' OR LOWER(t.test_name) LIKE '%syphilis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006676', 'order_code', 'Thyroid Peroxidase Ab; CPT 86376'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'LabCorp', '006684', 'order_code', 'Thyroglobulin Antibody; CPT 86800'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%ab%'
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

-- ============================================================
-- ARUP LABORATORIES
-- ============================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040003', 'order_code', 'CBC with Differential; CPT 85025'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' OR LOWER(t.test_name) LIKE '%complete blood count%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020421', 'order_code', 'Comprehensive Metabolic Panel; CPT 80053'
FROM tests t WHERE LOWER(t.test_name) LIKE '%comprehensive metabolic%' OR LOWER(t.test_name) LIKE '%cmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020408', 'order_code', 'Basic Metabolic Panel; CPT 80048'
FROM tests t WHERE LOWER(t.test_name) LIKE '%basic metabolic%' OR LOWER(t.test_name) LIKE '%bmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070106', 'order_code', 'TSH; CPT 84443'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' OR LOWER(t.test_name) LIKE '%thyroid stimulating%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070104', 'order_code', 'Free T3; CPT 84481'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' OR LOWER(t.test_name) LIKE '%free triiodothyronine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070105', 'order_code', 'Free T4; CPT 84439'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' OR LOWER(t.test_name) LIKE '%free thyroxine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020415', 'order_code', 'Lipid Panel; CPT 80061'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070095', 'order_code', 'HbA1c; CPT 83036'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%hemoglobin a1c%' OR LOWER(t.test_name) LIKE '%a1c%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070215', 'order_code', 'Vitamin D 25-Hydroxy; CPT 82306; LC-MS/MS'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%25%' OR LOWER(t.test_name) LIKE '%25-hydroxy%vitamin d%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070065', 'order_code', 'Ferritin; CPT 82728'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020036', 'order_code', 'Iron and TIBC; CPT 83540, 83550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron panel%' OR LOWER(t.test_name) LIKE '%iron%tibc%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070048', 'order_code', 'CRP Quantitative; CPT 86140'
FROM tests t WHERE LOWER(t.test_name) LIKE '%crp%' AND LOWER(t.test_name) NOT LIKE '%hs-crp%' AND LOWER(t.test_name) NOT LIKE '%high%sens%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070049', 'order_code', 'hs-CRP; CPT 86141'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040060', 'order_code', 'ESR Westergren; CPT 85652'
FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' OR LOWER(t.test_name) LIKE '%sedimentation%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050370', 'order_code', 'ANA Screen IFA; CPT 86235'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070130', 'order_code', 'Testosterone (Males, IA); CPT 84403; ECLIA'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone total%' OR LOWER(t.test_name) LIKE '%total testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070131', 'order_code', 'Free Testosterone (Dialysis); CPT 84402'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone free%' OR LOWER(t.test_name) LIKE '%free testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0093247', 'order_code', 'Estradiol (MS); CPT 82670; LC-MS/MS'
FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070100', 'order_code', 'Progesterone; CPT 84144'
FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070067', 'order_code', 'FSH; CPT 83001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' OR LOWER(t.test_name) LIKE '%follicle%stimulating%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070082', 'order_code', 'LH; CPT 83002'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070051', 'order_code', 'DHEA-Sulfate; CPT 82627'
FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070099', 'order_code', 'Prolactin; CPT 84146'
FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070079', 'order_code', 'IGF-1; CPT 84305'
FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070047', 'order_code', 'Cortisol AM; CPT 82533'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070080', 'order_code', 'Insulin; CPT 83525'
FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070214', 'order_code', 'Vitamin B12; CPT 82607'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070066', 'order_code', 'Folate; CPT 82746'
FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' OR LOWER(t.test_name) LIKE '%folic acid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020034', 'order_code', 'Magnesium; CPT 83735'
FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020039', 'order_code', 'Phosphorus; CPT 84100'
FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070098', 'order_code', 'PTH Intact; CPT 83970'
FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020019', 'order_code', 'Calcium Ionized; CPT 82330'
FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium%ionized%' OR LOWER(t.test_name) LIKE '%ionized calcium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020468', 'order_code', 'Urinalysis w/ Microscopic; CPT 81001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020044', 'order_code', 'Uric Acid; CPT 84550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0020026', 'order_code', 'GGT; CPT 82977'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' OR LOWER(t.test_name) LIKE '%gamma%glutamyl%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070078', 'order_code', 'Homocysteine; CPT 83090'
FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040050', 'order_code', 'Fibrinogen Activity; CPT 85384'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070101', 'order_code', 'PSA Total; CPT 84153'
FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050126', 'order_code', 'Hepatitis B Surface Antibody; CPT 86706'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b%surface%ab%' OR LOWER(t.test_name) LIKE '%hep b%surface%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050189', 'order_code', 'Hepatitis C Antibody; CPT 86803'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%' OR LOWER(t.test_name) LIKE '%hep c%ab%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0051339', 'order_code', 'HIV 1/2 Ag/Ab 4th Gen; CPT 87389'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050233', 'order_code', 'RPR Syphilis Screen; CPT 86592'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%vdrl%' OR LOWER(t.test_name) LIKE '%syphilis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050550', 'order_code', 'Thyroid Peroxidase Ab; CPT 86376'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0050548', 'order_code', 'Thyroglobulin Antibody; CPT 86800'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%ab%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '2002650', 'order_code', 'Celiac Disease Panel; CPT 86364, 82784'
FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040012', 'order_code', 'Reticulocyte Count; CPT 85045'
FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0040019', 'order_code', 'Hemoglobin Evaluation; CPT 83020'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hemoglobin electrophoresis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '2002283', 'order_code', 'Soluble Transferrin Receptor; CPT 84110'
FROM tests t WHERE LOWER(t.test_name) LIKE '%soluble transferrin%' OR LOWER(t.test_name) LIKE '%stfr%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'ARUP Laboratories', '0070068', 'order_code', 'Gastrin; CPT 82941'
FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%'
ON CONFLICT DO NOTHING;

-- ============================================================
-- MAYO CLINIC LABS
-- ============================================================

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CBC/9109', 'order_code', 'CBC with Differential; CPT 85025'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cbc%' OR LOWER(t.test_name) LIKE '%complete blood count%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CMP/85021', 'order_code', 'Comprehensive Metabolic Panel; CPT 80053'
FROM tests t WHERE LOWER(t.test_name) LIKE '%comprehensive metabolic%' OR LOWER(t.test_name) LIKE '%cmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'BMP/85014', 'order_code', 'Basic Metabolic Panel; CPT 80048'
FROM tests t WHERE LOWER(t.test_name) LIKE '%basic metabolic%' OR LOWER(t.test_name) LIKE '%bmp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'STSH/8939', 'order_code', 'TSH Sensitive; CPT 84443'
FROM tests t WHERE LOWER(t.test_name) LIKE '%tsh%' OR LOWER(t.test_name) LIKE '%thyroid stimulating%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FT3/8945', 'order_code', 'Free T3; CPT 84481'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t3%' OR LOWER(t.test_name) LIKE '%free triiodothyronine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FT4/8942', 'order_code', 'Free T4; CPT 84439'
FROM tests t WHERE LOWER(t.test_name) LIKE '%free t4%' OR LOWER(t.test_name) LIKE '%free thyroxine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'LPDP/8309', 'order_code', 'Lipid Panel; CPT 80061'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lipid panel%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'A1C/82105', 'order_code', 'HbA1c; CPT 83036'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hba1c%' OR LOWER(t.test_name) LIKE '%hemoglobin a1c%' OR LOWER(t.test_name) LIKE '%a1c%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'DHVIT/83670', 'order_code', 'Vitamin D 25-Hydroxy; CPT 82306'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin d%25%' OR LOWER(t.test_name) LIKE '%25-hydroxy%vitamin d%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FERR1/619953', 'order_code', 'Ferritin; CPT 82728'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ferritin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'TIBC/2501', 'order_code', 'TIBC; CPT 83550; Iron: FE/2502 CPT 83540'
FROM tests t WHERE LOWER(t.test_name) LIKE '%iron panel%' OR LOWER(t.test_name) LIKE '%iron%tibc%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CRP/9731', 'order_code', 'CRP Quantitative; CPT 86140'
FROM tests t WHERE LOWER(t.test_name) LIKE '%crp%' AND LOWER(t.test_name) NOT LIKE '%hs-crp%' AND LOWER(t.test_name) NOT LIKE '%high%sens%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HSCRP/82047', 'order_code', 'hs-CRP; CPT 86141'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hs-crp%' OR LOWER(t.test_name) LIKE '%high%sensitivity%crp%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'SEDRT/2462', 'order_code', 'ESR; CPT 85652'
FROM tests t WHERE LOWER(t.test_name) LIKE '%esr%' OR LOWER(t.test_name) LIKE '%sed rate%' OR LOWER(t.test_name) LIKE '%sedimentation%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FANA/83165', 'order_code', 'ANA IFA; CPT 86235'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ana%' OR LOWER(t.test_name) LIKE '%antinuclear%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'TTST/83686', 'order_code', 'Testosterone Total; CPT 84403; LC-MS/MS'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone total%' OR LOWER(t.test_name) LIKE '%total testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'TFTST/9324', 'order_code', 'Testosterone Free; CPT 84402'
FROM tests t WHERE LOWER(t.test_name) LIKE '%testosterone free%' OR LOWER(t.test_name) LIKE '%free testosterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'EEST/31599', 'order_code', 'Estradiol; CPT 82670'
FROM tests t WHERE LOWER(t.test_name) LIKE '%estradiol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'PRGN/8141', 'order_code', 'Progesterone; CPT 84144'
FROM tests t WHERE LOWER(t.test_name) LIKE '%progesterone%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FSH/8670', 'order_code', 'FSH; CPT 83001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fsh%' OR LOWER(t.test_name) LIKE '%follicle%stimulating%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'LH/8283', 'order_code', 'LH; CPT 83002'
FROM tests t WHERE LOWER(t.test_name) LIKE '%lh%' OR LOWER(t.test_name) LIKE '%luteinizing%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'DHEA/9429', 'order_code', 'DHEA-Sulfate; CPT 82627'
FROM tests t WHERE LOWER(t.test_name) LIKE '%dhea%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'PRL/8690', 'order_code', 'Prolactin; CPT 84146'
FROM tests t WHERE LOWER(t.test_name) LIKE '%prolactin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'IGF1/80601', 'order_code', 'IGF-1; CPT 84305'
FROM tests t WHERE LOWER(t.test_name) LIKE '%igf%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CORT/8545', 'order_code', 'Cortisol AM; CPT 82533'
FROM tests t WHERE LOWER(t.test_name) LIKE '%cortisol%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'INSF/8684', 'order_code', 'Insulin Fasting; CPT 83525'
FROM tests t WHERE LOWER(t.test_name) LIKE '%insulin%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'B12/31789', 'order_code', 'Vitamin B12; CPT 82607'
FROM tests t WHERE LOWER(t.test_name) LIKE '%vitamin b12%' OR LOWER(t.test_name) LIKE '%b12%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FOL/31408', 'order_code', 'Folate; CPT 82746'
FROM tests t WHERE LOWER(t.test_name) LIKE '%folate%' OR LOWER(t.test_name) LIKE '%folic acid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'MG/8622', 'order_code', 'Magnesium; CPT 83735'
FROM tests t WHERE LOWER(t.test_name) LIKE '%magnesium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'PHOS/8507', 'order_code', 'Phosphorus; CPT 84100'
FROM tests t WHERE LOWER(t.test_name) LIKE '%phosphorus%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'IPTH/82798', 'order_code', 'PTH Intact; CPT 83970'
FROM tests t WHERE LOWER(t.test_name) LIKE '%pth%' OR LOWER(t.test_name) LIKE '%parathyroid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CAIO/9281', 'order_code', 'Calcium Ionized; CPT 82330'
FROM tests t WHERE LOWER(t.test_name) LIKE '%calcium%ionized%' OR LOWER(t.test_name) LIKE '%ionized calcium%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'UAM/8599', 'order_code', 'Urinalysis w/ Microscopic; CPT 81001'
FROM tests t WHERE LOWER(t.test_name) LIKE '%urinalysis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'UA/8509', 'order_code', 'Uric Acid; CPT 84550'
FROM tests t WHERE LOWER(t.test_name) LIKE '%uric acid%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'GGT/8677', 'order_code', 'GGT; CPT 82977'
FROM tests t WHERE LOWER(t.test_name) LIKE '%ggt%' OR LOWER(t.test_name) LIKE '%gamma%glutamyl%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HCYSP/9068', 'order_code', 'Homocysteine; CPT 83090'
FROM tests t WHERE LOWER(t.test_name) LIKE '%homocysteine%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'FIB/9346', 'order_code', 'Fibrinogen Activity; CPT 85384'
FROM tests t WHERE LOWER(t.test_name) LIKE '%fibrinogen%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'PSA/8598', 'order_code', 'PSA Total; CPT 84153'
FROM tests t WHERE LOWER(t.test_name) LIKE '%psa%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HBSAB/8361', 'order_code', 'Hepatitis B Surface Ab; CPT 86706'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis b%surface%ab%' OR LOWER(t.test_name) LIKE '%hep b%surface%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HCVAB/82539', 'order_code', 'Hepatitis C Ab; CPT 86803'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hepatitis c%' OR LOWER(t.test_name) LIKE '%hep c%ab%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HIVCA/62693', 'order_code', 'HIV 1/2 Ag/Ab 4th Gen; CPT 87389'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hiv%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'RPR/9028', 'order_code', 'RPR Syphilis Screen; CPT 86592'
FROM tests t WHERE LOWER(t.test_name) LIKE '%rpr%' OR LOWER(t.test_name) LIKE '%vdrl%' OR LOWER(t.test_name) LIKE '%syphilis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'ATPO/8336', 'order_code', 'Thyroid Peroxidase Ab; CPT 86376'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroid peroxidase%' OR LOWER(t.test_name) LIKE '%tpo%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'APTS/8344', 'order_code', 'Thyroglobulin Ab; CPT 86800'
FROM tests t WHERE LOWER(t.test_name) LIKE '%thyroglobulin%ab%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'CELI/63246', 'order_code', 'Celiac Disease Panel; CPT 86364, 82784'
FROM tests t WHERE LOWER(t.test_name) LIKE '%celiac%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'RETIC/9788', 'order_code', 'Reticulocyte Count; CPT 85045'
FROM tests t WHERE LOWER(t.test_name) LIKE '%reticulocyte%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'HEVP/84158', 'order_code', 'Hemoglobin Evaluation; CPT 83020'
FROM tests t WHERE LOWER(t.test_name) LIKE '%hemoglobin electrophoresis%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'STFR/80089', 'order_code', 'Soluble Transferrin Receptor; CPT 84110'
FROM tests t WHERE LOWER(t.test_name) LIKE '%soluble transferrin%' OR LOWER(t.test_name) LIKE '%stfr%'
ON CONFLICT DO NOTHING;

INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)
SELECT t.id, 'Mayo Clinic Labs', 'GAST/8204', 'order_code', 'Gastrin; CPT 82941'
FROM tests t WHERE LOWER(t.test_name) LIKE '%gastrin%'
ON CONFLICT DO NOTHING;
