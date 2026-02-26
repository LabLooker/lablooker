-- LabLooker seed-full.sql
-- Generated from test-database-research.md
-- Tests: 357 | Labs: 10 | Pricing: 200 (top 20 tests × 10 providers) | Symptoms: 40 | States: 51

-- Clear existing data
TRUNCATE tests, labs, pricing, icd10_codes, test_icd10_codes, states, symptoms CASCADE;

-- ============================================================
-- TESTS
-- ============================================================

-- -------------------------------------------------------
-- SECTION 1: THYROID (21 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000001-0000-0000-0000-000000000000', 'TSH (Thyroid Stimulating Hormone)', 'Measures pituitary hormone that signals the thyroid; the primary screening test for all thyroid conditions.', ARRAY['84443'], 'thyroid', false, 'Most important first-line thyroid test; 3rd-generation assay standard');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000002-0000-0000-0000-000000000000', 'Free T4 (Thyroxine, Free)', 'Measures the unbound, active form of T4 hormone; used with TSH to assess thyroid function.', ARRAY['84439'], 'thyroid', false, 'More clinically useful than total T4; standard follow-up after abnormal TSH');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000003-0000-0000-0000-000000000000', 'Free T3 (Triiodothyronine, Free)', 'Measures the active, unbound T3 hormone; useful in hyperthyroidism and T3 toxicosis.', ARRAY['84481'], 'thyroid', false, 'Helpful in suspected hyperthyroidism with normal T4; T3 toxicosis diagnosis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000004-0000-0000-0000-000000000000', 'Total T4 (Thyroxine, Total)', 'Measures total thyroxine (bound + free) in blood; less specific than Free T4 due to protein binding effects.', ARRAY['84436'], 'thyroid', false, 'Affected by pregnancy, estrogen, liver disease; less preferred than Free T4');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000005-0000-0000-0000-000000000000', 'Total T3 (Triiodothyronine, Total)', 'Measures total T3 (bound + free); used in evaluation of hyperthyroidism and T3 toxicosis.', ARRAY['84480'], 'thyroid', false, 'Less common; Free T3 generally preferred');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000006-0000-0000-0000-000000000000', 'Reverse T3 (rT3)', 'Measures the inactive form of T3; elevated in chronic illness, stress, and conversion disorders.', ARRAY['84482'], 'thyroid', false, 'Popular with functional medicine practitioners; controversial clinical utility per mainstream medicine');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000007-0000-0000-0000-000000000000', 'T3 Uptake (Resin T3 Uptake)', 'Indirect measure of thyroid hormone-binding proteins; used to calculate Free T4 Index (T7).', ARRAY['84479'], 'thyroid', false, 'Older test; largely replaced by direct Free T4 measurement');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000008-0000-0000-0000-000000000000', 'Free T4 Index (T7)', 'Calculated value combining T3 uptake and Total T4; estimates free T4 without direct measurement.', ARRAY['84479','84436'], 'thyroid', false, 'Panel code; increasingly replaced by direct Free T4');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000009-0000-0000-0000-000000000000', 'Anti-TPO (Thyroid Peroxidase Antibody)', 'Detects antibodies against thyroid peroxidase enzyme; elevated in Hashimoto''s and Graves'' disease.', ARRAY['86376'], 'thyroid', false, 'Key autoimmune thyroid marker; positive in ~95% of Hashimoto''s');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000010-0000-0000-0000-000000000000', 'Anti-Thyroglobulin Antibody (TgAb)', 'Detects antibodies against thyroglobulin protein; elevated in Hashimoto''s and thyroid cancer monitoring.', ARRAY['86800'], 'thyroid', false, 'Used with TPO for comprehensive autoimmune thyroid screening; can interfere with Tg monitoring');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000011-0000-0000-0000-000000000000', 'Thyroglobulin (Tg)', 'Measures protein made only by thyroid cells; used to monitor thyroid cancer after thyroidectomy.', ARRAY['84432'], 'thyroid', false, 'Cancer monitoring marker; unreliable if TgAb positive');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000012-0000-0000-0000-000000000000', 'TSI (Thyroid Stimulating Immunoglobulin)', 'Detects antibodies that stimulate TSH receptors; diagnostic for Graves'' disease (hyperthyroidism).', ARRAY['86800'], 'thyroid', false, 'Confirmatory test for Graves'' disease; also called TRAb or TSHR Ab');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000013-0000-0000-0000-000000000000', 'TRAb (TSH Receptor Antibody)', 'Detects antibodies to TSH receptor (stimulating or blocking); used for Graves'' disease diagnosis.', ARRAY['86800'], 'thyroid', false, 'Includes stimulating and blocking variants; some labs separate TSI from blocking TRAb');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000014-0000-0000-0000-000000000000', 'Calcitonin', 'Hormone produced by thyroid C-cells; elevated in medullary thyroid cancer and C-cell hyperplasia.', ARRAY['82308'], 'thyroid', false, 'Important tumor marker for medullary thyroid carcinoma (MTC)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000015-0000-0000-0000-000000000000', 'Thyroid Panel with TSH', 'Panel including T3 Uptake, Total T4, Free T4 Index, and TSH for comprehensive thyroid function assessment.', ARRAY['84436','84443','84479'], 'thyroid', false, 'Common panel; exact components vary by lab');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000016-0000-0000-0000-000000000000', 'Comprehensive Thyroid Panel', 'Comprehensive panel covering TSH, Free T4, Free T3, Reverse T3, TPO Ab, and TgAb.', ARRAY['84443','84439','84481','84482','86376','86800'], 'thyroid', false, 'Popular with functional medicine; exact components vary by lab/DTC platform');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000017-0000-0000-0000-000000000000', 'Iodine, Serum/Plasma', 'Measures iodine levels in blood; relevant for thyroid function and iodine deficiency assessment.', ARRAY['84999'], 'thyroid', false, 'Used by functional medicine; reference ranges debated');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000018-0000-0000-0000-000000000000', 'Iodine, Urine', 'Spot urine iodine; more reliable than serum for assessing body iodine status.', ARRAY['84999'], 'thyroid', false, 'Spot urine expressed as iodine:creatinine ratio; DTC available');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000019-0000-0000-0000-000000000000', 'Thyroid Ultrasound (imaging)', 'Imaging study (not blood test); evaluates thyroid nodules, size, and vascularity.', ARRAY['76536'], 'thyroid', false, 'NOT a blood test; requires radiology; listed here for completeness');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000020-0000-0000-0000-000000000000', 'Parathyroid Hormone (PTH)', 'Measures PTH from parathyroid glands embedded in thyroid; regulates calcium and phosphorus.', ARRAY['83970'], 'thyroid', false, 'Related to thyroid anatomy; used with calcium for calcium disorders');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000021-0000-0000-0000-000000000000', 'PTH-Related Protein (PTHrP)', 'Measures parathyroid hormone-related protein; elevated in humoral hypercalcemia of malignancy.', ARRAY['83965'], 'thyroid', false, 'Mainly used in cancer-related hypercalcemia; DTC available through some platforms');

-- -------------------------------------------------------
-- SECTION 2: HORMONES (40 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000022-0000-0000-0000-000000000000', 'Testosterone, Total', 'Measures total testosterone (bound + free) in blood; primary test for hypogonadism and androgen excess.', ARRAY['84403'], 'hormones', true, 'Should be drawn before 10 AM; fasting preferred but not always required');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000023-0000-0000-0000-000000000000', 'Testosterone, Total (LC/MS/MS)', 'Gold-standard mass spectrometry method for total testosterone; more accurate than immunoassay, especially at low levels.', ARRAY['84403'], 'hormones', true, 'Preferred method for women and children; Quest code 15983');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000024-0000-0000-0000-000000000000', 'Testosterone, Free (Calculated)', 'Calculated free testosterone based on total T and SHBG using Vermeulen formula; estimates bioavailable T.', ARRAY['84402'], 'hormones', true, 'Calculated, not directly measured; less accurate than equilibrium dialysis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000025-0000-0000-0000-000000000000', 'Testosterone, Free (Direct)', 'Directly measured free testosterone via equilibrium dialysis; most accurate method for free T.', ARRAY['84402'], 'hormones', true, 'Gold standard for free T; some DTC platforms offer this specifically');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000026-0000-0000-0000-000000000000', 'Testosterone, Bioavailable', 'Measures testosterone not bound to SHBG (free + albumin-bound); a comprehensive bioactivity estimate.', ARRAY['84402'], 'hormones', true, 'Calculated from total T, SHBG, albumin');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000027-0000-0000-0000-000000000000', 'SHBG (Sex Hormone Binding Globulin)', 'Protein that binds testosterone and estradiol; elevated SHBG lowers bioavailable hormones.', ARRAY['84270'], 'hormones', false, 'Essential for calculating free and bioavailable testosterone');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000028-0000-0000-0000-000000000000', 'Estradiol (E2)', 'Most potent estrogen; primary sex hormone test for women and estrogen monitoring in men on TRT.', ARRAY['82670'], 'hormones', false, 'Standard estradiol; consider "sensitive" assay (LC/MS/MS) for men and children');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000029-0000-0000-0000-000000000000', 'Estradiol, Sensitive (LC/MS/MS)', 'Mass spectrometry-based estradiol; more accurate at low levels; preferred for men and children.', ARRAY['82670'], 'hormones', false, 'Quest Diagnostics Estradiol Sensitive (code 30289); Labcorp Estradiol, Sensitive');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000030-0000-0000-0000-000000000000', 'Estrone (E1)', 'Measures estrone, the predominant estrogen in post-menopausal women; conversion product of estradiol.', ARRAY['82679'], 'hormones', false, 'Less commonly tested; useful in menopause and hormone replacement monitoring');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000031-0000-0000-0000-000000000000', 'Estriol (E3)', 'Measures estriol; primary estrogen during pregnancy; part of quad screen for chromosomal abnormalities.', ARRAY['82677'], 'hormones', false, 'Mainly used in pregnancy screening; uE3 = unconjugated estriol');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000032-0000-0000-0000-000000000000', 'Progesterone', 'Measures progesterone; confirms ovulation, supports luteal phase assessment, and monitors pregnancy.', ARRAY['84144'], 'hormones', false, 'Timed with menstrual cycle (day 21 for ovulation confirmation)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000033-0000-0000-0000-000000000000', 'Progesterone, 17-OH (17-Hydroxyprogesterone)', 'Elevated in congenital adrenal hyperplasia (CAH); also measured in adrenal function assessment.', ARRAY['84143'], 'hormones', true, 'Newborn screen for CAH; adults tested for late-onset CAH');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000034-0000-0000-0000-000000000000', 'FSH (Follicle Stimulating Hormone)', 'Pituitary hormone stimulating follicle development in women and sperm production in men; elevated in menopause.', ARRAY['83001'], 'hormones', false, 'Day 3 FSH is standard for ovarian reserve; elevated FSH indicates declining ovarian function');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000035-0000-0000-0000-000000000000', 'LH (Luteinizing Hormone)', 'Pituitary hormone triggering ovulation in women and testosterone production in men.', ARRAY['83002'], 'hormones', false, 'LH surge triggers ovulation; day 3 LH used in fertility workup');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000036-0000-0000-0000-000000000000', 'Prolactin', 'Hormone produced by pituitary; elevated in pituitary adenomas, hypothyroidism, and certain medications.', ARRAY['84146'], 'hormones', false, 'Should ideally be drawn in AM; stress can falsely elevate; macroprolactin can cause false elevation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000037-0000-0000-0000-000000000000', 'DHEA-Sulfate (DHEA-S)', 'Adrenal androgen precursor; reflects adrenal function; often tested in adrenal fatigue workup.', ARRAY['82627'], 'hormones', false, 'Most stable form of DHEA; does not require timed draw');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000038-0000-0000-0000-000000000000', 'DHEA (Unconjugated)', 'Unconjugated DHEA (less stable than DHEA-S); reflects adrenal and gonadal production.', ARRAY['82626'], 'hormones', false, 'Less commonly tested than DHEA-S; more variable levels');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000039-0000-0000-0000-000000000000', 'Androstenedione', 'Androgen precursor produced by adrenal glands and gonads; elevated in PCOS and CAH.', ARRAY['82157'], 'hormones', false, 'Useful in PCOS workup alongside testosterone');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000040-0000-0000-0000-000000000000', 'Cortisol, AM (Serum)', 'Morning cortisol drawn 8-9 AM; screens for adrenal insufficiency (low) or Cushing''s (high).', ARRAY['82533'], 'hormones', false, 'Timing is critical: draw between 7-9 AM for meaningful results');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000041-0000-0000-0000-000000000000', 'Cortisol, PM (Serum)', 'Afternoon/evening cortisol; normally much lower than AM; used in Cushing''s evaluation.', ARRAY['82533'], 'hormones', false, 'PM should be <50% of AM; diurnal variation essential for interpretation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000042-0000-0000-0000-000000000000', 'Cortisol, 24-Hour Urine Free', 'Collection for cortisol; gold standard for Cushing''s syndrome screening.', ARRAY['82530'], 'hormones', false, 'Requires 24-hr urine collection; more sensitive for Cushing''s than single serum cortisol');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000043-0000-0000-0000-000000000000', 'Cortisol, Salivary (4-point)', 'Salivary cortisol measured at 4 time points throughout day; assesses diurnal cortisol rhythm.', ARRAY['82530'], 'hormones', false, 'Popular with functional medicine; at-home collection kit available');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000044-0000-0000-0000-000000000000', 'ACTH (Adrenocorticotropic Hormone)', 'Pituitary hormone stimulating cortisol release; used in differentiating causes of Cushing''s and adrenal insufficiency.', ARRAY['82024'], 'hormones', false, 'Must be collected in chilled EDTA tube; pre-analytic handling critical');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000045-0000-0000-0000-000000000000', 'IGF-1 (Insulin-like Growth Factor 1)', 'Growth hormone surrogate marker; screens for GH deficiency and acromegaly; more stable than GH itself.', ARRAY['84305'], 'hormones', false, 'More reliable than random GH measurement; preferred screening test for GH axis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000046-0000-0000-0000-000000000000', 'Growth Hormone (GH)', 'Measures human growth hormone; pulsatile secretion makes random levels difficult to interpret.', ARRAY['83003'], 'hormones', false, 'Random GH levels unreliable; stimulation/suppression testing preferred diagnostically');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000047-0000-0000-0000-000000000000', 'Melatonin', 'Sleep hormone produced by pineal gland; measured to assess sleep disorders and circadian rhythm.', ARRAY['83519'], 'hormones', false, 'Salivary melatonin preferred; less commonly available through DTC');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000048-0000-0000-0000-000000000000', 'Aldosterone, Serum', 'Mineralocorticoid hormone regulating sodium/potassium; elevated in primary aldosteronism.', ARRAY['82088'], 'hormones', false, 'Best measured in upright position; affected by dietary sodium and medications');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000049-0000-0000-0000-000000000000', 'Aldosterone, Urine (24-hr)', '24-hour urine aldosterone; more comprehensive assessment of aldosterone production.', ARRAY['82088'], 'hormones', false, 'Requires 24-hr urine collection; often paired with serum aldosterone');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000050-0000-0000-0000-000000000000', 'Renin Activity (PRA)', 'Plasma renin activity; used with aldosterone to calculate aldosterone-to-renin ratio (ARR) in hypertension workup.', ARRAY['84244'], 'hormones', false, 'Aldosterone:Renin ratio (ARR) >20-30 suggests primary aldosteronism');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000051-0000-0000-0000-000000000000', 'Renin, Direct', 'Direct renin concentration (DRC) measurement; alternative to plasma renin activity.', ARRAY['84244'], 'hormones', false, 'DRC increasingly replacing PRA in many labs');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000052-0000-0000-0000-000000000000', 'Free Testosterone + Total Testosterone', 'Panel combining total and free testosterone measurement; provides complete testosterone picture.', ARRAY['84402','84403'], 'hormones', true, 'Standard panel for men''s health evaluation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000053-0000-0000-0000-000000000000', 'Sex Hormone Panel, Male', 'Comprehensive male hormone panel: total/free T, SHBG, FSH, LH, prolactin, DHEA-S, estradiol.', ARRAY['84403','84402','84270','83001','83002','84146','82627','82670'], 'hormones', true, 'Panel price; components ordered individually');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000054-0000-0000-0000-000000000000', 'Sex Hormone Panel, Female', 'Comprehensive female hormone panel: estradiol, progesterone, FSH, LH, prolactin, testosterone, DHEA-S.', ARRAY['82670','84144','83001','83002','84146','84403','82627'], 'hormones', false, 'Timing relative to menstrual cycle is critical');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000055-0000-0000-0000-000000000000', 'AMH (Anti-Mullerian Hormone)', 'Marker of ovarian reserve (egg supply); used in fertility evaluation and menopause prediction.', ARRAY['86291'], 'hormones', false, 'Stable across menstrual cycle; can be drawn any day');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000056-0000-0000-0000-000000000000', 'Inhibin B', 'Ovarian hormone reflecting follicle count; used with FSH for ovarian reserve assessment.', ARRAY['86336'], 'hormones', false, 'Day 3 draw preferred; less commonly available than AMH');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000057-0000-0000-0000-000000000000', 'Inhibin A', 'Placental hormone; used in quad maternal serum screening for Down syndrome.', ARRAY['86336'], 'hormones', false, 'Primarily used in prenatal screening');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000058-0000-0000-0000-000000000000', 'Total Estrogen', 'Measures all circulating estrogens (E1+E2+E3); used in menopause and hormone replacement monitoring.', ARRAY['82672'], 'hormones', false, 'Less specific than individual estrogen measurements');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000059-0000-0000-0000-000000000000', 'Pregnenolone', 'Precursor hormone to all steroid hormones; used in adrenal and hormone cascade evaluation.', ARRAY['84140'], 'hormones', false, 'Popular in functional/anti-aging medicine; not routinely covered by insurance');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000060-0000-0000-0000-000000000000', 'Estrogen Metabolites (4-OHE, 2-OHE)', 'Measures estrogen metabolites; used to assess estrogen metabolism pathways and cancer risk.', ARRAY['82672'], 'hormones', false, 'Specialty test; urine preferred; associated with breast cancer risk assessment');

