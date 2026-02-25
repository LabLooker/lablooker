-- ============================================================
-- LabLooker Comprehensive Seed Data
-- 120 lab tests, 60 ICD-10 codes, 19 symptoms, 51 states
-- ============================================================

-- ============================================================
-- TESTS (120 total)
-- ============================================================
insert into tests (id, test_name, description, cpt_codes, category, fasting_required, turnaround, notes) values
-- THYROID (001-011)
('a0000001-0000-0000-0000-000000000001', 'TSH (Thyroid Stimulating Hormone)', 'Measures the hormone that tells your thyroid to produce thyroid hormones. It is the primary screening test for thyroid problems.', '{84443}', 'thyroid', false, '1-2 days', 'Best drawn in the morning when TSH peaks. First-line test for hypo/hyperthyroidism screening.'),
('a0000001-0000-0000-0000-000000000002', 'Free T4 (Thyroxine)', 'Measures the active, unbound form of the main thyroid hormone T4. Used alongside TSH to evaluate how well your thyroid is working.', '{84439}', 'thyroid', false, '1-2 days', 'Order with TSH for complete thyroid assessment. Free T4 is preferred over Total T4.'),
('a0000001-0000-0000-0000-000000000003', 'Free T3 (Triiodothyronine)', 'Measures the unbound, active form of T3, the most potent thyroid hormone. Helpful when TSH is abnormal but Free T4 is normal.', '{84481}', 'thyroid', false, '1-2 days', 'Often ordered with TSH and Free T4. Important for detecting T3 thyrotoxicosis.'),
('a0000001-0000-0000-0000-000000000004', 'Reverse T3', 'Measures reverse T3, an inactive form of T3. High levels may indicate your body is converting T4 into the inactive form instead of active T3.', '{84482}', 'thyroid', false, '3-5 days', 'Useful in evaluating sick euthyroid syndrome and chronic illness. Not routinely ordered.'),
('a0000001-0000-0000-0000-000000000005', 'Total T4', 'Measures both bound and unbound T4 in your blood. Can be affected by protein levels, so Free T4 is generally preferred.', '{84436}', 'thyroid', false, '1-2 days', 'Can be falsely elevated by estrogen, pregnancy, or oral contraceptives due to increased binding proteins.'),
('a0000001-0000-0000-0000-000000000006', 'Total T3', 'Measures both bound and unbound T3 in your blood. Useful for diagnosing hyperthyroidism when T3 is the predominantly elevated hormone.', '{84480}', 'thyroid', false, '1-2 days', 'Affected by binding protein levels. Free T3 is generally more clinically useful.'),
('a0000001-0000-0000-0000-000000000007', 'TPO Antibodies (Thyroid Peroxidase)', 'Detects antibodies that attack a key thyroid enzyme. Elevated levels indicate autoimmune thyroid disease such as Hashimoto''s thyroiditis.', '{86376}', 'thyroid', false, '2-3 days', 'Present in about 95% of Hashimoto''s patients. Can be elevated years before thyroid dysfunction appears.'),
('a0000001-0000-0000-0000-000000000008', 'Thyroglobulin Antibodies', 'Detects antibodies against thyroglobulin, a protein made by the thyroid. Elevated in autoimmune thyroid disease and monitored after thyroid cancer treatment.', '{86800}', 'thyroid', false, '2-3 days', 'Can interfere with thyroglobulin tumor marker measurements. Often ordered with TPO antibodies.'),
('a0000001-0000-0000-0000-000000000009', 'Thyroid Stimulating Immunoglobulin (TSI)', 'Detects antibodies that mimic TSH and overstimulate the thyroid. The primary test for confirming Graves'' disease.', '{84445}', 'thyroid', false, '5-7 days', 'Highly specific for Graves'' disease. Also called thyroid-stimulating antibodies (TSAb).'),
('a0000001-0000-0000-0000-000000000010', 'Thyroglobulin', 'Measures the protein produced by thyroid cells. Primarily used as a tumor marker to monitor thyroid cancer after treatment.', '{84432}', 'thyroid', false, '3-5 days', 'Must be interpreted with thyroglobulin antibody results. Used for post-thyroidectomy cancer surveillance.'),
('a0000001-0000-0000-0000-000000000011', 'T3 Uptake', 'An indirect measure of thyroid-binding protein levels. Used with Total T4 to calculate the Free Thyroxine Index.', '{84479}', 'thyroid', false, '1-2 days', 'Largely replaced by direct Free T4 measurement. Still part of some legacy thyroid panels.'),
-- HORMONES (012-027)
('a0000001-0000-0000-0000-000000000012', 'Estradiol (E2)', 'Measures the primary form of estrogen. Used to evaluate menstrual irregularities, menopause symptoms, and fertility in both women and men.', '{82670}', 'hormones', false, '1-2 days', 'Timing depends on menstrual cycle phase. Day 3 is standard for fertility workup.'),
('a0000001-0000-0000-0000-000000000013', 'Progesterone', 'Measures the hormone essential for menstrual cycle regulation and pregnancy. Used to confirm ovulation and evaluate luteal phase function.', '{84144}', 'hormones', false, '1-2 days', 'Day 21 of cycle (7 days post-ovulation) is standard timing for ovulation confirmation.'),
('a0000001-0000-0000-0000-000000000014', 'Testosterone, Total', 'Measures all testosterone in your blood. Used to evaluate low testosterone in men and excess androgens in women.', '{84403}', 'hormones', false, '1-2 days', 'Must be drawn before 10 AM when levels peak. Repeat abnormal results to confirm.'),
('a0000001-0000-0000-0000-000000000015', 'Testosterone, Free', 'Measures only the unbound, active testosterone. More accurate than total testosterone when binding protein levels are abnormal.', '{84402}', 'hormones', false, '2-3 days', 'Calculated free testosterone from total T, SHBG, albumin is preferred over direct analog assay.'),
('a0000001-0000-0000-0000-000000000016', 'DHEA-S (Dehydroepiandrosterone Sulfate)', 'Measures an adrenal androgen hormone. Used to evaluate adrenal gland function and investigate excess androgen symptoms.', '{82627}', 'hormones', false, '1-2 days', 'Levels decline naturally with age. Elevated in adrenal tumors and congenital adrenal hyperplasia.'),
('a0000001-0000-0000-0000-000000000017', 'Cortisol, AM', 'Measures your morning cortisol, the primary stress hormone. AM cortisol is the standard screening test for adrenal insufficiency.', '{82533}', 'hormones', false, '1-2 days', 'Must be drawn between 7-9 AM for accurate baseline. Stress and illness can elevate levels.'),
('a0000001-0000-0000-0000-000000000018', 'Cortisol, PM', 'Measures your evening cortisol level. Normally cortisol drops significantly by evening, so elevated PM levels suggest Cushing''s syndrome.', '{82533}', 'hormones', false, '1-2 days', 'Draw between 4-6 PM. Same CPT as AM cortisol; timing difference is what matters clinically.'),
('a0000001-0000-0000-0000-000000000019', '24-Hour Urine Cortisol', 'Measures the total cortisol excreted in urine over a full day. Provides an integrated picture of daily cortisol production.', '{82530}', 'hormones', false, '3-5 days', 'Patient must collect all urine for 24 hours. One of three recommended screening tests for Cushing''s.'),
('a0000001-0000-0000-0000-000000000020', 'Prolactin', 'Measures the hormone responsible for breast milk production. Elevated levels can cause menstrual irregularities, infertility, or suggest a pituitary tumor.', '{84146}', 'hormones', false, '1-2 days', 'Best drawn in the morning. Stress, exercise, and certain medications can elevate levels.'),
('a0000001-0000-0000-0000-000000000021', 'FSH (Follicle Stimulating Hormone)', 'Measures the hormone that stimulates egg and sperm production. Used to evaluate fertility, menopause, and pituitary function.', '{83001}', 'hormones', false, '1-2 days', 'Day 3 of cycle for fertility workup. Elevated in menopause. Low suggests pituitary problem.'),
('a0000001-0000-0000-0000-000000000022', 'LH (Luteinizing Hormone)', 'Measures the hormone that triggers ovulation and testosterone production. Used with FSH to evaluate fertility and hormonal imbalances.', '{83002}', 'hormones', false, '1-2 days', 'LH:FSH ratio greater than 2:1 suggests PCOS. Mid-cycle surge confirms ovulation.'),
('a0000001-0000-0000-0000-000000000023', 'IGF-1 (Insulin-like Growth Factor 1)', 'Measures a hormone that reflects growth hormone activity. Used to screen for growth hormone deficiency or excess (acromegaly).', '{84305}', 'hormones', false, '1-2 days', 'Age-adjusted reference ranges are essential. Affected by nutritional status and liver function.'),
('a0000001-0000-0000-0000-000000000024', 'SHBG (Sex Hormone Binding Globulin)', 'Measures the protein that carries sex hormones in the blood. Important for interpreting testosterone and estrogen levels.', '{84270}', 'hormones', false, '1-2 days', 'Low SHBG associated with insulin resistance and PCOS. High SHBG can mask true testosterone levels.'),
('a0000001-0000-0000-0000-000000000025', 'Pregnenolone', 'Measures the precursor hormone from which most other steroid hormones are made. Sometimes called the mother hormone.', '{84140}', 'hormones', false, '2-3 days', 'Levels decline with age. Limited clinical utility; mainly used in specialty hormone evaluations.'),
('a0000001-0000-0000-0000-000000000026', 'Aldosterone', 'Measures the hormone that regulates sodium and potassium balance. Used to evaluate high blood pressure and adrenal gland disorders.', '{82088}', 'hormones', false, '2-3 days', 'Patient positioning (upright vs supine) affects results. Often ordered with renin as a ratio.'),
('a0000001-0000-0000-0000-000000000027', 'Renin', 'Measures the enzyme that helps regulate blood pressure through the renin-angiotensin system. Used with aldosterone to evaluate hypertension causes.', '{84244}', 'hormones', false, '2-3 days', 'Must note patient position and time of day. Aldosterone-to-renin ratio screens for primary aldosteronism.'),
-- IRON/BLOOD (028-036)
('a0000001-0000-0000-0000-000000000028', 'CBC with Differential', 'A comprehensive blood cell count including red cells, white cells with subtypes, hemoglobin, and platelets. The most commonly ordered blood test.', '{85025}', 'iron_blood', false, '1 day', 'No fasting required. CBC with differential is the standard version ordered in most clinical settings.'),
('a0000001-0000-0000-0000-000000000029', 'Iron, Serum', 'Measures the amount of iron circulating in your blood. Used with other iron tests to evaluate iron deficiency or overload.', '{83540}', 'iron_blood', true, '1-2 days', 'Fasting morning draw preferred as iron levels fluctuate during the day. Interpret with TIBC and ferritin.'),
('a0000001-0000-0000-0000-000000000030', 'TIBC (Total Iron Binding Capacity)', 'Measures how much iron your blood could carry. High TIBC suggests iron deficiency; low TIBC may indicate iron overload.', '{83550}', 'iron_blood', true, '1-2 days', 'Fasting preferred. Elevated in iron deficiency, decreased in chronic disease and hemochromatosis.'),
('a0000001-0000-0000-0000-000000000031', 'Iron Saturation %', 'Calculates the percentage of iron-binding sites that are occupied. Helps distinguish between types of iron disorders.', '{83550}', 'iron_blood', true, '1-2 days', 'Calculated as serum iron divided by TIBC times 100. Normal is 20-50 percent.'),
('a0000001-0000-0000-0000-000000000032', 'Ferritin', 'Measures your stored iron levels. The most sensitive test for iron deficiency, even before anemia develops.', '{82728}', 'iron_blood', false, '1-2 days', 'Can be falsely elevated by inflammation, infection, or liver disease. Optimal range is higher than the lab minimum.'),
('a0000001-0000-0000-0000-000000000033', 'Reticulocyte Count', 'Measures young red blood cells just released from bone marrow. Shows how actively your body is producing new red blood cells.', '{85045}', 'iron_blood', false, '1-2 days', 'Elevated in hemolytic anemia and blood loss. Low in bone marrow failure and nutritional deficiencies.'),
('a0000001-0000-0000-0000-000000000034', 'Soluble Transferrin Receptor (sTfR)', 'Measures a protein that reflects iron demand at the cellular level. Helps distinguish iron deficiency from anemia of chronic disease.', '{84466}', 'iron_blood', false, '3-5 days', 'Not affected by inflammation, unlike ferritin. Elevated when iron stores are truly depleted.'),
('a0000001-0000-0000-0000-000000000035', 'Haptoglobin', 'Measures a protein that binds free hemoglobin from broken red blood cells. Low levels suggest red blood cells are being destroyed (hemolysis).', '{83010}', 'iron_blood', false, '1-2 days', 'Low haptoglobin is a marker of hemolytic anemia. Also an acute phase reactant that rises with inflammation.'),
('a0000001-0000-0000-0000-000000000036', 'RBC Folate', 'Measures folate levels inside red blood cells, reflecting your folate status over the past 2-3 months. More reliable than serum folate.', '{82747}', 'iron_blood', false, '3-5 days', 'Better long-term indicator than serum folate. Important for evaluating megaloblastic anemia.'),
-- METABOLIC (037-050)
('a0000001-0000-0000-0000-000000000037', 'CMP (Comprehensive Metabolic Panel)', 'A panel of 14 tests covering blood sugar, electrolytes, kidney function, and liver enzymes. One of the most commonly ordered screening panels.', '{80053}', 'metabolic', true, '1 day', 'Requires 10-12 hour fast for accurate glucose. Includes sodium, potassium, chloride, CO2, BUN, creatinine, glucose, calcium, albumin, total protein, ALP, ALT, AST, bilirubin.'),
('a0000001-0000-0000-0000-000000000038', 'BMP (Basic Metabolic Panel)', 'A panel of 8 tests covering blood sugar, electrolytes, and kidney function. A quicker, less expensive alternative to CMP.', '{80048}', 'metabolic', true, '1 day', 'Requires 10-12 hour fast. Includes glucose, BUN, creatinine, sodium, potassium, chloride, CO2, calcium.'),
('a0000001-0000-0000-0000-000000000039', 'Fasting Glucose', 'Measures your blood sugar after an overnight fast. The basic screening test for diabetes and prediabetes.', '{82947}', 'metabolic', true, '1 day', 'Requires 10-12 hour fast. Normal below 100, prediabetes 100-125, diabetes 126 or above.'),
('a0000001-0000-0000-0000-000000000040', 'Fasting Insulin', 'Measures how much insulin your pancreas produces while fasting. Used to detect insulin resistance before blood sugar becomes abnormal.', '{83525}', 'metabolic', true, '1-2 days', 'Requires 10-12 hour fast. Can detect insulin resistance years before glucose rises.'),
('a0000001-0000-0000-0000-000000000041', 'HOMA-IR (Insulin Resistance Score)', 'A calculated score using fasting glucose and insulin that estimates insulin resistance. Higher scores indicate greater insulin resistance.', '{82947,83525}', 'metabolic', true, '1-2 days', 'Calculated as glucose times insulin divided by 405. Optimal below 1.0, concerning above 2.0.'),
('a0000001-0000-0000-0000-000000000042', 'HbA1c (Hemoglobin A1c)', 'Measures your average blood sugar over the past 2-3 months. The gold standard test for diagnosing and monitoring diabetes.', '{83036}', 'metabolic', false, '1-2 days', 'No fasting required. Normal below 5.7 percent, prediabetes 5.7-6.4, diabetes 6.5 or above.'),
('a0000001-0000-0000-0000-000000000043', 'Uric Acid', 'Measures uric acid levels in your blood. High levels can cause gout and kidney stones and are linked to cardiovascular risk.', '{84550}', 'metabolic', false, '1-2 days', 'Elevated by purine-rich foods, alcohol, and fructose. Target below 6.0 for gout patients.'),
('a0000001-0000-0000-0000-000000000044', 'Fasting Lipid Panel', 'Measures your cholesterol and triglycerides including total cholesterol, LDL, HDL, and triglycerides. Standard cardiovascular risk screening.', '{80061}', 'metabolic', true, '1 day', 'Requires 10-12 hour fast for accurate triglycerides. Non-fasting is acceptable for screening per newer guidelines.'),
('a0000001-0000-0000-0000-000000000045', 'ApoB (Apolipoprotein B)', 'Measures the number of potentially harmful cholesterol-carrying particles in your blood. Considered a better predictor of heart disease than LDL alone.', '{82172}', 'metabolic', false, '2-3 days', 'Each atherogenic particle has one ApoB molecule. Target below 90 general, below 80 high risk.'),
('a0000001-0000-0000-0000-000000000046', 'Lipoprotein(a) / Lp(a)', 'Measures a genetically determined type of LDL particle that increases cardiovascular risk. Levels are mostly determined by your genes.', '{83695}', 'metabolic', false, '3-5 days', 'Only needs to be measured once in a lifetime as levels are genetically fixed. Above 50 nmol/L is elevated risk.'),
('a0000001-0000-0000-0000-000000000047', 'LDL Particle Number (NMR LipoProfile)', 'Measures the actual number of LDL particles using advanced NMR technology. More predictive of heart disease than standard LDL cholesterol.', '{83704}', 'metabolic', false, '3-5 days', 'Advanced lipid testing. Discordance between LDL-C and LDL-P is clinically important.'),
('a0000001-0000-0000-0000-000000000048', 'hs-CRP (High-Sensitivity C-Reactive Protein)', 'Measures very low levels of inflammation in your blood. Used to assess cardiovascular risk and chronic low-grade inflammation.', '{86141}', 'metabolic', false, '1-2 days', 'Cardiac risk: below 1 low, 1-3 moderate, above 3 high. Recheck if above 10 as acute infection may be present.'),
('a0000001-0000-0000-0000-000000000049', 'ESR (Erythrocyte Sedimentation Rate)', 'Measures how quickly red blood cells settle in a tube, which increases with inflammation. A general, non-specific marker of inflammation.', '{85652}', 'metabolic', false, '1 day', 'Non-specific but useful for monitoring inflammatory conditions. Elevated in autoimmune disease, infection, and cancer.'),
('a0000001-0000-0000-0000-000000000050', 'CRP (C-Reactive Protein, Standard)', 'Measures inflammation in your body at standard sensitivity. Elevated CRP indicates infection, autoimmune disease, or significant inflammation.', '{86140}', 'metabolic', false, '1 day', 'Standard CRP for acute inflammation. Use hs-CRP for cardiovascular risk assessment.'),
-- VITAMINS/MINERALS (051-060)
('a0000001-0000-0000-0000-000000000051', 'Vitamin D, 25-Hydroxy', 'Measures your vitamin D status. Deficiency is extremely common and linked to fatigue, weakened bones, and impaired immune function.', '{82306}', 'vitamins_minerals', false, '2-3 days', '25-hydroxy is the correct form to test. Optimal 40-60 ng/mL. Supplement if below 30.'),
('a0000001-0000-0000-0000-000000000052', 'Vitamin B12', 'Measures B12 levels in your blood. Deficiency can cause fatigue, nerve damage, and cognitive problems, especially in vegetarians and older adults.', '{82607}', 'vitamins_minerals', false, '1-2 days', 'Serum B12 can be normal despite functional deficiency. Follow up with MMA if B12 is low-normal.'),
('a0000001-0000-0000-0000-000000000053', 'Methylmalonic Acid (MMA)', 'Measures a substance that builds up when B12 is deficient at the cellular level. More sensitive than serum B12 for detecting true B12 deficiency.', '{83921}', 'vitamins_minerals', false, '3-5 days', 'Elevated MMA confirms functional B12 deficiency even when serum B12 is borderline. Can also rise with kidney disease.'),
('a0000001-0000-0000-0000-000000000054', 'Homocysteine', 'Measures an amino acid that rises when B12, folate, or B6 are deficient. Elevated levels are also an independent cardiovascular risk factor.', '{83090}', 'vitamins_minerals', false, '2-3 days', 'Fasting preferred for most accurate results. Optimal below 10 umol/L. Elevated by B12/folate deficiency and MTHFR variants.'),
('a0000001-0000-0000-0000-000000000055', 'Folate, Serum', 'Measures the blood level of folate (vitamin B9). Important for DNA synthesis, red blood cell production, and preventing neural tube defects.', '{82746}', 'vitamins_minerals', false, '1-2 days', 'Reflects recent intake rather than long-term stores. RBC folate is a better measure of tissue stores.'),
('a0000001-0000-0000-0000-000000000056', 'RBC Magnesium', 'Measures magnesium inside red blood cells, providing a more accurate picture of your body''s magnesium stores than standard serum magnesium.', '{83735}', 'vitamins_minerals', false, '3-5 days', 'Serum magnesium can be normal even when intracellular stores are depleted. RBC Mg is the preferred test.'),
('a0000001-0000-0000-0000-000000000057', 'Zinc', 'Measures zinc levels in your blood. Zinc is essential for immune function, wound healing, taste, and smell.', '{84630}', 'vitamins_minerals', true, '2-3 days', 'Fasting required as recent meals lower zinc levels. Serum zinc can be normal despite mild deficiency.'),
('a0000001-0000-0000-0000-000000000058', 'Copper', 'Measures copper levels in your blood. Important for iron metabolism, nerve function, and immune health. Must be balanced with zinc.', '{82525}', 'vitamins_minerals', false, '2-3 days', 'Copper-to-zinc ratio is clinically relevant. Elevated in inflammation and estrogen therapy.'),
('a0000001-0000-0000-0000-000000000059', 'Selenium', 'Measures selenium, a trace mineral essential for thyroid hormone conversion and antioxidant defense. Important for thyroid health.', '{84255}', 'vitamins_minerals', false, '3-5 days', 'Important cofactor for thyroid hormone conversion T4 to T3. Deficiency linked to Hashimoto''s progression.'),
('a0000001-0000-0000-0000-000000000060', 'Iodine, Urine', 'Measures iodine excretion in urine, reflecting your dietary iodine intake. Iodine is essential for thyroid hormone production.', '{83789}', 'vitamins_minerals', false, '5-7 days', 'Spot urine is convenient but 24-hour urine is more accurate. Deficiency is the leading cause of hypothyroidism worldwide.'),
-- KIDNEY/LIVER (061-072)
('a0000001-0000-0000-0000-000000000061', 'BUN (Blood Urea Nitrogen)', 'Measures a waste product from protein metabolism that your kidneys filter out. High levels may indicate kidney problems or dehydration.', '{84520}', 'kidney_liver', false, '1 day', 'Elevated by high protein diet, dehydration, and kidney disease. BUN-to-creatinine ratio helps differentiate causes.'),
('a0000001-0000-0000-0000-000000000062', 'Creatinine', 'Measures a waste product from muscle metabolism filtered by your kidneys. The primary blood test for assessing kidney function.', '{82565}', 'kidney_liver', false, '1 day', 'Affected by muscle mass so reference ranges differ by age and sex. Used to calculate eGFR.'),
('a0000001-0000-0000-0000-000000000063', 'eGFR (Estimated Glomerular Filtration Rate)', 'Estimates how well your kidneys are filtering blood, calculated from creatinine. The standard measure of kidney function.', '{82565}', 'kidney_liver', false, '1 day', 'Calculated from creatinine using CKD-EPI equation. Normal above 90. Staging: 60-89 mild, 30-59 moderate, below 30 severe.'),
('a0000001-0000-0000-0000-000000000064', 'Cystatin C', 'An alternative kidney function marker not affected by muscle mass. Provides a more accurate kidney function estimate in certain populations.', '{82610}', 'kidney_liver', false, '2-3 days', 'More accurate than creatinine in elderly, obese, and very muscular patients. Can be used to confirm eGFR.'),
('a0000001-0000-0000-0000-000000000065', 'ALT (SGPT)', 'Measures an enzyme found mainly in the liver. Elevated levels indicate liver cell damage or inflammation.', '{84460}', 'kidney_liver', false, '1 day', 'Most specific liver enzyme. Elevated in hepatitis, fatty liver, and medication toxicity.'),
('a0000001-0000-0000-0000-000000000066', 'AST (SGOT)', 'Measures an enzyme found in the liver, heart, and muscles. Elevated levels can indicate liver damage but are less specific than ALT.', '{84450}', 'kidney_liver', false, '1 day', 'Also found in heart and muscle tissue. AST-to-ALT ratio above 2:1 suggests alcoholic liver disease.'),
('a0000001-0000-0000-0000-000000000067', 'GGT (Gamma-Glutamyl Transferase)', 'Measures a liver enzyme especially sensitive to alcohol use and bile duct problems. Often used to investigate elevated alkaline phosphatase.', '{82977}', 'kidney_liver', false, '1 day', 'Most sensitive marker for biliary disease and alcohol use. Elevated GGT plus elevated ALP equals likely biliary cause.'),
('a0000001-0000-0000-0000-000000000068', 'Alkaline Phosphatase (ALP)', 'Measures an enzyme found in the liver, bones, and other tissues. Elevated levels can indicate liver or bone disease.', '{84075}', 'kidney_liver', false, '1 day', 'Normally elevated in growing children and pregnancy. If elevated, GGT helps distinguish liver vs bone source.'),
('a0000001-0000-0000-0000-000000000069', 'Total Bilirubin', 'Measures the yellow pigment from red blood cell breakdown that is processed by the liver. High levels cause jaundice.', '{82247}', 'kidney_liver', false, '1 day', 'Mildly elevated in Gilbert''s syndrome which is benign. Significantly elevated indicates liver disease or hemolysis.'),
('a0000001-0000-0000-0000-000000000070', 'Direct Bilirubin', 'Measures the water-soluble form of bilirubin processed by the liver. Helps distinguish between types of jaundice.', '{82248}', 'kidney_liver', false, '1 day', 'Elevated direct bilirubin suggests biliary obstruction or liver disease.'),
('a0000001-0000-0000-0000-000000000071', 'Albumin', 'Measures the main protein made by your liver. Low levels can indicate liver disease, kidney disease, or malnutrition.', '{82040}', 'kidney_liver', false, '1 day', 'Also a negative acute phase reactant that drops with inflammation. Important for assessing nutritional status.'),
('a0000001-0000-0000-0000-000000000072', 'Total Protein', 'Measures all proteins in your blood, primarily albumin and globulins. Abnormal levels can point to liver, kidney, or immune disorders.', '{84155}', 'kidney_liver', false, '1 day', 'Total protein minus albumin equals globulin. High globulin may indicate chronic infection or myeloma.'),
-- IMMUNE/INFLAMMATION (073-080)
('a0000001-0000-0000-0000-000000000073', 'ANA (Antinuclear Antibody)', 'Detects antibodies that attack your own cell nuclei. A positive ANA is the primary screening test for autoimmune diseases like lupus.', '{86235}', 'immune', false, '2-3 days', 'Positive in about 95% of lupus patients but also in 15% of healthy people. Pattern and titer matter.'),
('a0000001-0000-0000-0000-000000000074', 'Anti-dsDNA', 'Detects antibodies against double-stranded DNA. Highly specific for lupus and levels correlate with disease activity.', '{86225}', 'immune', false, '3-5 days', 'Specific for SLE. Rising titers may predict disease flares. Used with complement levels for monitoring.'),
('a0000001-0000-0000-0000-000000000075', 'Rheumatoid Factor (RF)', 'Detects an antibody commonly found in rheumatoid arthritis. Also elevated in other autoimmune conditions and chronic infections.', '{86431}', 'immune', false, '1-2 days', 'Positive in about 80% of RA patients. Not specific; also elevated in Sjogren''s and hepatitis C.'),
('a0000001-0000-0000-0000-000000000076', 'Anti-CCP (Cyclic Citrullinated Peptide)', 'Detects antibodies highly specific for rheumatoid arthritis. Can be positive years before symptoms appear.', '{86200}', 'immune', false, '3-5 days', 'More specific than RF for RA diagnosis. Positive anti-CCP plus positive RF equals very high likelihood of RA.'),
('a0000001-0000-0000-0000-000000000077', 'Complement C3', 'Measures a key protein in the complement immune system. Low levels indicate the immune system is actively consuming complement, as seen in lupus flares.', '{86160}', 'immune', false, '2-3 days', 'Decreased in active SLE, glomerulonephritis, and some infections. Also an acute phase reactant.'),
('a0000001-0000-0000-0000-000000000078', 'Complement C4', 'Measures another complement protein. Low C4 often decreases before C3 in lupus flares and can indicate hereditary angioedema.', '{86162}', 'immune', false, '2-3 days', 'Low C4 with normal C3 may indicate hereditary angioedema. Both low in active lupus nephritis.'),
('a0000001-0000-0000-0000-000000000079', 'IL-6 (Interleukin-6)', 'Measures a key inflammatory signaling molecule. Elevated levels indicate active inflammation and are linked to many chronic diseases.', '{83519}', 'immune', false, '2-3 days', 'Potent pro-inflammatory cytokine. Elevated in rheumatoid arthritis, infections, and cytokine storms.'),
('a0000001-0000-0000-0000-000000000080', 'TNF-alpha (Tumor Necrosis Factor)', 'Measures a powerful inflammatory signaling protein. Elevated in autoimmune diseases, chronic infections, and some cancers.', '{83519}', 'immune', false, '3-5 days', 'Target of biologic drugs like infliximab and adalimumab. Same CPT code class as IL-6.'),
-- AUTOIMMUNE/GI (081-087)
('a0000001-0000-0000-0000-000000000081', 'Celiac Panel (tTG IgA)', 'Detects antibodies against tissue transglutaminase, the primary screening test for celiac disease. Requires eating gluten for accurate results.', '{86364}', 'autoimmune_gi', false, '2-3 days', 'Must be on a gluten-containing diet for accurate results. Also order Total IgA to rule out IgA deficiency.'),
('a0000001-0000-0000-0000-000000000082', 'Total IgA', 'Measures your total immunoglobulin A level. Important because IgA deficiency can cause false-negative celiac tests.', '{82784}', 'autoimmune_gi', false, '1-2 days', 'IgA deficiency affects about 2-3% of celiac patients. If IgA is low, use IgG-based celiac tests instead.'),
('a0000001-0000-0000-0000-000000000083', 'H. pylori Stool Antigen', 'Detects active H. pylori infection in stool. H. pylori causes most stomach ulcers and increases stomach cancer risk.', '{87338}', 'autoimmune_gi', false, '2-3 days', 'Must stop PPIs 2 weeks and antibiotics 4 weeks before testing. Stool antigen is preferred over blood antibody.'),
('a0000001-0000-0000-0000-000000000084', 'Calprotectin, Stool', 'Measures inflammation in your intestines. Used to distinguish inflammatory bowel disease from irritable bowel syndrome.', '{83993}', 'autoimmune_gi', false, '3-5 days', 'Elevated above 250 ug/g strongly suggests IBD. Normal levels help avoid unnecessary colonoscopy in IBS patients.'),
('a0000001-0000-0000-0000-000000000085', 'Lactoferrin, Stool', 'Detects an inflammatory protein in stool. Like calprotectin, helps distinguish IBD from functional GI disorders.', '{83631}', 'autoimmune_gi', false, '3-5 days', 'Another marker for intestinal inflammation. Often used alongside or as alternative to calprotectin.'),
('a0000001-0000-0000-0000-000000000086', 'Zonulin', 'Measures a protein involved in intestinal permeability. Elevated levels suggest the intestinal barrier may be compromised.', '{83520}', 'autoimmune_gi', false, '5-7 days', 'Research-stage marker for intestinal permeability. Elevated in celiac disease and some autoimmune conditions.'),
('a0000001-0000-0000-0000-000000000087', 'Secretory IgA (sIgA)', 'Measures the antibody that protects your gut lining. Low levels suggest weakened gut immune defense; high levels suggest active gut immune response.', '{82784}', 'autoimmune_gi', false, '3-5 days', 'Usually measured in stool or saliva. Important marker of mucosal immune function.'),
-- CANCER SCREENING (088-093)
('a0000001-0000-0000-0000-000000000088', 'PSA (Prostate Specific Antigen)', 'Measures a protein produced by the prostate gland. Elevated levels may indicate prostate cancer, but can also be raised by benign conditions.', '{84153}', 'cancer_screening', false, '1-2 days', 'Screening recommended for men over 50. PSA above 4.0 warrants further evaluation. Avoid ejaculation 48 hours before.'),
('a0000001-0000-0000-0000-000000000089', 'CA-125', 'Measures a protein that can be elevated in ovarian cancer. Used mainly for monitoring treatment response rather than screening.', '{86304}', 'cancer_screening', false, '2-3 days', 'Not recommended for general screening due to poor specificity. Also elevated in endometriosis and fibroids.'),
('a0000001-0000-0000-0000-000000000090', 'CA 19-9', 'Measures a protein often elevated in pancreatic and other GI cancers. Used primarily for monitoring treatment, not screening.', '{86301}', 'cancer_screening', false, '2-3 days', 'Not suitable for screening. Most useful for monitoring pancreatic cancer treatment response.'),
('a0000001-0000-0000-0000-000000000091', 'CEA (Carcinoembryonic Antigen)', 'Measures a protein that can be elevated in colorectal and other cancers. Primarily used to monitor cancer treatment and detect recurrence.', '{82378}', 'cancer_screening', false, '2-3 days', 'Not useful for screening. Important for colorectal cancer surveillance post-treatment. Also elevated in smokers.'),
('a0000001-0000-0000-0000-000000000092', 'AFP (Alpha-Fetoprotein)', 'Measures a protein elevated in liver cancer and certain germ cell tumors. Also used in prenatal screening for birth defects.', '{82105}', 'cancer_screening', false, '2-3 days', 'Used for hepatocellular carcinoma surveillance in high-risk patients. Also part of prenatal quad screen.'),
('a0000001-0000-0000-0000-000000000093', 'CA 15-3', 'Measures a protein that can be elevated in breast cancer. Used primarily for monitoring metastatic breast cancer treatment response.', '{86300}', 'cancer_screening', false, '2-3 days', 'Not recommended for screening or early detection. Most useful for monitoring advanced breast cancer treatment.'),
-- CARDIAC (094-097)
('a0000001-0000-0000-0000-000000000094', 'BNP (B-type Natriuretic Peptide)', 'Measures a hormone released by the heart when it is under stress. Used to diagnose and monitor heart failure.', '{83880}', 'cardiac', false, '1-2 days', 'BNP above 100 pg/mL suggests heart failure. Also elevated in kidney disease and pulmonary embolism.'),
('a0000001-0000-0000-0000-000000000095', 'NT-proBNP', 'Measures the inactive fragment released alongside BNP when the heart is stressed. A more stable marker of heart failure than BNP.', '{83880}', 'cardiac', false, '1-2 days', 'Longer half-life than BNP so more stable. Age-dependent cutoffs apply.'),
('a0000001-0000-0000-0000-000000000096', 'Troponin I', 'Measures a protein released when heart muscle is damaged. The primary test for diagnosing a heart attack.', '{84484}', 'cardiac', false, '1-2 hours', 'High-sensitivity troponin allows earlier detection. Serial measurements 3-6 hours apart needed. Any elevation warrants urgent evaluation.'),
('a0000001-0000-0000-0000-000000000097', 'D-Dimer', 'Measures a protein fragment produced when blood clots break down. Used to rule out blood clots like deep vein thrombosis and pulmonary embolism.', '{85379}', 'cardiac', false, '1-2 hours', 'Negative D-dimer effectively rules out DVT/PE. Elevated in many conditions including surgery and infection.'),
-- GENETICS (098-102)
('a0000001-0000-0000-0000-000000000098', 'HFE Gene (Hemochromatosis)', 'Tests for genetic mutations that cause hereditary hemochromatosis, a condition where your body absorbs too much iron.', '{81256}', 'genetics', false, '2-4 weeks', 'Tests for C282Y and H63D mutations. Order when iron saturation above 45% and ferritin is elevated. One-time test.'),
('a0000001-0000-0000-0000-000000000099', 'MTHFR Gene Mutation', 'Tests for variants in the MTHFR gene that affect how your body processes folate and homocysteine. Common variants are C677T and A1298C.', '{81291}', 'genetics', false, '2-4 weeks', 'Clinical significance is debated. Treat elevated homocysteine with methylfolate regardless of MTHFR status. One-time test.'),
('a0000001-0000-0000-0000-000000000100', 'Factor V Leiden', 'Tests for a genetic mutation that increases blood clot risk. The most common inherited clotting disorder.', '{81241}', 'genetics', false, '2-4 weeks', 'Heterozygous carriers have 5 to 7 times increased VTE risk. Consider testing after unprovoked blood clot.'),
('a0000001-0000-0000-0000-000000000101', 'Prothrombin G20210A', 'Tests for a genetic mutation in the prothrombin gene that increases blood clot risk. The second most common inherited clotting disorder.', '{81240}', 'genetics', false, '2-4 weeks', 'Heterozygous carriers have 2 to 3 times increased VTE risk. Often tested alongside Factor V Leiden.'),
('a0000001-0000-0000-0000-000000000102', 'BRCA1/BRCA2 Screening', 'Tests for mutations in BRCA genes that significantly increase breast and ovarian cancer risk. Important for family cancer history.', '{81162}', 'genetics', false, '2-4 weeks', 'Genetic counseling recommended before and after testing. Positive results warrant enhanced screening and risk reduction.'),
-- LONGEVITY (105-109)
('a0000001-0000-0000-0000-000000000105', 'Oxidized LDL (ox-LDL)', 'Measures LDL cholesterol that has been damaged by oxidation. Oxidized LDL is more likely to cause plaque buildup in arteries.', '{83698}', 'longevity', false, '3-5 days', 'Emerging cardiovascular risk marker. Elevated ox-LDL is more atherogenic than native LDL.'),
('a0000001-0000-0000-0000-000000000106', 'TMAO (Trimethylamine N-oxide)', 'Measures a metabolite produced by gut bacteria from dietary choline and carnitine. Elevated levels are linked to increased cardiovascular risk.', '{83520}', 'longevity', false, '5-7 days', 'Influenced by diet (red meat, eggs) and gut microbiome composition. Emerging research marker.'),
('a0000001-0000-0000-0000-000000000107', 'Omega-3 Index', 'Measures the percentage of omega-3 fatty acids in your red blood cell membranes. Reflects your long-term omega-3 intake and cardiovascular protection.', '{82542}', 'longevity', false, '5-7 days', 'Target above 8% for cardiovascular benefit. Most Americans are 4-5%. Reflects about 3 months of intake.'),
('a0000001-0000-0000-0000-000000000108', 'GlycanAge', 'Measures biological age through glycan patterns on immune proteins. A novel biomarker of biological aging that differs from chronological age.', '{82542}', 'longevity', false, '2-4 weeks', 'Research and consumer wellness marker. Not yet standard clinical practice. Reflects immune system aging.'),
('a0000001-0000-0000-0000-000000000109', 'IGFBP-3 (IGF Binding Protein 3)', 'Measures the main carrier protein for IGF-1. Used alongside IGF-1 to evaluate growth hormone status and some cancer risks.', '{83145}', 'longevity', false, '2-3 days', 'Interpret with IGF-1 levels. Low IGFBP-3 with low IGF-1 suggests growth hormone deficiency.'),
-- INFECTIOUS/OTHER (110-120)
('a0000001-0000-0000-0000-000000000110', 'EBV Panel (Epstein-Barr Virus)', 'Tests for current or past Epstein-Barr virus infection, which causes mono. Helpful for investigating chronic fatigue and unexplained symptoms.', '{86665}', 'infectious', false, '3-5 days', 'Includes VCA IgM (acute), VCA IgG (past), EBNA (past), and EA (reactivation). Most adults are EBV positive.'),
('a0000001-0000-0000-0000-000000000111', 'CMV IgG/IgM', 'Tests for current or past cytomegalovirus infection. CMV can reactivate in immunocompromised patients and is dangerous in pregnancy.', '{86644}', 'infectious', false, '2-3 days', 'IgM positive means recent or active infection. IgG positive means past infection. Important in pregnancy and transplant.'),
('a0000001-0000-0000-0000-000000000112', 'Monospot', 'A rapid test for infectious mononucleosis caused by Epstein-Barr virus. Results available quickly but can be falsely negative early in illness.', '{86308}', 'infectious', false, '1 day', 'Can be negative in first 1-2 weeks of mono. If negative but mono is suspected, order EBV-specific antibodies.'),
('a0000001-0000-0000-0000-000000000113', 'LDH (Lactate Dehydrogenase)', 'Measures an enzyme released when cells are damaged. Elevated in hemolytic anemia, liver disease, heart attack, and some cancers.', '{83615}', 'kidney_liver', false, '1 day', 'Non-specific marker of tissue damage. Elevated in many conditions including hemolysis, liver disease, and lymphoma.'),
('a0000001-0000-0000-0000-000000000114', 'IgG (Immunoglobulin G)', 'Measures the most abundant antibody in your blood, providing long-term immune protection. Low levels indicate increased susceptibility to infections.', '{82784}', 'immune', false, '2-3 days', 'IgG subclass testing may be needed if total IgG is normal but recurrent infections occur.'),
('a0000001-0000-0000-0000-000000000115', 'IgA (Immunoglobulin A)', 'Measures the antibody that protects your mucous membranes. Low IgA is the most common primary immune deficiency.', '{82784}', 'immune', false, '2-3 days', 'Selective IgA deficiency affects about 1 in 500 people. Can cause false-negative celiac tests.'),
('a0000001-0000-0000-0000-000000000116', 'IgM (Immunoglobulin M)', 'Measures the first antibody your body produces in response to a new infection. Elevated IgM indicates recent or acute infection.', '{82784}', 'immune', false, '2-3 days', 'First antibody produced in immune response. Elevated in acute infections and Waldenstrom''s macroglobulinemia.'),
('a0000001-0000-0000-0000-000000000117', 'Potassium', 'Measures potassium levels in your blood. Essential for heart rhythm, muscle function, and nerve signaling.', '{84132}', 'metabolic', false, '1 day', 'Critical value: below 3.0 or above 6.0 requires immediate attention. Hemolyzed samples cause falsely elevated results.'),
('a0000001-0000-0000-0000-000000000118', 'Gastrin, Fasting', 'Measures the hormone that stimulates stomach acid production. Elevated levels may indicate Zollinger-Ellison syndrome or chronic atrophic gastritis.', '{82938}', 'autoimmune_gi', true, '3-5 days', 'Must be fasting. Stop PPIs 7 days before testing for accurate results. Elevated by PPIs and H. pylori.'),
('a0000001-0000-0000-0000-000000000119', 'Food Sensitivity Panel (IgG)', 'Tests for IgG antibodies to common foods. Intended to identify potential food sensitivities, though clinical evidence for IgG testing is debated.', '{86001}', 'autoimmune_gi', false, '5-7 days', 'IgG food testing is controversial; many experts consider positive results to reflect normal immune exposure.'),
('a0000001-0000-0000-0000-000000000120', 'Omega-6/Omega-3 Ratio', 'Measures the balance between pro-inflammatory omega-6 and anti-inflammatory omega-3 fatty acids. A high ratio is associated with chronic inflammation.', '{82542}', 'longevity', false, '5-7 days', 'Optimal ratio is below 4:1. Standard Western diet often produces ratios of 15-20:1.');
-- ============================================================
-- RELATED TESTS (cross-references within categories)
-- ============================================================
-- Thyroid panel relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000007}' where id = 'a0000001-0000-0000-0000-000000000001';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000005}' where id = 'a0000001-0000-0000-0000-000000000002';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000004}' where id = 'a0000001-0000-0000-0000-000000000003';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000001}' where id = 'a0000001-0000-0000-0000-000000000004';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000011}' where id = 'a0000001-0000-0000-0000-000000000005';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000006}' where id = 'a0000001-0000-0000-0000-000000000006';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000008,a0000001-0000-0000-0000-000000000001}' where id = 'a0000001-0000-0000-0000-000000000007';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000007,a0000001-0000-0000-0000-000000000010}' where id = 'a0000001-0000-0000-0000-000000000008';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000007}' where id = 'a0000001-0000-0000-0000-000000000009';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000008}' where id = 'a0000001-0000-0000-0000-000000000010';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000005}' where id = 'a0000001-0000-0000-0000-000000000011';
-- Hormone relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000013,a0000001-0000-0000-0000-000000000021,a0000001-0000-0000-0000-000000000022}' where id = 'a0000001-0000-0000-0000-000000000012';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000012,a0000001-0000-0000-0000-000000000022}' where id = 'a0000001-0000-0000-0000-000000000013';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000015,a0000001-0000-0000-0000-000000000024}' where id = 'a0000001-0000-0000-0000-000000000014';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000014,a0000001-0000-0000-0000-000000000024}' where id = 'a0000001-0000-0000-0000-000000000015';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000014}' where id = 'a0000001-0000-0000-0000-000000000016';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000018,a0000001-0000-0000-0000-000000000019,a0000001-0000-0000-0000-000000000016}' where id = 'a0000001-0000-0000-0000-000000000017';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000019}' where id = 'a0000001-0000-0000-0000-000000000018';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000018}' where id = 'a0000001-0000-0000-0000-000000000019';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000021,a0000001-0000-0000-0000-000000000022}' where id = 'a0000001-0000-0000-0000-000000000020';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000022,a0000001-0000-0000-0000-000000000012}' where id = 'a0000001-0000-0000-0000-000000000021';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000021,a0000001-0000-0000-0000-000000000012}' where id = 'a0000001-0000-0000-0000-000000000022';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000109}' where id = 'a0000001-0000-0000-0000-000000000023';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000014,a0000001-0000-0000-0000-000000000015}' where id = 'a0000001-0000-0000-0000-000000000024';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000016,a0000001-0000-0000-0000-000000000017}' where id = 'a0000001-0000-0000-0000-000000000025';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000027}' where id = 'a0000001-0000-0000-0000-000000000026';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000026}' where id = 'a0000001-0000-0000-0000-000000000027';
-- Iron/blood relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000029}' where id = 'a0000001-0000-0000-0000-000000000028';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000030,a0000001-0000-0000-0000-000000000031,a0000001-0000-0000-0000-000000000032}' where id = 'a0000001-0000-0000-0000-000000000029';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000029,a0000001-0000-0000-0000-000000000031}' where id = 'a0000001-0000-0000-0000-000000000030';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000029,a0000001-0000-0000-0000-000000000030}' where id = 'a0000001-0000-0000-0000-000000000031';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000029,a0000001-0000-0000-0000-000000000034,a0000001-0000-0000-0000-000000000028}' where id = 'a0000001-0000-0000-0000-000000000032';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000028,a0000001-0000-0000-0000-000000000035}' where id = 'a0000001-0000-0000-0000-000000000033';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000029}' where id = 'a0000001-0000-0000-0000-000000000034';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000033,a0000001-0000-0000-0000-000000000113}' where id = 'a0000001-0000-0000-0000-000000000035';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000055,a0000001-0000-0000-0000-000000000052}' where id = 'a0000001-0000-0000-0000-000000000036';
-- Metabolic relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000038}' where id = 'a0000001-0000-0000-0000-000000000037';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000037}' where id = 'a0000001-0000-0000-0000-000000000038';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000040,a0000001-0000-0000-0000-000000000042}' where id = 'a0000001-0000-0000-0000-000000000039';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000039,a0000001-0000-0000-0000-000000000041}' where id = 'a0000001-0000-0000-0000-000000000040';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000039,a0000001-0000-0000-0000-000000000040}' where id = 'a0000001-0000-0000-0000-000000000041';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000039,a0000001-0000-0000-0000-000000000040}' where id = 'a0000001-0000-0000-0000-000000000042';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000037}' where id = 'a0000001-0000-0000-0000-000000000043';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000045,a0000001-0000-0000-0000-000000000046,a0000001-0000-0000-0000-000000000047}' where id = 'a0000001-0000-0000-0000-000000000044';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000044,a0000001-0000-0000-0000-000000000047}' where id = 'a0000001-0000-0000-0000-000000000045';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000044,a0000001-0000-0000-0000-000000000045}' where id = 'a0000001-0000-0000-0000-000000000046';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000044,a0000001-0000-0000-0000-000000000045}' where id = 'a0000001-0000-0000-0000-000000000047';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000049,a0000001-0000-0000-0000-000000000050}' where id = 'a0000001-0000-0000-0000-000000000048';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000048,a0000001-0000-0000-0000-000000000050}' where id = 'a0000001-0000-0000-0000-000000000049';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000048,a0000001-0000-0000-0000-000000000049}' where id = 'a0000001-0000-0000-0000-000000000050';
-- Vitamin/mineral relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000056}' where id = 'a0000001-0000-0000-0000-000000000051';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000053,a0000001-0000-0000-0000-000000000054}' where id = 'a0000001-0000-0000-0000-000000000052';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000054}' where id = 'a0000001-0000-0000-0000-000000000053';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000055}' where id = 'a0000001-0000-0000-0000-000000000054';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000036,a0000001-0000-0000-0000-000000000054}' where id = 'a0000001-0000-0000-0000-000000000055';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000051}' where id = 'a0000001-0000-0000-0000-000000000056';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000058}' where id = 'a0000001-0000-0000-0000-000000000057';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000057}' where id = 'a0000001-0000-0000-0000-000000000058';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000060,a0000001-0000-0000-0000-000000000007}' where id = 'a0000001-0000-0000-0000-000000000059';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000059,a0000001-0000-0000-0000-000000000001}' where id = 'a0000001-0000-0000-0000-000000000060';
-- Kidney/liver relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000062,a0000001-0000-0000-0000-000000000063}' where id = 'a0000001-0000-0000-0000-000000000061';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000061,a0000001-0000-0000-0000-000000000063}' where id = 'a0000001-0000-0000-0000-000000000062';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000062,a0000001-0000-0000-0000-000000000064}' where id = 'a0000001-0000-0000-0000-000000000063';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000062,a0000001-0000-0000-0000-000000000063}' where id = 'a0000001-0000-0000-0000-000000000064';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000066,a0000001-0000-0000-0000-000000000067}' where id = 'a0000001-0000-0000-0000-000000000065';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000065,a0000001-0000-0000-0000-000000000067}' where id = 'a0000001-0000-0000-0000-000000000066';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000065,a0000001-0000-0000-0000-000000000068}' where id = 'a0000001-0000-0000-0000-000000000067';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000067,a0000001-0000-0000-0000-000000000069}' where id = 'a0000001-0000-0000-0000-000000000068';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000070,a0000001-0000-0000-0000-000000000068}' where id = 'a0000001-0000-0000-0000-000000000069';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000069}' where id = 'a0000001-0000-0000-0000-000000000070';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000072}' where id = 'a0000001-0000-0000-0000-000000000071';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000071}' where id = 'a0000001-0000-0000-0000-000000000072';
-- Immune relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000074,a0000001-0000-0000-0000-000000000077}' where id = 'a0000001-0000-0000-0000-000000000073';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000073,a0000001-0000-0000-0000-000000000077,a0000001-0000-0000-0000-000000000078}' where id = 'a0000001-0000-0000-0000-000000000074';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000076}' where id = 'a0000001-0000-0000-0000-000000000075';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000075}' where id = 'a0000001-0000-0000-0000-000000000076';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000078}' where id = 'a0000001-0000-0000-0000-000000000077';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000077}' where id = 'a0000001-0000-0000-0000-000000000078';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000080,a0000001-0000-0000-0000-000000000048}' where id = 'a0000001-0000-0000-0000-000000000079';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000079,a0000001-0000-0000-0000-000000000048}' where id = 'a0000001-0000-0000-0000-000000000080';
-- Autoimmune/GI relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000082}' where id = 'a0000001-0000-0000-0000-000000000081';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000081}' where id = 'a0000001-0000-0000-0000-000000000082';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000118}' where id = 'a0000001-0000-0000-0000-000000000083';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000085}' where id = 'a0000001-0000-0000-0000-000000000084';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000084}' where id = 'a0000001-0000-0000-0000-000000000085';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000081,a0000001-0000-0000-0000-000000000087}' where id = 'a0000001-0000-0000-0000-000000000086';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000086,a0000001-0000-0000-0000-000000000082}' where id = 'a0000001-0000-0000-0000-000000000087';
-- Cardiac relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000095}' where id = 'a0000001-0000-0000-0000-000000000094';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000094}' where id = 'a0000001-0000-0000-0000-000000000095';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000094,a0000001-0000-0000-0000-000000000095}' where id = 'a0000001-0000-0000-0000-000000000096';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000100,a0000001-0000-0000-0000-000000000101}' where id = 'a0000001-0000-0000-0000-000000000097';
-- Genetics relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000029,a0000001-0000-0000-0000-000000000032}' where id = 'a0000001-0000-0000-0000-000000000098';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000054,a0000001-0000-0000-0000-000000000055}' where id = 'a0000001-0000-0000-0000-000000000099';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000101,a0000001-0000-0000-0000-000000000097}' where id = 'a0000001-0000-0000-0000-000000000100';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000100,a0000001-0000-0000-0000-000000000097}' where id = 'a0000001-0000-0000-0000-000000000101';
-- Longevity relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000045,a0000001-0000-0000-0000-000000000047}' where id = 'a0000001-0000-0000-0000-000000000105';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000107}' where id = 'a0000001-0000-0000-0000-000000000106';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000120}' where id = 'a0000001-0000-0000-0000-000000000107';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000023}' where id = 'a0000001-0000-0000-0000-000000000109';
-- Infectious/other relationships
update tests set related_tests = '{a0000001-0000-0000-0000-000000000112}' where id = 'a0000001-0000-0000-0000-000000000110';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000110}' where id = 'a0000001-0000-0000-0000-000000000111';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000110}' where id = 'a0000001-0000-0000-0000-000000000112';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000035,a0000001-0000-0000-0000-000000000066}' where id = 'a0000001-0000-0000-0000-000000000113';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000115,a0000001-0000-0000-0000-000000000116}' where id = 'a0000001-0000-0000-0000-000000000114';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000114,a0000001-0000-0000-0000-000000000116}' where id = 'a0000001-0000-0000-0000-000000000115';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000114,a0000001-0000-0000-0000-000000000115}' where id = 'a0000001-0000-0000-0000-000000000116';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000038}' where id = 'a0000001-0000-0000-0000-000000000117';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000083}' where id = 'a0000001-0000-0000-0000-000000000118';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000081}' where id = 'a0000001-0000-0000-0000-000000000119';
update tests set related_tests = '{a0000001-0000-0000-0000-000000000107}' where id = 'a0000001-0000-0000-0000-000000000120';
-- ============================================================
-- ICD-10 CODES (60 codes)
-- ============================================================
insert into icd10_codes (id, code, description) values
('b0000001-0000-0000-0000-000000000001', 'E03.9', 'Hypothyroidism, unspecified'),
('b0000001-0000-0000-0000-000000000002', 'E05.90', 'Thyrotoxicosis, unspecified'),
('b0000001-0000-0000-0000-000000000003', 'R53.83', 'Other fatigue'),
('b0000001-0000-0000-0000-000000000004', 'E06.3', 'Autoimmune thyroiditis'),
('b0000001-0000-0000-0000-000000000005', 'E05.00', 'Thyrotoxicosis with diffuse goiter (Graves disease)'),
('b0000001-0000-0000-0000-000000000006', 'C73', 'Malignant neoplasm of thyroid gland'),
('b0000001-0000-0000-0000-000000000007', 'E29.1', 'Testicular hypofunction'),
('b0000001-0000-0000-0000-000000000008', 'E28.39', 'Other primary ovarian failure'),
('b0000001-0000-0000-0000-000000000009', 'N91.2', 'Amenorrhea, unspecified'),
('b0000001-0000-0000-0000-000000000010', 'N97.0', 'Female infertility associated with anovulation'),
('b0000001-0000-0000-0000-000000000011', 'E25.9', 'Adrenogenital disorder, unspecified'),
('b0000001-0000-0000-0000-000000000012', 'E27.40', 'Unspecified adrenocortical insufficiency'),
('b0000001-0000-0000-0000-000000000013', 'E24.9', 'Cushing syndrome, unspecified'),
('b0000001-0000-0000-0000-000000000014', 'E22.1', 'Hyperprolactinemia'),
('b0000001-0000-0000-0000-000000000015', 'E23.0', 'Hypopituitarism'),
('b0000001-0000-0000-0000-000000000016', 'E34.3', 'Short stature due to endocrine disorder'),
('b0000001-0000-0000-0000-000000000017', 'E26.0', 'Primary hyperaldosteronism'),
('b0000001-0000-0000-0000-000000000018', 'D50.9', 'Iron deficiency anemia, unspecified'),
('b0000001-0000-0000-0000-000000000019', 'E61.1', 'Iron deficiency'),
('b0000001-0000-0000-0000-000000000020', 'D64.9', 'Anemia, unspecified'),
('b0000001-0000-0000-0000-000000000021', 'D59.9', 'Acquired hemolytic anemia, unspecified'),
('b0000001-0000-0000-0000-000000000022', 'E83.10', 'Hemochromatosis, unspecified'),
('b0000001-0000-0000-0000-000000000023', 'E11.65', 'Type 2 diabetes mellitus with hyperglycemia'),
('b0000001-0000-0000-0000-000000000024', 'R73.09', 'Other abnormal glucose'),
('b0000001-0000-0000-0000-000000000025', 'E78.5', 'Dyslipidemia, unspecified'),
('b0000001-0000-0000-0000-000000000026', 'E78.0', 'Pure hypercholesterolemia, unspecified'),
('b0000001-0000-0000-0000-000000000027', 'R79.89', 'Other specified abnormal findings of blood chemistry'),
('b0000001-0000-0000-0000-000000000028', 'E55.9', 'Vitamin D deficiency, unspecified'),
('b0000001-0000-0000-0000-000000000029', 'E53.8', 'Deficiency of other specified B group vitamins'),
('b0000001-0000-0000-0000-000000000030', 'D51.9', 'Vitamin B12 deficiency anemia, unspecified'),
('b0000001-0000-0000-0000-000000000031', 'E61.2', 'Magnesium deficiency'),
('b0000001-0000-0000-0000-000000000032', 'E60', 'Dietary zinc deficiency'),
('b0000001-0000-0000-0000-000000000033', 'E61.0', 'Copper deficiency'),
('b0000001-0000-0000-0000-000000000034', 'E59', 'Dietary selenium deficiency'),
('b0000001-0000-0000-0000-000000000035', 'E01.8', 'Other iodine-deficiency related thyroid disorders'),
('b0000001-0000-0000-0000-000000000036', 'N18.9', 'Chronic kidney disease, unspecified'),
('b0000001-0000-0000-0000-000000000037', 'K76.0', 'Fatty liver, not elsewhere classified'),
('b0000001-0000-0000-0000-000000000038', 'K75.9', 'Inflammatory liver disease, unspecified'),
('b0000001-0000-0000-0000-000000000039', 'R17', 'Unspecified jaundice'),
('b0000001-0000-0000-0000-000000000040', 'M32.9', 'Systemic lupus erythematosus, unspecified'),
('b0000001-0000-0000-0000-000000000041', 'M06.9', 'Rheumatoid arthritis, unspecified'),
('b0000001-0000-0000-0000-000000000042', 'M35.9', 'Systemic involvement of connective tissue, unspecified'),
('b0000001-0000-0000-0000-000000000043', 'K90.0', 'Celiac disease'),
('b0000001-0000-0000-0000-000000000044', 'K58.9', 'Irritable bowel syndrome without diarrhea'),
('b0000001-0000-0000-0000-000000000045', 'K50.90', 'Crohn disease, unspecified, without complications'),
('b0000001-0000-0000-0000-000000000046', 'K25.9', 'Gastric ulcer, unspecified'),
('b0000001-0000-0000-0000-000000000047', 'Z12.5', 'Encounter for screening for malignant neoplasm of prostate'),
('b0000001-0000-0000-0000-000000000048', 'Z80.3', 'Family history of malignant neoplasm of breast'),
('b0000001-0000-0000-0000-000000000049', 'C25.9', 'Malignant neoplasm of pancreas, unspecified'),
('b0000001-0000-0000-0000-000000000050', 'I50.9', 'Heart failure, unspecified'),
('b0000001-0000-0000-0000-000000000051', 'I21.9', 'Acute myocardial infarction, unspecified'),
('b0000001-0000-0000-0000-000000000052', 'I26.99', 'Other pulmonary embolism without acute cor pulmonale'),
('b0000001-0000-0000-0000-000000000053', 'D68.51', 'Activated protein C resistance (Factor V Leiden)'),
('b0000001-0000-0000-0000-000000000054', 'D68.52', 'Prothrombin gene mutation'),
('b0000001-0000-0000-0000-000000000055', 'Z00.00', 'Encounter for general adult medical examination without abnormal findings'),
('b0000001-0000-0000-0000-000000000056', 'B27.90', 'Infectious mononucleosis, unspecified, without complication'),
('b0000001-0000-0000-0000-000000000057', 'D80.2', 'Selective deficiency of immunoglobulin A'),
('b0000001-0000-0000-0000-000000000058', 'E16.1', 'Other hypoglycemia'),
('b0000001-0000-0000-0000-000000000059', 'E79.0', 'Hyperuricemia without signs of inflammatory arthritis and tophaceous disease'),
('b0000001-0000-0000-0000-000000000060', 'I10', 'Essential (primary) hypertension');
-- ============================================================
-- TEST <-> ICD-10 JUNCTION TABLE
-- ============================================================
insert into test_icd10_codes (test_id, icd10_code_id) values
-- TSH -> hypothyroidism, thyrotoxicosis, fatigue
('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001'),
('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002'),
('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000003'),
-- Free T4 -> hypothyroidism, thyrotoxicosis
('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001'),
('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002'),
-- Free T3 -> hypothyroidism, thyrotoxicosis
('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001'),
('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002'),
-- Reverse T3 -> hypothyroidism, fatigue
('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001'),
('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000003'),
-- Total T4 -> hypothyroidism, thyrotoxicosis
('a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001'),
('a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000002'),
-- Total T3 -> thyrotoxicosis
('a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000002'),
-- TPO Antibodies -> autoimmune thyroiditis, hypothyroidism
('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000004'),
('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000001'),
-- Thyroglobulin Antibodies -> autoimmune thyroiditis, thyroid cancer
('a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000004'),
('a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000006'),
-- TSI -> Graves disease
('a0000001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000005'),
-- Thyroglobulin -> thyroid cancer
('a0000001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000006'),
-- T3 Uptake -> hypothyroidism, thyrotoxicosis
('a0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000001'),
('a0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000002'),
-- Estradiol -> ovarian failure, amenorrhea, infertility
('a0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000008'),
('a0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000009'),
('a0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000010'),
-- Progesterone -> infertility, amenorrhea
('a0000001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000010'),
('a0000001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000009'),
-- Testosterone Total -> testicular hypofunction, fatigue
('a0000001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000007'),
('a0000001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000003'),
-- Testosterone Free -> testicular hypofunction
('a0000001-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000007'),
-- DHEA-S -> adrenogenital disorder, fatigue
('a0000001-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000011'),
('a0000001-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000003'),
-- Cortisol AM -> adrenocortical insufficiency, fatigue
('a0000001-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000012'),
('a0000001-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000003'),
-- Cortisol PM -> Cushing syndrome
('a0000001-0000-0000-0000-000000000018', 'b0000001-0000-0000-0000-000000000013'),
-- 24hr Urine Cortisol -> Cushing syndrome, adrenal insufficiency
('a0000001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000013'),
('a0000001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000012'),
-- Prolactin -> hyperprolactinemia, amenorrhea, infertility
('a0000001-0000-0000-0000-000000000020', 'b0000001-0000-0000-0000-000000000014'),
('a0000001-0000-0000-0000-000000000020', 'b0000001-0000-0000-0000-000000000009'),
('a0000001-0000-0000-0000-000000000020', 'b0000001-0000-0000-0000-000000000010'),
-- FSH -> ovarian failure, infertility, hypopituitarism
('a0000001-0000-0000-0000-000000000021', 'b0000001-0000-0000-0000-000000000008'),
('a0000001-0000-0000-0000-000000000021', 'b0000001-0000-0000-0000-000000000010'),
('a0000001-0000-0000-0000-000000000021', 'b0000001-0000-0000-0000-000000000015'),
-- LH -> ovarian failure, infertility
('a0000001-0000-0000-0000-000000000022', 'b0000001-0000-0000-0000-000000000008'),
('a0000001-0000-0000-0000-000000000022', 'b0000001-0000-0000-0000-000000000010'),
-- IGF-1 -> short stature, hypopituitarism
('a0000001-0000-0000-0000-000000000023', 'b0000001-0000-0000-0000-000000000016'),
('a0000001-0000-0000-0000-000000000023', 'b0000001-0000-0000-0000-000000000015'),
-- SHBG -> testicular hypofunction, adrenogenital
('a0000001-0000-0000-0000-000000000024', 'b0000001-0000-0000-0000-000000000007'),
('a0000001-0000-0000-0000-000000000024', 'b0000001-0000-0000-0000-000000000011'),
-- Pregnenolone -> adrenal insufficiency
('a0000001-0000-0000-0000-000000000025', 'b0000001-0000-0000-0000-000000000012'),
-- Aldosterone -> primary hyperaldosteronism, hypertension
('a0000001-0000-0000-0000-000000000026', 'b0000001-0000-0000-0000-000000000017'),
('a0000001-0000-0000-0000-000000000026', 'b0000001-0000-0000-0000-000000000060'),
-- Renin -> primary hyperaldosteronism, hypertension
('a0000001-0000-0000-0000-000000000027', 'b0000001-0000-0000-0000-000000000017'),
('a0000001-0000-0000-0000-000000000027', 'b0000001-0000-0000-0000-000000000060'),
-- CBC -> anemia, iron deficiency anemia, general exam
('a0000001-0000-0000-0000-000000000028', 'b0000001-0000-0000-0000-000000000020'),
('a0000001-0000-0000-0000-000000000028', 'b0000001-0000-0000-0000-000000000018'),
('a0000001-0000-0000-0000-000000000028', 'b0000001-0000-0000-0000-000000000055'),
-- Iron, Serum -> iron deficiency, iron deficiency anemia
('a0000001-0000-0000-0000-000000000029', 'b0000001-0000-0000-0000-000000000019'),
('a0000001-0000-0000-0000-000000000029', 'b0000001-0000-0000-0000-000000000018'),
-- TIBC -> iron deficiency, hemochromatosis
('a0000001-0000-0000-0000-000000000030', 'b0000001-0000-0000-0000-000000000019'),
('a0000001-0000-0000-0000-000000000030', 'b0000001-0000-0000-0000-000000000022'),
-- Iron Sat % -> iron deficiency, hemochromatosis
('a0000001-0000-0000-0000-000000000031', 'b0000001-0000-0000-0000-000000000019'),
('a0000001-0000-0000-0000-000000000031', 'b0000001-0000-0000-0000-000000000022'),
-- Ferritin -> iron deficiency, iron deficiency anemia, fatigue
('a0000001-0000-0000-0000-000000000032', 'b0000001-0000-0000-0000-000000000019'),
('a0000001-0000-0000-0000-000000000032', 'b0000001-0000-0000-0000-000000000018'),
('a0000001-0000-0000-0000-000000000032', 'b0000001-0000-0000-0000-000000000003'),
-- Reticulocyte -> anemia, hemolytic anemia
('a0000001-0000-0000-0000-000000000033', 'b0000001-0000-0000-0000-000000000020'),
('a0000001-0000-0000-0000-000000000033', 'b0000001-0000-0000-0000-000000000021'),
-- sTfR -> iron deficiency
('a0000001-0000-0000-0000-000000000034', 'b0000001-0000-0000-0000-000000000019'),
-- Haptoglobin -> hemolytic anemia
('a0000001-0000-0000-0000-000000000035', 'b0000001-0000-0000-0000-000000000021'),
-- RBC Folate -> anemia, B vitamin deficiency
('a0000001-0000-0000-0000-000000000036', 'b0000001-0000-0000-0000-000000000020'),
('a0000001-0000-0000-0000-000000000036', 'b0000001-0000-0000-0000-000000000029'),
-- CMP -> general exam, abnormal glucose, CKD
('a0000001-0000-0000-0000-000000000037', 'b0000001-0000-0000-0000-000000000055'),
('a0000001-0000-0000-0000-000000000037', 'b0000001-0000-0000-0000-000000000024'),
('a0000001-0000-0000-0000-000000000037', 'b0000001-0000-0000-0000-000000000036'),
-- BMP -> general exam, abnormal glucose
('a0000001-0000-0000-0000-000000000038', 'b0000001-0000-0000-0000-000000000055'),
('a0000001-0000-0000-0000-000000000038', 'b0000001-0000-0000-0000-000000000024'),
-- Fasting Glucose -> diabetes, abnormal glucose
('a0000001-0000-0000-0000-000000000039', 'b0000001-0000-0000-0000-000000000023'),
('a0000001-0000-0000-0000-000000000039', 'b0000001-0000-0000-0000-000000000024'),
-- Fasting Insulin -> diabetes, abnormal glucose, hypoglycemia
('a0000001-0000-0000-0000-000000000040', 'b0000001-0000-0000-0000-000000000023'),
('a0000001-0000-0000-0000-000000000040', 'b0000001-0000-0000-0000-000000000024'),
('a0000001-0000-0000-0000-000000000040', 'b0000001-0000-0000-0000-000000000058'),
-- HOMA-IR -> diabetes, abnormal glucose
('a0000001-0000-0000-0000-000000000041', 'b0000001-0000-0000-0000-000000000023'),
('a0000001-0000-0000-0000-000000000041', 'b0000001-0000-0000-0000-000000000024'),
-- HbA1c -> diabetes, abnormal glucose
('a0000001-0000-0000-0000-000000000042', 'b0000001-0000-0000-0000-000000000023'),
('a0000001-0000-0000-0000-000000000042', 'b0000001-0000-0000-0000-000000000024'),
-- Uric Acid -> hyperuricemia
('a0000001-0000-0000-0000-000000000043', 'b0000001-0000-0000-0000-000000000059'),
-- Lipid Panel -> dyslipidemia, hypercholesterolemia
('a0000001-0000-0000-0000-000000000044', 'b0000001-0000-0000-0000-000000000025'),
('a0000001-0000-0000-0000-000000000044', 'b0000001-0000-0000-0000-000000000026'),
-- ApoB -> dyslipidemia, hypercholesterolemia
('a0000001-0000-0000-0000-000000000045', 'b0000001-0000-0000-0000-000000000025'),
('a0000001-0000-0000-0000-000000000045', 'b0000001-0000-0000-0000-000000000026'),
-- Lp(a) -> dyslipidemia
('a0000001-0000-0000-0000-000000000046', 'b0000001-0000-0000-0000-000000000025'),
-- LDL-P -> dyslipidemia, hypercholesterolemia
('a0000001-0000-0000-0000-000000000047', 'b0000001-0000-0000-0000-000000000025'),
('a0000001-0000-0000-0000-000000000047', 'b0000001-0000-0000-0000-000000000026'),
-- hs-CRP -> abnormal blood chemistry, general exam
('a0000001-0000-0000-0000-000000000048', 'b0000001-0000-0000-0000-000000000027'),
('a0000001-0000-0000-0000-000000000048', 'b0000001-0000-0000-0000-000000000055'),
-- ESR -> abnormal blood chemistry, RA, lupus
('a0000001-0000-0000-0000-000000000049', 'b0000001-0000-0000-0000-000000000027'),
('a0000001-0000-0000-0000-000000000049', 'b0000001-0000-0000-0000-000000000041'),
('a0000001-0000-0000-0000-000000000049', 'b0000001-0000-0000-0000-000000000040'),
-- CRP standard -> abnormal blood chemistry
('a0000001-0000-0000-0000-000000000050', 'b0000001-0000-0000-0000-000000000027'),
-- Vitamin D -> vitamin D deficiency, fatigue
('a0000001-0000-0000-0000-000000000051', 'b0000001-0000-0000-0000-000000000028'),
('a0000001-0000-0000-0000-000000000051', 'b0000001-0000-0000-0000-000000000003'),
-- B12 -> B vitamin deficiency, B12 deficiency anemia, fatigue
('a0000001-0000-0000-0000-000000000052', 'b0000001-0000-0000-0000-000000000029'),
('a0000001-0000-0000-0000-000000000052', 'b0000001-0000-0000-0000-000000000030'),
('a0000001-0000-0000-0000-000000000052', 'b0000001-0000-0000-0000-000000000003'),
-- MMA -> B12 deficiency anemia, B vitamin deficiency
('a0000001-0000-0000-0000-000000000053', 'b0000001-0000-0000-0000-000000000030'),
('a0000001-0000-0000-0000-000000000053', 'b0000001-0000-0000-0000-000000000029'),
-- Homocysteine -> B vitamin deficiency, dyslipidemia
('a0000001-0000-0000-0000-000000000054', 'b0000001-0000-0000-0000-000000000029'),
('a0000001-0000-0000-0000-000000000054', 'b0000001-0000-0000-0000-000000000025'),
-- Folate -> B vitamin deficiency, anemia
('a0000001-0000-0000-0000-000000000055', 'b0000001-0000-0000-0000-000000000029'),
('a0000001-0000-0000-0000-000000000055', 'b0000001-0000-0000-0000-000000000020'),
-- RBC Magnesium -> magnesium deficiency
('a0000001-0000-0000-0000-000000000056', 'b0000001-0000-0000-0000-000000000031'),
-- Zinc -> zinc deficiency
('a0000001-0000-0000-0000-000000000057', 'b0000001-0000-0000-0000-000000000032'),
-- Copper -> copper deficiency
('a0000001-0000-0000-0000-000000000058', 'b0000001-0000-0000-0000-000000000033'),
-- Selenium -> selenium deficiency, autoimmune thyroiditis
('a0000001-0000-0000-0000-000000000059', 'b0000001-0000-0000-0000-000000000034'),
('a0000001-0000-0000-0000-000000000059', 'b0000001-0000-0000-0000-000000000004'),
-- Iodine -> iodine deficiency thyroid disorders
('a0000001-0000-0000-0000-000000000060', 'b0000001-0000-0000-0000-000000000035'),
-- BUN -> CKD
('a0000001-0000-0000-0000-000000000061', 'b0000001-0000-0000-0000-000000000036'),
-- Creatinine -> CKD
('a0000001-0000-0000-0000-000000000062', 'b0000001-0000-0000-0000-000000000036'),
-- eGFR -> CKD
('a0000001-0000-0000-0000-000000000063', 'b0000001-0000-0000-0000-000000000036'),
-- Cystatin C -> CKD
('a0000001-0000-0000-0000-000000000064', 'b0000001-0000-0000-0000-000000000036'),
-- ALT -> fatty liver, inflammatory liver disease
('a0000001-0000-0000-0000-000000000065', 'b0000001-0000-0000-0000-000000000037'),
('a0000001-0000-0000-0000-000000000065', 'b0000001-0000-0000-0000-000000000038'),
-- AST -> fatty liver, inflammatory liver disease
('a0000001-0000-0000-0000-000000000066', 'b0000001-0000-0000-0000-000000000037'),
('a0000001-0000-0000-0000-000000000066', 'b0000001-0000-0000-0000-000000000038'),
-- GGT -> fatty liver, inflammatory liver disease
('a0000001-0000-0000-0000-000000000067', 'b0000001-0000-0000-0000-000000000037'),
('a0000001-0000-0000-0000-000000000067', 'b0000001-0000-0000-0000-000000000038'),
-- ALP -> inflammatory liver disease, jaundice
('a0000001-0000-0000-0000-000000000068', 'b0000001-0000-0000-0000-000000000038'),
('a0000001-0000-0000-0000-000000000068', 'b0000001-0000-0000-0000-000000000039'),
-- Total Bilirubin -> jaundice
('a0000001-0000-0000-0000-000000000069', 'b0000001-0000-0000-0000-000000000039'),
-- Direct Bilirubin -> jaundice
('a0000001-0000-0000-0000-000000000070', 'b0000001-0000-0000-0000-000000000039'),
-- Albumin -> CKD, fatty liver
('a0000001-0000-0000-0000-000000000071', 'b0000001-0000-0000-0000-000000000036'),
('a0000001-0000-0000-0000-000000000071', 'b0000001-0000-0000-0000-000000000037'),
-- Total Protein -> abnormal blood chemistry
('a0000001-0000-0000-0000-000000000072', 'b0000001-0000-0000-0000-000000000027'),
-- ANA -> lupus, connective tissue disease
('a0000001-0000-0000-0000-000000000073', 'b0000001-0000-0000-0000-000000000040'),
('a0000001-0000-0000-0000-000000000073', 'b0000001-0000-0000-0000-000000000042'),
-- Anti-dsDNA -> lupus
('a0000001-0000-0000-0000-000000000074', 'b0000001-0000-0000-0000-000000000040'),
-- RF -> RA
('a0000001-0000-0000-0000-000000000075', 'b0000001-0000-0000-0000-000000000041'),
-- Anti-CCP -> RA
('a0000001-0000-0000-0000-000000000076', 'b0000001-0000-0000-0000-000000000041'),
-- C3 -> lupus
('a0000001-0000-0000-0000-000000000077', 'b0000001-0000-0000-0000-000000000040'),
-- C4 -> lupus
('a0000001-0000-0000-0000-000000000078', 'b0000001-0000-0000-0000-000000000040'),
-- IL-6 -> RA, connective tissue disease
('a0000001-0000-0000-0000-000000000079', 'b0000001-0000-0000-0000-000000000041'),
('a0000001-0000-0000-0000-000000000079', 'b0000001-0000-0000-0000-000000000042'),
-- TNF-alpha -> RA, connective tissue disease
('a0000001-0000-0000-0000-000000000080', 'b0000001-0000-0000-0000-000000000041'),
('a0000001-0000-0000-0000-000000000080', 'b0000001-0000-0000-0000-000000000042'),
-- Celiac Panel -> celiac disease
('a0000001-0000-0000-0000-000000000081', 'b0000001-0000-0000-0000-000000000043'),
-- Total IgA -> IgA deficiency, celiac disease
('a0000001-0000-0000-0000-000000000082', 'b0000001-0000-0000-0000-000000000057'),
('a0000001-0000-0000-0000-000000000082', 'b0000001-0000-0000-0000-000000000043'),
-- H. pylori -> gastric ulcer
('a0000001-0000-0000-0000-000000000083', 'b0000001-0000-0000-0000-000000000046'),
-- Calprotectin -> Crohn disease, IBS
('a0000001-0000-0000-0000-000000000084', 'b0000001-0000-0000-0000-000000000045'),
('a0000001-0000-0000-0000-000000000084', 'b0000001-0000-0000-0000-000000000044'),
-- Lactoferrin -> Crohn disease
('a0000001-0000-0000-0000-000000000085', 'b0000001-0000-0000-0000-000000000045'),
-- Zonulin -> celiac disease
('a0000001-0000-0000-0000-000000000086', 'b0000001-0000-0000-0000-000000000043'),
-- Secretory IgA -> IgA deficiency
('a0000001-0000-0000-0000-000000000087', 'b0000001-0000-0000-0000-000000000057'),
-- PSA -> prostate screening
('a0000001-0000-0000-0000-000000000088', 'b0000001-0000-0000-0000-000000000047'),
-- CA-125 -> general exam (ovarian monitoring)
('a0000001-0000-0000-0000-000000000089', 'b0000001-0000-0000-0000-000000000055'),
-- CA 19-9 -> pancreatic cancer
('a0000001-0000-0000-0000-000000000090', 'b0000001-0000-0000-0000-000000000049'),
-- CEA -> abnormal blood chemistry
('a0000001-0000-0000-0000-000000000091', 'b0000001-0000-0000-0000-000000000027'),
-- AFP -> fatty liver (hepatocellular monitoring)
('a0000001-0000-0000-0000-000000000092', 'b0000001-0000-0000-0000-000000000037'),
-- CA 15-3 -> family history breast cancer
('a0000001-0000-0000-0000-000000000093', 'b0000001-0000-0000-0000-000000000048'),
-- BNP -> heart failure
('a0000001-0000-0000-0000-000000000094', 'b0000001-0000-0000-0000-000000000050'),
-- NT-proBNP -> heart failure
('a0000001-0000-0000-0000-000000000095', 'b0000001-0000-0000-0000-000000000050'),
-- Troponin I -> MI
('a0000001-0000-0000-0000-000000000096', 'b0000001-0000-0000-0000-000000000051'),
-- D-Dimer -> PE
('a0000001-0000-0000-0000-000000000097', 'b0000001-0000-0000-0000-000000000052'),
-- HFE Gene -> hemochromatosis
('a0000001-0000-0000-0000-000000000098', 'b0000001-0000-0000-0000-000000000022'),
-- MTHFR -> B vitamin deficiency
('a0000001-0000-0000-0000-000000000099', 'b0000001-0000-0000-0000-000000000029'),
-- Factor V Leiden -> Factor V Leiden
('a0000001-0000-0000-0000-000000000100', 'b0000001-0000-0000-0000-000000000053'),
-- Prothrombin G20210A -> Prothrombin gene mutation
('a0000001-0000-0000-0000-000000000101', 'b0000001-0000-0000-0000-000000000054'),
-- BRCA -> family history breast cancer
('a0000001-0000-0000-0000-000000000102', 'b0000001-0000-0000-0000-000000000048'),
-- Oxidized LDL -> dyslipidemia
('a0000001-0000-0000-0000-000000000105', 'b0000001-0000-0000-0000-000000000025'),
-- TMAO -> dyslipidemia
('a0000001-0000-0000-0000-000000000106', 'b0000001-0000-0000-0000-000000000025'),
-- Omega-3 Index -> dyslipidemia
('a0000001-0000-0000-0000-000000000107', 'b0000001-0000-0000-0000-000000000025'),
-- GlycanAge -> general exam
('a0000001-0000-0000-0000-000000000108', 'b0000001-0000-0000-0000-000000000055'),
-- IGFBP-3 -> short stature
('a0000001-0000-0000-0000-000000000109', 'b0000001-0000-0000-0000-000000000016'),
-- EBV Panel -> mononucleosis, fatigue
('a0000001-0000-0000-0000-000000000110', 'b0000001-0000-0000-0000-000000000056'),
('a0000001-0000-0000-0000-000000000110', 'b0000001-0000-0000-0000-000000000003'),
-- CMV -> general exam
('a0000001-0000-0000-0000-000000000111', 'b0000001-0000-0000-0000-000000000055'),
-- Monospot -> mononucleosis
('a0000001-0000-0000-0000-000000000112', 'b0000001-0000-0000-0000-000000000056'),
-- LDH -> hemolytic anemia, inflammatory liver disease
('a0000001-0000-0000-0000-000000000113', 'b0000001-0000-0000-0000-000000000021'),
('a0000001-0000-0000-0000-000000000113', 'b0000001-0000-0000-0000-000000000038'),
-- IgG -> general exam
('a0000001-0000-0000-0000-000000000114', 'b0000001-0000-0000-0000-000000000055'),
-- IgA -> IgA deficiency
('a0000001-0000-0000-0000-000000000115', 'b0000001-0000-0000-0000-000000000057'),
-- IgM -> general exam
('a0000001-0000-0000-0000-000000000116', 'b0000001-0000-0000-0000-000000000055'),
-- Potassium -> abnormal blood chemistry
('a0000001-0000-0000-0000-000000000117', 'b0000001-0000-0000-0000-000000000027'),
-- Gastrin -> gastric ulcer
('a0000001-0000-0000-0000-000000000118', 'b0000001-0000-0000-0000-000000000046'),
-- Food Sensitivity -> IBS
('a0000001-0000-0000-0000-000000000119', 'b0000001-0000-0000-0000-000000000044'),
-- Omega-6/3 Ratio -> dyslipidemia
('a0000001-0000-0000-0000-000000000120', 'b0000001-0000-0000-0000-000000000025');
-- ============================================================
-- SYMPTOMS (19 total)
-- ============================================================
insert into symptoms (id, name, keywords, related_test_ids) values
('c0000001-0000-0000-0000-000000000001', 'Fatigue / Low Energy',
 '{fatigue,tired,exhausted,low energy,lethargy,weakness}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000028,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000042,a0000001-0000-0000-0000-000000000051,a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000056,a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000040,a0000001-0000-0000-0000-000000000037,a0000001-0000-0000-0000-000000000110,a0000001-0000-0000-0000-000000000014}'),

