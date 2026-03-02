-- Hospital Lab Test Codes
-- Generated 2026-03-01 from Cleveland Clinic Labs and Geisinger Medical Labs
-- Sources: clevelandcliniclabs.com, geisingermedicallabs.com

-- Create table for hospital-specific lab codes
CREATE TABLE IF NOT EXISTS hospital_lab_codes (
  id SERIAL PRIMARY KEY,
  hospital_system TEXT NOT NULL,
  test_name TEXT NOT NULL,
  common_name TEXT NOT NULL,  -- normalized name for cross-hospital matching
  hospital_code TEXT NOT NULL, -- the hospital's internal code
  code_type TEXT NOT NULL,     -- 'mnemonic', 'lab_id', 'numeric', etc.
  cpt_code TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_hospital_lab_codes_common ON hospital_lab_codes(common_name);
CREATE INDEX IF NOT EXISTS idx_hospital_lab_codes_hospital ON hospital_lab_codes(hospital_system);
CREATE INDEX IF NOT EXISTS idx_hospital_lab_codes_code ON hospital_lab_codes(hospital_code);

-- ============================================
-- CLEVELAND CLINIC LABORATORIES
-- Code type: mnemonic (Epic order code)
-- ============================================
INSERT INTO hospital_lab_codes (hospital_system, test_name, common_name, hospital_code, code_type, cpt_code, source_url) VALUES
('cleveland_clinic', 'CBC', 'CBC', 'CBC', 'mnemonic', '85025', 'https://clevelandcliniclabs.com/test/complete-blood-count/'),
('cleveland_clinic', 'Comprehensive Metabolic Panel', 'CMP', 'CMP', 'mnemonic', '80053', 'https://clevelandcliniclabs.com/test/comprehensive-metabolic-panel/'),
('cleveland_clinic', 'Basic Metabolic Panel', 'BMP', 'BMP', 'mnemonic', '80048', 'https://clevelandcliniclabs.com/test/basic-metabolic-panel/'),
('cleveland_clinic', 'TSH', 'TSH', 'TSH', 'mnemonic', '84443', 'https://clevelandcliniclabs.com/test/tsh/'),
('cleveland_clinic', 'T3, Free', 'Free T3', 'FREET3', 'mnemonic', '84481', 'https://clevelandcliniclabs.com/test/t3-free/'),
('cleveland_clinic', 'T4, Free', 'Free T4', 'FT4', 'mnemonic', '84439', 'https://clevelandcliniclabs.com/test/t4-free/'),
('cleveland_clinic', 'Lipid Panel, Fasting', 'Lipid Panel', 'LIPB', 'mnemonic', NULL, 'https://clevelandcliniclabs.com/test/lipid-panel/'),
('cleveland_clinic', 'Hemoglobin A1c', 'HbA1c', 'HBA1C', 'mnemonic', '83036', 'https://clevelandcliniclabs.com/test/hemoglobin-a1c/'),
('cleveland_clinic', 'Vitamin D, 25-Hydroxy', 'Vitamin D', 'VITD', 'mnemonic', '82306', 'https://clevelandcliniclabs.com/test/vitamin-d-25-hydroxy/'),
('cleveland_clinic', 'Ferritin', 'Ferritin', 'FERR', 'mnemonic', '82728', 'https://clevelandcliniclabs.com/test/ferritin/'),
('cleveland_clinic', 'Iron and TIBC', 'Iron/TIBC', 'FETIBC', 'mnemonic', NULL, 'https://clevelandcliniclabs.com/test/iron-and-tibc/'),
('cleveland_clinic', 'C-Reactive Protein', 'CRP', 'CRP', 'mnemonic', '86140', 'https://clevelandcliniclabs.com/test/c-reactive-protein/'),
('cleveland_clinic', 'C-Reactive Protein, High Sensitivity', 'hs-CRP', 'HSCRP', 'mnemonic', '86141', 'https://clevelandcliniclabs.com/test/c-reactive-protein-high-sensitivity/'),
('cleveland_clinic', 'Sedimentation Rate', 'ESR', 'WSR', 'mnemonic', '85652', 'https://clevelandcliniclabs.com/test/sedimentation-rate/'),
('cleveland_clinic', 'ANA', 'ANA', 'ANAS', 'mnemonic', '86038', 'https://clevelandcliniclabs.com/test/ana/'),
('cleveland_clinic', 'Testosterone, Total', 'Testosterone Total', 'TESTOS', 'mnemonic', '84403', 'https://clevelandcliniclabs.com/test/testosterone-total/'),
('cleveland_clinic', 'Testosterone, Free', 'Testosterone Free', 'FTESTO', 'mnemonic', '84402', 'https://clevelandcliniclabs.com/test/testosterone-free/'),
('cleveland_clinic', 'Estradiol', 'Estradiol', 'ESTDL', 'mnemonic', '82670', 'https://clevelandcliniclabs.com/test/estradiol/'),
('cleveland_clinic', 'Progesterone', 'Progesterone', 'PROG', 'mnemonic', '84144', 'https://clevelandcliniclabs.com/test/progesterone/'),
('cleveland_clinic', 'FSH', 'FSH', 'FSH', 'mnemonic', '83001', 'https://clevelandcliniclabs.com/test/fsh/'),
('cleveland_clinic', 'LH', 'LH', 'LH', 'mnemonic', '83002', 'https://clevelandcliniclabs.com/test/luteinizing-hormone/'),
('cleveland_clinic', 'DHEA-S', 'DHEA-S', 'DHEAS', 'mnemonic', '82627', 'https://clevelandcliniclabs.com/test/dhea-s/'),
('cleveland_clinic', 'Prolactin', 'Prolactin', 'PROL', 'mnemonic', '84146', 'https://clevelandcliniclabs.com/test/prolactin/'),
('cleveland_clinic', 'IGF-1 with Z-Score', 'IGF-1', 'ILG', 'mnemonic', NULL, 'https://clevelandcliniclabs.com/test/insulin-like-growth-factor-1-with-calculated-z-score/'),
('cleveland_clinic', 'Cortisol', 'Cortisol', 'CORT', 'mnemonic', '82533', 'https://clevelandcliniclabs.com/test/cortisol/'),
('cleveland_clinic', 'Insulin', 'Insulin', 'INS', 'mnemonic', '83525', 'https://clevelandcliniclabs.com/test/insulin/'),
('cleveland_clinic', 'Vitamin B12', 'B12', 'B12', 'mnemonic', '82607', 'https://clevelandcliniclabs.com/test/vitamin-b12/'),
('cleveland_clinic', 'Folate', 'Folate', 'FOL', 'mnemonic', '82746', 'https://clevelandcliniclabs.com/test/folate/'),
('cleveland_clinic', 'Magnesium', 'Magnesium', 'MG', 'mnemonic', '83735', 'https://clevelandcliniclabs.com/test/magnesium/'),
('cleveland_clinic', 'Phosphorus', 'Phosphorus', 'PHOS', 'mnemonic', '84100', 'https://clevelandcliniclabs.com/test/phosphorus/'),
('cleveland_clinic', 'PTH, Intact', 'PTH', 'PTHI', 'mnemonic', '83970', 'https://clevelandcliniclabs.com/test/pth-intact/'),
('cleveland_clinic', 'Calcium, Ionized', 'Calcium Ionized', 'ICA', 'mnemonic', '82330', 'https://clevelandcliniclabs.com/test/calcium-ionized/'),
('cleveland_clinic', 'Urinalysis', 'Urinalysis', 'UA', 'mnemonic', '81001', 'https://clevelandcliniclabs.com/test/urinalysis/'),
('cleveland_clinic', 'Uric Acid', 'Uric Acid', 'URIC', 'mnemonic', '84550', 'https://clevelandcliniclabs.com/test/uric-acid/'),
('cleveland_clinic', 'GGT', 'GGT', 'GGT', 'mnemonic', '82977', 'https://clevelandcliniclabs.com/test/ggt/'),
('cleveland_clinic', 'Homocysteine', 'Homocysteine', 'HOMO', 'mnemonic', '83090', 'https://clevelandcliniclabs.com/test/homocysteine/'),
('cleveland_clinic', 'Fibrinogen', 'Fibrinogen', 'FIB', 'mnemonic', '85384', 'https://clevelandcliniclabs.com/test/fibrinogen/'),
('cleveland_clinic', 'PSA', 'PSA', 'PSA', 'mnemonic', '84153', 'https://clevelandcliniclabs.com/test/psa/'),
('cleveland_clinic', 'Hepatitis B Surface Ab', 'Hep B Ab', 'AHBSAG', 'mnemonic', '86706', 'https://clevelandcliniclabs.com/test/hepatitis-b-surface-ab/'),
('cleveland_clinic', 'Hepatitis C Antibody', 'Hep C Ab', 'HCV', 'mnemonic', '86803', 'https://clevelandcliniclabs.com/test/hepatitis-c-antibody/'),
('cleveland_clinic', 'HIV 1/2 Ag/Ab', 'HIV', 'HIV', 'mnemonic', '87389', 'https://clevelandcliniclabs.com/test/hiv-1-2-antigen-and-antibody/'),
('cleveland_clinic', 'RPR', 'RPR', 'RPR', 'mnemonic', '86592', 'https://clevelandcliniclabs.com/test/rpr/'),
('cleveland_clinic', 'Thyroid Peroxidase Antibody', 'TPO Ab', 'MICRO', 'mnemonic', '86376', 'https://clevelandcliniclabs.com/test/thyroid-peroxidase-antibody/'),
('cleveland_clinic', 'Thyroglobulin Antibody', 'Thyroglobulin Ab', 'TGAB', 'mnemonic', '86800', 'https://clevelandcliniclabs.com/test/thyroglobulin-antibody/'),
('cleveland_clinic', 'Tissue Transglutaminase IgA', 'Celiac (tTG IgA)', 'TTG', 'mnemonic', '86364', 'https://clevelandcliniclabs.com/test/tissue-transglutaminase-iga/'),
('cleveland_clinic', 'Reticulocyte Count', 'Reticulocyte', 'RETIC', 'mnemonic', '85045', 'https://clevelandcliniclabs.com/test/reticulocyte-count/'),
('cleveland_clinic', 'Hemoglobin Electrophoresis', 'Hgb Electrophoresis', 'HB', 'mnemonic', '83020', 'https://clevelandcliniclabs.com/test/hemoglobin-electrophoresis/'),
('cleveland_clinic', 'Soluble Transferrin Receptor', 'sTfR', 'STRANS', 'mnemonic', '83872', 'https://clevelandcliniclabs.com/test/soluble-transferrin-receptor/'),
('cleveland_clinic', 'Gastrin', 'Gastrin', 'GAST', 'mnemonic', '82941', 'https://clevelandcliniclabs.com/test/gastrin/');

-- ============================================
-- GEISINGER MEDICAL LABORATORIES
-- Code type: lab_id (LABxxxx internal codes)
-- ============================================
INSERT INTO hospital_lab_codes (hospital_system, test_name, common_name, hospital_code, code_type, cpt_code, source_url) VALUES
('geisinger', 'CBC', 'CBC', 'LAB1961', 'lab_id', '85025', 'https://www.geisingermedicallabs.com/catalog/Details?tid=725'),
('geisinger', 'CBC with WBC Differential', 'CBC w/ Diff', 'LAB1963', 'lab_id', NULL, 'https://www.geisingermedicallabs.com/catalog/Details?tid=116'),
('geisinger', 'Comprehensive Metabolic Panel', 'CMP', 'LAB2069', 'lab_id', '80053', 'https://www.geisingermedicallabs.com/catalog/Details?tid=496'),
('geisinger', 'Basic Metabolic Panel', 'BMP', 'LAB1826', 'lab_id', '80048', 'https://www.geisingermedicallabs.com/catalog/Details?tid=377'),
('geisinger', 'TSH', 'TSH', 'LAB3204', 'lab_id', '84443', 'https://www.geisingermedicallabs.com/catalog/Details?tid=431'),
('geisinger', 'T3, Free', 'Free T3', 'LAB3123', 'lab_id', '84481', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1368'),
('geisinger', 'T4, Free', 'Free T4', 'LAB3128', 'lab_id', '84439', 'https://www.geisingermedicallabs.com/catalog/Details?tid=945'),
('geisinger', 'Lipid Panel', 'Lipid Panel', 'LAB2613', 'lab_id', NULL, 'https://www.geisingermedicallabs.com/catalog/Details?tid=465'),
('geisinger', 'Hemoglobin A1C', 'HbA1c', 'LAB2415', 'lab_id', '83036', 'https://www.geisingermedicallabs.com/catalog/Details?tid=569'),
('geisinger', '25-Hydroxy Vitamin D', 'Vitamin D', 'LAB1489', 'lab_id', '82306', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1563'),
('geisinger', 'Ferritin', 'Ferritin', 'LAB2275', 'lab_id', '82728', 'https://www.geisingermedicallabs.com/catalog/Details?tid=214'),
('geisinger', 'Iron Screen, Including TIBC', 'Iron/TIBC', 'LAB2556', 'lab_id', NULL, 'https://www.geisingermedicallabs.com/catalog/Details?tid=161'),
('geisinger', 'CRP (Inflammatory Marker)', 'CRP', 'LAB2100', 'lab_id', '86140', 'https://www.geisingermedicallabs.com/catalog/Details?tid=790'),
('geisinger', 'CRP, High Sensitivity', 'hs-CRP', 'LAB2101', 'lab_id', '86141', 'https://www.geisingermedicallabs.com/catalog/Details?tid=396'),
('geisinger', 'Erythrocyte Sedimentation Rate (ESR)', 'ESR', 'LAB2234', 'lab_id', '85652', 'https://www.geisingermedicallabs.com/catalog/Details?tid=636'),
('geisinger', 'ANA Screen with Reflexive Ab', 'ANA', 'LAB1767', 'lab_id', '86038', 'https://www.geisingermedicallabs.com/catalog/Details?tid=479'),
('geisinger', 'Testosterone, Total', 'Testosterone Total', 'LAB3139', 'lab_id', '84403', 'https://www.geisingermedicallabs.com/catalog/Details?tid=180'),
('geisinger', 'Testosterone, Free & Total, MS', 'Testosterone Free', 'LAB3137', 'lab_id', '84402', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1571'),
('geisinger', 'Estradiol', 'Estradiol', 'LAB2236', 'lab_id', '82670', 'https://www.geisingermedicallabs.com/catalog/Details?tid=376'),
('geisinger', 'Progesterone', 'Progesterone', 'LAB2923', 'lab_id', '84144', 'https://www.geisingermedicallabs.com/catalog/Details?tid=595'),
('geisinger', 'FSH', 'FSH', 'LAB2318', 'lab_id', '83001', 'https://www.geisingermedicallabs.com/catalog/Details?tid=358'),
('geisinger', 'LH', 'LH', 'LAB2608', 'lab_id', '83002', 'https://www.geisingermedicallabs.com/catalog/Details?tid=389'),
('geisinger', 'DHEA-Sulfate', 'DHEA-S', 'LAB2180', 'lab_id', '82627', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1006'),
('geisinger', 'Prolactin', 'Prolactin', 'LAB2925', 'lab_id', '84146', 'https://www.geisingermedicallabs.com/catalog/Details?tid=778'),
('geisinger', 'IGF-1, LC/MS', 'IGF-1', 'LAB2542', 'lab_id', NULL, 'https://www.geisingermedicallabs.com/catalog/Details?tid=1964'),
('geisinger', 'Cortisol', 'Cortisol', 'LAB2080', 'lab_id', '82533', 'https://www.geisingermedicallabs.com/catalog/Details?tid=481'),
('geisinger', 'Insulin', 'Insulin', 'LAB2538', 'lab_id', '83525', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1225'),
('geisinger', 'Vitamin B12', 'B12', 'LAB3256', 'lab_id', '82607', 'https://www.geisingermedicallabs.com/catalog/Details?tid=708'),
('geisinger', 'Folic Acid', 'Folate', 'LAB2302', 'lab_id', '82746', 'https://www.geisingermedicallabs.com/catalog/Details?tid=390'),
('geisinger', 'Magnesium', 'Magnesium', 'LAB2644', 'lab_id', '83735', 'https://www.geisingermedicallabs.com/catalog/Details?tid=70'),
('geisinger', 'Phosphorus', 'Phosphorus', 'LAB2846', 'lab_id', '84100', 'https://www.geisingermedicallabs.com/catalog/Details?tid=867'),
('geisinger', 'PTH', 'PTH', 'LAB2950', 'lab_id', '83970', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1984'),
('geisinger', 'Calcium, Ionized', 'Calcium Ionized', 'LAB1924', 'lab_id', '82330', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1296'),
('geisinger', 'Urinalysis with Microscopic', 'Urinalysis', 'LAB3219', 'lab_id', '81001', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1477'),
('geisinger', 'Uric Acid', 'Uric Acid', 'LAB3214', 'lab_id', '84550', 'https://www.geisingermedicallabs.com/catalog/Details?tid=554'),
('geisinger', 'GGTP', 'GGT', 'LAB2350', 'lab_id', '82977', 'https://www.geisingermedicallabs.com/catalog/Details?tid=769'),
('geisinger', 'Homocysteine', 'Homocysteine', 'LAB2493', 'lab_id', '83090', 'https://www.geisingermedicallabs.com/catalog/Details?tid=440'),
('geisinger', 'Fibrinogen', 'Fibrinogen', 'LAB2283', 'lab_id', '85384', 'https://www.geisingermedicallabs.com/catalog/Details?tid=94'),
('geisinger', 'PSA', 'PSA', 'LAB2944', 'lab_id', '84153', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1194'),
('geisinger', 'Hepatitis B Surface Antibody', 'Hep B Ab', 'LAB2437', 'lab_id', '86706', 'https://www.geisingermedicallabs.com/catalog/Details?tid=580'),
('geisinger', 'Hepatitis C Antibody', 'Hep C Ab', 'LAB2442', 'lab_id', '86803', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1405'),
('geisinger', 'HIV Ag & Ab Screen w/ Confirmation', 'HIV', 'LAB2467', 'lab_id', '87389', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1973'),
('geisinger', 'RPR', 'RPR', 'LAB2976', 'lab_id', '86592', 'https://www.geisingermedicallabs.com/catalog/Details?tid=14'),
('geisinger', 'Thyroid Peroxidase Antibody', 'TPO Ab', 'LAB3160', 'lab_id', '86376', 'https://www.geisingermedicallabs.com/catalog/Details?tid=993'),
('geisinger', 'Thyroglobulin Antibody', 'Thyroglobulin Ab', 'LAB3158', 'lab_id', '86800', 'https://www.geisingermedicallabs.com/catalog/Details?tid=7'),
('geisinger', 'Tissue Transglutaminase Ab (IgG,IgA)', 'Celiac (tTG IgA)', 'LAB3165', 'lab_id', '86364', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1943'),
('geisinger', 'Reticulocyte Panel', 'Reticulocyte', 'LAB3006', 'lab_id', '85045', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1038'),
('geisinger', 'Hemoglobinopathy Evaluation', 'Hgb Electrophoresis', 'LAB2424', 'lab_id', '83020', 'https://www.geisingermedicallabs.com/catalog/Details?tid=2088'),
('geisinger', 'Soluble Transferrin Receptor', 'sTfR', 'LAB3071', 'lab_id', '83872', 'https://www.geisingermedicallabs.com/catalog/Details?tid=997'),
('geisinger', 'Gastrin, Serum', 'Gastrin', 'LAB2340', 'lab_id', '82941', 'https://www.geisingermedicallabs.com/catalog/Details?tid=1961'),
('geisinger', 'Celiac Disease Serology Reflex Panel', 'Celiac Panel', 'LAB4793', 'lab_id', NULL, 'https://www.geisingermedicallabs.com/catalog/Details?tid=2640');
