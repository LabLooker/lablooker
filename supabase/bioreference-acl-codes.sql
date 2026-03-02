-- Northwell Health Labs Test Codes
-- Source: labs.northwell.edu (Public API)
-- Research Date: 2026-03-01
-- 
-- BioReference: BLOCKED by Incapsula WAF - requires real browser access
-- ACL Laboratories: Connection failures from server - try supplies.acllaboratories.com/tests-directory/
-- Incyte Diagnostics: Acquired by LabCorp Dec 2025 - no longer independent
--
-- Only Northwell data available programmatically

INSERT INTO lab_tests (lab_name, test_name, lab_test_name, lab_test_id, lab_order_code, loinc_code, cpt_codes) VALUES
-- Northwell Health Labs
('Northwell Health Labs', 'CBC', 'CBC with Differential', '139665651', '5500290', NULL, '85004;85027'),
('Northwell Health Labs', 'CMP', 'COMPMETA', '655045', '5302006', '24323-8', '82040;82247;82310;82374;82435;82565;82947;84075;84132;84155;84295;84450;84460;84520'),
('Northwell Health Labs', 'BMP', 'METABOLIC', '655039', '5302000', '51990-0', '82310;82374;82435;82565;82947;84132;84295;84520'),
('Northwell Health Labs', 'TSH', 'TSH', '656705', '5300435', '3016-3', '84443'),
('Northwell Health Labs', 'Free T3', 'Free Triiodothyronine', '657087', '5910011', '14928-6', '84481'),
('Northwell Health Labs', 'Free T4', 'Thyroxine-Free', '656709', '5300445', '14920-3', '84439'),
('Northwell Health Labs', 'Lipid Panel', 'LIPIDX', '168986312', '1453599', NULL, '82465;83718;84478'),
('Northwell Health Labs', 'HbA1c', 'A1C Estimated Average Glucose', '655093', '5302212', '17856-6', '83036'),
('Northwell Health Labs', 'Vitamin D', 'Vitamin D 25 Hydroxy', '656813', '5901360', NULL, '82306'),
('Northwell Health Labs', 'Ferritin', 'Ferritin', '656637', '5300315', '2276-4', '82728'),
('Northwell Health Labs', 'Iron/TIBC', 'Iron', '656645', '5300335', '2498-4', '83540'),
('Northwell Health Labs', 'CRP', 'C-Reactive Protein', '657293', '5302640', '7916-0', '86140'),
('Northwell Health Labs', 'hs-CRP', 'C-Reactive Protein Cardiac', '656837', '5901702', NULL, '86141'),
('Northwell Health Labs', 'ESR', 'Erythrocyte Sedimentation Rate (ESR)', '657485', '5500316', NULL, '85651'),
('Northwell Health Labs', 'ANA', 'Antinuclear AB', '654849', '5700066', '8061-4', '86038'),
('Northwell Health Labs', 'Testosterone Total', 'TESTOSTERONE, TOTAL', '657339', '5302950', '2986-8', '84403'),
('Northwell Health Labs', 'Testosterone Free', 'Testosterone, Free, and Total', '839033781', '211266', NULL, NULL),
('Northwell Health Labs', 'Estradiol', 'Estradiol', '657059', '5302160', '2243-4', '82670'),
('Northwell Health Labs', 'Progesterone', 'PROG', '657225', '5302495', '2839-9', '84144'),
('Northwell Health Labs', 'FSH', 'Follicle Stimulating Hormone', '656681', '5300405', '2286-3', '83001'),
('Northwell Health Labs', 'LH', 'Luteinizing Hormone', '656685', '5300410', '10501-5', '83002'),
('Northwell Health Labs', 'DHEA-S', 'Dehydroepiandrosterone Sulfate', '656347', '5900535', NULL, '82627'),
('Northwell Health Labs', 'Prolactin', 'Prolactin', '656671', '5300375', '15081-3', '84146'),
('Northwell Health Labs', 'IGF-1', 'IGF-1', '87876490', '5900868', NULL, '84305'),
('Northwell Health Labs', 'Cortisol', 'Cortisol AM Serum', '656639', '5300325', '2143-6', '82533'),
('Northwell Health Labs', 'Insulin', 'Insulin', '657341', '5302970', NULL, '83525'),
('Northwell Health Labs', 'B12', 'Vitamin B12', '656673', '5300385', '2132-9', '82607'),
('Northwell Health Labs', 'Folate', 'Folate', '656675', '5300390', '2284-8', '82746'),
('Northwell Health Labs', 'Magnesium', 'Magnesium', '656625', '5300255', '2601-3', '83735'),
('Northwell Health Labs', 'Phosphorus', 'Phosphorous', '656541', '5300065', '2777-1', '84100'),
('Northwell Health Labs', 'PTH', 'Parathyroid Hormone Intact with Calcium', '10385908', '5902666', '2731-8', '82310;83970'),
('Northwell Health Labs', 'Calcium Ionized', 'Calcium, Ionized', '656679', '5300400', '1995-0', '82330'),
('Northwell Health Labs', 'Urinalysis', 'Urinalysis with Rflx Culture', '155025180', '5600046', '58077-9', '81001'),
('Northwell Health Labs', 'Uric Acid', 'Uric Acid', '658305', '5300240', '3084-1', '84550'),
('Northwell Health Labs', 'GGT', 'Gamma Glutamyl Transferase', '656581', '5300140', '2324-2', '82977'),
('Northwell Health Labs', 'Homocysteine', 'Homocysteine Blood', '656617', '5900785', NULL, '83090'),
('Northwell Health Labs', 'Fibrinogen', 'Fibrinogen Clauss', '17045108', '5500571', NULL, '85384'),
('Northwell Health Labs', 'PSA', 'Prostate Specific Antigen', '657227', '5302500', '2857-1', '84153'),
('Northwell Health Labs', 'Hepatitis B Surface Ab', 'HEP B Surface Antigen', '657301', '5302657', '5195-3', '87340'),
('Northwell Health Labs', 'Hepatitis C Ab', 'Hepatitis C AB', '657317', '5302685', '22327-1', '86803'),
('Northwell Health Labs', 'HIV', 'HIV AG/AB Screen by CMIA', '115300971', '5308002', '56888-1', '86703'),
('Northwell Health Labs', 'RPR', 'Syphilis Titer', '171301239', '5963017', '31147-2', '86592'),
('Northwell Health Labs', 'TPO Ab', 'Thyroid Peroxidase Antibody', '657243', '5915422', '8099-4', '86376'),
('Northwell Health Labs', 'Thyroglobulin Ab', 'Thyroglobulin', '654923', '5900117', NULL, '84432;86800'),
('Northwell Health Labs', 'Celiac Panel', 'Celiac Panel', '76934532', '5711044', NULL, NULL),
('Northwell Health Labs', 'Reticulocyte Count', 'Retic Count', '655409', '5500355', '14196-0', '85045'),
('Northwell Health Labs', 'Hemoglobin Electrophoresis', 'HGB ELECT w Intrp and Reflex', '654799', '5604000', '43113-0', '83020'),
('Northwell Health Labs', 'sTfR', 'Soluable Transferrin Receptor', '768741', '5911010', NULL, '84238'),
('Northwell Health Labs', 'Gastrin', 'Gastrin Serum', '656197', '5900160', '2333-3', '82941')
ON CONFLICT (lab_name, test_name) DO UPDATE SET
  lab_test_name = EXCLUDED.lab_test_name,
  lab_test_id = EXCLUDED.lab_test_id,
  lab_order_code = EXCLUDED.lab_order_code,
  loinc_code = EXCLUDED.loinc_code,
  cpt_codes = EXCLUDED.cpt_codes;