('c0000001-0000-0000-0000-000000000002', 'Brain Fog / Poor Memory',
 '{brain fog,memory,concentration,confusion,cognitive}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000042,a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000051,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000054,a0000001-0000-0000-0000-000000000056,a0000001-0000-0000-0000-000000000040}'),

('c0000001-0000-0000-0000-000000000003', 'Hair Loss / Thinning Hair',
 '{hair loss,hair thinning,alopecia,shedding,balding}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000029,a0000001-0000-0000-0000-000000000014,a0000001-0000-0000-0000-000000000016,a0000001-0000-0000-0000-000000000051,a0000001-0000-0000-0000-000000000057,a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000007}'),

('c0000001-0000-0000-0000-000000000004', 'Unexplained Weight Gain',
 '{weight gain,can''t lose weight,obesity,metabolism}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000042,a0000001-0000-0000-0000-000000000040,a0000001-0000-0000-0000-000000000041,a0000001-0000-0000-0000-000000000044,a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000014,a0000001-0000-0000-0000-000000000012,a0000001-0000-0000-0000-000000000048}'),

('c0000001-0000-0000-0000-000000000005', 'Cold Intolerance / Always Cold',
 '{cold,freezing,cold hands,cold feet,temperature}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000004,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000028,a0000001-0000-0000-0000-000000000029,a0000001-0000-0000-0000-000000000059}'),