-- -------------------------------------------------------
-- SECTION 3: IRON & HEMATOLOGY (50 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000061-0000-0000-0000-000000000000', 'CBC with Differential (CBC w/ Diff)', 'Complete blood count measuring RBC, WBC, hemoglobin, hematocrit, platelets, and 5-part differential.', ARRAY['85025'], 'hematology', false, 'Most common hematology test; 5-part diff includes neutrophils, lymphocytes, monocytes, eos, basos');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000062-0000-0000-0000-000000000000', 'CBC without Differential', 'Complete blood count without white cell differential breakdown; basic automated count.', ARRAY['85027'], 'hematology', false, 'Less information than CBC w/ diff; less commonly ordered');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000063-0000-0000-0000-000000000000', 'Hemoglobin', 'Measures oxygen-carrying protein in red blood cells; screens for anemia.', ARRAY['85018'], 'hematology', false, 'Individual component; often part of CBC');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000064-0000-0000-0000-000000000000', 'Hematocrit', 'Measures percentage of blood volume occupied by red blood cells; screens for anemia and polycythemia.', ARRAY['85014'], 'hematology', false, 'Individual component; often part of CBC');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000065-0000-0000-0000-000000000000', 'RBC Count', 'Count of red blood cells per volume; used with hemoglobin and hematocrit to characterize anemia.', ARRAY['85041'], 'hematology', false, 'Usually reported as part of CBC');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000066-0000-0000-0000-000000000000', 'WBC Count', 'Total white blood cell count; elevated in infection, leukemia; decreased in bone marrow suppression.', ARRAY['85048'], 'hematology', false, 'Part of CBC; differential needed to characterize abnormal WBC');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000067-0000-0000-0000-000000000000', 'Platelet Count', 'Count of blood platelets; low (thrombocytopenia) or high (thrombocytosis) affects clotting.', ARRAY['85049'], 'hematology', false, 'Part of CBC; critical for bleeding/clotting risk assessment');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000068-0000-0000-0000-000000000000', 'Blood Smear, Peripheral', 'Microscopic examination of blood cells; identifies abnormal cell shapes, parasites, and immature cells.', ARRAY['85060'], 'hematology', false, 'Adds morphology detail not captured by automated CBC');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000069-0000-0000-0000-000000000000', 'Manual Differential', 'Manual microscopic WBC differential; more accurate for abnormal cells than automated.', ARRAY['85007'], 'hematology', false, 'Ordered when automated differential flags abnormalities');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000070-0000-0000-0000-000000000000', 'Reticulocyte Count', 'Counts immature red blood cells; reflects bone marrow''s RBC production rate.', ARRAY['85044'], 'hematology', false, 'Helpful in classifying anemia as hypo- or hyperproliferative');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000071-0000-0000-0000-000000000000', 'Reticulocyte, Absolute', 'Absolute count of reticulocytes; more clinically useful than percentage alone.', ARRAY['85045'], 'hematology', false, 'Often paired with reticulocyte count');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000072-0000-0000-0000-000000000000', 'Ferritin', 'Iron storage protein; best single test for iron deficiency (low) and iron overload (high).', ARRAY['82728'], 'iron', false, 'Can be falsely elevated as acute phase reactant in inflammation; interpret with CRP');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000073-0000-0000-0000-000000000000', 'Iron, Serum', 'Measures iron in bloodstream at time of draw; fluctuates throughout the day.', ARRAY['83540'], 'iron', true, 'Highly variable; interpret with TIBC and ferritin for full iron picture');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000074-0000-0000-0000-000000000000', 'TIBC (Total Iron Binding Capacity)', 'Measures capacity of transferrin to bind iron; elevated in iron deficiency, decreased in iron overload.', ARRAY['83550'], 'iron', true, 'Usually reported with iron and calculated transferrin saturation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000075-0000-0000-0000-000000000000', 'Iron & TIBC Panel', 'Combined iron and TIBC measurement; provides transferrin saturation for iron status assessment.', ARRAY['83540','83550'], 'iron', true, 'Transferrin saturation = (Iron/TIBC) x 100; >45% suggests iron overload');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000076-0000-0000-0000-000000000000', 'Transferrin', 'Direct measurement of iron-transport protein; alternative to TIBC for assessing iron status.', ARRAY['84466'], 'iron', false, 'Low in malnutrition, liver disease; high in iron deficiency');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000077-0000-0000-0000-000000000000', 'Transferrin Saturation', 'Calculated value: serum iron divided by TIBC x 100; percentage of transferrin bound to iron.', ARRAY['83540','83550'], 'iron', true, '<16% suggests iron deficiency; >45% suggests hemochromatosis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000078-0000-0000-0000-000000000000', 'Soluble Transferrin Receptor (sTfR)', 'Surface protein concentration reflecting iron-deficient erythropoiesis; not affected by inflammation.', ARRAY['84466'], 'iron', false, 'Distinguishes iron-deficiency anemia from anemia of chronic disease; not widely available DTC');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000079-0000-0000-0000-000000000000', 'Hepcidin', 'Liver peptide regulating iron absorption; elevated in inflammation-related anemia; low in iron deficiency.', ARRAY['83519'], 'iron', false, 'Research and specialty use; limited DTC availability');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000080-0000-0000-0000-000000000000', 'Prothrombin Time (PT/INR)', 'Measures extrinsic coagulation pathway; used to monitor warfarin therapy and assess liver function.', ARRAY['85610'], 'coagulation', false, 'INR standardizes PT results; elevated in warfarin use, vitamin K deficiency, liver disease');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000081-0000-0000-0000-000000000000', 'aPTT (Activated Partial Thromboplastin Time)', 'Measures intrinsic coagulation pathway; used to monitor heparin therapy and detect factor deficiencies.', ARRAY['85730'], 'coagulation', false, 'Elevated in hemophilia, lupus anticoagulant, heparin use');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000082-0000-0000-0000-000000000000', 'D-Dimer', 'Fibrin degradation product; elevated in clotting events (DVT, PE, DIC).', ARRAY['85378'], 'coagulation', false, 'High sensitivity, low specificity; negative D-dimer rules out clot; positive requires imaging');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000083-0000-0000-0000-000000000000', 'D-Dimer, Quantitative', 'Quantitative D-dimer measurement; used for DVT/PE diagnosis and DIC monitoring.', ARRAY['85379'], 'coagulation', false, 'More specific reporting than qualitative; varies by lab methodology');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000084-0000-0000-0000-000000000000', 'Fibrinogen', 'Clotting protein; decreased in DIC and liver disease; elevated as acute phase reactant.', ARRAY['85384'], 'coagulation', false, 'Both a coagulation factor and inflammatory marker');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000085-0000-0000-0000-000000000000', 'Fibrinogen Activity', 'Functional measurement of fibrinogen; identifies dysfibrinogenemia (abnormal fibrinogen function).', ARRAY['85385'], 'coagulation', false, 'More specific than antigen measurement; detects functional defects');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000086-0000-0000-0000-000000000000', 'Thrombin Time', 'Measures time to clot after thrombin added; detects fibrinogen deficiency and inhibitors.', ARRAY['85670'], 'coagulation', false, 'Useful in detecting heparin contamination and fibrinogen disorders');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000087-0000-0000-0000-000000000000', 'Platelet Aggregation Studies', 'Tests platelet function response to various agonists; diagnoses platelet function disorders.', ARRAY['85576'], 'coagulation', false, 'Requires special handling; often sent to reference lab');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000088-0000-0000-0000-000000000000', 'PFA-100 (Platelet Function Analyzer)', 'Rapid screening test for platelet function and von Willebrand disease.', ARRAY['85576'], 'coagulation', false, 'Alternative to bleeding time; screens for platelet dysfunction');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000089-0000-0000-0000-000000000000', 'Von Willebrand Factor Antigen', 'Measures vWF protein quantity; used to diagnose von Willebrand disease.', ARRAY['85246'], 'coagulation', false, 'Must interpret with vWF activity (ristocetin cofactor)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000090-0000-0000-0000-000000000000', 'Von Willebrand Factor Activity', 'Measures vWF function (ristocetin cofactor activity); functional test for vWF.', ARRAY['85247'], 'coagulation', false, 'Paired with vWF antigen for vWD diagnosis and typing');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000091-0000-0000-0000-000000000000', 'Factor VIII Activity', 'Measures clotting Factor VIII; low in hemophilia A.', ARRAY['85240'], 'coagulation', false, 'Hemophilia A diagnosis and monitoring');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000092-0000-0000-0000-000000000000', 'Factor IX Activity', 'Measures clotting Factor IX; low in hemophilia B (Christmas disease).', ARRAY['85250'], 'coagulation', false, 'Hemophilia B diagnosis and monitoring');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000093-0000-0000-0000-000000000000', 'Lupus Anticoagulant', 'Detects phospholipid antibodies that paradoxically prolong clotting tests; associated with thrombosis.', ARRAY['85613'], 'coagulation', false, 'Part of antiphospholipid syndrome workup; misnomer - causes clots, not bleeding');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000094-0000-0000-0000-000000000000', 'Antiphospholipid Panel', 'Panel for antiphospholipid syndrome: lupus anticoagulant, anticardiolipin, anti-beta2-glycoprotein.', ARRAY['85613','86147','86148'], 'coagulation', false, 'All three tests needed for complete APS evaluation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000095-0000-0000-0000-000000000000', 'Protein C Activity', 'Anticoagulant protein; deficiency causes increased thrombosis risk.', ARRAY['85303'], 'coagulation', false, 'Part of hypercoagulability workup; can be acquired or inherited');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000096-0000-0000-0000-000000000000', 'Protein S, Free', 'Cofactor for Protein C; free Protein S is the active form; deficiency increases clot risk.', ARRAY['85306'], 'coagulation', false, 'Total, free, and functional Protein S are measured differently');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000097-0000-0000-0000-000000000000', 'Antithrombin III Activity', 'Natural anticoagulant; deficiency leads to increased thrombosis risk; can be acquired.', ARRAY['85300'], 'coagulation', false, 'Heparin resistance can indicate AT-III deficiency');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000098-0000-0000-0000-000000000000', 'Sickle Cell Screen (Hgb Solubility)', 'Qualitative test for sickle hemoglobin (HbS); positive if HbS present.', ARRAY['85660'], 'hematology', false, 'Screening test only; positive result requires Hgb electrophoresis for confirmation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000099-0000-0000-0000-000000000000', 'Hemoglobin Electrophoresis', 'Separates and identifies different hemoglobin types; diagnoses sickle cell disease, thalassemia, and hemoglobin variants.', ARRAY['83020'], 'hematology', false, 'Definitive test for hemoglobinopathies');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000100-0000-0000-0000-000000000000', 'G6PD Screen', 'Detects G6PD enzyme deficiency; required before certain medications.', ARRAY['82955'], 'hematology', false, 'Most common enzyme deficiency worldwide; X-linked; prevalent in African, Mediterranean, Asian populations');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000101-0000-0000-0000-000000000000', 'G6PD, Quantitative', 'Quantitative G6PD enzyme activity; confirms G6PD deficiency diagnosis.', ARRAY['82960'], 'hematology', false, 'More accurate than qualitative screen, especially in heterozygous females');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000102-0000-0000-0000-000000000000', 'Haptoglobin', 'Protein binding free hemoglobin; decreased in hemolytic anemia.', ARRAY['83010'], 'hematology', false, 'Low haptoglobin + elevated LDH + indirect bilirubin = hemolysis triad');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000103-0000-0000-0000-000000000000', 'LDH (Lactate Dehydrogenase)', 'Enzyme released in cell damage; elevated in hemolysis, liver disease, cancer, and muscle injury.', ARRAY['83615'], 'hematology', false, 'Non-specific; used in multiple contexts including tumor monitoring');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000104-0000-0000-0000-000000000000', 'Direct Coombs Test (DAT)', 'Detects antibodies attached to red blood cells; diagnoses autoimmune hemolytic anemia.', ARRAY['86880'], 'hematology', false, 'Positive in AIHA, drug-induced hemolysis, HDN');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000105-0000-0000-0000-000000000000', 'Indirect Coombs Test (IAT)', 'Detects free antibodies in serum; used in blood typing and transfusion compatibility.', ARRAY['86850'], 'hematology', false, 'Part of antibody screen before transfusion');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000106-0000-0000-0000-000000000000', 'Blood Type (ABO & Rh)', 'Determines ABO blood group and Rh factor; essential for transfusion and pregnancy.', ARRAY['86900','86901'], 'hematology', false, 'DTC available; Rh negative mothers need monitoring during pregnancy');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000107-0000-0000-0000-000000000000', 'ESR (Erythrocyte Sedimentation Rate)', 'Measures rate red blood cells settle; nonspecific marker of inflammation.', ARRAY['85652'], 'hematology', false, 'Westergren method is standard; less specific than CRP but very widely used');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000108-0000-0000-0000-000000000000', 'Mean Corpuscular Volume (MCV)', 'Average red blood cell size; low in iron deficiency/thalassemia, high in B12/folate deficiency.', ARRAY['85025'], 'hematology', false, 'Reported as part of CBC; key for anemia classification');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000109-0000-0000-0000-000000000000', 'RDW (Red Cell Distribution Width)', 'Variability in RBC size; elevated in iron deficiency, mixed deficiencies, or early treatment response.', ARRAY['85025'], 'hematology', false, 'Part of CBC; high RDW + normal MCV suggests multiple concurrent deficiencies');

