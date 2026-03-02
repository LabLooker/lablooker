/**
 * seed-icd10.mjs
 * Populates icd10_codes and test_icd10_codes tables.
 * Idempotent — safe to run multiple times.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cbeazeiehgiwhklxtdir.supabase.co';
const SUPABASE_KEY = 'sb_secret_xT7abHdrbszgED4H4vNQ0A_OeFe-uLT';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── All unique ICD-10 codes ──────────────────────────────────────────────────
const ICD10_CODES = [
  // Thyroid
  { code: 'E03.9',   description: 'Hypothyroidism, unspecified' },
  { code: 'E05.90',  description: 'Hyperthyroidism, unspecified' },
  { code: 'E06.3',   description: 'Autoimmune thyroiditis' },
  { code: 'Z79.899', description: 'Other long term drug therapy' },
  // Adrenal
  { code: 'E27.40',  description: 'Adrenocortical insufficiency, unspecified' },
  { code: 'E27.49',  description: 'Other adrenocortical insufficiency' },
  { code: 'E24.9',   description: 'Cushing syndrome, unspecified' },
  // Hormones – female
  { code: 'N91.2',   description: 'Amenorrhea, unspecified' },
  { code: 'E28.39',  description: 'Other ovarian dysfunction' },
  { code: 'Z78.0',   description: 'Asymptomatic menopausal state' },
  { code: 'N95.1',   description: 'Menopausal and female climacteric states' },
  { code: 'N97.8',   description: 'Other female infertility' },
  { code: 'N64.52',  description: 'Nipple discharge' },
  // Hormones – male
  { code: 'E29.1',   description: 'Testicular hypofunction' },
  // Hormones – pituitary
  { code: 'E22.0',   description: 'Acromegaly and pituitary gigantism' },
  { code: 'E23.0',   description: 'Hypopituitarism' },
  { code: 'E22.1',   description: 'Hyperprolactinemia' },
  { code: 'R62.50',  description: 'Unspecified lack of expected normal physiological development in childhood' },
  // Misc symptoms
  { code: 'R53.83',  description: 'Other fatigue' },
  { code: 'R68.89',  description: 'Other specified general symptoms and signs' },
  // Anemia / Blood
  { code: 'D64.9',   description: 'Anemia, unspecified' },
  { code: 'D50.9',   description: 'Iron deficiency anemia, unspecified' },
  { code: 'D72.9',   description: 'Disorder of white blood cells, unspecified' },
  { code: 'D51.9',   description: 'Vitamin B12 deficiency anemia, unspecified' },
  { code: 'D52.9',   description: 'Folate deficiency anemia, unspecified' },
  { code: 'L65.9',   description: 'Nonscarring hair loss, unspecified' },
  // Coagulation
  { code: 'D68.9',   description: 'Coagulation defect, unspecified' },
  { code: 'D69.6',   description: 'Thrombocytopenia, unspecified' },
  { code: 'I82.409', description: 'Acute embolism and thrombosis of unspecified deep veins' },
  { code: 'D66',     description: 'Hereditary factor VIII deficiency (Hemophilia A)' },
  { code: 'D67',     description: 'Hereditary factor IX deficiency (Hemophilia B)' },
  { code: 'D69.3',   description: 'Immune thrombocytopenic purpura' },
  { code: 'D68.51',  description: 'Activated protein C resistance' },
  // Metabolic / Diabetes
  { code: 'E11.9',   description: 'Type 2 diabetes mellitus without complications' },
  { code: 'E10.9',   description: 'Type 1 diabetes mellitus without complications' },
  { code: 'R73.09',  description: 'Other elevated blood glucose level' },
  { code: 'Z13.1',   description: 'Encounter for screening for diabetes mellitus' },
  { code: 'E66.9',   description: 'Obesity, unspecified' },
  { code: 'E16.0',   description: 'Drug-induced hypoglycemia without coma' },
  { code: 'E87.1',   description: 'Hyponatremia' },
  { code: 'E83.51',  description: 'Hypocalcemia' },
  // Kidney
  { code: 'N18.9',   description: 'Chronic kidney disease, unspecified' },
  { code: 'N17.9',   description: 'Acute kidney failure, unspecified' },
  { code: 'N20.0',   description: 'Calculus of kidney' },
  { code: 'I10',     description: 'Essential (primary) hypertension' },
  // Minerals / Vitamins
  { code: 'E55.9',   description: 'Vitamin D deficiency, unspecified' },
  { code: 'M81.0',   description: 'Age-related osteoporosis without current pathological fracture' },
  { code: 'M54.5',   description: 'Low back pain' },
  { code: 'E83.40',  description: 'Disorders of magnesium metabolism, unspecified' },
  { code: 'R25.2',   description: 'Cramp and spasm' },
  { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus' },
  { code: 'E83.52',  description: 'Hypercalcemia' },
  { code: 'E21.0',   description: 'Primary hyperparathyroidism' },
  { code: 'E20.9',   description: 'Hypoparathyroidism, unspecified' },
  { code: 'E60',     description: 'Dietary zinc deficiency' },
  { code: 'L21.9',   description: 'Seborrhoeic dermatitis, unspecified' },
  { code: 'E83.00',  description: 'Disorder of copper metabolism, unspecified' },
  // Lipids / Cardiovascular
  { code: 'E78.5',   description: 'Hyperlipidemia, unspecified' },
  { code: 'Z13.220', description: 'Encounter for screening for lipoid disorders' },
  { code: 'M79.3',   description: 'Panniculitis, unspecified' },
  { code: 'M06.9',   description: 'Rheumatoid arthritis, unspecified' },
  { code: 'I25.10',  description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
  { code: 'I50.9',   description: 'Heart failure, unspecified' },
  { code: 'I21.9',   description: 'Acute myocardial infarction, unspecified' },
  { code: 'I48.91',  description: 'Unspecified atrial fibrillation' },
  // Liver
  { code: 'K76.0',   description: 'Fatty (change of) liver, not elsewhere classified' },
  { code: 'K70.10',  description: 'Alcoholic hepatitis without ascites' },
  { code: 'B18.2',   description: 'Chronic viral hepatitis C' },
  { code: 'E40',     description: 'Kwashiorkor (severe protein malnutrition)' },
  { code: 'K74.60',  description: 'Unspecified cirrhosis of liver' },
  { code: 'B18.1',   description: 'Chronic viral hepatitis B without delta-agent' },
  { code: 'K83.1',   description: 'Obstruction of bile duct' },
  { code: 'E83.01',  description: 'Wilsons disease' },
  // Inflammation / Immune / Autoimmune
  { code: 'M32.9',   description: 'Systemic lupus erythematosus, unspecified' },
  { code: 'M35.9',   description: 'Systemic involvement of connective tissue, unspecified' },
  { code: 'D84.9',   description: 'Immunodeficiency, unspecified' },
  { code: 'K90.0',   description: 'Coeliac disease' },
  { code: 'K52.9',   description: 'Noninfective gastroenteritis and colitis, unspecified' },
  { code: 'R19.7',   description: 'Diarrhoea, unspecified' },
  { code: 'A77.0',   description: 'Spotted fever due to Rickettsia rickettsii' },
  { code: 'M45.9',   description: 'Ankylosing spondylitis of unspecified sites' },
  { code: 'L40.0',   description: 'Psoriasis vulgaris' },
  { code: 'M34.9',   description: 'Systemic sclerosis, unspecified' },
  { code: 'M33.20',  description: 'Polymyositis, organ involvement unspecified' },
  { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
  { code: 'L20.9',   description: 'Atopic dermatitis, unspecified' },
  // Cancer markers
  { code: 'C61',     description: 'Malignant neoplasm of prostate' },
  { code: 'N40.0',   description: 'Benign prostatic hyperplasia without lower urinary tract symptoms' },
  { code: 'Z12.5',   description: 'Encounter for screening for malignant neoplasm of prostate' },
  { code: 'C56.9',   description: 'Malignant neoplasm of unspecified ovary' },
  { code: 'N80.9',   description: 'Endometriosis, unspecified' },
  { code: 'Z12.79',  description: 'Encounter for other screening for malignant neoplasm of other genitourinary organs' },
  { code: 'C18.9',   description: 'Malignant neoplasm of colon, unspecified' },
  { code: 'Z12.11',  description: 'Encounter for screening for malignant neoplasm of colon' },
  // Infectious
  { code: 'Z11.4',   description: 'Encounter for screening for human immunodeficiency virus' },
  { code: 'B20',     description: 'Human immunodeficiency virus disease' },
  { code: 'Z11.59',  description: 'Encounter for screening for other viral diseases' },
  { code: 'A69.20',  description: 'Lyme disease, unspecified' },
  { code: 'Z11.8',   description: 'Encounter for screening for other infectious and parasitic diseases' },
  { code: 'A53.9',   description: 'Syphilis, unspecified' },
  { code: 'A54.9',   description: 'Gonococcal infection, unspecified' },
  { code: 'A56.9',   description: 'Chlamydial infection, unspecified' },
  { code: 'B00.9',   description: 'Herpesviral infection, unspecified' },
  { code: 'B19.9',   description: 'Unspecified viral hepatitis without hepatic coma' },
  { code: 'A15.0',   description: 'Tuberculosis of lung' },
  { code: 'Z11.1',   description: 'Encounter for screening for respiratory tuberculosis' },
  { code: 'B97.29',  description: 'Other coronavirus as the cause of diseases classified elsewhere (COVID-19)' },
  { code: 'J06.9',   description: 'Acute upper respiratory infection, unspecified' },
  { code: 'B09',     description: 'Unspecified viral infection characterized by skin and mucous membrane lesions' },
  // Gout / Kidney stone
  { code: 'M10.9',   description: 'Gout, unspecified' },
  { code: 'E79.0',   description: 'Hyperuricemia without signs of inflammatory arthritis' },
  // Homocysteine / B12
  { code: 'G62.0',   description: 'Drug-induced polyneuropathy' },
];

// ─── Mapping rules: test name patterns → ICD-10 code keys ────────────────────
// Returns array of codes for a given test name + category
function getCodesForTest(testName, category) {
  const n = testName.toLowerCase();

  // ── Thyroid ────────────────────────────────────────────────────────────────
  if (/\btsh\b/.test(n) || /thyroid stimulat/.test(n)) {
    return ['E03.9','E05.90','E06.3','Z79.899','R53.83'];
  }
  if (/free t4|thyroxine.*free|ft4/.test(n)) {
    return ['E03.9','E05.90','E06.3','Z79.899','R53.83'];
  }
  if (/free t3|triiodothyronine.*free|ft3/.test(n)) {
    return ['E03.9','E05.90','E06.3','R53.83'];
  }
  if (/total t4|thyroxine.*total/.test(n)) {
    return ['E03.9','E05.90','R53.83'];
  }
  if (/total t3|triiodothyronine.*total/.test(n)) {
    return ['E03.9','E05.90','R53.83'];
  }
  if (/reverse t3|rt3/.test(n)) {
    return ['E03.9','R53.83','E27.40'];
  }
  if (/t3 uptake|resin t3/.test(n)) {
    return ['E03.9','E05.90'];
  }
  if (/free t4 index|t7/.test(n)) {
    return ['E03.9','E05.90'];
  }
  if (/anti.tpo|thyroid peroxidase/.test(n)) {
    return ['E06.3','E03.9','E05.90'];
  }
  if (/anti.thyroglobulin|tgab/.test(n)) {
    return ['E06.3','E03.9','E05.90'];
  }
  if (/thyroglobulin\b/.test(n) && !/anti/.test(n)) {
    return ['E03.9','E05.90','E06.3'];
  }
  if (/thyroid panel|comprehensive thyroid/.test(n)) {
    return ['E03.9','E05.90','E06.3','Z79.899','R53.83'];
  }
  if (/trab|tsh receptor/.test(n)) {
    return ['E05.90','E06.3'];
  }
  if (/tsi|thyroid stimulat.*immuno/.test(n)) {
    return ['E05.90','E06.3'];
  }
  if (/calcitonin/.test(n)) {
    return ['E07.9','E21.0','E20.9'];
  }
  if (/parathyroid hormone|pth/.test(n) && !/pth.rp/.test(n)) {
    return ['E21.0','E20.9','E83.52','N20.0'];
  }
  if (/pth.related|pthrp/.test(n)) {
    return ['E83.52','E21.0','C56.9'];
  }
  if (/iodine/.test(n)) {
    return ['E03.9','E05.90'];
  }
  if (/thyroid ultrasound/.test(n)) {
    return ['E03.9','E05.90','E06.3'];
  }

  // ── Hormones ───────────────────────────────────────────────────────────────
  if (/testosterone.*total|total.*testosterone/.test(n) && !/free/.test(n)) {
    return ['E29.1','N91.2','E28.39','R68.89'];
  }
  if (/testosterone.*free|free.*testosterone/.test(n)) {
    return ['E29.1','N91.2','E28.39','R68.89'];
  }
  if (/testosterone.*bioavail/.test(n)) {
    return ['E29.1','N91.2','E28.39'];
  }
  if (/free testosterone.*total testosterone|testosterone.*\+/.test(n)) {
    return ['E29.1','N91.2','E28.39','R68.89'];
  }
  if (/shbg|sex hormone binding/.test(n)) {
    return ['E29.1','E28.39','E11.9'];
  }
  if (/estradiol|estradiol.*e2|e2.*estradiol/.test(n)) {
    return ['N91.2','E28.39','Z78.0','N95.1'];
  }
  if (/estriol|e3/.test(n)) {
    return ['N91.2','E28.39','Z78.0'];
  }
  if (/estrone|e1/.test(n)) {
    return ['N91.2','E28.39','Z78.0'];
  }
  if (/total estrogen/.test(n)) {
    return ['N91.2','E28.39','Z78.0','N95.1'];
  }
  if (/estrogen metabolite/.test(n)) {
    return ['N91.2','E28.39','N80.9'];
  }
  if (/progesterone\b/.test(n) && !/17.oh|17-oh|17-hydroxy/.test(n)) {
    return ['N91.2','E28.39','N97.8'];
  }
  if (/17.oh.*progesterone|17-hydroxy.*progesterone|progesterone.*17-oh/.test(n)) {
    return ['E25.0','N91.2','E28.39'];
  }
  if (/\bfsh\b|follicle stimulat/.test(n)) {
    return ['N91.2','E28.39','N97.8','E29.1'];
  }
  if (/\blh\b|luteinizing/.test(n)) {
    return ['N91.2','E28.39','N97.8','E29.1'];
  }
  if (/dhea.sulfate|dhea-s\b/.test(n)) {
    return ['E27.49','R53.83','E28.39'];
  }
  if (/\bdhea\b/.test(n) && !/sulfate|dhea-s/.test(n)) {
    return ['E27.49','R53.83','E28.39'];
  }
  if (/cortisol/.test(n)) {
    return ['E27.40','E27.49','E24.9','R53.83'];
  }
  if (/\bacth\b|adrenocorticotrop/.test(n)) {
    return ['E27.40','E27.49','E24.9'];
  }
  if (/prolactin/.test(n)) {
    return ['N64.52','N91.2','E22.1'];
  }
  if (/\bigf.1\b|insulin.like growth factor/.test(n)) {
    return ['E22.0','E23.0','R62.50'];
  }
  if (/growth hormone|gh\b/.test(n) && !/binding/.test(n)) {
    return ['E22.0','E23.0','R62.50'];
  }
  if (/amh|anti.mullerian/.test(n)) {
    return ['N97.8','E28.39','N91.2'];
  }
  if (/inhibin/.test(n)) {
    return ['N97.8','E28.39','C56.9'];
  }
  if (/pregnenolone/.test(n)) {
    return ['E27.49','E28.39','R53.83'];
  }
  if (/androstenedione/.test(n)) {
    return ['E28.39','E29.1','E25.0'];
  }
  if (/aldosterone/.test(n)) {
    return ['I10','E27.49','E26.9'];
  }
  if (/renin/.test(n)) {
    return ['I10','E27.49','N18.9'];
  }
  if (/melatonin/.test(n)) {
    return ['G47.00','R53.83'];
  }
  if (/sex hormone panel/.test(n)) {
    return ['E29.1','N91.2','E28.39','R68.89'];
  }

  // ── Iron & Blood ───────────────────────────────────────────────────────────
  if (/\bcbc\b|complete blood count/.test(n)) {
    return ['D64.9','D50.9','R53.83','D72.9'];
  }
  if (/ferritin/.test(n)) {
    return ['D50.9','R53.83','L65.9','D72.9'];
  }
  if (/iron.*tibc|tibc.*iron|iron.*panel|iron & tibc/.test(n)) {
    return ['D50.9','D64.9','R53.83'];
  }
  if (/\biron\b.*serum|serum.*\biron\b/.test(n)) {
    return ['D50.9','D64.9','R53.83'];
  }
  if (/\btibc\b|total iron binding/.test(n)) {
    return ['D50.9','D64.9'];
  }
  if (/transferrin saturation/.test(n)) {
    return ['D50.9','E83.10'];
  }
  if (/transferrin\b/.test(n) && !/saturation/.test(n)) {
    return ['D50.9','D64.9','E40'];
  }
  if (/soluble transferrin receptor|stfr/.test(n)) {
    return ['D50.9','D64.9','R53.83'];
  }
  if (/hepcidin/.test(n)) {
    return ['D50.9','D64.9','E83.10'];
  }
  if (/vitamin b12|cobalamin/.test(n)) {
    return ['D51.9','G62.0','R53.83'];
  }
  if (/b12.*folate|folate.*b12|b12.*&.*folate/.test(n)) {
    return ['D51.9','D52.9','R53.83'];
  }
  if (/folate|folic acid/.test(n)) {
    return ['D52.9','D51.9'];
  }
  if (/methylmalonic acid|mma/.test(n)) {
    return ['D51.9','G62.0'];
  }

  // ── Hematology ─────────────────────────────────────────────────────────────
  if (/hemoglobin\b/.test(n) && !/a1c|electro|hbsa/.test(n)) {
    return ['D64.9','D50.9','R53.83'];
  }
  if (/hematocrit/.test(n)) {
    return ['D64.9','D50.9'];
  }
  if (/rbc count/.test(n)) {
    return ['D64.9','D50.9'];
  }
  if (/wbc count/.test(n)) {
    return ['D72.9','D64.9','R53.83'];
  }
  if (/platelet count/.test(n)) {
    return ['D69.6','D68.9'];
  }
  if (/peripheral.*smear|blood smear/.test(n)) {
    return ['D64.9','D50.9','D72.9'];
  }
  if (/manual differential/.test(n)) {
    return ['D72.9','D64.9'];
  }
  if (/reticulocyte/.test(n)) {
    return ['D64.9','D50.9'];
  }
  if (/hemoglobin electrophoresis/.test(n)) {
    return ['D57.1','D64.9','D50.9'];
  }
  if (/sickle cell screen/.test(n)) {
    return ['D57.1','D57.0'];
  }
  if (/g6pd/.test(n)) {
    return ['D55.0','D64.9'];
  }
  if (/haptoglobin/.test(n)) {
    return ['D59.9','D64.9'];
  }
  if (/direct coombs|dat\b/.test(n)) {
    return ['D59.1','D64.9'];
  }
  if (/indirect coombs|iat\b/.test(n)) {
    return ['D59.1','Z36'];
  }
  if (/ldh|lactate dehydrogenase/.test(n)) {
    return ['D59.9','K76.0','I21.9'];
  }
  if (/mean corpuscular volume|mcv/.test(n)) {
    return ['D64.9','D51.9','D52.9'];
  }
  if (/rdw|red cell distribution/.test(n)) {
    return ['D64.9','D50.9'];
  }
  if (/blood type|abo.*rh|rh.*abo/.test(n)) {
    return ['Z67.10','Z36'];
  }

  // ── Coagulation ────────────────────────────────────────────────────────────
  if (/prothrombin time|pt.*inr|inr/.test(n)) {
    return ['D68.9','I82.409','Z79.01'];
  }
  if (/\baptt\b|activated partial thromboplastin/.test(n)) {
    return ['D68.9','D66','D67'];
  }
  if (/d.dimer/.test(n)) {
    return ['I82.409','D65','I26.99'];
  }
  if (/fibrinogen/.test(n)) {
    return ['D68.9','D65','I82.409'];
  }
  if (/thrombin time/.test(n)) {
    return ['D68.9','D65'];
  }
  if (/platelet aggregation|pfa.100/.test(n)) {
    return ['D69.1','D68.9'];
  }
  if (/von willebrand/.test(n)) {
    return ['D68.00','D68.9'];
  }
  if (/factor viii/.test(n)) {
    return ['D66','D68.9'];
  }
  if (/factor ix/.test(n)) {
    return ['D67','D68.9'];
  }
  if (/protein c activity/.test(n)) {
    return ['D68.51','I82.409'];
  }
  if (/protein s/.test(n)) {
    return ['D68.51','I82.409'];
  }
  if (/antithrombin/.test(n)) {
    return ['D68.59','I82.409'];
  }
  if (/lupus anticoagulant/.test(n)) {
    return ['M32.9','D68.61'];
  }
  if (/antiphospholipid panel/.test(n)) {
    return ['M32.9','D68.61','I82.409'];
  }

  // ── Metabolic ──────────────────────────────────────────────────────────────
  if (/\bcmp\b|comprehensive metabolic/.test(n)) {
    return ['E11.9','N18.9','K76.0','E87.1','E83.51'];
  }
  if (/\bbmp\b|basic metabolic/.test(n)) {
    return ['E11.9','N18.9','E87.1','E83.51'];
  }
  if (/electrolyte panel/.test(n)) {
    return ['E87.1','E87.6','N18.9'];
  }
  if (/glucose.*fasting|fasting.*glucose/.test(n)) {
    return ['E11.9','E10.9','R73.09','Z13.1'];
  }
  if (/glucose.*random|random.*glucose/.test(n)) {
    return ['E11.9','E10.9','R73.09'];
  }
  if (/glucose.*post|post.*prandial|ogtt|oral glucose tolerance/.test(n)) {
    return ['E11.9','E10.9','R73.09','Z13.1'];
  }
  if (/glucose.*urine|urine.*glucose/.test(n)) {
    return ['E11.9','E10.9','N18.9'];
  }
  if (/hba1c|hemoglobin a1c/.test(n)) {
    return ['E11.9','E10.9','R73.09','Z13.1'];
  }
  if (/insulin.*fasting|fasting.*insulin/.test(n)) {
    return ['E11.9','E66.9','E16.0'];
  }
  if (/\bhoma.ir\b/.test(n)) {
    return ['E11.9','E66.9'];
  }
  if (/c.peptide/.test(n)) {
    return ['E11.9','E10.9','E16.0'];
  }
  if (/fructosamine/.test(n)) {
    return ['E11.9','E10.9'];
  }
  if (/uric acid/.test(n)) {
    return ['M10.9','E79.0','N20.0'];
  }
  if (/\bbun\b|blood urea nitrogen/.test(n)) {
    return ['N18.9','N17.9','E11.9','I10'];
  }
  if (/creatinine.*serum|serum.*creatinine/.test(n)) {
    return ['N18.9','N17.9','E11.9','I10'];
  }
  if (/\begfr\b|estimated.*gfr|ckd.epi/.test(n)) {
    return ['N18.9','N17.9','E11.9','I10'];
  }
  if (/magnesium.*serum|serum.*magnesium/.test(n)) {
    return ['E83.40','R25.2','G43.909','E83.51'];
  }
  if (/calcium.*serum|serum.*calcium|calcium.*ionized/.test(n)) {
    return ['E83.51','E83.52','E21.0','E20.9'];
  }
  if (/sodium\b/.test(n) && !/urine/.test(n)) {
    return ['E87.1','N18.9'];
  }
  if (/potassium\b/.test(n) && !/urine/.test(n)) {
    return ['E87.6','N18.9','I10'];
  }
  if (/chloride/.test(n)) {
    return ['E87.8','N18.9'];
  }
  if (/co2|bicarbonate/.test(n)) {
    return ['E87.4','N18.9'];
  }
  if (/phosphorus.*phosphate|phosphate.*phosphorus/.test(n) && !/urine/.test(n)) {
    return ['N18.9','E83.51','E21.0'];
  }
  if (/anion gap/.test(n)) {
    return ['E87.2','N18.9'];
  }
  if (/lactate|lactic acid/.test(n)) {
    return ['R09.2','E11.9'];
  }
  if (/beta.hydroxybutyrate/.test(n)) {
    return ['E10.9','E11.9','E13.10'];
  }
  if (/ketones/.test(n)) {
    return ['E10.9','E11.9'];
  }

  // ── Vitamins ───────────────────────────────────────────────────────────────
  if (/vitamin d.*25.oh|25.oh.*vitamin d|vitamin d.*total/.test(n)) {
    return ['E55.9','M81.0','M54.5','R53.83'];
  }
  if (/vitamin d.*1,25|1,25.*vitamin d|active.*vitamin d/.test(n)) {
    return ['E83.51','N20.0','E55.9'];
  }
  if (/vitamin a|retinol/.test(n)) {
    return ['E50.9','L20.9'];
  }
  if (/vitamin b1|thiamine/.test(n)) {
    return ['E51.9','G31.2'];
  }
  if (/vitamin b2|riboflavin/.test(n)) {
    return ['E53.0'];
  }
  if (/vitamin b3|niacin|nicotinic acid/.test(n)) {
    return ['E52','R53.83'];
  }
  if (/vitamin b5|pantothenic/.test(n)) {
    return ['E53.8','R53.83'];
  }
  if (/vitamin b6|pyridoxine/.test(n)) {
    return ['E53.1','G62.0'];
  }
  if (/vitamin b7|biotin/.test(n)) {
    return ['E53.8','L65.9'];
  }
  if (/vitamin c|ascorbic acid/.test(n)) {
    return ['E54','R53.83'];
  }
  if (/vitamin e|alpha.tocopherol/.test(n)) {
    return ['E56.0','G31.81'];
  }
  if (/vitamin k1|phylloquinone/.test(n)) {
    return ['E56.1','D68.4'];
  }
  if (/vitamin k2|menaquinone/.test(n)) {
    return ['E56.1','M81.0'];
  }

  // ── Minerals ───────────────────────────────────────────────────────────────
  if (/zinc.*serum|serum.*zinc/.test(n)) {
    return ['E60','L21.9','R53.83'];
  }
  if (/copper.*serum|serum.*copper/.test(n)) {
    return ['E83.00','R53.83'];
  }
  if (/magnesium.*rbc|rbc.*magnesium/.test(n)) {
    return ['E83.40','R25.2','G43.909'];
  }
  if (/selenium/.test(n)) {
    return ['E59','R53.83'];
  }
  if (/chromium/.test(n)) {
    return ['R53.83','E11.9'];
  }
  if (/iodine.*serum|serum.*iodine/.test(n) && !/thyroid/.test(n)) {
    return ['E03.9','E05.90'];
  }
  if (/manganese/.test(n)) {
    return ['T57.2XXA','R53.83'];
  }
  if (/molybdenum/.test(n)) {
    return ['E61.5','R53.83'];
  }
  if (/phosphorus.*serum|serum.*phosphorus/.test(n) && !/urine/.test(n)) {
    return ['N18.9','E83.51','E21.0'];
  }
  if (/lead.*blood|blood.*lead/.test(n)) {
    return ['T56.0X1A','R53.83'];
  }
  if (/mercury/.test(n)) {
    return ['T56.1X1A','R53.83'];
  }
  if (/arsenic/.test(n)) {
    return ['T57.0X1A','R53.83'];
  }
  if (/cadmium/.test(n)) {
    return ['T56.3X1A','R53.83'];
  }
  if (/heavy metals panel/.test(n)) {
    return ['T56.91XA','R53.83'];
  }
  if (/lithium level/.test(n)) {
    return ['Z79.899','F31.9'];
  }

  // ── Lipids / Cardiovascular ────────────────────────────────────────────────
  if (/lipid panel|standard.*lipid/.test(n)) {
    return ['E78.5','I10','E11.9','Z13.220'];
  }
  if (/total cholesterol/.test(n)) {
    return ['E78.5','I10','Z13.220'];
  }
  if (/hdl cholesterol/.test(n)) {
    return ['E78.5','I10','E11.9'];
  }
  if (/ldl cholesterol/.test(n)) {
    return ['E78.5','I25.10','I10'];
  }
  if (/triglycerides/.test(n)) {
    return ['E78.5','E11.9','E66.9'];
  }
  if (/vldl cholesterol/.test(n)) {
    return ['E78.5','E11.9'];
  }
  if (/non.hdl cholesterol/.test(n)) {
    return ['E78.5','I25.10'];
  }
  if (/cholesterol.*hdl ratio/.test(n)) {
    return ['E78.5','I25.10'];
  }
  if (/apolipoprotein b|apob/.test(n)) {
    return ['E78.5','I25.10'];
  }
  if (/apolipoprotein a|apoa/.test(n)) {
    return ['E78.5','I25.10'];
  }
  if (/lipoprotein.a\b|lp\(a\)/.test(n)) {
    return ['I25.10','E78.5'];
  }
  if (/nmr lipoprofile|advanced lipid|cardioi?q|vap cholesterol/.test(n)) {
    return ['E78.5','I25.10','I10','Z13.220'];
  }
  if (/omega.3 index/.test(n)) {
    return ['I25.10','E78.5'];
  }
  if (/omega.6.*omega.3|omega.*ratio/.test(n)) {
    return ['I25.10','E78.5','M06.9'];
  }
  if (/fatty acid profile/.test(n)) {
    return ['E78.5','I25.10'];
  }
  if (/\bhs.crp\b|high sensitivity crp/.test(n)) {
    return ['M79.3','I10','R53.83','M06.9'];
  }
  if (/\bcrp\b.*standard|crp.*quantitative|standard.*crp/.test(n)) {
    return ['M79.3','I10','R53.83','M06.9'];
  }
  if (/crp.*inflam|hs.crp.*inflam/.test(n)) {
    return ['M79.3','I10','R53.83','M06.9'];
  }
  if (/homocysteine/.test(n)) {
    return ['E11.9','I25.10','D51.9'];
  }
  if (/\bbnp\b|b.type natriuretic/.test(n)) {
    return ['I50.9','I21.9','I48.91'];
  }
  if (/nt.probnp|n.terminal.*bnp/.test(n)) {
    return ['I50.9','I21.9','I48.91'];
  }
  if (/troponin/.test(n)) {
    return ['I21.9','I25.10','I50.9'];
  }
  if (/ck.mb|creatine kinase.*cardiac/.test(n)) {
    return ['I21.9','I25.10'];
  }
  if (/\bck\b.*total|creatine kinase.*total/.test(n)) {
    return ['I21.9','M62.89','R53.83'];
  }
  if (/myoglobin/.test(n)) {
    return ['I21.9','M62.89'];
  }
  if (/galectin.3/.test(n)) {
    return ['I50.9','N18.9'];
  }
  if (/st2 soluble/.test(n)) {
    return ['I50.9','I21.9'];
  }
  if (/tmao|trimethylamine/.test(n)) {
    return ['I25.10','E78.5'];
  }
  if (/myeloperoxidase|mpo/.test(n) && !/anti.mpo|p.anca/.test(n)) {
    return ['I25.10','I10','M06.9'];
  }
  if (/lp.pla2|lipoprotein.associated phospholipase/.test(n)) {
    return ['I25.10','I10'];
  }
  if (/oxidized ldl/.test(n)) {
    return ['I25.10','E78.5'];
  }
  if (/\bggt\b|gamma.glutamyl/.test(n)) {
    return ['K76.0','K70.10','B18.2'];
  }

  // ── Liver ──────────────────────────────────────────────────────────────────
  if (/hepatic function panel|lfts/.test(n)) {
    return ['K76.0','K70.10','B18.2'];
  }
  if (/\balt\b|alanine aminotransferase/.test(n)) {
    return ['K76.0','K70.10','B18.2'];
  }
  if (/\bast\b|aspartate aminotransferase/.test(n)) {
    return ['K76.0','K70.10','B18.2'];
  }
  if (/\balp\b|alkaline phosphatase/.test(n)) {
    return ['K76.0','K83.1','E20.9'];
  }
  if (/albumin.*serum|serum.*albumin/.test(n)) {
    return ['E40','K76.0','N18.9'];
  }
  if (/total bilirubin/.test(n)) {
    return ['K76.0','K70.10','K83.1'];
  }
  if (/direct bilirubin|conjugated bilirubin/.test(n)) {
    return ['K83.1','K76.0','B18.2'];
  }
  if (/indirect bilirubin|unconjugated bilirubin/.test(n)) {
    return ['D59.9','K76.0'];
  }
  if (/total protein/.test(n) && !/electrophoresis/.test(n)) {
    return ['E40','K76.0','N18.9'];
  }
  if (/globulins/.test(n)) {
    return ['K76.0','M32.9'];
  }
  if (/ammonia/.test(n)) {
    return ['K74.60','K76.0'];
  }
  if (/ceruloplasmin/.test(n)) {
    return ['E83.01','D50.9'];
  }
  if (/copper.*serum.*liver|liver.*copper/.test(n)) {
    return ['E83.01','K76.0'];
  }
  if (/alpha.1 antitrypsin/.test(n)) {
    return ['J44.1','K74.60'];
  }
  if (/fib.4 score|fibrosure|fibrotest/.test(n)) {
    return ['K76.0','B18.2','K74.60'];
  }
  if (/bile acids/.test(n)) {
    return ['K83.1','K76.0'];
  }
  if (/5.nucleotidase/.test(n)) {
    return ['K83.1','K76.0'];
  }
  if (/ld.*lactate dehydrogenase.*liver|lactate.*dehydrogenase.*liver/.test(n)) {
    return ['K76.0','D59.9'];
  }

  // ── Kidney ─────────────────────────────────────────────────────────────────
  if (/kidney function panel/.test(n)) {
    return ['N18.9','N17.9','E11.9','I10'];
  }
  if (/urinalysis.*complete|urinalysis.*microscopy/.test(n)) {
    return ['N18.9','N39.0','N17.9'];
  }
  if (/urinalysis.*dipstick|urinalysis.*non.auto/.test(n)) {
    return ['N39.0','N18.9'];
  }
  if (/urine culture/.test(n)) {
    return ['N39.0','N18.9'];
  }
  if (/urine creatinine/.test(n)) {
    return ['N18.9','N17.9'];
  }
  if (/microalbumin/.test(n)) {
    return ['E11.9','N18.9','I10'];
  }
  if (/acr\b|albumin.*creatinine ratio/.test(n)) {
    return ['E11.9','N18.9','I10'];
  }
  if (/protein.*urine|urine.*protein/.test(n)) {
    return ['N18.9','M32.9','E11.9'];
  }
  if (/cystatin c/.test(n)) {
    return ['N18.9','N17.9'];
  }
  if (/osmolality.*serum|serum.*osmolality/.test(n)) {
    return ['E87.1','N18.9'];
  }
  if (/osmolality.*urine|urine.*osmolality/.test(n)) {
    return ['N18.9','N39.0'];
  }
  if (/kidney stone analysis|24.hour urine kidney stone/.test(n)) {
    return ['N20.0','E79.0','E83.52'];
  }
  if (/beta.2 microglobulin.*urine|urine.*beta.2 microglobulin/.test(n)) {
    return ['N18.9','C90.00'];
  }
  if (/calcium.*urine|urine.*calcium/.test(n)) {
    return ['N20.0','E83.52','E21.0'];
  }
  if (/phosphorus.*urine|urine.*phosphorus/.test(n)) {
    return ['N20.0','N18.9'];
  }
  if (/potassium.*urine|urine.*potassium/.test(n)) {
    return ['E87.6','N18.9'];
  }
  if (/sodium.*urine|urine.*sodium/.test(n)) {
    return ['E87.1','N18.9'];
  }

  // ── Inflammation ───────────────────────────────────────────────────────────
  if (/\besr\b|erythrocyte sedimentation|sed rate/.test(n)) {
    return ['M06.9','M32.9','R53.83'];
  }
  if (/procalcitonin|pct/.test(n)) {
    return ['A41.9','J44.1'];
  }
  if (/interleukin.6|il.6/.test(n)) {
    return ['M06.9','M32.9','A41.9'];
  }
  if (/tnf.alpha/.test(n)) {
    return ['M06.9','K50.90'];
  }
  if (/ferritin.*inflam/.test(n)) {
    return ['D50.9','R53.83','M06.9'];
  }
  if (/white blood cell differential/.test(n)) {
    return ['D72.9','A41.9','D64.9'];
  }

  // ── Immune ─────────────────────────────────────────────────────────────────
  if (/complement c3\b/.test(n)) {
    return ['M32.9','D84.9'];
  }
  if (/complement c4\b/.test(n)) {
    return ['M32.9','D84.9'];
  }
  if (/total complement|ch50/.test(n)) {
    return ['M32.9','D84.9'];
  }
  if (/immunoglobulin g subclass|igg1|igg.*subclass/.test(n)) {
    return ['D84.9','J45.909'];
  }
  if (/immunoglobulin g\b|igg\b/.test(n) && !/subclass/.test(n)) {
    return ['D84.9','M32.9'];
  }
  if (/immunoglobulin a\b|iga\b/.test(n)) {
    return ['K90.0','D84.9'];
  }
  if (/immunoglobulin m\b|igm\b/.test(n)) {
    return ['D84.9','B19.9'];
  }
  if (/immunoglobulin e\b|ige.*total/.test(n)) {
    return ['J45.909','L20.9'];
  }
  if (/immunoglobulin d\b|igd\b/.test(n)) {
    return ['D84.9'];
  }
  if (/protein electrophoresis|spep/.test(n)) {
    return ['C90.00','D84.9','E40'];
  }
  if (/immunofixation|ife/.test(n)) {
    return ['C90.00','D84.9'];
  }
  if (/serum free light chains|kappa.*lambda/.test(n)) {
    return ['C90.00','D84.9'];
  }
  if (/cd4.*cd8|t.cell subsets/.test(n)) {
    return ['B20','D84.9'];
  }
  if (/natural killer.*nk cells/.test(n)) {
    return ['D84.9','B20'];
  }
  if (/beta.2 microglobulin\b/.test(n) && !/urine/.test(n)) {
    return ['C90.00','B20','N18.9'];
  }

  // ── Autoimmune ─────────────────────────────────────────────────────────────
  if (/\bana\b.*screen|antinuclear antibody.*screen/.test(n)) {
    return ['M32.9','M06.9','M35.9'];
  }
  if (/\bana\b.*titer|antinuclear.*titer/.test(n)) {
    return ['M32.9','M35.9'];
  }
  if (/anti.dsdna/.test(n)) {
    return ['M32.9'];
  }
  if (/anti.smith|anti.sm\b/.test(n)) {
    return ['M32.9'];
  }
  if (/anti.ssa|anti.ro/.test(n)) {
    return ['M32.9','M35.00'];
  }
  if (/anti.ssb|anti.la/.test(n)) {
    return ['M32.9','M35.00'];
  }
  if (/anti.scl.70|anti.topoisomerase/.test(n)) {
    return ['M34.9'];
  }
  if (/anti.centromere/.test(n)) {
    return ['M34.9'];
  }
  if (/anti.jo.1/.test(n)) {
    return ['M33.20','M34.9'];
  }
  if (/anti.mpo|p.anca/.test(n)) {
    return ['M31.9','M32.9'];
  }
  if (/anti.pr3|c.anca/.test(n)) {
    return ['M31.3','M32.9'];
  }
  if (/\banca.*ifa/.test(n)) {
    return ['M31.9','M32.9'];
  }
  if (/anti.neutrophil cytoplasmic.*mpo.*pr3/.test(n)) {
    return ['M31.9','M32.9'];
  }
  if (/anti.gbm|anti.glomerular/.test(n)) {
    return ['N04.9','M31.0'];
  }
  if (/rheumatoid factor|\brf\b/.test(n)) {
    return ['M06.9','M35.9'];
  }
  if (/anti.ccp/.test(n)) {
    return ['M06.9','M35.9'];
  }
  if (/\bhla.b27\b/.test(n)) {
    return ['M45.9','M08.1','L40.0'];
  }
  if (/anticardiolipin/.test(n)) {
    return ['M32.9','D68.61','I82.409'];
  }
  if (/anti.beta.2 glycoprotein/.test(n)) {
    return ['M32.9','D68.61'];
  }
  if (/anti.histone/.test(n)) {
    return ['M32.9'];
  }
  if (/anti.ribosomal p/.test(n)) {
    return ['M32.9'];
  }
  if (/anti.ro52/.test(n)) {
    return ['M35.00','M32.9'];
  }
  if (/sjogren.*panel/.test(n)) {
    return ['M35.00','M32.9'];
  }
  if (/systemic sclerosis panel/.test(n)) {
    return ['M34.9','M35.9'];
  }
  if (/myositis panel/.test(n)) {
    return ['M33.20','M34.9','M35.9'];
  }
  if (/cryoglobulins/.test(n)) {
    return ['M32.9','B18.2','C88.0'];
  }
  if (/immunological.*allergy.*ige|total ige/.test(n)) {
    return ['J45.909','L20.9'];
  }

  // ── Infectious ─────────────────────────────────────────────────────────────
  if (/hiv.*1\+2.*antibody|hiv.*ag.*ab.*combo|hiv.*4th gen/.test(n)) {
    return ['Z11.4','B20'];
  }
  if (/hiv.*p24/.test(n)) {
    return ['Z11.4','B20'];
  }
  if (/hiv.*rna|hiv.*viral load/.test(n)) {
    return ['B20'];
  }
  if (/\bhiv\b/.test(n)) {
    return ['Z11.4','B20'];
  }
  if (/hepatitis b surface antigen|hbsag/.test(n)) {
    return ['B18.1','Z11.59'];
  }
  if (/hepatitis b surface antibody|anti.hbs/.test(n)) {
    return ['B18.1','Z11.59'];
  }
  if (/hepatitis b core.*antibody|anti.hbc/.test(n)) {
    return ['B18.1','Z11.59'];
  }
  if (/hepatitis b core.*igm/.test(n)) {
    return ['B16.9','Z11.59'];
  }
  if (/hepatitis b e antigen|hbeag/.test(n)) {
    return ['B18.1'];
  }
  if (/hepatitis b e antibody|anti.hbe/.test(n)) {
    return ['B18.1'];
  }
  if (/hepatitis b dna|hbv viral load/.test(n)) {
    return ['B18.1'];
  }
  if (/hepatitis b panel/.test(n)) {
    return ['B18.1','Z11.59'];
  }
  if (/hepatitis c antibody/.test(n)) {
    return ['B18.2','Z11.59'];
  }
  if (/hepatitis c rna|hepatitis c.*viral load/.test(n)) {
    return ['B18.2'];
  }
  if (/hepatitis c genotype/.test(n)) {
    return ['B18.2'];
  }
  if (/hepatitis d/.test(n)) {
    return ['B18.0'];
  }
  if (/hepatitis e/.test(n)) {
    return ['B17.2'];
  }
  if (/hepatitis a.*total antibody|hav ab/.test(n)) {
    return ['B15.9','Z11.59'];
  }
  if (/hepatitis a.*igm/.test(n)) {
    return ['B15.9'];
  }
  if (/hepatitis a.*igg/.test(n)) {
    return ['Z86.19','Z11.59'];
  }
  if (/lyme disease antibody|lyme.*elisa/.test(n)) {
    return ['A69.20','Z11.8'];
  }
  if (/lyme western blot/.test(n)) {
    return ['A69.20'];
  }
  if (/syphilis.*fta|syphilis.*treponemal/.test(n)) {
    return ['A53.9'];
  }
  if (/syphilis.*rpr|syphilis.*non.treponemal/.test(n)) {
    return ['A53.9','Z11.8'];
  }
  if (/syphilis.*total antibody|syphilis.*tppa/.test(n)) {
    return ['A53.9','Z11.8'];
  }
  if (/chlamydia.*naat/.test(n)) {
    return ['A56.9','Z11.8'];
  }
  if (/gonorrhea.*naat/.test(n)) {
    return ['A54.9','Z11.8'];
  }
  if (/ct.*ng naat|combined.*chlamydia.*gonorrhea/.test(n)) {
    return ['A56.9','A54.9','Z11.8'];
  }
  if (/trichomonas/.test(n)) {
    return ['A59.00','Z11.8'];
  }
  if (/mycoplasma genitalium/.test(n)) {
    return ['A49.3','Z11.8'];
  }
  if (/bacterial vaginosis|bv testing/.test(n)) {
    return ['N76.0'];
  }
  if (/herpes simplex 1\+2.*igm/.test(n)) {
    return ['B00.9'];
  }
  if (/herpes simplex.*1 igg/.test(n)) {
    return ['B00.9'];
  }
  if (/herpes simplex.*2 igg/.test(n)) {
    return ['A60.09'];
  }
  if (/hsv pcr|herpes simplex dna/.test(n)) {
    return ['B00.9','A60.09'];
  }
  if (/cmv igg.*igm|cytomegalovirus/.test(n)) {
    return ['B25.9','Z11.59'];
  }
  if (/ebv panel|mono.*ebv/.test(n)) {
    return ['B27.00','B27.09'];
  }
  if (/mono spot|heterophile antibody/.test(n)) {
    return ['B27.00'];
  }
  if (/quantiferon.*tb|igra/.test(n)) {
    return ['A15.0','Z11.1'];
  }
  if (/t.spot.*tb/.test(n)) {
    return ['A15.0','Z11.1'];
  }
  if (/tb skin test|ppd/.test(n)) {
    return ['A15.0','Z11.1'];
  }
  if (/rocky mountain spotted fever|rmsf/.test(n)) {
    return ['A77.0','Z11.8'];
  }
  if (/rubella igg/.test(n)) {
    return ['P35.0','Z11.59'];
  }
  if (/measles antibody|rubeola igg/.test(n)) {
    return ['B05.9','Z11.59'];
  }
  if (/mumps antibody/.test(n)) {
    return ['B26.9','Z11.59'];
  }
  if (/varicella zoster|vzv/.test(n)) {
    return ['B09','Z11.59'];
  }
  if (/west nile/.test(n)) {
    return ['A92.30','Z11.8'];
  }
  if (/toxoplasma/.test(n)) {
    return ['B58.9','Z11.8'];
  }
  if (/influenza antibody/.test(n)) {
    return ['J10.1','Z11.59'];
  }
  if (/sars.cov.2.*antibody|covid.*antibody/.test(n)) {
    return ['U07.1','Z11.52'];
  }
  if (/sars.cov.2.*pcr|covid.*pcr/.test(n)) {
    return ['U07.1'];
  }
  if (/strep a|streptococcal.*ridt/.test(n)) {
    return ['J02.0','Z11.8'];
  }
  if (/strep b|gbs culture/.test(n)) {
    return ['B95.1','Z36'];
  }
  if (/blood culture/.test(n)) {
    return ['A41.9','R50.9'];
  }
  if (/h.*pylori.*antibody|h.*pylori.*igg/.test(n)) {
    return ['K25.9','Z11.8'];
  }
  if (/h.*pylori.*antigen.*stool/.test(n)) {
    return ['K25.9'];
  }
  if (/h.*pylori.*breath/.test(n)) {
    return ['K25.9'];
  }
  if (/urinary tract infection culture|uti culture/.test(n)) {
    return ['N39.0'];
  }

  // ── Cancer markers (would be in a separate cancer category if present) ──────
  if (/\bpsa\b/.test(n)) {
    return ['C61','N40.0','Z12.5'];
  }
  if (/ca.125/.test(n)) {
    return ['C56.9','N80.9','Z12.79'];
  }
  if (/\bcea\b/.test(n)) {
    return ['C18.9','Z12.11'];
  }

  // ── Celiac ─────────────────────────────────────────────────────────────────
  if (/celiac|ttg.iga|tissue transglutaminase/.test(n)) {
    return ['K90.0','K52.9','R19.7'];
  }

  // ── Default fallback ────────────────────────────────────────────────────────
  console.warn(`  ⚠ No specific mapping for: "${testName}" (${category})`);
  return ['R53.83'];
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔬 LabLooker ICD-10 seed script starting...\n');

  // 1. Fetch all tests
  const { data: tests, error: testsErr } = await supabase
    .from('tests')
    .select('id, test_name, category')
    .order('category, test_name');
  if (testsErr) throw new Error('Failed to fetch tests: ' + JSON.stringify(testsErr));
  console.log(`✅ Fetched ${tests.length} tests\n`);

  // 2. Build mapping: testId → ICD-10 codes list
  const testMappings = tests.map(t => ({
    id: t.id,
    test_name: t.test_name,
    codes: getCodesForTest(t.test_name, t.category),
  }));

  // 3. Determine all unique codes needed
  const neededCodes = new Set();
  for (const tm of testMappings) {
    for (const code of tm.codes) neededCodes.add(code);
  }
  console.log(`\n📋 Unique ICD-10 codes to insert: ${neededCodes.size}`);

  // Validate all needed codes are in our master list
  const codeMap = Object.fromEntries(ICD10_CODES.map(c => [c.code, c.description]));
  const unknown = [...neededCodes].filter(c => !codeMap[c]);
  if (unknown.length > 0) {
    console.warn(`⚠ Unknown codes (will be added with placeholder desc):`, unknown);
    for (const c of unknown) {
      codeMap[c] = `ICD-10 code ${c}`;
    }
  }

  // 4. Upsert ICD-10 codes (idempotent via on_conflict)
  console.log('\n📥 Upserting ICD-10 codes...');
  const codesToInsert = [...neededCodes].map(code => ({
    code,
    description: codeMap[code],
  }));

  const { error: upsertErr } = await supabase
    .from('icd10_codes')
    .upsert(codesToInsert, { onConflict: 'code', ignoreDuplicates: true });
  if (upsertErr) throw new Error('Failed to upsert codes: ' + JSON.stringify(upsertErr));
  console.log(`✅ Upserted ${codesToInsert.length} ICD-10 codes`);

  // 5. Fetch the inserted codes to get their UUIDs
  const { data: insertedCodes, error: fetchErr } = await supabase
    .from('icd10_codes')
    .select('id, code');
  if (fetchErr) throw new Error('Failed to fetch inserted codes: ' + JSON.stringify(fetchErr));

  const codeIdMap = Object.fromEntries(insertedCodes.map(c => [c.code, c.id]));
  console.log(`✅ Fetched ${insertedCodes.length} ICD-10 code IDs`);

  // 6. Build junction table rows
  const junctionRows = [];
  for (const tm of testMappings) {
    for (const code of tm.codes) {
      const codeId = codeIdMap[code];
      if (!codeId) {
        console.warn(`  ⚠ Missing ID for code ${code}`);
        continue;
      }
      junctionRows.push({ test_id: tm.id, icd10_code_id: codeId });
    }
  }
  console.log(`\n🔗 Junction rows to insert: ${junctionRows.length}`);

  // 7. Upsert junction rows in batches of 500
  const BATCH_SIZE = 500;
  let inserted = 0;
  for (let i = 0; i < junctionRows.length; i += BATCH_SIZE) {
    const batch = junctionRows.slice(i, i + BATCH_SIZE);
    const { error: jErr } = await supabase
      .from('test_icd10_codes')
      .upsert(batch, { onConflict: 'test_id,icd10_code_id', ignoreDuplicates: true });
    if (jErr) throw new Error(`Failed to upsert junction batch ${i}: ${JSON.stringify(jErr)}`);
    inserted += batch.length;
    process.stdout.write(`\r📥 Inserted ${inserted}/${junctionRows.length} junction rows...`);
  }
  console.log(`\n✅ Done! ${junctionRows.length} test↔ICD-10 mappings created`);

  // 8. Summary
  console.log('\n── Summary ──────────────────────────────────');
  console.log(`  Tests processed:       ${tests.length}`);
  console.log(`  ICD-10 codes inserted: ${codesToInsert.length}`);
  console.log(`  Mappings created:      ${junctionRows.length}`);
  console.log('─────────────────────────────────────────────');
  console.log('✨ ICD-10 seed complete!');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message || err);
  process.exit(1);
});