('c0000001-0000-0000-0000-000000000006', 'Heart Palpitations',
 '{palpitations,heart racing,fast heartbeat,arrhythmia,skipped beats}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000056,a0000001-0000-0000-0000-000000000117,a0000001-0000-0000-0000-000000000028,a0000001-0000-0000-0000-000000000094,a0000001-0000-0000-0000-000000000096,a0000001-0000-0000-0000-000000000017}'),

('c0000001-0000-0000-0000-000000000007', 'Anxiety / Panic Attacks',
 '{anxiety,panic,nervousness,worry,racing thoughts}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000056,a0000001-0000-0000-0000-000000000039,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000009}'),

('c0000001-0000-0000-0000-000000000008', 'Depression / Low Mood',
 '{depression,sad,low mood,hopelessness,unmotivated}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000051,a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000014,a0000001-0000-0000-0000-000000000054,a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000042,a0000001-0000-0000-0000-000000000056}'),

('c0000001-0000-0000-0000-000000000009', 'Joint / Muscle Pain',
 '{joint pain,muscle pain,aches,stiffness,arthritis,fibromyalgia}',
 '{a0000001-0000-0000-0000-000000000048,a0000001-0000-0000-0000-000000000049,a0000001-0000-0000-0000-000000000050,a0000001-0000-0000-0000-000000000073,a0000001-0000-0000-0000-000000000075,a0000001-0000-0000-0000-000000000076,a0000001-0000-0000-0000-000000000051,a0000001-0000-0000-0000-000000000043,a0000001-0000-0000-0000-000000000079,a0000001-0000-0000-0000-000000000001}'),