-- -------------------------------------------------------
-- SECTION 4: METABOLIC & DIABETES (30 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000110-0000-0000-0000-000000000000', 'CMP (Comprehensive Metabolic Panel)', '14-test panel covering kidney, liver, electrolytes, glucose, and protein; comprehensive health snapshot.', ARRAY['80053'], 'metabolic', true, 'Includes: glucose, BUN, creatinine, eGFR, sodium, potassium, chloride, CO2, calcium, total protein, albumin, bilirubin, ALT, AST, ALP');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000111-0000-0000-0000-000000000000', 'BMP (Basic Metabolic Panel)', '8-test panel: glucose, BUN, creatinine, eGFR, electrolytes (sodium, potassium, chloride, CO2), calcium.', ARRAY['80048'], 'metabolic', true, 'Subset of CMP; covers metabolic function without liver tests');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000112-0000-0000-0000-000000000000', 'Electrolyte Panel', 'Measures sodium, potassium, chloride, and CO2 (bicarbonate); assesses electrolyte balance and acid-base status.', ARRAY['80051'], 'metabolic', false, 'Subset of BMP/CMP; ordered for electrolyte abnormalities');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000113-0000-0000-0000-000000000000', 'Glucose, Fasting', 'Blood sugar level after 8-12 hours of fasting; primary screening test for diabetes.', ARRAY['82947'], 'metabolic', true, '<100 mg/dL normal; 100-125 prediabetes; >=126 diabetes (requires confirmation)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000114-0000-0000-0000-000000000000', 'Glucose, Random', 'Blood sugar at any time regardless of fasting; >=200 mg/dL with symptoms diagnoses diabetes.', ARRAY['82948'], 'metabolic', false, 'Less useful for screening; primarily for symptomatic patients');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000115-0000-0000-0000-000000000000', 'Glucose, Post-prandial (2-hr)', 'Blood sugar 2 hours after consuming 75g glucose load; screens for postprandial glucose dysregulation.', ARRAY['82950'], 'metabolic', true, 'Part of OGTT or standalone 2-hour test');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000116-0000-0000-0000-000000000000', 'OGTT (Oral Glucose Tolerance Test)', 'Multiple glucose measurements after 75g glucose drink; standard for diagnosing gestational diabetes and prediabetes.', ARRAY['82951'], 'metabolic', true, '3-hour test (100g) for gestational DM; 2-hour test (75g) for general DM screening');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000117-0000-0000-0000-000000000000', 'HbA1c (Hemoglobin A1c)', 'Average blood sugar over 2-3 months; the diagnostic and monitoring standard for diabetes management.', ARRAY['83036'], 'metabolic', false, '<5.7% normal; 5.7-6.4% prediabetes; >=6.5% diabetes; no fasting required');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000118-0000-0000-0000-000000000000', 'Insulin, Fasting', 'Measures insulin after fasting; screens for insulin resistance, beta-cell function, and hypoglycemia.', ARRAY['83525'], 'metabolic', true, 'Interpret with fasting glucose (HOMA-IR); not standardized across labs');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000119-0000-0000-0000-000000000000', 'C-Peptide', 'By-product of insulin production; distinguishes type 1 from type 2 diabetes; monitors beta-cell function.', ARRAY['84681'], 'metabolic', true, 'Useful in insulin users (C-peptide not affected by exogenous insulin)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000120-0000-0000-0000-000000000000', 'HOMA-IR (Calculated)', 'Homeostatic Model Assessment of Insulin Resistance; calculated from fasting glucose and insulin.', '{}', 'metabolic', true, 'Formula: (Glucose x Insulin) / 405; >2.5-3.0 suggests insulin resistance');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000121-0000-0000-0000-000000000000', 'Glucose, Urine', 'Detects glucose in urine; positive result suggests hyperglycemia exceeding renal threshold.', ARRAY['81003'], 'metabolic', false, 'Part of urinalysis; positive above ~180 mg/dL serum glucose');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000122-0000-0000-0000-000000000000', 'Ketones, Serum', 'Measures ketone bodies in blood; elevated in DKA, ketogenic diet, fasting, and starvation.', ARRAY['82009'], 'metabolic', false, 'Beta-hydroxybutyrate is the most clinically useful ketone');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000123-0000-0000-0000-000000000000', 'Beta-Hydroxybutyrate', 'Primary ketone body in DKA; more specific than acetoacetate for ketosis monitoring.', ARRAY['82010'], 'metabolic', false, 'DKA monitoring; also useful in ketogenic diet optimization');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000124-0000-0000-0000-000000000000', 'Fructosamine', 'Reflects average glucose over 2-3 weeks; useful when A1c is unreliable (hemolytic anemia, hemoglobin variants).', ARRAY['82985'], 'metabolic', false, 'Alternative to A1c when red cell turnover is abnormal');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000125-0000-0000-0000-000000000000', 'Uric Acid', 'End product of purine metabolism; elevated in gout and kidney disease; also linked to cardiovascular risk.', ARRAY['84550'], 'metabolic', true, 'Gout is defined by elevated uric acid plus crystal deposition');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000126-0000-0000-0000-000000000000', 'Lactate (Lactic Acid)', 'Byproduct of anaerobic metabolism; elevated in sepsis, severe hypoxia, and metabolic disorders.', ARRAY['83605'], 'metabolic', false, 'Requires special handling (ice, immediate transport); venous or arterial');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000127-0000-0000-0000-000000000000', 'Phosphorus (Phosphate)', 'Electrolyte involved in bone, kidney, and PTH metabolism; abnormal in kidney disease and vitamin D deficiency.', ARRAY['84100'], 'metabolic', false, 'Part of bone and kidney metabolism panels');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000128-0000-0000-0000-000000000000', 'Calcium, Serum', 'Most important mineral; regulated by PTH and vitamin D; abnormal in thyroid/parathyroid disorders and cancer.', ARRAY['82310'], 'metabolic', false, 'Ionized calcium more accurate; total calcium affected by albumin levels');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000129-0000-0000-0000-000000000000', 'Calcium, Ionized', 'Unbound, biologically active calcium; more accurate than total calcium, especially in abnormal albumin states.', ARRAY['82330'], 'metabolic', false, 'Preferred in critically ill patients; affected by pH');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000130-0000-0000-0000-000000000000', 'Magnesium, Serum', 'Electrolyte important for nerve, muscle, and cardiac function; commonly deficient.', ARRAY['83735'], 'metabolic', false, 'Serum magnesium doesn''t reflect intracellular status; RBC magnesium more informative');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000131-0000-0000-0000-000000000000', 'Sodium', 'Primary extracellular electrolyte regulating fluid balance; part of BMP/CMP.', ARRAY['84295'], 'metabolic', false, 'Individual component; hyponatremia and hypernatremia both serious');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000132-0000-0000-0000-000000000000', 'Potassium', 'Critical electrolyte for cardiac and muscle function; part of BMP/CMP.', ARRAY['84132'], 'metabolic', false, 'Hemolysis falsely elevates; critical values prompt urgent treatment');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000133-0000-0000-0000-000000000000', 'Chloride', 'Electrolyte balancing body fluids and acid-base; part of BMP/CMP.', ARRAY['82435'], 'metabolic', false, 'Used with CO2 to calculate anion gap');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000134-0000-0000-0000-000000000000', 'CO2 (Bicarbonate)', 'Blood bicarbonate level; reflects acid-base balance; part of BMP/CMP.', ARRAY['82374'], 'metabolic', false, 'Low = acidosis; high = alkalosis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000135-0000-0000-0000-000000000000', 'Anion Gap', 'Calculated from sodium, chloride, and bicarbonate; screens for metabolic acidosis causes.', '{}', 'metabolic', false, 'AG = Na - (Cl + HCO3); >12 suggests MUDPILES causes');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000136-0000-0000-0000-000000000000', 'BUN (Blood Urea Nitrogen)', 'Waste product from protein metabolism filtered by kidneys; elevated in kidney disease and dehydration.', ARRAY['84520'], 'metabolic', false, 'Part of BMP/CMP; BUN:creatinine ratio helps differentiate pre-renal vs renal causes');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000137-0000-0000-0000-000000000000', 'Creatinine, Serum', 'Muscle metabolism waste product filtered by kidneys; best simple measure of kidney function.', ARRAY['82565'], 'metabolic', false, 'eGFR calculated from creatinine, age, sex, race (CKD-EPI or MDRD equation)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000138-0000-0000-0000-000000000000', 'eGFR (Estimated GFR)', 'Estimated kidney filtration rate calculated from creatinine; the primary measure of kidney function stage.', '{}', 'metabolic', false, 'CKD-EPI equation now standard; eGFR <60 for >3 months = CKD');

-- -------------------------------------------------------
-- SECTION 5: LIPIDS & CARDIOVASCULAR (40 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000139-0000-0000-0000-000000000000', 'Lipid Panel (Standard)', 'Measures total cholesterol, HDL, LDL (calculated), and triglycerides; standard cardiovascular risk screening.', ARRAY['80061'], 'lipids', true, 'LDL calculated by Friedewald equation; unreliable when TG >400; most-ordered lipid test');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000140-0000-0000-0000-000000000000', 'Total Cholesterol', 'Total amount of all cholesterol types; part of lipid panel; elevated increases heart disease risk.', ARRAY['82465'], 'lipids', true, 'Individual component; best interpreted in context of lipid panel');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000141-0000-0000-0000-000000000000', 'HDL Cholesterol', '"Good" cholesterol; transports cholesterol to liver for removal; low HDL is a cardiovascular risk factor.', ARRAY['83718'], 'lipids', true, '<40 mg/dL in men, <50 mg/dL in women = low risk; <60 is below optimal');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000142-0000-0000-0000-000000000000', 'LDL Cholesterol, Calculated', '"Bad" cholesterol calculated via Friedewald equation from total cholesterol, HDL, and triglycerides.', ARRAY['80061'], 'lipids', true, 'Standard LDL calculation; unreliable when TG >400 mg/dL');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000143-0000-0000-0000-000000000000', 'LDL Cholesterol, Direct', 'Directly measured LDL; more accurate than calculated LDL, especially when TG is elevated.', ARRAY['83721'], 'lipids', true, 'Preferred when TG >400; standard for non-fasting lipid assessment');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000144-0000-0000-0000-000000000000', 'Triglycerides', 'Blood fats made in liver; elevated by refined carbs, alcohol, and metabolic syndrome.', ARRAY['84478'], 'lipids', true, '<150 mg/dL optimal; >500 pancreatitis risk; strongly affected by recent food');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000145-0000-0000-0000-000000000000', 'VLDL Cholesterol', 'Very low-density lipoprotein, calculated from triglycerides (TG/5); transports triglycerides.', ARRAY['84478'], 'lipids', true, 'Calculated; elevated in metabolic syndrome and hypertriglyceridemia');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000146-0000-0000-0000-000000000000', 'Non-HDL Cholesterol', 'Total cholesterol minus HDL; reflects all atherogenic lipoproteins; increasingly preferred over LDL alone.', '{}', 'lipids', true, 'Calculated; better predictor of CVD risk than LDL in some populations');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000147-0000-0000-0000-000000000000', 'Cholesterol/HDL Ratio', 'Total cholesterol divided by HDL; risk ratio for cardiovascular disease; >5 considered high risk.', '{}', 'lipids', true, 'Calculated; target <4.5 for lower risk');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000148-0000-0000-0000-000000000000', 'Apolipoprotein B (ApoB)', 'Protein on all atherogenic particles; best single measure of atherogenic particle count; superior to LDL-C in many studies.', ARRAY['82172'], 'lipids', true, 'Each LDL, VLDL, and Lp(a) particle has ONE ApoB; directly measured');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000149-0000-0000-0000-000000000000', 'Apolipoprotein A-1 (ApoA-1)', 'Primary protein on HDL particles; reflects HDL functionality; ApoB/ApoA-1 ratio predicts CVD risk.', ARRAY['82172'], 'lipids', true, 'Can be ordered with ApoB for comprehensive apolipoprotein assessment');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000150-0000-0000-0000-000000000000', 'Lipoprotein(a) [Lp(a)]', 'Genetically determined atherogenic lipoprotein; major independent cardiovascular risk factor; not modifiable by lifestyle.', ARRAY['83695'], 'lipids', false, 'Should be measured once in lifetime (genetic); elevated in ~20% of population; target <30 mg/dL');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000151-0000-0000-0000-000000000000', 'NMR LipoProfile', 'Nuclear magnetic resonance analysis of lipoprotein particle number and size; superior to standard lipid panel for risk.', ARRAY['83704'], 'lipids', true, 'Measures LDL particle number (LDL-P), particle size; available through Labcorp');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000152-0000-0000-0000-000000000000', 'CardioIQ Advanced Lipid Panel', 'Quest Diagnostics'' advanced panel including ion mobility lipoprotein fractionation, ApoB, and Lp(a).', ARRAY['83704','82172','83695'], 'lipids', true, 'Quest proprietary panel; comprehensive atherogenic risk assessment');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000153-0000-0000-0000-000000000000', 'VAP Cholesterol Test', 'Vertical Auto Profile measuring lipoprotein subclasses; alternative to NMR.', ARRAY['80061','83704'], 'lipids', true, 'Less commonly available than NMR; varies by lab');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000154-0000-0000-0000-000000000000', 'Omega-3 Index', 'Measures EPA+DHA as percentage of red blood cell fatty acids; reflects cardiovascular protective omega-3 status.', ARRAY['82726'], 'lipids', false, 'Target >8%; <4% associated with increased CVD risk');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000155-0000-0000-0000-000000000000', 'Omega-6/Omega-3 Ratio', 'Ratio of omega-6 to omega-3 fatty acids; elevated ratio associated with inflammation and cardiovascular risk.', ARRAY['82726'], 'lipids', false, 'Target ratio <4:1; typical Western diet is 15-20:1');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000156-0000-0000-0000-000000000000', 'Fatty Acid Profile (Full)', 'Comprehensive measurement of multiple fatty acids including saturated, monounsaturated, omega-3, and omega-6.', ARRAY['82726'], 'lipids', true, 'Available through specialty labs; DTC available');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000157-0000-0000-0000-000000000000', 'hs-CRP (High Sensitivity CRP)', 'High-sensitivity CRP measuring very low inflammation levels; strong cardiovascular risk predictor.', ARRAY['86141'], 'cardiovascular', false, 'Reynolds Risk Score incorporates hs-CRP; <1 mg/L low risk; 1-3 average; >3 high risk');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000158-0000-0000-0000-000000000000', 'CRP, Standard', 'Standard CRP for detecting inflammation; less sensitive than hs-CRP; appropriate for acute infection monitoring.', ARRAY['86140'], 'cardiovascular', false, 'Lower sensitivity than hs-CRP for cardiovascular risk; appropriate for infection/inflammatory monitoring');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000159-0000-0000-0000-000000000000', 'Homocysteine', 'Amino acid elevated in B-vitamin deficiency and MTHFR variants; independent cardiovascular risk factor.', ARRAY['83090'], 'cardiovascular', true, 'Target <10 umol/L; elevated by low B12, B6, folate, and/or MTHFR variants');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000160-0000-0000-0000-000000000000', 'Troponin I', 'Cardiac-specific protein released during myocardial injury; primary marker for heart attack diagnosis.', ARRAY['84484'], 'cardiovascular', false, 'Highly cardiac-specific; high-sensitivity troponin detects very small myocardial damage');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000161-0000-0000-0000-000000000000', 'High-Sensitivity Troponin I (hs-TnI)', 'Ultra-sensitive troponin I detecting myocardial injury earlier and at lower concentrations.', ARRAY['84484'], 'cardiovascular', false, 'Standard of care in ED for acute MI; some DTC platforms offer for monitoring');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000162-0000-0000-0000-000000000000', 'BNP (B-type Natriuretic Peptide)', 'Heart failure biomarker released when heart muscle is stretched; used to diagnose and monitor heart failure.', ARRAY['83880'], 'cardiovascular', false, 'BNP <100 pg/mL argues against heart failure; rising levels indicate decompensation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000163-0000-0000-0000-000000000000', 'NT-proBNP (N-terminal pro BNP)', 'Stable fragment of BNP precursor; preferred heart failure biomarker for diagnosis and prognosis.', ARRAY['83880'], 'cardiovascular', false, 'Longer half-life than BNP; age-adjusted cutoffs required');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000164-0000-0000-0000-000000000000', 'Galectin-3', 'Fibrosis biomarker produced by macrophages; risk stratification in heart failure.', ARRAY['86849'], 'cardiovascular', false, 'Predicts myocardial fibrosis; add-on to BNP/NT-proBNP in HF assessment');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000165-0000-0000-0000-000000000000', 'ST2 Soluble', 'Decoy receptor for IL-33; elevated in cardiac stress and fibrosis; heart failure risk marker.', ARRAY['86849'], 'cardiovascular', false, 'Complements BNP for heart failure risk stratification');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000166-0000-0000-0000-000000000000', 'CK (Creatine Kinase, Total)', 'Enzyme in muscle and heart; elevated in muscle damage, rhabdomyolysis, and heart attack.', ARRAY['82552'], 'cardiovascular', false, 'Non-specific; CK-MB fraction needed for cardiac specificity');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000167-0000-0000-0000-000000000000', 'CK-MB (Creatine Kinase, Cardiac Fraction)', 'Cardiac-specific isoenzyme of CK; elevated in myocardial infarction; now largely replaced by troponin.', ARRAY['82553'], 'cardiovascular', false, 'Historical cardiac marker; less sensitive and specific than troponin; still used in some settings');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000168-0000-0000-0000-000000000000', 'Myoglobin', 'Oxygen-binding muscle protein; early marker of muscle damage and MI; non-cardiac specific.', ARRAY['83874'], 'cardiovascular', false, 'Very early marker (rises within 1-3 hrs of MI); poor cardiac specificity');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000169-0000-0000-0000-000000000000', 'Lipoprotein-Associated Phospholipase A2 (Lp-PLA2)', 'Enzyme on LDL particles promoting vascular inflammation; independent CVD risk marker.', ARRAY['83698'], 'cardiovascular', false, 'PLAC test; FDA-cleared for CHD and stroke risk assessment');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000170-0000-0000-0000-000000000000', 'Myeloperoxidase (MPO)', 'Enzyme released by neutrophils; elevated MPO associated with oxidative stress and cardiovascular events.', ARRAY['83519'], 'cardiovascular', false, 'Available through Cleveland HeartLab and some reference labs');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000171-0000-0000-0000-000000000000', 'TMAO (Trimethylamine N-Oxide)', 'Gut-derived metabolite associated with increased cardiovascular risk; linked to dietary patterns.', ARRAY['83519'], 'cardiovascular', true, 'Emerging marker; specialty labs; DTC available through some platforms');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000172-0000-0000-0000-000000000000', 'Oxidized LDL', 'Oxidatively modified LDL; promotes atherosclerosis; marker of oxidative stress.', ARRAY['83519'], 'cardiovascular', false, 'Emerging marker; not widely standardized');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000173-0000-0000-0000-000000000000', 'GGT (Gamma-Glutamyl Transferase)', 'Liver enzyme also serving as a cardiovascular risk biomarker; elevated by alcohol, fatty liver, and metabolic syndrome.', ARRAY['82977'], 'cardiovascular', false, 'Elevated GGT is an independent CVD risk factor beyond its liver function role');

