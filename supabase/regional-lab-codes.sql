-- Regional Lab Test Codes — SQL Inserts
-- Generated: 2026-03-01
-- Source: Interpath Laboratory (interpathlab.com) — the only regional lab with fully accessible public test directory
-- Other labs require browser automation or direct contact for proprietary codes

-- ============================================================
-- LAB: Interpath Laboratory
-- Region: Pacific Northwest (OR, WA, ID)
-- Website: interpathlab.com
-- ============================================================

-- Assumes tables:
--   labs (id, name, slug, website, region, parent_company, notes)
--   lab_tests (id, lab_id, standard_test_name, lab_order_code, lab_test_name, cpt_codes, specimen_type, notes)

-- Insert lab record
INSERT INTO labs (name, slug, website, region, parent_company, notes)
VALUES (
  'Interpath Laboratory',
  'interpath',
  'https://www.interpathlab.com',
  'Pacific Northwest (OR, WA, ID)',
  NULL,
  'Full test library publicly accessible at interpathlab.com/test-library/'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert test codes (using lab_id subquery)
INSERT INTO lab_tests (lab_id, standard_test_name, lab_order_code, lab_test_name, cpt_codes, specimen_type, notes) VALUES
((SELECT id FROM labs WHERE slug = 'interpath'), 'CBC', '3002', 'CBC with ANC', '85025', 'EDTA Whole Blood', 'Also: 3005 (CBC without Differential)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'CMP', '1943', 'Comprehensive Metabolic Panel', '80053', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'BMP', '1942', 'Basic Metabolic Panel', '80048', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'TSH', '2090', 'TSH, 3rd Generation', '84443', 'Serum', 'Also: 2190 (TSH w/Free T4 Reflex)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Free T3', '2296', 'Free T3', '84481', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Free T4', '2146', 'Free T4', '84439', 'Serum', 'Also: 90202 (by Equilibrium Dialysis)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Lipid Panel', '1454', 'Lipid Panel', '80061', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'HbA1c', '2051', 'Hemoglobin A1C Panel', '83036', 'EDTA Whole Blood', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Vitamin D 25-OH', '2655', 'Vitamin D 25-OH', '82306', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Ferritin', '2074', 'Ferritin', '82728', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Iron Panel', '2040', 'Iron and Total Iron Binding', '83540,83550', 'Serum', 'Also: 2038 (Iron alone), 1448 (Iron Deficiency Panel)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'CRP', '2320', 'C-Reactive Protein', '86140', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'hs-CRP', '2560', 'C-Reactive Protein, Highly Sensitive', '86141', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'ESR', '3105', 'Erythrocyte Sedimentation Rate (ESR)', '85652', 'EDTA Whole Blood', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'ANA', '1747', 'Anti-Nuclear Antibody', '86235', 'Serum', 'Also: 1748 (ANA with Reflex)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Testosterone Total', '2179', 'Testosterone', '84403', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Testosterone Free', '5025', 'Testosterone, Free + Total', '84402,84403', 'Serum', 'Also: 92160 (Free Testosterone LC/MS)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Estradiol', '2231', 'Estradiol', '82670', 'Serum', 'Also: 93162 (Ultrasensitive)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Progesterone', '2300', 'Progesterone', '84144', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'FSH', '2166', 'FSH', '83001', 'Serum', 'Also: 2170 (FSH and LH combo)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'LH', '2167', 'LH', '83002', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'DHEA-S', '2214', 'DHEA Sulfate', '82627', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Prolactin', '2131', 'Prolactin', '84146', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'IGF-1', '2738', 'IGF-1', '84305', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Cortisol AM', '2880', 'Cortisol', '82533', 'Serum', 'Also: 91359 (Saliva), 91071 (Urinary Free)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Insulin Fasting', '2227', 'Insulin, Fasting', '83525', 'Serum', 'Also: 2228 (Random)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Vitamin B12', '2126', 'Vitamin B12', '82607', 'Serum', 'Also: 2140 (B12 and Folate combo)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Folate', '2127', 'Folate', '82746', 'Serum', 'Also: 91104 (Folate, RBC)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Magnesium', '2042', 'Magnesium', '83735', 'Serum', 'Also: 9669 (RBC), 91159 (Urine)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Phosphorus', '1012', 'Phosphorus, Inorganic', '84100', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'PTH Intact', '5026', 'Parathyroid Hormone, Intact (PTH)', '83970', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Calcium Ionized', '91042', 'Calcium, Ionized', '82330', 'Heparinized Whole Blood', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Urinalysis', '3300', 'Urinalysis', '81001', 'Urine', 'Also: 3302 (with C&S Reflex), 3321 (Micro)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Uric Acid', '1013', 'Uric Acid, Serum or Plasma', '84550', 'Serum/Plasma', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'GGT', '2019', 'GGT', '82977', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Homocysteine', '2224', 'Homocysteine', '83090', 'Serum/Plasma', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Fibrinogen', '2054', 'Fibrinogen', '85384', 'Citrate Plasma', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'PSA', '2147', 'PSA, Ultrasensitive', '84153', 'Serum', 'Also: 2293 (MC Screening), 2261 (Total & Free)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Hepatitis B Surface Ab', '2104', 'Hepatitis B Virus Surface Antibody, Post-Vaccination', '86706', 'Serum', 'Also: 1436 (Hep B Panel)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Hepatitis C Ab', '2304', 'Hepatitis C Virus Antibody', '86803', 'Serum', 'Also: 2698 (with Reflex)'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'HIV 1/2', '2845', 'HIV 1/2 Antigen and Antibodies, Fourth Generation', '87389', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'RPR/VDRL', '1003', 'Treponema pallidum (Syphilis) Screening Cascade', '86592', 'Serum', 'Reflexive cascade approach'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Thyroid Peroxidase Ab', '2754', 'Anti-Thyroid Peroxidase', '86376', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Thyroglobulin Ab', '2755', 'Anti-Thyroglobulin', '86800', 'Serum', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Celiac Panel (tTG IgA)', '2752', 'Tissue Transglutaminase Antibody, IgA', '86364', 'Serum', 'Part of celiac workup'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Celiac Panel (tTG IgG)', '2727', 'Tissue Transglutaminase Antibody, IgG', '86364', 'Serum', 'Part of celiac workup'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Celiac Panel (DGP IgA)', '2725', 'Deaminated Gliadin Peptide Antibody, IgA', '86364', 'Serum', 'Part of celiac workup'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Celiac Panel (DGP IgG)', '2726', 'Deaminated Gliadin Peptide Antibody, IgG', '86364', 'Serum', 'Part of celiac workup'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Sed Rate', '3105', 'Erythrocyte Sedimentation Rate (ESR)', '85652', 'EDTA Whole Blood', 'Same as ESR'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Reticulocyte Count', '3120', 'Reticulocyte Count, Automated', '85045', 'EDTA Whole Blood', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Hemoglobin Electrophoresis', '90200', 'Hemoglobin Evaluation Reflexive Cascade', '83021', 'EDTA Whole Blood', 'Reflexive cascade approach'),
((SELECT id FROM labs WHERE slug = 'interpath'), 'sTfR', '91541', 'Soluble Transferrin Receptor, Serum or Plasma', '84466', 'Serum/Plasma', NULL),
((SELECT id FROM labs WHERE slug = 'interpath'), 'Gastrin', '91108', 'Gastrin', '82941', 'Serum', NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PLACEHOLDER LABS (no proprietary codes extracted yet)
-- Insert lab records for future population
-- ============================================================

INSERT INTO labs (name, slug, website, region, parent_company, notes) VALUES
('CPL (Clinical Pathology Laboratories)', 'cpl', 'https://www.cpllabs.com', 'Texas', 'Sonic Healthcare', 'JS-rendered directory at cpllabs.com/clinicians/test-directory/; needs browser scraping'),
('Sonic Reference Laboratory', 'sonic-ref', 'https://www.sonichealthcareusa.com', 'National (HQ Austin TX)', 'Sonic Healthcare', 'Test manual at testmanual.sonichealthcareusa.com; requires practice selection'),
('BioReference Laboratories', 'bioreference', 'https://www.bioreference.com', 'National (HQ NJ)', 'OPKO Health', 'JS-rendered directory; also has CPT code search tool'),
('Marshfield Labs', 'marshfield', 'https://www.marshfieldlabs.org', 'Wisconsin, Upper Michigan, E. Minnesota', 'Marshfield Clinic Health System', 'Client portal only — requires registration for test reference manual'),
('ACL Laboratories', 'acl', 'https://www.acllaboratories.com', 'Illinois, Wisconsin', 'Advocate Health', 'Directory at supplies.acllaboratories.com; server was down during research'),
('Northwell Health Labs', 'northwell', 'https://nwhlabs.northwell.edu', 'New York (Long Island, NYC metro)', 'Northwell Health', 'JS-rendered Epic-based directory at labs.northwell.edu'),
('Fairview Health Labs', 'fairview', 'https://www.fairview.org', 'Minnesota', 'M Health Fairview', 'labguide.fairview.org returned 520 error'),
('PeaceHealth Labs', 'peacehealth', 'https://www.peacehealth.org', 'Alaska, Oregon, Washington', 'PeaceHealth', 'peacehealthlabs.org domain expired; now uses Quest for some locations'),
('Incyte Diagnostics', 'incyte', 'https://www.incytediagnostics.com', 'Pacific Northwest (Spokane WA)', 'Labcorp (acquired Dec 2025)', 'Acquired by Labcorp Dec 2025; directory still live but transitioning')
ON CONFLICT (slug) DO NOTHING;