('c0000001-0000-0000-0000-000000000010', 'Insomnia / Poor Sleep',
 '{insomnia,can''t sleep,waking up,sleep quality,restless}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000018,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000056,a0000001-0000-0000-0000-000000000039,a0000001-0000-0000-0000-000000000012}'),

('c0000001-0000-0000-0000-000000000011', 'Irregular / Heavy Periods',
 '{irregular periods,heavy periods,menstrual,cycle,spotting,amenorrhea}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000012,a0000001-0000-0000-0000-000000000013,a0000001-0000-0000-0000-000000000021,a0000001-0000-0000-0000-000000000022,a0000001-0000-0000-0000-000000000020,a0000001-0000-0000-0000-000000000014,a0000001-0000-0000-0000-000000000016,a0000001-0000-0000-0000-000000000028,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000007}'),

('c0000001-0000-0000-0000-000000000012', 'Low Libido',
 '{low libido,sex drive,erectile,arousal,desire}',
 '{a0000001-0000-0000-0000-000000000014,a0000001-0000-0000-0000-000000000015,a0000001-0000-0000-0000-000000000012,a0000001-0000-0000-0000-000000000024,a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000020,a0000001-0000-0000-0000-000000000016,a0000001-0000-0000-0000-000000000017,a0000001-0000-0000-0000-000000000051}'),