-- -------------------------------------------------------
-- SECTION 6: VITAMINS & MINERALS (41 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000174-0000-0000-0000-000000000000', 'Vitamin D, 25-OH (Total)', 'Measures the storage form of Vitamin D; the best overall indicator of vitamin D status.', ARRAY['82306'], 'vitamins', false, 'Most commonly ordered vitamin test; <20 ng/mL deficiency; 20-30 insufficiency; 30-80 optimal');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000175-0000-0000-0000-000000000000', 'Vitamin D, 25-OH (D2 + D3, LC/MS/MS)', 'Mass spectrometry method separating D2 (ergocalciferol) and D3 (cholecalciferol); most accurate method.', ARRAY['82306'], 'vitamins', false, 'Gold standard; distinguishes supplemental D2 from endogenous/supplemental D3');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000176-0000-0000-0000-000000000000', 'Vitamin D, 1,25-Dihydroxy (Active)', 'Active form of Vitamin D; regulated by kidneys; elevated in sarcoidosis and some granulomatous diseases.', ARRAY['82652'], 'vitamins', false, 'Active form; less useful than 25-OH for assessing D status; elevated in granulomatous disease');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000177-0000-0000-0000-000000000000', 'Vitamin B12 (Cobalamin)', 'Essential vitamin for nerve function and red blood cell formation; deficiency causes macrocytic anemia and neuropathy.', ARRAY['82607'], 'vitamins', false, 'Serum B12 may not reflect tissue status; methylmalonic acid is functional B12 test');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000178-0000-0000-0000-000000000000', 'Folate, Serum', 'Water-soluble B vitamin essential for DNA synthesis and cell division; deficiency causes macrocytic anemia.', ARRAY['82746'], 'vitamins', false, 'Important in pregnancy for neural tube defect prevention');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000179-0000-0000-0000-000000000000', 'Folate, RBC', 'Red blood cell folate; reflects longer-term folate status (2-3 months) versus serum folate (days).', ARRAY['82747'], 'vitamins', false, 'More accurate indicator of tissue folate stores than serum folate');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000180-0000-0000-0000-000000000000', 'Vitamin B12 & Folate Panel', 'Combined B12 and folate measurement; complete assessment of these related vitamins.', ARRAY['82607','82746'], 'vitamins', false, 'Ordered together since deficiency of either causes macrocytic anemia');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000181-0000-0000-0000-000000000000', 'Methylmalonic Acid (MMA), Serum', 'Metabolite elevated in functional B12 deficiency even before serum B12 drops; more sensitive than B12 level.', ARRAY['83921'], 'vitamins', false, 'Functional B12 status test; elevated when B12 inadequate at tissue level');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000182-0000-0000-0000-000000000000', 'Methylmalonic Acid (MMA), Urine', 'Urine MMA; sensitive indicator of vitamin B12 functional deficiency.', ARRAY['83921'], 'vitamins', false, 'Less commonly used than serum; 24-hr urine preferred');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000183-0000-0000-0000-000000000000', 'Vitamin B1 (Thiamine)', 'Essential for carbohydrate metabolism and nerve function; deficiency causes Wernicke-Korsakoff syndrome.', ARRAY['84425'], 'vitamins', false, 'At-risk: alcoholics, bariatric surgery patients, eating disorders, IV nutrition');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000184-0000-0000-0000-000000000000', 'Vitamin B2 (Riboflavin)', 'Essential for energy metabolism and antioxidant function; deficiency causes angular cheilitis and glossitis.', ARRAY['84252'], 'vitamins', false, 'Rarely tested in isolation; part of B-complex nutrition panels');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000185-0000-0000-0000-000000000000', 'Vitamin B3 (Niacin/Nicotinic Acid)', 'Essential for energy metabolism; deficiency causes pellagra; excess (therapeutic use) can cause flushing, liver damage.', ARRAY['84591'], 'vitamins', false, 'Measured as niacin, niacinamide, or urinary N-methylnicotinamide');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000186-0000-0000-0000-000000000000', 'Vitamin B5 (Pantothenic Acid)', 'Essential coenzyme for fatty acid synthesis; isolated deficiency very rare.', ARRAY['84591'], 'vitamins', false, 'Not commonly ordered; part of comprehensive nutrition panels');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000187-0000-0000-0000-000000000000', 'Vitamin B6 (Pyridoxine)', 'Essential coenzyme for protein metabolism; deficiency causes peripheral neuropathy and dermatitis.', ARRAY['84207'], 'vitamins', false, 'Excess B6 also causes neuropathy; important to check levels in supplement users');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000188-0000-0000-0000-000000000000', 'Vitamin B7 (Biotin)', 'Essential for fat metabolism; deficiency rare but can be caused by raw egg white consumption; interferes with many lab tests.', ARRAY['82607'], 'vitamins', false, 'High-dose biotin supplements interfere with immunoassay-based lab tests');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000189-0000-0000-0000-000000000000', 'Vitamin A (Retinol)', 'Fat-soluble vitamin essential for vision, immune function, and cell growth; deficiency causes night blindness.', ARRAY['82380'], 'vitamins', true, 'Fat-soluble; stored in liver; toxicity possible with excess supplementation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000190-0000-0000-0000-000000000000', 'Vitamin C (Ascorbic Acid)', 'Water-soluble antioxidant vitamin; deficiency causes scurvy; important for collagen synthesis and immune function.', ARRAY['82180'], 'vitamins', false, 'Rare deficiency in developed countries; at-risk: smokers, malabsorption');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000191-0000-0000-0000-000000000000', 'Vitamin E (Alpha-Tocopherol)', 'Fat-soluble antioxidant; deficiency causes neurological damage; supplement use common.', ARRAY['84446'], 'vitamins', true, 'Fat-soluble; interpret with lipid levels since E is lipid-transported');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000192-0000-0000-0000-000000000000', 'Vitamin K1 (Phylloquinone)', 'Fat-soluble vitamin essential for blood clotting; deficiency causes bleeding; supplementation common.', ARRAY['84597'], 'vitamins', true, 'Dietary vitamin K; primarily from green leafy vegetables');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000193-0000-0000-0000-000000000000', 'Vitamin K2 (Menaquinone)', 'Form of vitamin K involved in calcium metabolism and bone health; may reduce cardiovascular calcification.', ARRAY['84597'], 'vitamins', true, 'Emerging area; less standardized testing than K1');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000194-0000-0000-0000-000000000000', 'Zinc, Serum', 'Essential mineral for immune function, wound healing, and taste/smell; deficiency common in elderly.', ARRAY['84630'], 'minerals', false, 'Serum zinc affected by acute illness and albumin; RBC zinc may be more accurate');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000195-0000-0000-0000-000000000000', 'Copper, Serum', 'Essential mineral for iron metabolism and antioxidant function; deficiency and excess both harmful.', ARRAY['82525'], 'minerals', false, 'Wilson''s disease = excess copper; copper deficiency can mimic B12 deficiency');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000196-0000-0000-0000-000000000000', 'Selenium, Serum', 'Antioxidant mineral essential for thyroid hormone metabolism and immune function.', ARRAY['84255'], 'minerals', false, 'Geographic variation; low in selenium-poor soil areas');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000197-0000-0000-0000-000000000000', 'Magnesium, RBC', 'Red blood cell magnesium; better indicator of intracellular magnesium status than serum magnesium.', ARRAY['83735'], 'minerals', false, 'Preferred functional magnesium marker; reflects intracellular stores more accurately');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000198-0000-0000-0000-000000000000', 'Phosphorus, Serum', 'Electrolyte in bone, energy, and pH regulation; regulated by kidneys, PTH, and vitamin D.', ARRAY['84100'], 'minerals', false, 'Low in malabsorption; high in kidney disease and hypoparathyroidism');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000199-0000-0000-0000-000000000000', 'Chromium', 'Trace mineral enhancing insulin action; deficiency may worsen glucose metabolism.', ARRAY['82495'], 'minerals', false, 'Specialty test; limited standardization; DTC available through some labs');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000200-0000-0000-0000-000000000000', 'Manganese', 'Essential trace mineral for enzyme function; toxicity from industrial exposure.', ARRAY['83785'], 'minerals', false, 'Toxicity monitoring in TPN patients and welders; deficiency rare');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000201-0000-0000-0000-000000000000', 'Molybdenum', 'Ultra-trace mineral; cofactor for several enzymes; isolated deficiency extremely rare.', ARRAY['83986'], 'minerals', false, 'Not commonly ordered; part of comprehensive micronutrient panels');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000202-0000-0000-0000-000000000000', 'Iodine, Serum (Minerals)', 'Mineral essential for thyroid hormone synthesis; deficiency causes goiter and hypothyroidism.', ARRAY['84999'], 'minerals', false, 'Also listed under thyroid; interpretation varies by lab');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000203-0000-0000-0000-000000000000', 'Lithium Level', 'Measures therapeutic lithium for bipolar disorder; narrow therapeutic window.', ARRAY['80178'], 'minerals', false, 'Also listed under drug monitoring; steady-state level 12 hrs post-dose');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000204-0000-0000-0000-000000000000', 'Heavy Metals Panel (Blood)', 'Screens blood for multiple heavy metals including lead, mercury, arsenic, cadmium.', ARRAY['83015'], 'minerals', false, 'Panel approach; specific metals can be ordered individually');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000205-0000-0000-0000-000000000000', 'Lead, Blood', 'Measures lead exposure; screening in children and high-exposure adults.', ARRAY['83655'], 'minerals', false, 'Mandatory screening in children 1-2 years; occupational exposure monitoring');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000206-0000-0000-0000-000000000000', 'Mercury, Blood', 'Measures mercury exposure from seafood, dental amalgam, and industrial sources.', ARRAY['83825'], 'minerals', false, 'Methylmercury from fish most common source');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000207-0000-0000-0000-000000000000', 'Arsenic, Blood/Urine', 'Measures arsenic exposure from contaminated water, food, or occupational sources.', ARRAY['82175'], 'minerals', false, '24-hr urine preferred; speciation (organic vs inorganic) important');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000208-0000-0000-0000-000000000000', 'Cadmium, Blood/Urine', 'Measures cadmium exposure from smoking, industrial exposure, and contaminated food.', ARRAY['82300'], 'minerals', false, 'Kidney tubular damage is main toxicity; urine preferred for chronic exposure');

