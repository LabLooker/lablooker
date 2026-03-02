-- Stanford & NYU Lab Test Codes
-- Auto-generated from stanfordlab.com and testmenu.com/nyumc on 2026-03-02
-- For use with lablooker Supabase database

-- Create table for hospital lab test codes
CREATE TABLE IF NOT EXISTS hospital_lab_codes (
    id SERIAL PRIMARY KEY,
    common_name TEXT NOT NULL,
    hospital TEXT NOT NULL,
    test_name TEXT NOT NULL,
    order_code TEXT,
    epic_code TEXT,
    test_id TEXT,
    cpt_codes TEXT,
    specimen_type TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for lookups
CREATE INDEX IF NOT EXISTS idx_hospital_lab_codes_common_name ON hospital_lab_codes(common_name);
CREATE INDEX IF NOT EXISTS idx_hospital_lab_codes_hospital ON hospital_lab_codes(hospital);
CREATE INDEX IF NOT EXISTS idx_hospital_lab_codes_order_code ON hospital_lab_codes(order_code);

-- Clear existing data for these hospitals
DELETE FROM hospital_lab_codes WHERE hospital IN ('Stanford Health Care', 'NYU Langone Health');

-- ========== STANFORD HEALTH CARE ==========
INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('CBC', 'Stanford Health Care', 'Complete Blood Count (CBC) with Automated Differential', 'CBCD', 'LABCBCD', '85025', 'Whole Blood', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('CMP', 'Stanford Health Care', 'Comprehensive Metabolic Panel', 'METC', 'LABMETC', '80053', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('BMP', 'Stanford Health Care', 'Basic Metabolic Panel', 'METB', 'LABMETB', '80048', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('TSH', 'Stanford Health Care', 'TSH with Reflex to FT4', 'TSHFT4', 'LABTSHFT4', '84443, 84439', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Free T3', 'Stanford Health Care', 'Free T3', 'FRT3', 'LABYFT3', '84481', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Free T4', 'Stanford Health Care', 'Thyroxine, Free, Plasma/Serum', 'FT4', 'LABFT4', '84439', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Lipid Panel', 'Stanford Health Care', 'Lipid Panel with Direct LDL, Serum', 'LPD', 'LABLPD', '80061, 83721', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('HbA1c', 'Stanford Health Care', 'Hemoglobin A1c, Whole Blood', 'A1C', 'LABA1C', '83036', 'Whole Blood', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Vitamin D 25-OH', 'Stanford Health Care', 'Vitamin D, 25-Hydroxy', 'VD25H', 'LABVD25H', '82306.0', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Ferritin', 'Stanford Health Care', 'Ferritin', 'FER', 'LABFER', '82728', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Iron/TIBC', 'Stanford Health Care', 'Transferrin Saturation, Serum/Plasma (includes Iron, TIBC and Calculated % Saturation)', 'TRFS', 'LABTRFS', '83540, 83550, 84466', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('CRP', 'Stanford Health Care', 'C-reactive Protein (CRP) Serum/Plasma', 'CRP', 'LABCRP', '86140', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('hs-CRP', 'Stanford Health Care', 'C-Reactive Protein (CRP), High Sensitivity, Serum/Plasma', 'HSCRP', 'LABHSCRP', '86141', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('ESR', 'Stanford Health Care', 'Sedimentation Rate', 'ESRP', 'LABESRP', '85651 or 85652', 'Whole Blood', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('ANA', 'Stanford Health Care', 'Anti-Nuclear Antibody', 'ANAS', 'LABANAS', '86235', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Testosterone Total', 'Stanford Health Care', 'Testosterone, Total, Serum', 'TES', 'LABTES', '84403', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Testosterone Free', 'Stanford Health Care', 'Testosterone, Total/Free Adult (Male and Female)', 'TESFTA', 'LABTESFTA', '84402 - Testosterone, Free; 84403 - Testosterone, Total', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Estradiol', 'Stanford Health Care', 'Estradiol', 'E2MS', 'LABE2MS', '82670', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Progesterone', 'Stanford Health Care', 'Progesterone, Serum/Plasma', 'PGN', 'LABPGN', '84144', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('FSH', 'Stanford Health Care', 'Folicular Stimulating Hormone (FSH), Serum', 'FLL', 'LABFLL', '83001', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('LH', 'Stanford Health Care', 'Luteinizing Hormone (LH), Serum', 'LUT', 'LABLUT', '83002', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('DHEA-S', 'Stanford Health Care', 'Dehydroepiandrosterone Sulfate', 'DHS', 'LABYDHEAS', '82627', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Prolactin', 'Stanford Health Care', 'Prolactin, Serum', 'PROL', 'LABPROL', '84146', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('IGF-1', 'Stanford Health Care', 'Insulin-Like Growth Factor 1', 'IGF1', 'LABIGF1', '', '', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Cortisol', 'Stanford Health Care', 'Cortisol, Serum or Plasma', 'CORT', 'LABCORT', '82533', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Insulin', 'Stanford Health Care', 'Insulin, Fasting', 'INSLF', 'LABINSLF', '83525', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('B12', 'Stanford Health Care', 'Vitamin B12', 'B12', 'LABB12', '82607', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Folate', 'Stanford Health Care', 'Folic Acid (Folate)', 'FOL', 'LABFOL', '82746', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Magnesium', 'Stanford Health Care', 'Magnesium, Serum/Plasma', 'MGN', 'LABMGN', '83735', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Phosphorus', 'Stanford Health Care', 'Phosphorus, Serum/Plasma', 'PHOS', 'LABPHOS', '84100', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('PTH', 'Stanford Health Care', 'PTH-intact, Plasma', 'PTH', 'LABPTH', '83970', 'Plasma', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Calcium Ionized', 'Stanford Health Care', 'Ionized Calcium', 'CAI', 'LABCAI', '82330.0', 'Whole Blood', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Urinalysis', 'Stanford Health Care', 'Urinalysis with Microscopic', 'UA', 'LABUA', '81001', 'Urine', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Uric Acid', 'Stanford Health Care', 'Uric Acid, Serum/Plasma', 'URIC', 'LABURIC', '84550', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('GGT', 'Stanford Health Care', 'Gamma-Glutamyl transferase (GGT), Serum/Plasma', 'GGT', 'LABGGT', '82977', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Homocysteine', 'Stanford Health Care', 'Homocysteine, Serum/Plasma', 'HMCY', 'LABHMCY', '83090', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Fibrinogen', 'Stanford Health Care', 'Fibrinogen', 'FIB', 'LABFIB', '85384', 'Platelet-Poor Plasma', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('PSA', 'Stanford Health Care', 'PSA Screen', 'PSAS', 'LABPSAS', 'G0103', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Hep B Ab', 'Stanford Health Care', 'Hepatitis B Surface Antibody, Quantitative', 'HBSQT', 'LABHBSQT', '86706', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Hep C Ab', 'Stanford Health Care', 'Hepatitis C Virus (HCV) Antibody, IgG', 'HCVA', 'LABHCVA', '86803', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('HIV', 'Stanford Health Care', 'HIV Antigen/Antibody Screen', 'HIVAA', 'LABHIVAA', '87389', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('RPR', 'Stanford Health Care', 'RPR', 'RPRQLT', 'LABRPRQLT', '86592 w/ Reflex 86593', 'Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('TPO Ab', 'Stanford Health Care', 'Thyroid Peroxidase Antibody (TPO) (Thyroid Microsomal Antibody), Serum', 'ANTIM', 'LABANTIM', '86376', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Thyroglobulin Ab', 'Stanford Health Care', 'Thyroglobulin Antibody, Serum', 'ANTITG', 'LABANTITG', '86800', 'Plasma/Serum', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Celiac', 'Stanford Health Care', 'Celiac PLUS', 'CEPLUS', '', '', '', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Sed Rate', 'Stanford Health Care', 'Sedimentation Rate', 'ESRP', 'LABESRP', '85651 or 85652', 'Whole Blood', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Reticulocyte', 'Stanford Health Care', 'Reticulocyte Count', 'RETIC', 'LABRETIC', '85045', 'Whole Blood', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Hgb Electrophoresis', 'Stanford Health Care', 'Hemoglobin Quantification and Fractionation', 'HGBQ', 'LABHGBQ', '83020', 'Whole Blood', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('sTfR', 'Stanford Health Care', 'Soluble Transferrin Receptor, Serum', 'YSTFR', 'LABYSTFR', '', '', 'https://stanfordlab.com');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, epic_code, cpt_codes, specimen_type, source_url)
VALUES ('Gastrin', 'Stanford Health Care', 'Gastrin', '11081R', 'LAB11081R', '', '', 'https://stanfordlab.com');

-- ========== NYU LANGONE HEALTH ==========
INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('CBC', 'NYU Langone Health', 'Tisch Labs - CBC', 'LAB294', '1311773', '', 'Whole Blood', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('CMP', 'NYU Langone Health', 'Tisch Labs - Comprehensive Metabolic Panel', 'LAB17', '1311782', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('BMP', 'NYU Langone Health', 'Tisch Labs - Basic Metabolic Panel', 'LAB15', '1311765', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('TSH', 'NYU Langone Health', 'Tisch Labs - TSH', 'LAB129', '1312026', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Free T3', 'NYU Langone Health', 'T3, Free (Triiodothyronine, Free)', 'LAB137', '317069', '', '', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Free T4', 'NYU Langone Health', 'Free T4 (Thyroxine) by Equil Dialysis-TMS', 'LAB10261', '316906', '', '', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Lipid Panel', 'NYU Langone Health', 'Tisch Labs - Lipid Panel', 'LAB18', '1311933', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('HbA1c', 'NYU Langone Health', 'Tisch Labs - Hemoglobin A1C', 'LAB90', '1311723', '', 'Whole Blood', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Vitamin D 25-OH', 'NYU Langone Health', 'Tisch Labs - Vitamin D', 'LAB535', '1312049', '', 'Serum', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Ferritin', 'NYU Langone Health', 'Tisch Labs - Ferritin', 'LAB68', '1311838', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Iron/TIBC', 'NYU Langone Health', 'Tisch Labs - Iron Binding Group (Iron + Calculated TIBC)', 'LAB829', '1316172', '', 'Plasma (Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('CRP', 'NYU Langone Health', 'Tisch Labs - C-Reactive Protein', 'LAB149', '1311802', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('hs-CRP', 'NYU Langone Health', 'Tisch Labs - C-Reactive Protein, High Sensitivity', 'LAB150', '1316152', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('ESR', 'NYU Langone Health', 'Tisch Labs - Sed Rate (Erythrocyte Sedimentation Rate)', 'LAB322', '1311822', '', 'Whole Blood', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('ANA', 'NYU Langone Health', 'Tisch Labs - Nuclear Antibody (ANA) Screen w/reflex', 'LAB21089', '1311748', '', 'SERUM', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Testosterone Total', 'NYU Langone Health', 'Total Testosterone, Male Adult', 'LAB10296', '317175', '', '', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Testosterone Free', 'NYU Langone Health', 'Free Testosterone Panel, Male', 'LAB173', '317169', '', '', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Estradiol', 'NYU Langone Health', 'Tisch Labs - Estradiol', 'LAB523', '1311823', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Progesterone', 'NYU Langone Health', 'Tisch Labs - Progesterone', 'LAB529', '1311967', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('FSH', 'NYU Langone Health', 'Tisch Labs - FSH, Follicle Stimulating Hormone', 'LAB86', '1316157', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('LH', 'NYU Langone Health', 'Tisch Labs - Luteinizing Hormone (LH)', 'LAB87', '1311932', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('DHEA-S', 'NYU Langone Health', 'Dehydroepiandrosterone Sulfate (DHEA Sulfate)', 'LAB524', '316976', '', '', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Prolactin', 'NYU Langone Health', 'Tisch Labs - Prolactin', 'LAB531', '1311968', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('IGF-1', 'NYU Langone Health', 'Insulin-Like Growth Factor 1 (IGF-1) with Calculated Z-Score', 'LAB526', '848498', '', 'Serum', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Cortisol', 'NYU Langone Health', 'Tisch Labs - Cortisol', 'LAB61', '1311792', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Insulin', 'NYU Langone Health', 'Tisch Labs - Insulin', 'LAB527', '1311895', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('B12', 'NYU Langone Health', 'Tisch Labs - Vitamin B12', 'LAB67', '1312048', '', 'Serum', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Folate', 'NYU Langone Health', 'Tisch Labs - Folate', 'LAB69', '1311844', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Magnesium', 'NYU Langone Health', 'Tisch Labs - Magnesium', 'LAB103', '1311942', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Phosphorus', 'NYU Langone Health', 'Tisch Labs - Phosphorus', 'LAB113', '1311960', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('PTH', 'NYU Langone Health', 'Tisch Labs - Parathyroid Hormone (PTH)', 'LAB108', '1311974', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Calcium Ionized', 'NYU Langone Health', 'Tisch Labs - Ionized Calcium', 'LAB308700', '1316173', '', 'Whole Blood(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Urinalysis', 'NYU Langone Health', 'Tisch Labs - Urinalysis with Reflex to Microscopic', 'LAB348', '1312029', '', 'Urine', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Uric Acid', 'NYU Langone Health', 'Tisch Labs - Uric Acid', 'LAB10763', '1312044', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('GGT', 'NYU Langone Health', 'Tisch Labs - GGTP', 'LAB85', '1311848', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Homocysteine', 'NYU Langone Health', 'Tisch Labs - Homocysteine', 'LAB93', '1311866', '', 'Serum', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Fibrinogen', 'NYU Langone Health', 'Tisch Labs - Fibrinogen Assay', 'LAB314', '1311840', '', 'Citrated Plasma', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('PSA', 'NYU Langone Health', 'Tisch Labs - PSA Total', 'LAB116', '1311972', '', 'Serum', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Hep B Ab', 'NYU Langone Health', 'Tisch Labs - Hepatitis B surface Antibody', 'LAB472', '1311857', '', 'Serum', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Hep C Ab', 'NYU Langone Health', 'Tisch Labs - Hepatitis C Ab Total w/Reflex', 'LAB2308', '1311738', '', 'Serum (Gold separator tube)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('HIV', 'NYU Langone Health', 'Tisch Labs - HIV 1/2 Ag/Ab, 4th Gen, W/RFLX', 'LAB2209', '', '', 'Whole Blood', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('RPR', 'NYU Langone Health', 'Tisch Labs - RPR Monitor with reflex titer', 'LAB494', '1311987', '', 'SERUM', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('TPO Ab', 'NYU Langone Health', 'Tisch Labs - Anti-Thyroid Peroxidase Antibody (TPO)', 'LAB858', '1311759', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Thyroglobulin Ab', 'NYU Langone Health', 'Tisch Labs - Anti-Thyroglobulin Antibody', 'LAB515', '1311758', '', 'Plasma(Lithium Heparin)', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Celiac', 'NYU Langone Health', 'Celiac Disease Reflexive Panel', 'LAB822', '317535', '', '', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Sed Rate', 'NYU Langone Health', 'Tisch Labs - Sed Rate (Erythrocyte Sedimentation Rate)', 'LAB322', '1311822', '', 'Whole Blood', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Reticulocyte', 'NYU Langone Health', 'Tisch Labs - Reticulocyte Count', 'LAB296', '1311981', '', 'Whole Blood', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Hgb Electrophoresis', 'NYU Langone Health', 'Hemoglobin Evaluation', 'LAB288', '317016', '', '', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('sTfR', 'NYU Langone Health', 'Soluble Transferrin Receptor', 'LAB10811', '317420', '', '', 'https://www.testmenu.com/nyumc');

INSERT INTO hospital_lab_codes (common_name, hospital, test_name, order_code, test_id, cpt_codes, specimen_type, source_url)
VALUES ('Gastrin', 'NYU Langone Health', 'Gastrin', 'LAB80', '317080', '', '', 'https://www.testmenu.com/nyumc');