('c0000001-0000-0000-0000-000000000013', 'Numbness / Tingling',
 '{numbness,tingling,pins and needles,neuropathy,paresthesia}',
 '{a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000053,a0000001-0000-0000-0000-000000000054,a0000001-0000-0000-0000-000000000042,a0000001-0000-0000-0000-000000000039,a0000001-0000-0000-0000-000000000055,a0000001-0000-0000-0000-000000000056,a0000001-0000-0000-0000-000000000058,a0000001-0000-0000-0000-000000000028}'),

('c0000001-0000-0000-0000-000000000014', 'Bloating / Digestive Issues',
 '{bloating,gas,digestive,IBS,constipation,diarrhea,stomach}',
 '{a0000001-0000-0000-0000-000000000081,a0000001-0000-0000-0000-000000000082,a0000001-0000-0000-0000-000000000083,a0000001-0000-0000-0000-000000000084,a0000001-0000-0000-0000-000000000085,a0000001-0000-0000-0000-000000000086,a0000001-0000-0000-0000-000000000087,a0000001-0000-0000-0000-000000000118,a0000001-0000-0000-0000-000000000119,a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000037}'),

('c0000001-0000-0000-0000-000000000015', 'Frequent Illness / Low Immunity',
 '{frequent illness,sick often,infections,immune,colds}',
 '{a0000001-0000-0000-0000-000000000028,a0000001-0000-0000-0000-000000000051,a0000001-0000-0000-0000-000000000057,a0000001-0000-0000-0000-000000000114,a0000001-0000-0000-0000-000000000115,a0000001-0000-0000-0000-000000000116,a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000017}'),