-- -------------------------------------------------------
-- SECTION 7: KIDNEY & URINARY (25 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000209-0000-0000-0000-000000000000', 'Urinalysis, Complete with Microscopy', 'Comprehensive urine analysis including dipstick, physical properties, and microscopic exam of sediment.', ARRAY['81001'], 'kidney', false, 'Gold standard urinalysis; detects protein, blood, glucose, ketones, bacteria, casts, crystals');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000210-0000-0000-0000-000000000000', 'Urinalysis, Dipstick (Automated)', 'Automated dipstick urinalysis without microscopy; rapid screening for common abnormalities.', ARRAY['81003'], 'kidney', false, 'Less complete than full UA with micro; appropriate for screening');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000211-0000-0000-0000-000000000000', 'Urinalysis, Non-automated', 'Manual dipstick urinalysis; used in low-volume settings.', ARRAY['81002'], 'kidney', false, 'Less commonly used than automated methods');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000212-0000-0000-0000-000000000000', 'Urine Culture, Bacteria', 'Bacterial culture of urine to diagnose urinary tract infection and identify organism and sensitivities.', ARRAY['87086'], 'kidney', false, 'Mid-stream clean-catch specimen required; positive = >100,000 CFU/mL');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000213-0000-0000-0000-000000000000', 'Cystatin C', 'Alternative GFR marker; not affected by muscle mass, more sensitive for early CKD than creatinine.', ARRAY['82610'], 'kidney', false, 'Preferred in elderly, sarcopenic, or muscular patients where creatinine is unreliable');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000214-0000-0000-0000-000000000000', 'eGFR (CKD-EPI)', 'Estimated glomerular filtration rate using CKD-EPI equation; classifies CKD stages 1-5.', '{}', 'kidney', false, 'Standard for CKD staging; <60 for >3 months with kidney damage = CKD');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000215-0000-0000-0000-000000000000', 'Microalbumin, Urine (Random)', 'Detects small amounts of albumin in urine; early sign of kidney damage in diabetes and hypertension.', ARRAY['82043'], 'kidney', false, 'ACR (albumin:creatinine ratio) <30 normal; 30-300 microalbuminuria; >300 macroalbuminuria');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000216-0000-0000-0000-000000000000', 'Microalbumin:Creatinine Ratio (ACR)', 'Albumin-to-creatinine ratio in spot urine; standardizes for urine concentration; preferred microalbumin test.', ARRAY['82043','82570'], 'kidney', false, 'Most clinically useful form of microalbumin testing');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000217-0000-0000-0000-000000000000', 'Protein, Urine (24-hr)', '24-hour urine protein; quantitative protein excretion; diagnosing nephrotic syndrome.', ARRAY['84156'], 'kidney', false, '>3.5 g/24hr = nephrotic range proteinuria');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000218-0000-0000-0000-000000000000', 'Protein, Urine (Spot)', 'Spot urine protein with or without creatinine ratio; more convenient than 24-hr collection.', ARRAY['84156'], 'kidney', false, 'Protein:creatinine ratio >0.2 suggests significant proteinuria');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000219-0000-0000-0000-000000000000', 'Urine Creatinine', 'Urine creatinine measurement; used to standardize other urine measurements (like albumin).', ARRAY['82570'], 'kidney', false, 'Part of ACR and protein:creatinine ratio calculations');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000220-0000-0000-0000-000000000000', 'Osmolality, Urine', 'Measures urine concentration; assesses kidney concentrating ability and hydration status.', ARRAY['83935'], 'kidney', false, 'Paired with serum osmolality in diabetes insipidus evaluation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000221-0000-0000-0000-000000000000', 'Osmolality, Serum', 'Measures blood particle concentration; used in hyponatremia workup and poisoning evaluation.', ARRAY['83930'], 'kidney', false, 'Normal 275-295 mOsm/kg; elevated in dehydration and toxic alcohol ingestion');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000222-0000-0000-0000-000000000000', 'Kidney Function Panel', 'Panel: albumin, CO2, creatinine, glucose, phosphorus, potassium, sodium, BUN, calcium.', ARRAY['80069'], 'kidney', false, 'Less commonly ordered than BMP or CMP; panel components vary');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000223-0000-0000-0000-000000000000', 'Phosphorus, Urine', '24-hour urine phosphorus; assesses renal phosphate handling.', ARRAY['84105'], 'kidney', false, 'Used with serum phosphorus in hyperparathyroidism evaluation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000224-0000-0000-0000-000000000000', 'Calcium, Urine (24-hr)', '24-hour urine calcium; used in kidney stone prevention and hypercalcemia evaluation.', ARRAY['82340'], 'kidney', false, 'Dietary calcium restriction often recommended before collection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000225-0000-0000-0000-000000000000', 'Potassium, Urine', 'Urine potassium; differentiates renal from non-renal causes of potassium disorders.', ARRAY['84133'], 'kidney', false, 'TTKG (trans-tubular K gradient) calculation uses urine and serum K and osmolality');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000226-0000-0000-0000-000000000000', 'Sodium, Urine', 'Urine sodium; used in hyponatremia, acute kidney injury, and dehydration evaluation.', ARRAY['84300'], 'kidney', false, 'FeNa (fractional excretion of sodium) uses serum and urine Na and creatinine');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000227-0000-0000-0000-000000000000', 'Beta-2 Microglobulin, Urine', 'Small protein filtered by glomeruli; elevated in tubular kidney damage and multiple myeloma.', ARRAY['82232'], 'kidney', false, 'Renal tubular dysfunction marker; also tumor marker for lymphoid malignancies');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000228-0000-0000-0000-000000000000', 'Kidney Stone Analysis', 'Chemical analysis of passed kidney stones; identifies stone type (calcium oxalate, uric acid, struvite, cystine).', ARRAY['82355'], 'kidney', false, 'Requires actual stone specimen; not a blood/urine test');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000229-0000-0000-0000-000000000000', '24-Hour Urine Kidney Stone Panel', 'Comprehensive 24-hr urine panel: calcium, oxalate, uric acid, citrate, magnesium, phosphorus, creatinine, sodium.', '{}', 'kidney', false, 'Essential for stone recurrence prevention; multiple CPT codes');

-- -------------------------------------------------------
-- SECTION 8: LIVER & GALLBLADDER (25 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000230-0000-0000-0000-000000000000', 'Hepatic Function Panel (LFTs)', 'Standard liver function panel: albumin, total protein, AST, ALT, ALP, total and direct bilirubin.', ARRAY['80076'], 'liver', false, 'Most comprehensive single liver panel; 7-test panel');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000231-0000-0000-0000-000000000000', 'ALT (Alanine Aminotransferase)', 'Most liver-specific enzyme; elevated in hepatitis, NAFLD, and drug-induced liver injury.', ARRAY['84460'], 'liver', false, 'More liver-specific than AST; primary liver damage marker');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000232-0000-0000-0000-000000000000', 'AST (Aspartate Aminotransferase)', 'Enzyme found in liver, heart, muscle; elevated in liver damage and muscle injury.', ARRAY['84450'], 'liver', false, 'Less specific for liver than ALT; AST:ALT ratio >2:1 suggests alcoholic liver disease');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000233-0000-0000-0000-000000000000', 'ALP (Alkaline Phosphatase)', 'Enzyme in liver, bone, and bile ducts; elevated in cholestatic liver disease, bone disease, and pregnancy.', ARRAY['84075'], 'liver', false, 'Elevated in biliary obstruction, Paget''s disease, and normal in growing children');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000234-0000-0000-0000-000000000000', 'Total Bilirubin', 'Total of direct and indirect bilirubin; measures liver''s ability to process red blood cell breakdown products.', ARRAY['82247'], 'liver', false, 'Elevated in liver disease, hemolysis, and bile duct obstruction');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000235-0000-0000-0000-000000000000', 'Direct Bilirubin (Conjugated)', 'Liver-processed (conjugated) bilirubin; elevated specifically in liver disease and biliary obstruction.', ARRAY['82248'], 'liver', false, 'Helps distinguish obstructive from hemolytic jaundice');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000236-0000-0000-0000-000000000000', 'Indirect Bilirubin (Unconjugated)', 'Calculated as total minus direct bilirubin; elevated in hemolysis and Gilbert''s syndrome.', '{}', 'liver', false, 'High indirect with low direct = hemolysis or Gilbert''s syndrome');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000237-0000-0000-0000-000000000000', 'Albumin, Serum', 'Primary protein made by liver; low albumin indicates chronic liver disease or malnutrition.', ARRAY['82040'], 'liver', false, 'Half-life ~20 days; reflects chronic liver function; acute phase reactant (decreases in illness)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000238-0000-0000-0000-000000000000', 'Total Protein', 'Total serum protein (albumin + globulins); elevated in multiple myeloma; decreased in liver disease.', ARRAY['84155'], 'liver', false, 'Albumin:globulin ratio useful in characterizing protein abnormalities');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000239-0000-0000-0000-000000000000', 'Globulins', 'Calculated as total protein minus albumin; includes immunoglobulins and other proteins.', '{}', 'liver', false, 'Elevated in liver disease, myeloma, autoimmune; low in immunodeficiency');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000240-0000-0000-0000-000000000000', 'Alpha-1 Antitrypsin', 'Liver protein protecting tissues from enzymes; deficiency causes emphysema and liver disease.', ARRAY['82103'], 'liver', false, 'Phenotyping/genotyping needed to confirm deficiency (Pi*ZZ most severe)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000241-0000-0000-0000-000000000000', 'Ammonia', 'Neurotoxin cleared by liver; elevated in hepatic encephalopathy and urea cycle disorders.', ARRAY['82140'], 'liver', false, 'Pre-analytic handling critical (ice, immediate processing); dietary protein affects levels');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000242-0000-0000-0000-000000000000', 'Ceruloplasmin', 'Copper-carrying protein; decreased in Wilson''s disease (copper toxicity); also an acute phase reactant.', ARRAY['82390'], 'liver', false, 'Part of Wilson''s disease workup with serum copper and 24-hr urine copper');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000243-0000-0000-0000-000000000000', 'Copper, Serum (Liver)', 'Elevated in Wilson''s disease (paradoxically can be low) and cholestatic liver disease.', ARRAY['82525'], 'liver', false, 'Interpret with ceruloplasmin; 24-hr urine copper most sensitive for Wilson''s');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000244-0000-0000-0000-000000000000', 'FibroSure/FibroTest', 'Calculated fibrosis score using multiple biomarkers; non-invasive liver fibrosis assessment.', '{}', 'liver', false, 'Panel of 6 biomarkers; proprietary algorithm; alternative to liver biopsy');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000245-0000-0000-0000-000000000000', 'FIB-4 Score (Calculated)', 'Non-invasive fibrosis calculation using age, AST, ALT, and platelet count.', '{}', 'liver', false, 'Free calculation; excellent for NAFLD/NASH fibrosis screening');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000246-0000-0000-0000-000000000000', 'LD (Lactate Dehydrogenase) - Liver', 'Enzyme in many tissues including liver; elevated in liver injury, hemolysis, and cancer.', ARRAY['83615'], 'liver', false, 'Non-specific; elevated in many conditions');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000247-0000-0000-0000-000000000000', '5-Nucleotidase', 'Enzyme more specific than ALP for liver disease vs. bone disease.', ARRAY['84255'], 'liver', false, 'Elevated with ALP in cholestatic liver disease but NOT in bone disease');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000248-0000-0000-0000-000000000000', 'Bile Acids, Serum', 'Produced by liver from cholesterol; elevated in cholestatic liver disease and intrahepatic cholestasis of pregnancy.', ARRAY['82239'], 'liver', false, 'Sensitive early marker of cholestasis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000249-0000-0000-0000-000000000000', 'Alkaline Phosphatase Isoenzymes', 'Differentiates liver vs. bone vs. placental ALP isoenzymes when ALP is elevated.', ARRAY['84080'], 'liver', false, 'Useful when ALP elevated to determine organ source');

-- -------------------------------------------------------
-- SECTION 9: IMMUNE & INFLAMMATION (24 + 8 = 32 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000250-0000-0000-0000-000000000000', 'hs-CRP (High Sensitivity) - Inflammation', 'Highly sensitive CRP for cardiovascular risk; also monitors subclinical inflammation.', ARRAY['86141'], 'inflammation', false, '<1 low, 1-3 average, >3 high cardiovascular risk');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000251-0000-0000-0000-000000000000', 'CRP, Quantitative', 'Standard CRP for monitoring infection and inflammatory conditions; less sensitive than hs-CRP.', ARRAY['86140'], 'inflammation', false, 'Rises within 4-6 hours of acute inflammation; peaks at 24-72 hours');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000252-0000-0000-0000-000000000000', 'ESR (Sed Rate, Westergren)', 'Non-specific inflammation marker; slower responding than CRP; used in GCA, PMR, and autoimmune monitoring.', ARRAY['85652'], 'inflammation', false, 'Slower to rise and fall than CRP; age and sex affect normal values');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000253-0000-0000-0000-000000000000', 'Procalcitonin (PCT)', 'Peptide elevated specifically in bacterial infection and sepsis; helps guide antibiotic therapy decisions.', ARRAY['84145'], 'inflammation', false, '<0.25 ng/mL argues against bacterial infection; >0.5 suggests bacterial sepsis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000254-0000-0000-0000-000000000000', 'Interleukin-6 (IL-6)', 'Inflammatory cytokine; elevated in sepsis, COVID-19, rheumatoid arthritis, and cytokine storm.', ARRAY['83519'], 'inflammation', false, 'Measured with specific IL-6 immunoassay; emerging clinical utility');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000255-0000-0000-0000-000000000000', 'TNF-Alpha', 'Pro-inflammatory cytokine; research use; monitoring in inflammatory bowel disease and rheumatic disease treatment.', ARRAY['83519'], 'inflammation', false, 'Limited clinical standardization; more research-oriented');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000256-0000-0000-0000-000000000000', 'Ferritin (Inflammation)', 'High ferritin as acute phase reactant; marker of severe inflammatory conditions and hemophagocytic syndrome.', ARRAY['82728'], 'inflammation', false, 'Extremely elevated ferritin (>10,000) seen in HLH, Still''s disease, sepsis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000257-0000-0000-0000-000000000000', 'White Blood Cell Differential', 'Part of CBC; identifies increased neutrophils (infection), lymphocytes (viral), eosinophils (allergy/parasites).', ARRAY['85025'], 'inflammation', false, 'CBC w/diff gives this information; key for characterizing inflammation type');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000258-0000-0000-0000-000000000000', 'Complement C3', 'Complement protein; decreased in active lupus and complement deficiency; elevated in acute inflammation.', ARRAY['86160'], 'immune', false, 'Classic complement pathway; low in active SLE with renal involvement');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000259-0000-0000-0000-000000000000', 'Complement C4', 'Complement protein; decreased in active SLE and hereditary C4 deficiency; also acute phase protein.', ARRAY['86161'], 'immune', false, 'Low C4 more specific for SLE activity than C3; also low in angioedema (HAE)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000260-0000-0000-0000-000000000000', 'Total Complement (CH50)', 'Functional test of the entire classic complement pathway; screens for complement component deficiencies.', ARRAY['86162'], 'immune', false, 'Low CH50 indicates deficiency in one or more complement components');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000261-0000-0000-0000-000000000000', 'Immunoglobulin G (IgG)', 'Most abundant antibody class; deficiency causes recurrent infections; elevated in autoimmune and chronic infection.', ARRAY['82784'], 'immune', false, 'Includes 4 subclasses (IgG1-4); can be measured individually');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000262-0000-0000-0000-000000000000', 'Immunoglobulin A (IgA)', 'Primary mucosal antibody; deficiency common (1:500); associated with celiac disease and recurrent GI/respiratory infections.', ARRAY['82784'], 'immune', false, 'IgA deficiency is most common primary immunodeficiency');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000263-0000-0000-0000-000000000000', 'Immunoglobulin M (IgM)', 'First antibody class produced in new infections; pentameric structure; elevated in Waldenstrom''s.', ARRAY['82784'], 'immune', false, 'Elevated IgM in primary infection, Waldenstrom''s macroglobulinemia');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000264-0000-0000-0000-000000000000', 'Immunoglobulin E (IgE), Total', 'Antibody associated with allergic reactions and parasitic infections; elevated in allergic disease.', ARRAY['82785'], 'immune', false, 'Total IgE screening; specific IgE tests needed to identify triggers');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000265-0000-0000-0000-000000000000', 'Immunoglobulin G Subclasses (IgG1-4)', 'Individual IgG subclass levels; IgG4 subclass deficiency associated with recurrent respiratory infections.', ARRAY['82787'], 'immune', false, 'IgG2 deficiency associated with impaired polysaccharide response');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000266-0000-0000-0000-000000000000', 'CD4/CD8 Ratio (T-cell subsets)', 'Counts T-helper (CD4) and cytotoxic (CD8) T cells; monitors HIV progression and immune status.', ARRAY['86360'], 'immune', false, 'CD4 count critical in HIV management; <200 defines AIDS');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000267-0000-0000-0000-000000000000', 'Natural Killer (NK) Cells', 'Measures natural killer cell count; part of lymphocyte subset panel in immune deficiency evaluation.', ARRAY['86355'], 'immune', false, 'Part of complete lymphocyte subset panel');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000268-0000-0000-0000-000000000000', 'Beta-2 Microglobulin', 'Small protein on all nucleated cells; elevated in lymphoma, multiple myeloma, and kidney disease.', ARRAY['82232'], 'immune', false, 'Disease activity marker in multiple myeloma');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000269-0000-0000-0000-000000000000', 'Protein Electrophoresis (SPEP)', 'Separates serum proteins into fractions; detects monoclonal proteins (M-protein) in myeloma.', ARRAY['84165'], 'immune', false, 'Screening for multiple myeloma and Waldenstrom''s; M-spike on SPEP is diagnostic clue');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000270-0000-0000-0000-000000000000', 'Immunofixation (IFE/Immunoelectrophoresis)', 'Identifies specific protein class responsible for M-spike found on SPEP; confirms myeloma diagnosis.', ARRAY['86334'], 'immune', false, 'More specific than SPEP; identifies IgG, IgA, IgM, IgD, IgE myeloma types');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000271-0000-0000-0000-000000000000', 'Serum Free Light Chains (Kappa/Lambda)', 'Measures kappa and lambda light chains and their ratio; sensitive myeloma and light chain disease screen.', ARRAY['83519'], 'immune', false, 'Kappa:lambda ratio abnormality detected in light chain myeloma where SPEP may be negative');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000272-0000-0000-0000-000000000000', 'Immunoglobulin D (IgD)', 'Rare immunoglobulin class; elevated in IgD myeloma (rare) and may be elevated in infection.', ARRAY['82784'], 'immune', false, 'Rarely tested; IgD myeloma is uncommon');