('c0000001-0000-0000-0000-000000000016', 'Excessive Sweating',
 '{sweating,night sweats,hot flashes,perspiration}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000012,a0000001-0000-0000-0000-000000000021,a0000001-0000-0000-0000-000000000039,a0000001-0000-0000-0000-000000000042,a0000001-0000-0000-0000-000000000028,a0000001-0000-0000-0000-000000000110}'),

('c0000001-0000-0000-0000-000000000017', 'Brittle / Thinning Nails',
 '{brittle nails,thin nails,nail breakage,nails splitting}',
 '{a0000001-0000-0000-0000-000000000032,a0000001-0000-0000-0000-000000000029,a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000052,a0000001-0000-0000-0000-000000000057,a0000001-0000-0000-0000-000000000028}'),

('c0000001-0000-0000-0000-000000000018', 'Dry Skin / Dry Eyes',
 '{dry skin,dry eyes,eczema,flaky skin,itchy skin}',
 '{a0000001-0000-0000-0000-000000000001,a0000001-0000-0000-0000-000000000002,a0000001-0000-0000-0000-000000000003,a0000001-0000-0000-0000-000000000051,a0000001-0000-0000-0000-000000000057,a0000001-0000-0000-0000-000000000107,a0000001-0000-0000-0000-000000000055,a0000001-0000-0000-0000-000000000073,a0000001-0000-0000-0000-000000000012}'),

('c0000001-0000-0000-0000-000000000019', 'Swollen Lymph Nodes',
 '{swollen lymph nodes,lymphadenopathy,swollen glands,lumps}',
 '{a0000001-0000-0000-0000-000000000028,a0000001-0000-0000-0000-000000000049,a0000001-0000-0000-0000-000000000050,a0000001-0000-0000-0000-000000000110,a0000001-0000-0000-0000-000000000111,a0000001-0000-0000-0000-000000000112,a0000001-0000-0000-0000-000000000113,a0000001-0000-0000-0000-000000000114,a0000001-0000-0000-0000-000000000073}');
-- ============================================================
-- STATES (50 + DC)
-- ============================================================
insert into states (state_code, state_name, dtc_allowed, notes) values
  ('AL', 'Alabama', 'allowed', null),
  ('AK', 'Alaska', 'allowed', null),
  ('AZ', 'Arizona', 'allowed', null),
  ('AR', 'Arkansas', 'restricted', 'Varies by test type'),
  ('CA', 'California', 'restricted', 'Varies by test type'),
  ('CO', 'Colorado', 'allowed', null),
  ('CT', 'Connecticut', 'allowed', null),
  ('DE', 'Delaware', 'allowed', null),
  ('DC', 'District of Columbia', 'allowed', null),
  ('FL', 'Florida', 'allowed', null),
  ('GA', 'Georgia', 'allowed', null),
  ('HI', 'Hawaii', 'allowed', null),
  ('ID', 'Idaho', 'allowed', null),
  ('IL', 'Illinois', 'restricted', 'Varies by test type'),
  ('IN', 'Indiana', 'allowed', null),
  ('IA', 'Iowa', 'allowed', null),
  ('KS', 'Kansas', 'restricted', 'Varies by test type'),
  ('KY', 'Kentucky', 'allowed', null),
  ('LA', 'Louisiana', 'allowed', null),
  ('ME', 'Maine', 'restricted', 'Varies by test type'),
  ('MD', 'Maryland', 'restricted', 'Varies by test type'),
  ('MA', 'Massachusetts', 'allowed', null),
  ('MI', 'Michigan', 'restricted', 'Varies by test type'),
  ('MN', 'Minnesota', 'allowed', null),
  ('MS', 'Mississippi', 'restricted', 'Varies by test type'),
  ('MO', 'Missouri', 'restricted', 'Varies by test type'),
  ('MT', 'Montana', 'allowed', null),
  ('NE', 'Nebraska', 'allowed', null),
  ('NV', 'Nevada', 'restricted', 'Varies by test type'),
  ('NH', 'New Hampshire', 'allowed', null),
  ('NJ', 'New Jersey', 'prohibited', 'No direct-to-consumer lab ordering'),
  ('NM', 'New Mexico', 'allowed', null),
  ('NY', 'New York', 'prohibited', 'No direct-to-consumer lab ordering'),
  ('NC', 'North Carolina', 'allowed', null),
  ('ND', 'North Dakota', 'allowed', null),
  ('OH', 'Ohio', 'allowed', null),
  ('OK', 'Oklahoma', 'allowed', null),
  ('OR', 'Oregon', 'allowed', null),
  ('PA', 'Pennsylvania', 'allowed', null),
  ('RI', 'Rhode Island', 'prohibited', 'No direct-to-consumer lab ordering'),
  ('SC', 'South Carolina', 'allowed', null),
  ('SD', 'South Dakota', 'allowed', null),
  ('TN', 'Tennessee', 'allowed', null),
  ('TX', 'Texas', 'allowed', null),
  ('UT', 'Utah', 'restricted', 'Varies by test type'),
  ('VT', 'Vermont', 'allowed', null),
  ('VA', 'Virginia', 'allowed', null),
  ('WA', 'Washington', 'allowed', null),
  ('WV', 'West Virginia', 'allowed', null),
  ('WI', 'Wisconsin', 'allowed', null),
  ('WY', 'Wyoming', 'allowed', null);