-- -------------------------------------------------------
-- SECTION 10: AUTOIMMUNE (31 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000273-0000-0000-0000-000000000000', 'ANA (Antinuclear Antibody) Screen, IFA', 'Screens for antibodies against cell nuclei; positive in lupus, Sjogren''s, scleroderma, and other autoimmune diseases.', ARRAY['86038'], 'autoimmune', false, 'First-line screening test; IFA (HEp-2 cells) is gold standard method; titer and pattern reported');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000274-0000-0000-0000-000000000000', 'ANA Titer & Pattern', 'Quantitative ANA with staining pattern (homogeneous, speckled, nucleolar, centromere); guides specific antibody testing.', ARRAY['86039'], 'autoimmune', false, 'Pattern guides follow-up: homogeneous = anti-dsDNA; speckled = anti-Smith; centromere = anti-centromere');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000275-0000-0000-0000-000000000000', 'Anti-dsDNA (Double-Stranded DNA Antibody)', 'Highly specific for systemic lupus erythematosus (SLE); titer correlates with disease activity.', ARRAY['86225'], 'autoimmune', false, 'Titer fluctuates with disease activity; rising titer predicts lupus flare');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000276-0000-0000-0000-000000000000', 'Anti-Smith (Sm) Antibody', 'Highly specific for lupus (SLE); does not fluctuate with disease activity like anti-dsDNA.', ARRAY['86235'], 'autoimmune', false, 'High specificity (~99%); lower sensitivity (~25-30%) for SLE');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000277-0000-0000-0000-000000000000', 'Anti-SSA/Ro Antibody', 'Associated with Sjogren''s syndrome, lupus, and neonatal lupus/heart block in offspring.', ARRAY['86235'], 'autoimmune', false, 'Can cross placenta causing neonatal lupus and congenital heart block');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000278-0000-0000-0000-000000000000', 'Anti-SSB/La Antibody', 'Associated with Sjogren''s syndrome; usually found with anti-SSA; more specific for Sjogren''s.', ARRAY['86235'], 'autoimmune', false, 'Rarely positive without anti-SSA; high specificity for primary Sjogren''s');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000279-0000-0000-0000-000000000000', 'Anti-Scl-70 (Anti-Topoisomerase I)', 'Highly specific for diffuse cutaneous systemic sclerosis (scleroderma); associated with pulmonary fibrosis.', ARRAY['86235'], 'autoimmune', false, 'Diffuse scleroderma marker; ILD more common when positive');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000280-0000-0000-0000-000000000000', 'Anti-Centromere Antibody', 'Associated with limited cutaneous scleroderma (CREST syndrome); relatively disease-specific.', ARRAY['86235'], 'autoimmune', false, 'CREST syndrome: Calcinosis, Raynaud''s, Esophageal dysmotility, Sclerodactyly, Telangiectasia');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000281-0000-0000-0000-000000000000', 'Anti-Jo-1 (Anti-Histidyl-tRNA Synthetase)', 'Associated with polymyositis/dermatomyositis and antisynthetase syndrome (ILD + myositis + arthritis).', ARRAY['86235'], 'autoimmune', false, 'Part of myositis-specific antibody panel; antisynthetase syndrome marker');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000282-0000-0000-0000-000000000000', 'Rheumatoid Factor (RF)', 'Autoantibody against IgG; elevated in rheumatoid arthritis, Sjogren''s, and other inflammatory conditions.', ARRAY['86431'], 'autoimmune', false, '70-80% sensitivity for RA; less specific than anti-CCP; can be positive in many conditions');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000283-0000-0000-0000-000000000000', 'Anti-CCP (Cyclic Citrullinated Peptide)', 'Highly specific (~98%) antibody for rheumatoid arthritis; positive early before symptoms in some.', ARRAY['86200'], 'autoimmune', false, 'Most specific autoantibody for RA; may precede clinical disease by years');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000284-0000-0000-0000-000000000000', 'Anti-MPO (p-ANCA)', 'Antibody against myeloperoxidase; positive in microscopic polyangiitis and Churg-Strauss syndrome.', ARRAY['86596'], 'autoimmune', false, 'p-ANCA pattern on IFA; confirms MPO specificity');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000285-0000-0000-0000-000000000000', 'Anti-PR3 (c-ANCA)', 'Antibody against proteinase-3; highly specific for granulomatosis with polyangiitis (GPA/Wegener''s).', ARRAY['86596'], 'autoimmune', false, 'c-ANCA pattern on IFA; anti-PR3 is the specific antigen');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000286-0000-0000-0000-000000000000', 'ANCA, IFA', 'Screens for antineutrophil cytoplasmic antibodies; positive result prompts MPO and PR3 specific testing.', ARRAY['86596'], 'autoimmune', false, 'Screening test; positive IFA requires reflex to anti-MPO and anti-PR3');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000287-0000-0000-0000-000000000000', 'Anticardiolipin Antibody, IgG/IgM/IgA', 'Phospholipid antibodies associated with antiphospholipid syndrome (thrombosis and pregnancy loss).', ARRAY['86147'], 'autoimmune', false, 'Part of APS workup; must be positive on 2 occasions >=12 weeks apart');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000288-0000-0000-0000-000000000000', 'Anti-Beta-2 Glycoprotein I IgG/IgM', 'More specific antiphospholipid antibody for APS than anticardiolipin alone.', ARRAY['86148'], 'autoimmune', false, 'Part of APS workup; 3-test panel with anticardiolipin and lupus anticoagulant');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000289-0000-0000-0000-000000000000', 'HLA-B27', 'Genetic marker strongly associated with ankylosing spondylitis and other spondyloarthropathies.', ARRAY['86812'], 'autoimmune', false, '~90% of ankylosing spondylitis patients are HLA-B27 positive; not diagnostic alone');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000290-0000-0000-0000-000000000000', 'Anti-Histone Antibody', 'Associated with drug-induced lupus erythematosus (DILE).', ARRAY['86235'], 'autoimmune', false, 'Very sensitive for drug-induced lupus; hydralazine and procainamide most common causes');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000291-0000-0000-0000-000000000000', 'Anti-Ribosomal P Antibody', 'Specific for SLE, especially neuropsychiatric lupus (psychosis, depression).', ARRAY['86235'], 'autoimmune', false, 'Associated with lupus cerebritis and psychiatric manifestations');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000292-0000-0000-0000-000000000000', 'Anti-Ro52 Antibody', 'Ro52 antigen (different from Ro60/SSA); associated with myositis, Sjogren''s, and ILD.', ARRAY['86235'], 'autoimmune', false, 'Distinguish from Ro60 (classic SSA); increasingly measured separately');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000293-0000-0000-0000-000000000000', 'Myositis Panel', 'Panel of myositis-specific antibodies: anti-Jo-1, anti-Mi-2, anti-SRP, anti-MDA5, anti-TIF1g, and others.', ARRAY['86235'], 'autoimmune', false, 'Multiple individual CPT codes; helps classify inflammatory myopathy subtype');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000294-0000-0000-0000-000000000000', 'Sjogren''s Syndrome Panel', 'Includes anti-SSA (Ro), anti-SSB (La), and minor salivary gland biopsy (Schirmer''s test).', ARRAY['86235'], 'autoimmune', false, 'Serology alone not sufficient for diagnosis; requires clinical criteria');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000295-0000-0000-0000-000000000000', 'Systemic Sclerosis Panel', 'Anti-topoisomerase I (Scl-70), anti-centromere, anti-RNA polymerase III for scleroderma subtyping.', ARRAY['86235'], 'autoimmune', false, 'Multiple antibodies guide treatment and prognosis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000296-0000-0000-0000-000000000000', 'Anti-GBM (Anti-Glomerular Basement Membrane)', 'Causes Goodpasture syndrome (pulmonary hemorrhage + glomerulonephritis).', ARRAY['86200'], 'autoimmune', false, 'Rare but life-threatening; anti-GBM and MPO-ANCA can co-occur');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000297-0000-0000-0000-000000000000', 'Cryoglobulins', 'Proteins that precipitate in cold; associated with hepatitis C, lymphoma, and autoimmune disease.', ARRAY['82595'], 'autoimmune', false, 'Requires special handling (keep warm until processed); mixed cryoglobulinemia most common');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000298-0000-0000-0000-000000000000', 'Anti-Neutrophil Cytoplasmic Antibody (MPO+PR3)', 'Combined test for both ANCA specificities; used in vasculitis evaluation.', ARRAY['86596'], 'autoimmune', false, 'Usually followed by specific antigen testing');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000299-0000-0000-0000-000000000000', 'Immunological (Allergy) Workup - Total IgE', 'Total immunoglobulin E; elevated in allergic disease and parasitic infection.', ARRAY['82785'], 'autoimmune', false, 'Screening test; specific allergen IgE testing needed to identify triggers');

-- -------------------------------------------------------
-- SECTION 11: INFECTIOUS DISEASE (59 tests)
-- -------------------------------------------------------

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000300-0000-0000-0000-000000000000', 'HIV 1+2 Antibody', 'Detects antibodies to HIV-1 and HIV-2; 4th-generation test (antigen+antibody) now standard.', ARRAY['86703'], 'infectious', false, '4th gen Ag/Ab combo (87389) detects earlier than 3rd gen Ab only test');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000301-0000-0000-0000-000000000000', 'HIV Ag/Ab 4th Generation (Combo)', 'Detects both HIV p24 antigen and HIV-1/2 antibodies; earliest available HIV test.', ARRAY['87389'], 'infectious', false, 'Window period ~18 days vs ~22 days for 3rd gen; FDA-recommended standard');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000302-0000-0000-0000-000000000000', 'HIV RNA (Viral Load)', 'Quantifies HIV viral RNA; monitors treatment efficacy and detects acute infection before antibody.', ARRAY['87536'], 'infectious', false, 'Undetectable VL is the treatment goal (<20-50 copies/mL depending on assay)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000303-0000-0000-0000-000000000000', 'HIV p24 Antigen', 'HIV core protein; detectable during acute infection before antibody seroconversion.', ARRAY['87389'], 'infectious', false, 'Usually included in 4th gen Ag/Ab combo test');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000304-0000-0000-0000-000000000000', 'Chlamydia (NAAT)', 'Nucleic acid amplification test for Chlamydia trachomatis; most sensitive STI test available.', ARRAY['87491'], 'infectious', false, 'Most sensitive method; urine or swab specimen');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000305-0000-0000-0000-000000000000', 'Gonorrhea (NAAT)', 'Nucleic acid amplification test for Neisseria gonorrhoeae; most sensitive STI test available.', ARRAY['87591'], 'infectious', false, 'Usually ordered with chlamydia NAAT; urine or swab');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000306-0000-0000-0000-000000000000', 'CT/NG NAAT (Combined)', 'Combined chlamydia and gonorrhea NAAT; most common STI panel component.', ARRAY['87491','87591'], 'infectious', false, 'Standard STI screening panel component');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000307-0000-0000-0000-000000000000', 'Syphilis, RPR (Non-Treponemal)', 'Non-specific syphilis screening test; titers correlate with disease activity and treatment response.', ARRAY['86592'], 'infectious', false, 'Screening test; positive result requires FTA-ABS or TP-PA for confirmation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000308-0000-0000-0000-000000000000', 'Syphilis, FTA-ABS (Treponemal)', 'Confirmatory treponemal-specific syphilis test; remains positive for life after infection.', ARRAY['86780'], 'infectious', false, 'Confirmatory test; used to confirm positive RPR; remains positive even after treatment');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000309-0000-0000-0000-000000000000', 'Syphilis, Total Antibody (TPPA/EIA)', 'Newer treponemal-specific syphilis test; used in reverse testing algorithms.', ARRAY['86780'], 'infectious', false, 'Reverse algorithm: treponemal first, then RPR for confirmation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000310-0000-0000-0000-000000000000', 'Herpes Simplex Virus 1 IgG', 'Detects past HSV-1 infection (commonly oral herpes); most adults are seropositive.', ARRAY['86695'], 'infectious', false, 'High prevalence (67-80% globally); positive does not distinguish oral from genital infection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000311-0000-0000-0000-000000000000', 'Herpes Simplex Virus 2 IgG', 'Detects past HSV-2 infection (primarily genital herpes); type-specific serology.', ARRAY['86696'], 'infectious', false, 'Type-specific HSV-2 IgG: positive indicates prior genital HSV-2 infection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000312-0000-0000-0000-000000000000', 'Herpes Simplex 1+2 IgM', 'Detects recent/active HSV infection; less reliable than IgG due to cross-reactivity issues.', ARRAY['86694'], 'infectious', false, 'Low specificity for primary HSV; PCR preferred for active lesions');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000313-0000-0000-0000-000000000000', 'HSV PCR (Herpes Simplex DNA)', 'Most sensitive test for active herpes lesions; detects HSV DNA directly.', ARRAY['87529'], 'infectious', false, 'Specimen from swab of active lesion or CSF; gold standard for active disease');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000314-0000-0000-0000-000000000000', 'Hepatitis A, Total Antibody (HAV Ab)', 'Detects total hepatitis A antibodies; distinguishes past infection from vaccination.', ARRAY['86708'], 'infectious', false, 'Total Ab = IgM + IgG; positive after infection and vaccination');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000315-0000-0000-0000-000000000000', 'Hepatitis A IgM', 'IgM antibody indicates current or very recent hepatitis A infection.', ARRAY['86709'], 'infectious', false, 'Positive in acute HAV infection; remains positive for ~3-6 months');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000316-0000-0000-0000-000000000000', 'Hepatitis A IgG', 'IgG antibody indicates past HAV infection or vaccination; provides immunity.', ARRAY['86708'], 'infectious', false, 'Positive after recovery from infection or successful vaccination');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000317-0000-0000-0000-000000000000', 'Hepatitis B Surface Antigen (HBsAg)', 'Active hepatitis B infection marker; positive in acute and chronic HBV.', ARRAY['87340'], 'infectious', false, 'First marker to become positive in HBV; persists in chronic infection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000318-0000-0000-0000-000000000000', 'Hepatitis B Surface Antibody (anti-HBs)', 'Immunity marker; positive after HBV vaccination or recovery from acute infection.', ARRAY['86706'], 'infectious', false, 'Level >10 mIU/mL indicates protective immunity');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000319-0000-0000-0000-000000000000', 'Hepatitis B Core Antibody, Total (anti-HBc)', 'Antibody to hepatitis B core antigen; positive in past or current HBV infection but NOT after vaccination.', ARRAY['86704'], 'infectious', false, 'Helps distinguish vaccination (negative) from past infection (positive)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000320-0000-0000-0000-000000000000', 'Hepatitis B Core IgM (anti-HBc IgM)', 'IgM antibody to HBc antigen; marker of acute or reactivating HBV infection.', ARRAY['86705'], 'infectious', false, 'Positive in window period and acute HBV; may be positive in reactivation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000321-0000-0000-0000-000000000000', 'Hepatitis B e Antigen (HBeAg)', 'Viral protein indicating high HBV replication and infectivity.', ARRAY['87350'], 'infectious', false, 'Positive = high viral replication; e seroconversion marks reduced activity');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000322-0000-0000-0000-000000000000', 'Hepatitis B e Antibody (anti-HBe)', 'Antibody to HBe antigen; positive after e seroconversion; indicates reduced HBV replication.', ARRAY['86707'], 'infectious', false, 'e seroconversion associated with better prognosis');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000323-0000-0000-0000-000000000000', 'Hepatitis B DNA (HBV Viral Load)', 'Quantitative HBV DNA; monitors antiviral treatment response and replication status.', ARRAY['87517'], 'infectious', false, 'High HBV DNA + HBeAg = high infectivity; goal of treatment is VL suppression');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000324-0000-0000-0000-000000000000', 'Hepatitis B Panel', 'Comprehensive HBV panel: HBsAg, anti-HBs, anti-HBc; screens for infection, immunity, and past exposure.', ARRAY['87340','86706','86704'], 'infectious', false, 'Standard hepatitis B workup');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000325-0000-0000-0000-000000000000', 'Hepatitis C Antibody', 'Screens for past or current HCV infection; positive result requires RNA confirmation.', ARRAY['86803'], 'infectious', false, 'May remain positive for life after cleared infection; positive = confirm with HCV RNA');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000326-0000-0000-0000-000000000000', 'Hepatitis C RNA (Viral Load)', 'Detects and quantifies HCV RNA; confirms active infection and monitors treatment.', ARRAY['87522'], 'infectious', false, 'Undetectable HCV RNA confirms cure (SVR12)');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000327-0000-0000-0000-000000000000', 'Hepatitis C Genotype', 'Identifies HCV genotype (1-6) and subtype; guides selection of direct-acting antiviral therapy.', ARRAY['87902'], 'infectious', false, 'Genotype 1 most common in US; guides DAA treatment selection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000328-0000-0000-0000-000000000000', 'Hepatitis D Antibody (HDV)', 'Detects hepatitis D virus antibody; HDV only infects HBV-positive patients.', ARRAY['86692'], 'infectious', false, 'Only relevant in HBsAg-positive patients; coinfection or superinfection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000329-0000-0000-0000-000000000000', 'Hepatitis E Antibody', 'Detects past HEV infection; primarily fecal-oral transmission; rare in US but endemic in developing countries.', ARRAY['86699'], 'infectious', false, 'IgM indicates acute HEV; IgG indicates past infection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000330-0000-0000-0000-000000000000', 'Trichomonas (NAAT)', 'Most sensitive test for Trichomonas vaginalis; nucleic acid amplification.', ARRAY['87661'], 'infectious', false, 'NAAT more sensitive than wet prep; available in urine and vaginal/urethral swab');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000331-0000-0000-0000-000000000000', 'Mycoplasma genitalium (NAAT)', 'Emerging STI pathogen associated with urethritis and cervicitis; increasingly resistant to antibiotics.', ARRAY['87563'], 'infectious', false, 'Not part of standard STI panels but becoming more available');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000332-0000-0000-0000-000000000000', 'Bacterial Vaginosis (BV) Testing', 'Molecular test for BV-associated bacteria (NAAT); more sensitive than Amsel criteria.', ARRAY['87510'], 'infectious', false, 'Some DTC platforms offer vaginal swab for self-collection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000333-0000-0000-0000-000000000000', 'QuantiFERON-TB Gold Plus (IGRA)', 'Interferon-gamma release assay (IGRA) for tuberculosis infection; blood test alternative to TB skin test.', ARRAY['86480'], 'infectious', false, 'Preferred over TB skin test for BCG-vaccinated individuals');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000334-0000-0000-0000-000000000000', 'T-SPOT.TB', 'Alternative IGRA for tuberculosis; enumerates T cells responding to TB antigens.', ARRAY['86481'], 'infectious', false, 'Alternative to QuantiFERON; similar accuracy');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000335-0000-0000-0000-000000000000', 'TB Skin Test (PPD)', 'Intradermal purified protein derivative injection; read 48-72 hours later for TB exposure.', ARRAY['86580'], 'infectious', false, 'False positives with BCG vaccine; IGRA preferred in vaccinated individuals');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000336-0000-0000-0000-000000000000', 'CMV IgG/IgM', 'Cytomegalovirus antibodies; IgM = recent infection; IgG = past exposure; important in pregnancy and immunosuppression.', ARRAY['86644','86645'], 'infectious', false, 'CMV = most common congenital infection; critical in organ transplant recipients');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000337-0000-0000-0000-000000000000', 'EBV Panel (Mono)', 'Epstein-Barr virus antibody panel including VCA IgM, VCA IgG, and EBNA; diagnoses mono and past infection.', ARRAY['86663','86664','86665'], 'infectious', false, 'VCA IgM positive = acute mononucleosis; EBNA negative = acute; positive = past');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000338-0000-0000-0000-000000000000', 'Varicella Zoster Antibody (IgG)', 'Detects immunity to chickenpox/shingles virus; used to confirm immunity in healthcare workers and pregnancy.', ARRAY['86787'], 'infectious', false, 'Required for healthcare worker immunity verification; DTC commonly available');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000339-0000-0000-0000-000000000000', 'Rubella IgG', 'Detects rubella immunity; critical in women of childbearing age due to congenital rubella risk.', ARRAY['86762'], 'infectious', false, 'Required prenatal test; titer >10 IU/mL indicates protective immunity');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000340-0000-0000-0000-000000000000', 'Measles Antibody (Rubeola IgG)', 'Detects measles immunity; used to confirm vaccine-induced immunity.', ARRAY['86765'], 'infectious', false, 'Waning vaccine immunity a public health concern; titer-based immunity confirmation');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000341-0000-0000-0000-000000000000', 'Mumps Antibody (IgG)', 'Detects mumps immunity after vaccination or infection.', ARRAY['86735'], 'infectious', false, 'Part of MMR immunity panel for healthcare workers and travelers');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000342-0000-0000-0000-000000000000', 'Influenza Antibody', 'Serologic detection of influenza antibodies; research and surveillance use.', ARRAY['86710'], 'infectious', false, 'Rapid antigen tests or PCR used clinically; antibody testing mainly research');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000343-0000-0000-0000-000000000000', 'Lyme Disease Antibody (ELISA)', 'First-tier Lyme disease screening test; detects antibodies to Borrelia burgdorferi.', ARRAY['86618'], 'infectious', false, '2-tier testing required: positive ELISA must be confirmed with Western blot');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000344-0000-0000-0000-000000000000', 'Lyme Western Blot (IgM/IgG)', 'Confirmatory Lyme disease test after positive ELISA; identifies specific Borrelia antibody bands.', ARRAY['86617'], 'infectious', false, 'CDC criteria: IgM (2/3 bands) for early; IgG (5/10 bands) for late Lyme');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000345-0000-0000-0000-000000000000', 'Rocky Mountain Spotted Fever (RMSF)', 'Rickettsia rickettsii antibodies; serious tick-borne illness requiring early treatment.', ARRAY['86000'], 'infectious', false, 'IgG titer >=1:64 supports diagnosis; acute + convalescent titers most informative');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000346-0000-0000-0000-000000000000', 'West Nile Virus IgM/IgG', 'Detects West Nile virus antibodies; IgM indicates recent infection during mosquito season.', ARRAY['86789'], 'infectious', false, 'CSF IgM most specific for neuroinvasive disease; serum IgM used for systemic infection');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000347-0000-0000-0000-000000000000', 'SARS-CoV-2 Antibody (COVID-19)', 'Detects antibodies to COVID-19; indicates past infection or vaccination; does not diagnose active infection.', ARRAY['86769'], 'infectious', false, 'Nucleocapsid Ab = prior infection; Spike Ab = infection or vaccination');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000348-0000-0000-0000-000000000000', 'SARS-CoV-2 PCR (COVID-19)', 'Detects COVID-19 RNA; definitive test for active COVID-19 infection.', ARRAY['87635'], 'infectious', false, 'Gold standard for active infection diagnosis; NP swab most common specimen');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000349-0000-0000-0000-000000000000', 'Strep A, Culture/RIDT', 'Tests for Group A Streptococcus causing strep throat; rapid antigen test or culture.', ARRAY['87430','87880'], 'infectious', false, 'Rapid test (87880) has lower sensitivity; negative rapid test in children should be cultured');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000350-0000-0000-0000-000000000000', 'Strep B (GBS) Culture', 'Group B Streptococcus culture; essential screening in pregnancy at 35-37 weeks.', ARRAY['87081'], 'infectious', false, 'Required prenatal test; GBS colonization requires intrapartum antibiotics');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000351-0000-0000-0000-000000000000', 'Urinary Tract Infection Culture', 'Bacterial culture of urine to identify causative organisms and antibiotic sensitivities.', ARRAY['87086'], 'infectious', false, 'Mid-stream clean-catch specimen; susceptibility testing guides antibiotic choice');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000352-0000-0000-0000-000000000000', 'Blood Culture', 'Cultures blood for bacteria or yeast; definitive test for bacteremia and septicemia.', ARRAY['87040'], 'infectious', false, 'Requires sterile collection; 2 sets from different sites standard practice');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000353-0000-0000-0000-000000000000', 'Mono Spot (Heterophile Antibody)', 'Rapid screening test for infectious mononucleosis (EBV); detects heterophile antibodies.', ARRAY['86308'], 'infectious', false, 'False negatives common in early disease and in children <12; confirm with EBV panel if negative');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000354-0000-0000-0000-000000000000', 'Toxoplasma IgG/IgM', 'Detects toxoplasma antibodies; important in pregnancy (congenital toxo risk) and immunocompromised.', ARRAY['86777','86778'], 'infectious', false, 'IgM indicates recent/active infection; IgG indicates past exposure');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000355-0000-0000-0000-000000000000', 'H. Pylori Antibody (IgG)', 'Detects antibodies to H. pylori; indicates past or current infection.', ARRAY['86677'], 'infectious', false, 'Remains positive after treatment; not useful for confirming eradication');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000356-0000-0000-0000-000000000000', 'H. Pylori Antigen, Stool', 'Detects H. pylori antigens in stool; excellent for diagnosis and confirming eradication.', ARRAY['87338'], 'infectious', false, 'Preferred over antibody test for confirming treatment success; wait 4 weeks after antibiotics');

INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)
VALUES ('a0000357-0000-0000-0000-000000000000', 'H. Pylori Breath Test (UBT)', 'Urea breath test for active H. pylori infection; non-invasive and highly accurate.', ARRAY['83013','83014'], 'infectious', false, 'Gold standard non-invasive test for H. pylori');

-- ============================================================
-- LABS (10 DTC providers)
-- ============================================================
-- Pricing researched Feb 2025 from provider websites, findlabtest.com,
-- shayahealth.com/quest-labs-via-ulta, and the PMC DTC pricing study
-- (PMC11663041). Prices reflect typical self-pay / cash-pay consumer
-- rates and may fluctuate with promotions.

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000001-0000-0000-0000-000000000000', 'QuestDirect', 'https://www.questhealth.com', 'direct', NULL, NULL, 'Quest Diagnostics consumer-direct platform; results in 1-2 days; 2,100+ locations nationwide');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000002-0000-0000-0000-000000000000', 'Labcorp OnDemand', 'https://www.ondemand.labcorp.com', 'direct', NULL, NULL, 'Labcorp consumer-direct platform; 2,000+ locations; results in 1-3 days');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000003-0000-0000-0000-000000000000', 'Ulta Lab Tests', 'https://www.ultalabtests.com', 'intermediary', 'Quest', NULL, 'Uses Quest Diagnostics network; generally lowest DTC prices; not available in NY, NJ, RI');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000004-0000-0000-0000-000000000000', 'Walk-In Lab', 'https://www.walkinlab.com', 'intermediary', 'Quest,Labcorp', NULL, 'Uses both Quest and Labcorp networks; competitive pricing; broad test selection');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000005-0000-0000-0000-000000000000', 'HealthLabs.com', 'https://www.healthlabs.com', 'intermediary', 'Quest,Labcorp', NULL, 'Uses Quest and Labcorp; strong panel bundling; results in 1-3 days');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000006-0000-0000-0000-000000000000', 'Request A Test', 'https://requestatest.com', 'intermediary', 'Quest,Labcorp', NULL, 'Uses Quest and Labcorp networks; offers both individual tests and discounted panels');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000007-0000-0000-0000-000000000000', 'Private MD Labs', 'https://www.privatemdlabs.com', 'intermediary', 'Labcorp', NULL, 'Primarily uses Labcorp network; popular for hormone panels; higher individual test prices');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000008-0000-0000-0000-000000000000', 'DirectLabs', 'https://directlabs.com', 'intermediary', 'Quest', NULL, 'Uses Quest Diagnostics network; good panel pricing; established DTC provider');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000009-0000-0000-0000-000000000000', 'Personalabs', 'https://www.personalabs.com', 'intermediary', 'Quest,Labcorp', NULL, 'Uses Quest and Labcorp; no hidden draw or facility fees; moderate pricing');

INSERT INTO labs (id, lab_name, website, ordering_type, uses_network, affiliate_link, notes)
VALUES ('b0000010-0000-0000-0000-000000000000', 'Life Extension', 'https://www.lifeextension.com/lab-testing', 'intermediary', 'Labcorp', NULL, 'Uses Labcorp network; known for supplement company; competitive lab test pricing');

-- ============================================================
-- PRICING (Top 20 tests × 10 labs = 200 rows)
-- ============================================================
-- Sources: ultalabtests.com product pages, findlabtest.com comparisons,
-- shayahealth.com/quest-labs-via-ulta.php, questhealth.com, ondemand.labcorp.com,
-- healthlabs.com, requestatest.com, privatemdlabs.com, directlabs.com,
-- personalabs.com/blog/bloodwork-cost-guide-personalabs, lifeextension.com/lab-testing,
-- PMC article "Cost Comparisons of Physician-Ordered vs DTC Lab Testing" (PMC11663041)

-- -------------------------------------------------------
-- 1. CBC with Differential (a0000061)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 35.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 15.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 24.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 50.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 28.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 34.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000061-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 28.00, false);

-- -------------------------------------------------------
-- 2. CMP - Comprehensive Metabolic Panel (a0000110)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 35.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 16.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 28.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 35.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 28.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 34.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000110-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 28.00, false);

-- -------------------------------------------------------
-- 3. Lipid Panel (a0000139)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 65.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 20.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 33.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 33.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000139-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 33.00, false);

-- -------------------------------------------------------
-- 4. TSH (a0000001)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 24.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 34.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000001-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 36.00, false);

-- -------------------------------------------------------
-- 5. HbA1c (a0000117)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 26.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 36.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000117-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 39.00, false);

-- -------------------------------------------------------
-- 6. Vitamin D, 25-OH (a0000174)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 79.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 38.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 69.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 55.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000174-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 47.00, false);

-- -------------------------------------------------------
-- 7. Free T4 (a0000002)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 24.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 33.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 55.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 42.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000002-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 36.00, false);

-- -------------------------------------------------------
-- 8. Testosterone, Total (a0000022)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 79.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 69.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 38.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 69.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 99.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 79.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000022-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 49.00, false);

-- -------------------------------------------------------
-- 9. Vitamin B12 (a0000177)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 28.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000177-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 38.00, false);

-- -------------------------------------------------------
-- 10. Ferritin (a0000072)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 24.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 33.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 73.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 42.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000072-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 28.00, false);

-- -------------------------------------------------------
-- 11. Iron & TIBC Panel (a0000075)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 24.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 33.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 55.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 33.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 42.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000075-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 33.00, false);

-- -------------------------------------------------------
-- 12. Free T3 (a0000003)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 28.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000003-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 38.00, false);

-- -------------------------------------------------------
-- 13. Thyroid Panel with TSH (a0000015)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 79.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 69.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 38.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 69.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 55.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000015-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 49.00, false);

-- -------------------------------------------------------
-- 14. Estradiol (a0000028)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 69.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 32.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 55.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 65.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000028-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 42.00, false);

-- -------------------------------------------------------
-- 15. hs-CRP (a0000157)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 55.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 28.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000157-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 39.00, false);

-- -------------------------------------------------------
-- 16. DHEA-Sulfate (a0000037)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 69.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 59.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 32.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 55.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 65.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000037-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 42.00, false);

-- -------------------------------------------------------
-- 17. Cortisol, AM (a0000040)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 28.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 49.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 55.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000040-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 39.00, false);

-- -------------------------------------------------------
-- 18. Urinalysis, Complete (a0000209)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 25.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 12.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 19.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 19.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 25.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 22.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 25.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000209-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 22.00, false);

-- -------------------------------------------------------
-- 19. ESR (a0000107)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 35.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 18.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 35.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 45.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 34.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000107-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 29.00, false);

-- -------------------------------------------------------
-- 20. BMP - Basic Metabolic Panel (a0000111)
-- -------------------------------------------------------
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000001-0000-0000-0000-000000000000', 35.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000002-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000003-0000-0000-0000-000000000000', 14.95, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000004-0000-0000-0000-000000000000', 24.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000005-0000-0000-0000-000000000000', 25.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000006-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000007-0000-0000-0000-000000000000', 39.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000008-0000-0000-0000-000000000000', 25.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000009-0000-0000-0000-000000000000', 29.00, false);
INSERT INTO pricing (test_id, lab_id, price, requires_rx) VALUES ('a0000111-0000-0000-0000-000000000000', 'b0000010-0000-0000-0000-000000000000', 25.00, false);

-- ============================================================
-- SYMPTOMS (40 symptom-to-test mappings)
-- ============================================================

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000001-0000-0000-0000-000000000000', 'Fatigue', ARRAY['fatigue','tired','exhausted','low energy','lethargy','sleepy','worn out'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000075-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000177-0000-0000-0000-000000000000','a0000040-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000002-0000-0000-0000-000000000000', 'Hair Loss', ARRAY['hair loss','thinning hair','hair falling out','alopecia','balding','shedding hair'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000009-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000075-0000-0000-0000-000000000000','a0000022-0000-0000-0000-000000000000','a0000037-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000194-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000003-0000-0000-0000-000000000000', 'Weight Gain', ARRAY['weight gain','gaining weight','unexplained weight gain','obesity','getting heavier','cant lose weight'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000118-0000-0000-0000-000000000000','a0000139-0000-0000-0000-000000000000','a0000040-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000004-0000-0000-0000-000000000000', 'Brain Fog', ARRAY['brain fog','mental fog','difficulty concentrating','poor focus','forgetful','memory problems','confused','cognitive issues'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000177-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000130-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000005-0000-0000-0000-000000000000', 'Joint Pain', ARRAY['joint pain','arthritis','stiff joints','swollen joints','aching joints','joint inflammation'], ARRAY['a0000107-0000-0000-0000-000000000000','a0000157-0000-0000-0000-000000000000','a0000273-0000-0000-0000-000000000000','a0000282-0000-0000-0000-000000000000','a0000283-0000-0000-0000-000000000000','a0000125-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000006-0000-0000-0000-000000000000', 'Headaches', ARRAY['headache','headaches','migraine','head pain','tension headache','chronic headache'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000157-0000-0000-0000-000000000000','a0000130-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000007-0000-0000-0000-000000000000', 'Anxiety', ARRAY['anxiety','anxious','nervousness','panic','worry','restless','jittery'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000040-0000-0000-0000-000000000000','a0000130-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000177-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000008-0000-0000-0000-000000000000', 'Depression', ARRAY['depression','depressed','sad','low mood','hopeless','unmotivated','apathy'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000022-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000177-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000040-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000009-0000-0000-0000-000000000000', 'Muscle Weakness', ARRAY['muscle weakness','weak muscles','loss of strength','difficulty lifting','muscle fatigue'], ARRAY['a0000174-0000-0000-0000-000000000000','a0000130-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000001-0000-0000-0000-000000000000','a0000177-0000-0000-0000-000000000000','a0000022-0000-0000-0000-000000000000','a0000166-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000010-0000-0000-0000-000000000000', 'Insomnia', ARRAY['insomnia','cant sleep','difficulty sleeping','sleep problems','waking up at night','restless sleep'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000040-0000-0000-0000-000000000000','a0000043-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000130-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000011-0000-0000-0000-000000000000', 'Cold Intolerance', ARRAY['cold intolerance','always cold','cold hands','cold feet','sensitive to cold','feeling cold'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000009-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000012-0000-0000-0000-000000000000', 'Heat Intolerance', ARRAY['heat intolerance','always hot','sweating','excessive sweating','overheating','hot flashes'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000012-0000-0000-0000-000000000000','a0000028-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000013-0000-0000-0000-000000000000', 'Weight Loss (Unexplained)', ARRAY['unexplained weight loss','losing weight','unintentional weight loss','wasting'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000','a0000107-0000-0000-0000-000000000000','a0000157-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000014-0000-0000-0000-000000000000', 'Frequent Infections', ARRAY['frequent infections','always sick','getting sick often','recurrent infections','weak immune system','low immunity'], ARRAY['a0000061-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000261-0000-0000-0000-000000000000','a0000262-0000-0000-0000-000000000000','a0000263-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000194-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000015-0000-0000-0000-000000000000', 'Easy Bruising', ARRAY['easy bruising','bruise easily','unexplained bruises','petechiae','bleeding easily'], ARRAY['a0000061-0000-0000-0000-000000000000','a0000080-0000-0000-0000-000000000000','a0000081-0000-0000-0000-000000000000','a0000230-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000016-0000-0000-0000-000000000000', 'Shortness of Breath', ARRAY['shortness of breath','difficulty breathing','breathless','winded easily','dyspnea'], ARRAY['a0000061-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000075-0000-0000-0000-000000000000','a0000162-0000-0000-0000-000000000000','a0000001-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000017-0000-0000-0000-000000000000', 'Heart Palpitations', ARRAY['heart palpitations','racing heart','irregular heartbeat','skipped beats','fluttering heart'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000130-0000-0000-0000-000000000000','a0000132-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000018-0000-0000-0000-000000000000', 'Dry Skin', ARRAY['dry skin','flaky skin','cracked skin','rough skin','itchy skin','eczema'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000189-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000019-0000-0000-0000-000000000000', 'Constipation', ARRAY['constipation','irregular bowel','hard stool','difficulty passing stool','bloating'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000128-0000-0000-0000-000000000000','a0000130-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000020-0000-0000-0000-000000000000', 'Diarrhea (Chronic)', ARRAY['chronic diarrhea','loose stool','frequent bowel movements','watery stool','IBS'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000157-0000-0000-0000-000000000000','a0000107-0000-0000-0000-000000000000','a0000262-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000021-0000-0000-0000-000000000000', 'Low Libido', ARRAY['low libido','low sex drive','decreased libido','no sex drive','sexual dysfunction','erectile dysfunction'], ARRAY['a0000022-0000-0000-0000-000000000000','a0000025-0000-0000-0000-000000000000','a0000027-0000-0000-0000-000000000000','a0000028-0000-0000-0000-000000000000','a0000001-0000-0000-0000-000000000000','a0000036-0000-0000-0000-000000000000','a0000037-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000022-0000-0000-0000-000000000000', 'Irregular Periods', ARRAY['irregular periods','missed period','heavy periods','light periods','amenorrhea','menstrual irregularity','PCOS'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000034-0000-0000-0000-000000000000','a0000035-0000-0000-0000-000000000000','a0000028-0000-0000-0000-000000000000','a0000032-0000-0000-0000-000000000000','a0000036-0000-0000-0000-000000000000','a0000022-0000-0000-0000-000000000000','a0000037-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000023-0000-0000-0000-000000000000', 'Muscle Cramps', ARRAY['muscle cramps','cramps','charley horse','muscle spasms','leg cramps','twitching'], ARRAY['a0000130-0000-0000-0000-000000000000','a0000128-0000-0000-0000-000000000000','a0000132-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000024-0000-0000-0000-000000000000', 'Numbness and Tingling', ARRAY['numbness','tingling','pins and needles','neuropathy','tingling hands','tingling feet','paresthesia'], ARRAY['a0000177-0000-0000-0000-000000000000','a0000181-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000','a0000187-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000025-0000-0000-0000-000000000000', 'Excessive Thirst', ARRAY['excessive thirst','always thirsty','polydipsia','dry mouth','drinking lots of water'], ARRAY['a0000113-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000128-0000-0000-0000-000000000000','a0000209-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000026-0000-0000-0000-000000000000', 'Frequent Urination', ARRAY['frequent urination','peeing a lot','polyuria','urinary frequency','nocturia','waking to urinate'], ARRAY['a0000113-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000209-0000-0000-0000-000000000000','a0000128-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000027-0000-0000-0000-000000000000', 'Bone Pain', ARRAY['bone pain','bone ache','osteoporosis','bone weakness','fractures','bone loss'], ARRAY['a0000174-0000-0000-0000-000000000000','a0000128-0000-0000-0000-000000000000','a0000020-0000-0000-0000-000000000000','a0000127-0000-0000-0000-000000000000','a0000233-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000028-0000-0000-0000-000000000000', 'Pale Skin', ARRAY['pale skin','pallor','looking pale','washed out','ghostly pale','pale complexion'], ARRAY['a0000061-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000075-0000-0000-0000-000000000000','a0000177-0000-0000-0000-000000000000','a0000178-0000-0000-0000-000000000000','a0000070-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000029-0000-0000-0000-000000000000', 'Swollen Neck / Goiter', ARRAY['swollen neck','goiter','thyroid swelling','lump in throat','neck enlargement','enlarged thyroid'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000003-0000-0000-0000-000000000000','a0000009-0000-0000-0000-000000000000','a0000010-0000-0000-0000-000000000000','a0000012-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000030-0000-0000-0000-000000000000', 'High Cholesterol', ARRAY['high cholesterol','elevated cholesterol','high LDL','low HDL','high triglycerides','hyperlipidemia'], ARRAY['a0000139-0000-0000-0000-000000000000','a0000148-0000-0000-0000-000000000000','a0000150-0000-0000-0000-000000000000','a0000157-0000-0000-0000-000000000000','a0000001-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000031-0000-0000-0000-000000000000', 'Acne', ARRAY['acne','breakouts','pimples','cystic acne','hormonal acne','adult acne'], ARRAY['a0000022-0000-0000-0000-000000000000','a0000025-0000-0000-0000-000000000000','a0000037-0000-0000-0000-000000000000','a0000039-0000-0000-0000-000000000000','a0000028-0000-0000-0000-000000000000','a0000118-0000-0000-0000-000000000000','a0000001-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000032-0000-0000-0000-000000000000', 'Dizziness', ARRAY['dizziness','dizzy','lightheaded','vertigo','faint','feeling faint','wobbly'], ARRAY['a0000061-0000-0000-0000-000000000000','a0000072-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000001-0000-0000-0000-000000000000','a0000113-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000033-0000-0000-0000-000000000000', 'Swelling / Edema', ARRAY['swelling','edema','puffy','water retention','swollen ankles','swollen legs','bloated'], ARRAY['a0000110-0000-0000-0000-000000000000','a0000209-0000-0000-0000-000000000000','a0000215-0000-0000-0000-000000000000','a0000001-0000-0000-0000-000000000000','a0000230-0000-0000-0000-000000000000','a0000162-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000034-0000-0000-0000-000000000000', 'Skin Rash', ARRAY['rash','skin rash','hives','itchy rash','redness','dermatitis','skin irritation'], ARRAY['a0000061-0000-0000-0000-000000000000','a0000273-0000-0000-0000-000000000000','a0000264-0000-0000-0000-000000000000','a0000107-0000-0000-0000-000000000000','a0000157-0000-0000-0000-000000000000','a0000230-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000035-0000-0000-0000-000000000000', 'Night Sweats', ARRAY['night sweats','sweating at night','waking up sweaty','soaking sheets','nocturnal sweating'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000','a0000107-0000-0000-0000-000000000000','a0000113-0000-0000-0000-000000000000','a0000028-0000-0000-0000-000000000000','a0000034-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000036-0000-0000-0000-000000000000', 'Mood Swings', ARRAY['mood swings','irritable','irritability','emotional','mood changes','volatile mood'], ARRAY['a0000001-0000-0000-0000-000000000000','a0000002-0000-0000-0000-000000000000','a0000022-0000-0000-0000-000000000000','a0000028-0000-0000-0000-000000000000','a0000032-0000-0000-0000-000000000000','a0000040-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000177-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000037-0000-0000-0000-000000000000', 'Slow Wound Healing', ARRAY['slow healing','wounds not healing','cuts heal slowly','slow recovery','poor wound healing'], ARRAY['a0000117-0000-0000-0000-000000000000','a0000113-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000','a0000194-0000-0000-0000-000000000000','a0000190-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000038-0000-0000-0000-000000000000', 'Chest Pain', ARRAY['chest pain','chest tightness','chest pressure','angina','heart pain'], ARRAY['a0000160-0000-0000-0000-000000000000','a0000139-0000-0000-0000-000000000000','a0000157-0000-0000-0000-000000000000','a0000162-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000039-0000-0000-0000-000000000000', 'Abdominal Pain', ARRAY['abdominal pain','stomach pain','belly pain','stomach ache','cramping','gut pain'], ARRAY['a0000110-0000-0000-0000-000000000000','a0000230-0000-0000-0000-000000000000','a0000061-0000-0000-0000-000000000000','a0000157-0000-0000-0000-000000000000','a0000209-0000-0000-0000-000000000000','a0000355-0000-0000-0000-000000000000']::uuid[]);

INSERT INTO symptoms (id, name, keywords, related_test_ids) VALUES
('c0000040-0000-0000-0000-000000000000', 'Blurred Vision', ARRAY['blurred vision','blurry vision','vision problems','difficulty seeing','eye problems'], ARRAY['a0000113-0000-0000-0000-000000000000','a0000117-0000-0000-0000-000000000000','a0000001-0000-0000-0000-000000000000','a0000110-0000-0000-0000-000000000000','a0000174-0000-0000-0000-000000000000']::uuid[]);
