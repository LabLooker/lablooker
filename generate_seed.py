#!/usr/bin/env python3
"""
Generates seed-full.sql from test-database-research.md
"""
import re
import sys

INPUT_FILE = "/home/mightyyeti/lablooker/test-database-research.md"
OUTPUT_FILE = "/home/mightyyeti/lablooker/supabase/seed-full.sql"

# Read input
with open(INPUT_FILE, "r") as f:
    content = f.read()

# Category mapping from research categories to DB categories
CATEGORY_MAP = {
    "Thyroid": "thyroid",
    "Thyroid/Metabolic": "thyroid",
    "Hormones": "hormones",
    "Iron": "iron",
    "Hematology": "hematology",
    "Hematology/Inflammation": "hematology",
    "Coagulation": "coagulation",
    "Metabolic": "metabolic",
    "Lipids": "lipids",
    "Cardiovascular": "cardiovascular",
    "Vitamins": "vitamins",
    "Minerals": "minerals",
    "Kidney": "kidney",
    "Liver": "liver",
    "Inflammation": "inflammation",
    "Immune": "immune",
    "Autoimmune": "autoimmune",
    "Autoimmune/Allergy": "autoimmune",
    "Infectious": "infectious",
    "Cancer": "cancer",
    "Genetics": "genetics",
    "Allergy": "allergy",
    "GI": "gi_digestive",
    "Wellness": "nutrition",
    "Drug Monitoring": "drug_monitoring",
    "Pregnancy": "pregnancy",
    "Fertility": "fertility",
    "Pediatric": "pediatric",
    "Mental Health": "mental_health",
}

def escape_sql(s):
    """Escape single quotes for SQL"""
    if s is None:
        return ""
    return s.replace("'", "''")

def parse_cpt_codes(cpt_str):
    """Parse CPT codes into a SQL array"""
    cpt_str = cpt_str.strip()
    # Skip non-code values
    if cpt_str in ("Calculated", "Multiple", "N/A", ""):
        return "'{}'"
    # Handle range codes like "86663-86665"
    # Handle codes with verify
    cpt_str = cpt_str.replace("(verify)", "").strip()
    # Handle "+" separator and "," separator
    # Split by comma, +, or spaces that look like separators
    codes = re.split(r'[,+]', cpt_str)
    codes = [c.strip() for c in codes if c.strip()]
    # Filter out non-code values
    filtered = []
    for c in codes:
        # Remove parenthetical notes
        c = re.sub(r'\s*\(.*?\)', '', c).strip()
        # Handle range like "86663-86665"
        if re.match(r'^\d+-\d+$', c):
            # Just keep the range as a single string
            filtered.append(c)
        elif re.match(r'^\d+', c):
            # Extract the numeric code
            m = re.match(r'^(\d+)', c)
            if m:
                filtered.append(m.group(1))
        elif c in ("serial", "multiple", "x8", "Multiple"):
            continue
        else:
            # Try to find numbers
            nums = re.findall(r'\b\d{5}\b', c)
            filtered.extend(nums)

    if not filtered:
        return "'{}'"

    return "ARRAY[" + ",".join(f"'{code}'" for code in filtered) + "]"

def parse_icd10_codes(icd_str):
    """Parse ICD-10 codes from a string"""
    if not icd_str or icd_str.strip() == "":
        return []
    # Match ICD-10 patterns: letter followed by digits, possibly with dots and more characters
    codes = re.findall(r'[A-Z]\d+(?:\.\d+)?(?:[A-Za-z0-9]+)?', icd_str)
    return [c.strip() for c in codes if c.strip()]

def parse_fasting(fasting_str):
    """Parse fasting requirement"""
    fasting_str = fasting_str.strip().lower()
    if fasting_str.startswith("yes"):
        return "true"
    return "false"

def parse_tables(content):
    """Parse all test tables from the markdown content"""
    tests = []
    seen_names = set()  # Track test names for dedup

    # Find all table rows (lines starting with |)
    lines = content.split('\n')
    current_section = None
    in_table = False

    for line in lines:
        # Detect section headers
        section_match = re.match(r'^## \d+\.\s+(.+)', line)
        if section_match:
            current_section = section_match.group(1).strip()
            in_table = False
            continue

        # Detect table header
        if line.strip().startswith('| Test Name |'):
            in_table = True
            continue

        # Skip separator row
        if line.strip().startswith('|---'):
            continue

        # Skip pricing section
        if '# PRICING SECTION' in line or '## Top 100' in line or '## Overview' in line:
            in_table = False
            current_section = "PRICING"
            continue

        if current_section == "PRICING":
            continue

        # Parse table rows
        if in_table and line.strip().startswith('|') and line.strip().endswith('|'):
            cols = [c.strip() for c in line.split('|')]
            # Remove empty first and last elements from split
            cols = [c for c in cols if c != '']

            if len(cols) >= 7:
                test_name = cols[0].strip()
                cpt_code = cols[1].strip()
                category = cols[2].strip()
                description = cols[3].strip()
                fasting = cols[4].strip()
                icd10 = cols[5].strip()
                notes = cols[6].strip() if len(cols) > 6 else ""

                # Skip if empty test name
                if not test_name:
                    continue

                # Skip the pricing table rows (they have Rank column)
                if re.match(r'^\d+$', test_name):
                    continue

                # Map category
                db_category = CATEGORY_MAP.get(category, None)
                if db_category is None:
                    # Try partial match
                    for k, v in CATEGORY_MAP.items():
                        if k.lower() in category.lower():
                            db_category = v
                            break
                    if db_category is None:
                        print(f"WARNING: Unknown category '{category}' for test '{test_name}', skipping", file=sys.stderr)
                        continue

                # Dedup check (normalize name for comparison)
                name_key = test_name.lower().strip()
                if name_key in seen_names:
                    continue
                seen_names.add(name_key)

                icd10_codes = parse_icd10_codes(icd10)

                tests.append({
                    "name": test_name,
                    "cpt_codes": parse_cpt_codes(cpt_code),
                    "category": db_category,
                    "description": description,
                    "fasting": parse_fasting(fasting),
                    "icd10_codes": icd10_codes,
                    "notes": notes,
                })

    return tests

# Parse the tests
tests = parse_tables(content)
print(f"Parsed {len(tests)} unique tests", file=sys.stderr)

# Assign UUIDs to tests
test_uuids = {}
for i, test in enumerate(tests, 1):
    uuid = f"a{i:07d}-0000-0000-0000-000000000000"
    test["uuid"] = uuid
    test_uuids[test["name"]] = uuid

# Collect ALL unique ICD-10 codes
all_icd10 = {}
for test in tests:
    for code in test["icd10_codes"]:
        if code not in all_icd10:
            all_icd10[code] = code  # Will assign description later

# ICD-10 code descriptions (comprehensive mapping)
ICD10_DESCRIPTIONS = {
    "E03.9": "Hypothyroidism, unspecified",
    "E05.90": "Thyrotoxicosis, unspecified without thyroid crisis",
    "E00.9": "Congenital iodine-deficiency syndrome, unspecified",
    "Z13.88": "Encounter for screening for other specified disorder",
    "E06.9": "Thyroiditis, unspecified",
    "E05.00": "Thyrotoxicosis with diffuse goiter without thyroid crisis",
    "E05.01": "Thyrotoxicosis with diffuse goiter with thyroid crisis",
    "R53.83": "Other fatigue",
    "E06.3": "Autoimmune thyroiditis",
    "C73": "Malignant neoplasm of thyroid gland",
    "Z85.850": "Personal history of malignant neoplasm of thyroid",
    "E07.89": "Other specified disorders of thyroid",
    "C34.90": "Malignant neoplasm of unspecified part of bronchus or lung",
    "M06.9": "Rheumatoid arthritis, unspecified",
    "E04.1": "Nontoxic single thyroid nodule",
    "E04.2": "Nontoxic multinodular goiter",
    "R22.1": "Localized swelling, mass and lump, neck",
    "E21.0": "Primary hyperparathyroidism",
    "E20.9": "Hypoparathyroidism, unspecified",
    "E83.50": "Unspecified disorder of calcium metabolism",
    "C80.1": "Malignant (primary) neoplasm, unspecified",
    "E83.52": "Hypercalcemia",
    "E21.3": "Hyperparathyroidism, unspecified",
    "E01.8": "Other iodine-deficiency related thyroid disorders",
    "E29.1": "Testicular hypofunction",
    "E28.1": "Androgen excess",
    "F52.0": "Hypoactive sexual desire disorder",
    "E28.0": "Estrogen excess",
    "N91.0": "Primary amenorrhea",
    "E28.9": "Ovarian dysfunction, unspecified",
    "E28.39": "Other primary ovarian failure",
    "N95.1": "Menopausal and female climacteric states",
    "O09.90": "Supervision of high risk pregnancy, unspecified, unspecified trimester",
    "Z34.00": "Encounter for supervision of normal first pregnancy, unspecified trimester",
    "N97.0": "Female infertility associated with anovulation",
    "E25.0": "Congenital adrenogenital disorders associated with enzyme deficiency",
    "E27.49": "Other adrenocortical insufficiency",
    "E27.1": "Primary adrenocortical insufficiency",
    "E28.319": "Premature menopause, unspecified",
    "N46.11": "Organic oligospermia",
    "E22.1": "Hyperprolactinemia",
    "N64.3": "Galactorrhea not associated with childbirth",
    "R92.8": "Other abnormal findings on diagnostic imaging of breast",
    "E23.7": "Disorder of pituitary gland, unspecified",
    "E82.627": "DHEA-S deficiency",  # simplified
    "E27.40": "Unspecified adrenocortical insufficiency",
    "E24.9": "Cushing syndrome, unspecified",
    "E24.0": "Pituitary-dependent Cushing disease",
    "F41.9": "Anxiety disorder, unspecified",
    "E82.024": "ACTH deficiency",  # simplified
    "E34.3": "Short stature due to endocrine disorder",
    "E22.0": "Acromegaly and pituitary gigantism",
    "E23.0": "Hypopituitarism",
    "G47.00": "Insomnia, unspecified",
    "G47.10": "Hypersomnolence, unspecified",
    "F51.01": "Primary insomnia",
    "E26.09": "Other primary hyperaldosteronism",
    "E26.01": "Conn syndrome",
    "I10": "Essential (primary) hypertension",
    "N28.1": "Cyst of kidney, acquired",
    "Z31.41": "Encounter for fertility testing",
    "O28.1": "Abnormal biochemical finding on antenatal screening of mother",
    "D64.9": "Anemia, unspecified",
    "D50.9": "Iron deficiency anemia, unspecified",
    "D70.9": "Neutropenia, unspecified",
    "Z00.00": "Encounter for general adult medical examination without abnormal findings",
    "R71.0": "Precipitant fall in hematocrit",
    "D75.1": "Secondary polycythemia",
    "D72.819": "Decreased white blood cell count, unspecified",
    "D69.6": "Thrombocytopenia, unspecified",
    "D69.59": "Other secondary thrombocytopenia",
    "D61.9": "Aplastic anemia, unspecified",
    "B55.0": "Visceral leishmaniasis",
    "D50.1": "Sideropenic dysphagia",
    "E83.10": "Hemochromatosis, unspecified",
    "D64.89": "Other specified anemias",
    "Z79.01": "Long term (current) use of anticoagulants",
    "K74.60": "Unspecified cirrhosis of liver",
    "D68.9": "Coagulation defect, unspecified",
    "I26.99": "Other pulmonary embolism without acute cor pulmonale",
    "I82.401": "Acute embolism and thrombosis of unspecified deep veins of lower extremity",
    "D65": "Disseminated intravascular coagulation",
    "R09.89": "Other specified symptoms and signs involving the circulatory and respiratory systems",
    "D68.8": "Other specified coagulation defects",
    "D68.2": "Hereditary deficiency of other clotting factors",
    "D69.1": "Qualitative platelet defects",
    "D69.9": "Hemorrhagic condition, unspecified",
    "D68.0": "Von Willebrand disease",
    "D66": "Hereditary factor VIII deficiency",
    "D68.1": "Hereditary factor XI deficiency",
    "D67": "Hereditary factor IX deficiency",
    "M32.9": "Systemic lupus erythematosus, unspecified",
    "D68.61": "Antiphospholipid syndrome",
    "O26.119": "Low weight gain in pregnancy, unspecified trimester",
    "D68.59": "Other primary thrombophilia",
    "D57.1": "Sickle-cell disease without crisis",
    "D57.3": "Sickle-cell trait",
    "D57.0": "HbSS disease with crisis",
    "D56.1": "Beta thalassemia",
    "D55.0": "Anemia due to G6PD deficiency",
    "D59.9": "Acquired hemolytic anemia, unspecified",
    "D58.9": "Hereditary hemolytic anemia, unspecified",
    "D59.1": "Other autoimmune hemolytic anemias",
    "P55.9": "Hemolytic disease of newborn, unspecified",
    "T80.30XA": "ABO incompatibility reaction, unspecified, initial encounter",
    "Z01.83": "Encounter for blood typing",
    "Z31.82": "Encounter for Rh incompatibility status",
    "O29.90": "Unspecified complication of anesthesia during pregnancy, unspecified trimester",
    "L93.0": "Discoid lupus erythematosus",
    "M30.3": "Mucocutaneous lymph node syndrome (Kawasaki)",
    "E11.9": "Type 2 diabetes mellitus without complications",
    "N18.9": "Chronic kidney disease, unspecified",
    "E87.1": "Hypo-osmolality and hyponatremia",
    "E87.5": "Hyperkalemia",
    "E87.8": "Other disorders of electrolyte and fluid balance",
    "E10.9": "Type 1 diabetes mellitus without complications",
    "R73.09": "Other abnormal glucose",
    "Z13.1": "Encounter for screening for diabetes mellitus",
    "R73.01": "Impaired fasting glucose",
    "E16.0": "Drug-induced hypoglycemia without coma",
    "E16.1": "Other hypoglycemia",
    "R81": "Glycosuria",
    "E11.10": "Type 2 diabetes mellitus with ketoacidosis without coma",
    "E10.10": "Type 1 diabetes mellitus with ketoacidosis without coma",
    "R82.4": "Acetonuria",
    "D58.2": "Other hemoglobinopathies",
    "M10.00": "Idiopathic gout, unspecified site",
    "E79.0": "Hyperuricemia without signs of inflammatory arthritis and tophaceous disease",
    "R09.02": "Hypoxemia",
    "A41.9": "Sepsis, unspecified organism",
    "E87.2": "Acidosis",
    "E83.30": "Disorder of phosphorus metabolism, unspecified",
    "E83.40": "Disorders of magnesium metabolism, unspecified",
    "E83.42": "Hypomagnesemia",
    "R00.0": "Tachycardia, unspecified",
    "E87.0": "Hyperosmolality and hypernatremia",
    "E87.6": "Hypokalemia",
    "R79.89": "Other specified abnormal findings of blood chemistry",
    "N28.9": "Disorder of kidney and ureter, unspecified",
    "N18.3": "Chronic kidney disease, stage 3",
    "N18.4": "Chronic kidney disease, stage 4",
    "E78.5": "Hyperlipidemia, unspecified",
    "E78.00": "Pure hypercholesterolemia, unspecified",
    "E78.1": "Pure hypertriglyceridemia",
    "Z13.220": "Encounter for screening for lipoid disorders",
    "E78.6": "Lipoprotein deficiency",
    "I25.10": "Atherosclerotic heart disease of native coronary artery without angina pectoris",
    "Z71.3": "Dietary counseling and surveillance",
    "Z13.6": "Encounter for screening for cardiovascular disorders",
    "J18.9": "Pneumonia, unspecified organism",
    "L03.90": "Cellulitis, unspecified",
    "E72.11": "Homocystinuria",
    "I21.9": "Acute myocardial infarction, unspecified",
    "I20.9": "Angina pectoris, unspecified",
    "R07.9": "Chest pain, unspecified",
    "I50.9": "Heart failure, unspecified",
    "I50.32": "Chronic diastolic (congestive) heart failure",
    "M62.9": "Disorder of muscle, unspecified",
    "T79.6XXA": "Traumatic ischemia of muscle, initial encounter",
    "K74.00": "Hepatic fibrosis, unspecified",
    "Z72.89": "Other problems related to lifestyle",
    "E55.9": "Vitamin D deficiency, unspecified",
    "E55.0": "Rickets, active",
    "E55.1": "Vitamin D deficiency, unspecified - other",
    "M80.08": "Age-related osteoporosis with current pathological fracture",
    "E53.8": "Deficiency of other specified B group vitamins",
    "D51.9": "Vitamin B12 deficiency anemia, unspecified",
    "G62.9": "Polyneuropathy, unspecified",
    "D52.9": "Folate deficiency anemia, unspecified",
    "E51.9": "Thiamine deficiency, unspecified",
    "E51.11": "Dry beriberi",
    "G31.2": "Degeneration of nervous system due to alcohol",
    "E53.0": "Riboflavin deficiency",
    "E52": "Niacin deficiency (pellagra)",
    "L98.8": "Other specified disorders of skin and subcutaneous tissue",
    "E53.1": "Pyridoxine deficiency",
    "E50.9": "Vitamin A deficiency, unspecified",
    "E50.0": "Vitamin A deficiency with conjunctival xerosis",
    "E54": "Ascorbic acid deficiency",
    "M35.3": "Polymyalgia rheumatica",
    "E56.0": "Vitamin E deficiency",
    "E56.1": "Vitamin K deficiency",
    "D68.4": "Acquired coagulation factor deficiency",
    "M81.00": "Age-related osteoporosis without current pathological fracture",
    "E60": "Dietary zinc deficiency",
    "D84.9": "Immunodeficiency, unspecified",
    "E83.00": "Disorder of copper metabolism, unspecified",
    "E83.01": "Wilson disease",
    "E59": "Dietary selenium deficiency",
    "R25.2": "Cramp and spasm",
    "E83.9": "Disorder of mineral metabolism, unspecified",
    "E01.8b": "Other iodine-deficiency related thyroid disorders",
    "E04.9": "Nontoxic goiter, unspecified",
    "F31.9": "Bipolar disorder, unspecified",
    "Z79.899": "Other long term (current) drug therapy",
    "T56.0XXA": "Toxic effects of lead and its compounds, accidental, initial encounter",
    "T57.0XXA": "Toxic effects of arsenic and its compounds, accidental, initial encounter",
    "Z57.5": "Occupational exposure to toxic agents in other industries",
    "Z77.010": "Contact with and (suspected) exposure to lead",
    "T56.1XXA": "Toxic effects of mercury and its compounds, accidental, initial encounter",
    "T56.3XXA": "Toxic effects of cadmium and its compounds, accidental, initial encounter",
    "F17.210": "Nicotine dependence, cigarettes, uncomplicated",
    "N39.0": "Urinary tract infection, site not specified",
    "R80.0": "Isolated proteinuria",
    "R82.998": "Other abnormal findings in urine",
    "B37.41": "Candidal cystitis and urethritis",
    "E11.65": "Type 2 diabetes mellitus with hyperglycemia",
    "E11.21": "Type 2 diabetes mellitus with diabetic nephropathy",
    "N04.9": "Nephrotic syndrome with unspecified morphologic changes",
    "N20.0": "Calculus of kidney",
    "N25.81": "Secondary hyperparathyroidism of renal origin",
    "N20.9": "Urinary calculus, unspecified",
    "E86.0": "Dehydration",
    "N17.9": "Acute kidney failure, unspecified",
    "C90.00": "Multiple myeloma not having achieved remission",
    "D89.2": "Hypergammaglobulinemia, unspecified",
    "T51.0X1A": "Toxic effects of ethanol, accidental, initial encounter",
    "K70.30": "Alcoholic cirrhosis of liver without ascites",
    "B18.2": "Chronic viral hepatitis C",
    "K80.20": "Calculus of gallbladder without cholecystitis without obstruction",
    "K75.9": "Inflammatory liver disease, unspecified",
    "M85.80": "Other specified disorders of bone density and structure, unspecified site",
    "R17": "Unspecified jaundice",
    "E80.4": "Gilbert syndrome",
    "E44.0": "Moderate protein-calorie malnutrition",
    "R78.89": "Finding of other specified substances, not normally found in blood",
    "J43.9": "Emphysema, unspecified",
    "K74.69": "Other cirrhosis of liver",
    "K72.90": "Hepatic failure, unspecified without coma",
    "G93.41": "Metabolic encephalopathy",
    "E72.20": "Disorder of urea cycle metabolism, unspecified",
    "E83.110": "Hereditary hemochromatosis",
    "B18.1": "Chronic viral hepatitis B without delta-agent",
    "B18.0": "Chronic viral hepatitis B with delta-agent",
    "K86.89": "Other specified diseases of pancreas",
    "R50.9": "Fever, unspecified",
    "A41.01": "Sepsis due to Methicillin susceptible Staphylococcus aureus",
    "Z86.19": "Personal history of other infectious and parasitic diseases",
    "D76.1": "Hemophagocytic lymphohistiocytosis",
    "B99.9": "Other and unspecified infectious disease",
    "D84.1": "Defects in the complement system",
    "D83.9": "Common variable immunodeficiency, unspecified",
    "D80.0": "Hereditary hypogammaglobulinemia",
    "D80.2": "Selective deficiency of immunoglobulin A (IgA)",
    "K90.0": "Celiac disease",
    "C88.0": "Waldenstrom macroglobulinemia",
    "D80.9": "Immunodeficiency with predominantly antibody defects, unspecified",
    "J45.50": "Severe persistent asthma, uncomplicated",
    "L20.9": "Atopic dermatitis, unspecified",
    "B82.9": "Intestinal parasitism, unspecified",
    "D80.3": "Selective deficiency of immunoglobulin G (IgG) subclasses",
    "J06.9": "Acute upper respiratory infection, unspecified",
    "B20": "Human immunodeficiency virus (HIV) disease",
    "Z21": "Asymptomatic human immunodeficiency virus infection status",
    "C83.90": "Non-follicular (diffuse) lymphoma, unspecified, unspecified site",
    "C90.10": "Plasma cell leukemia not having achieved remission",
    "M35.00": "Sicca syndrome, unspecified",
    "M32.10": "Systemic lupus erythematosus, organ or system involvement unspecified",
    "M32.12": "Systemic lupus erythematosus with renal involvement",
    "M34.0": "Progressive systemic sclerosis",
    "M34.9": "Systemic sclerosis, unspecified",
    "M34.1": "CR(E)ST syndrome",
    "M33.20": "Polymyositis, organ involvement unspecified",
    "M33.00": "Juvenile dermatomyositis, organ involvement unspecified",
    "J84.116": "Cryptogenic organizing pneumonia",
    "M05.79": "Rheumatoid arthritis with rheumatoid factor of unspecified site",
    "M31.7": "Microscopic polyangiitis",
    "M30.1": "Polyarteritis with lung involvement (Churg-Strauss)",
    "M31.30": "Wegener granulomatosis without renal involvement",
    "M45.9": "Ankylosing spondylitis of unspecified sites in spine",
    "M07.60": "Enteropathic arthropathies, unspecified site",
    "M08.1": "Juvenile ankylosing spondylitis",
    "M32.89": "Other forms of systemic lupus erythematosus",
    "M35.09": "Other sicca syndrome",
    "M31.0": "Hypersensitivity angiitis",
    "N08": "Glomerular disorders in diseases classified elsewhere",
    "D89.1": "Cryoglobulinemia",
    "Z71.7": "Human immunodeficiency virus (HIV) counseling",
    "A56.00": "Chlamydial infection of lower genitourinary tract, unspecified",
    "A56.01": "Chlamydial cystitis and urethritis",
    "A56.11": "Chlamydial female pelvic inflammatory disease",
    "A54.00": "Gonococcal infection of lower genitourinary tract, unspecified",
    "A54.01": "Gonococcal cystitis and urethritis, unspecified",
    "A54.09": "Other gonococcal infection of lower genitourinary tract",
    "A51.0": "Primary genital syphilis",
    "A52.9": "Late syphilis, unspecified",
    "A53.9": "Syphilis, unspecified",
    "A60.00": "Herpesviral infection of urogenital system, unspecified",
    "B00.9": "Herpesviral infection, unspecified",
    "Z22.7": "Latent tuberculosis",
    "A60.01": "Herpesviral infection of penis",
    "A60.02": "Herpesviral infection of other male genital organs",
    "B15.9": "Hepatitis A without hepatic coma",
    "Z22.51": "Carrier of viral hepatitis B",
    "B16.9": "Acute hepatitis B without delta-agent and without hepatic coma",
    "B18.9": "Chronic viral hepatitis, unspecified",
    "B19.10": "Unspecified viral hepatitis B without hepatic coma",
    "B17.10": "Acute hepatitis C without hepatic coma",
    "Z22.52": "Carrier of viral hepatitis C",
    "B17.0": "Acute delta-(super)infection of hepatitis B carrier",
    "B17.2": "Acute hepatitis E",
    "A59.00": "Urogenital trichomoniasis, unspecified",
    "A59.01": "Trichomonal vulvovaginitis",
    "A59.09": "Other urogenital trichomoniasis",
    "A49.3": "Mycoplasma infection, unspecified site",
    "A56.19": "Other chlamydial infection of lower genitourinary tract",
    "N76.0": "Acute vaginitis",
    "A49.9": "Bacterial infection, unspecified",
    "Z11.1": "Encounter for screening for respiratory tuberculosis",
    "A15.9": "Respiratory tuberculosis unspecified",
    "Z20.1": "Contact with and (suspected) exposure to tuberculosis",
    "B25.9": "Cytomegaloviral disease, unspecified",
    "P35.1": "Congenital cytomegalovirus infection",
    "Z20.828": "Contact with and (suspected) exposure to other viral communicable diseases",
    "B27.00": "Gammaherpesviral mononucleosis without complication",
    "B27.09": "Gammaherpesviral mononucleosis with other complication",
    "B01.9": "Varicella without complication",
    "B02.9": "Zoster without complications",
    "Z22.828": "Carrier of other viral disease",
    "B06.9": "Rubella without complication",
    "Z22.4": "Carrier of infections with a predominantly sexual mode of transmission",
    "P35.0": "Congenital rubella syndrome",
    "B05.9": "Measles without complication",
    "B26.9": "Mumps without complication",
    "J11.1": "Influenza due to unidentified influenza virus with other respiratory manifestations",
    "Z23": "Encounter for immunization",
    "A69.20": "Lyme disease, unspecified",
    "A69.29": "Other conditions associated with Lyme disease",
    "A77.0": "Spotted fever due to Rickettsia rickettsii",
    "A92.30": "West Nile virus infection, unspecified",
    "U09.9": "Post-COVID-19 condition, unspecified",
    "U07.1": "COVID-19",
    "J02.0": "Streptococcal pharyngitis",
    "J03.00": "Acute streptococcal tonsillitis, unspecified",
    "O28.5": "Abnormal finding on antenatal screening of mother",
    "P36.10": "Sepsis of newborn due to unspecified Streptococci",
    "Z36": "Encounter for antenatal screening of mother",
    "N30.00": "Acute cystitis without hematuria",
    "Z87.39": "Other personal history of diseases of musculoskeletal system",
    "R78.81": "Bacteremia",
    "B58.9": "Toxoplasmosis, unspecified",
    "P37.1": "Congenital toxoplasmosis",
    "Z20.818": "Contact with and suspected exposure to other bacterial communicable diseases",
    "K25.9": "Gastric ulcer, unspecified, without hemorrhage or perforation",
    "K27.9": "Peptic ulcer, site unspecified, without hemorrhage or perforation",
    "B96.81": "Helicobacter pylori as the cause of diseases classified elsewhere",
    "C61": "Malignant neoplasm of prostate",
    "N40.0": "Benign prostatic hyperplasia without lower urinary tract symptoms",
    "Z12.5": "Encounter for screening for malignant neoplasm of prostate",
    "C56.9": "Malignant neoplasm of unspecified ovary",
    "C56.1": "Malignant neoplasm of right ovary",
    "C56.2": "Malignant neoplasm of left ovary",
    "N80.9": "Endometriosis, unspecified",
    "C25.9": "Malignant neoplasm of pancreas, unspecified",
    "C18.9": "Malignant neoplasm of colon, unspecified",
    "C22.1": "Intrahepatic bile duct carcinoma",
    "C50.919": "Malignant neoplasm of unspecified site of unspecified female breast",
    "C50.929": "Malignant neoplasm of unspecified site of unspecified male breast",
    "C22.0": "Liver cell carcinoma",
    "C62.90": "Malignant neoplasm of unspecified testis, unspecified whether descended or undescended",
    "C58": "Malignant neoplasm of placenta",
    "O00.90": "Unspecified ectopic pregnancy without intrauterine pregnancy",
    "C7A.00": "Malignant carcinoid tumor of unspecified site",
    "C7A.01": "Malignant carcinoid tumor of small intestine",
    "D3A.00": "Benign carcinoid tumor of unspecified site",
    "D3A.01": "Benign carcinoid tumor of small intestine",
    "C74.10": "Malignant neoplasm of medulla of unspecified adrenal gland",
    "C16.9": "Malignant neoplasm of stomach, unspecified",
    "Z12.39": "Encounter for screening for malignant neoplasm of other site",
    "C53.9": "Malignant neoplasm of cervix uteri, unspecified",
    "C44.99": "Other specified malignant neoplasm of skin, unspecified",
    "C91.10": "Chronic lymphocytic leukemia of B-cell type not having achieved remission",
    "Z15.01": "Genetic susceptibility to malignant neoplasm of breast",
    "Z15.02": "Genetic susceptibility to malignant neoplasm of ovary",
    "C54.1": "Malignant neoplasm of endometrium",
    "Z15.09": "Genetic susceptibility to other malignant neoplasm",
    "D12.6": "Benign neoplasm of colon, unspecified",
    "G11.3": "Cerebellar ataxia with defective DNA repair",
    "G30.9": "Alzheimer disease, unspecified",
    "Z84.89": "Family history of other conditions",
    "Z91.19": "Patient's noncompliance with other medical treatment and regimen",
    "F32.9": "Major depressive disorder, single episode, unspecified",
    "E83.118": "Other hemochromatosis",
    "Q99.2": "Fragile X chromosome",
    "F70": "Mild intellectual disabilities",
    "F79": "Unspecified intellectual disabilities",
    "G10": "Huntington disease",
    "Z14.1": "Cystic fibrosis carrier",
    "Q89.3": "Situs inversus",
    "E84.9": "Cystic fibrosis, unspecified",
    "G12.0": "Infantile spinal muscular atrophy, type I (Werdnig-Hoffman)",
    "G12.1": "Other inherited spinal muscular atrophy",
    "Z14.8": "Genetic carrier of other disease",
    "D68.51": "Activated protein C resistance",
    "D68.52": "Prothrombin gene mutation",
    "G72.9": "Myopathy, unspecified",
    "J30.1": "Allergic rhinitis due to pollen",
    "L50.0": "Allergic urticaria",
    "T78.1XXA": "Other adverse food reactions, not elsewhere classified, initial encounter",
    "L27.2": "Dermatitis due to ingested food",
    "K52.29": "Allergic and dietetic gastroenteritis and colitis",
    "T78.00XA": "Anaphylactic reaction due to unspecified food, initial encounter",
    "J30.2": "Other seasonal allergic rhinitis",
    "J30.89": "Other allergic rhinitis",
    "J45.20": "Mild intermittent asthma, uncomplicated",
    "J30.81": "Allergic rhinitis due to animal (cat)(dog) hair and dander",
    "L23.5": "Allergic contact dermatitis due to other chemical products",
    "Z77.098": "Contact with and suspected exposure to other hazardous substances",
    "G43.909": "Migraine, unspecified, not intractable, without status migrainosus",
    "T63.441A": "Toxic effect of venom of bees, accidental, initial encounter",
    "T63.461A": "Toxic effect of venom of wasps, accidental, initial encounter",
    "R68.89": "Other general symptoms and signs",
    "D72.1": "Eosinophilia",
    "D47.09": "Other mast cell neoplasms of uncertain behavior",
    "T78.2XXA": "Anaphylactic shock, unspecified, initial encounter",
    "K50.90": "Crohn disease, unspecified, without complications",
    "K51.90": "Ulcerative colitis, unspecified, without complications",
    "K58.9": "Irritable bowel syndrome without diarrhea",
    "Z12.11": "Encounter for screening for malignant neoplasm of colon",
    "K57.30": "Diverticulosis of large intestine without perforation or abscess without bleeding",
    "A07.9": "Protozoal intestinal disease, unspecified",
    "A06.9": "Amebiasis, unspecified",
    "A07.1": "Giardiasis",
    "A07.2": "Cryptosporidiosis",
    "B59": "Pneumocystosis",
    "A04.72": "Enterocolitis due to Clostridioides difficile, not specified as recurrent",
    "A04.71": "Enterocolitis due to Clostridioides difficile, recurrent",
    "A02.0": "Salmonella enteritis",
    "A03.9": "Shigellosis, unspecified",
    "A04.5": "Campylobacter enteritis",
    "A09": "Infectious gastroenteritis and colitis, unspecified",
    "K52.9": "Noninfective gastroenteritis and colitis, unspecified",
    "K90.49": "Malabsorption due to intolerance, not elsewhere classified",
    "K86.81": "Exocrine pancreatic insufficiency",
    "K86.1": "Other chronic pancreatitis",
    "K90.3": "Pancreatic steatorrhea",
    "K63.89": "Other specified diseases of intestine",
    "E16.4": "Increased secretion of gastrin",
    "K29.40": "Chronic atrophic gastritis without bleeding",
    "K31.89": "Other diseases of stomach and duodenum",
    "D51.0": "Vitamin B12 deficiency anemia due to intrinsic factor deficiency",
    "K90.41": "Non-celiac gluten sensitivity",
    "Z94.4": "Liver transplant status",
    "E63.9": "Nutritional deficiency, unspecified",
    "E72.19": "Other disorders of sulfur-bearing amino-acid metabolism",
    "Z13.228": "Encounter for screening for other metabolic disorders",
    "Z13.29": "Encounter for screening for other suspected endocrine disorder",
    "G40.909": "Epilepsy, unspecified, not intractable, without status epilepticus",
    "G50.0": "Trigeminal neuralgia",
    "G89.29": "Other chronic pain",
    "B95.62": "Methicillin resistant Staphylococcus aureus infection as the cause of diseases classified elsewhere",
    "Z94.0": "Kidney transplant status",
    "L40.0": "Psoriasis vulgaris",
    "T39.1X1A": "Poisoning by 4-Aminophenol derivatives, accidental, initial encounter",
    "K71.10": "Toxic liver disease with hepatic necrosis, without coma",
    "T39.091A": "Poisoning by salicylates, accidental, initial encounter",
    "F10.10": "Alcohol abuse, uncomplicated",
    "P28.4": "Other apnea of newborn",
    "T39.311A": "Poisoning by propionic acid derivatives, accidental, initial encounter",
    "F20.9": "Schizophrenia, unspecified",
    "T43.011A": "Poisoning by tricyclic antidepressants, accidental, initial encounter",
    "C91.00": "Acute lymphoblastic leukemia not having achieved remission",
    "J45.51": "Severe persistent asthma with (acute) exacerbation",
    "J44.1": "Chronic obstructive pulmonary disease with (acute) exacerbation",
    "O02.9": "Abnormal product of conception, unspecified",
    "Z32.01": "Encounter for pregnancy test, result positive",
    "O24.419": "Gestational diabetes mellitus in pregnancy, unspecified control",
    "Q00.0": "Anencephaly",
    "P55.0": "Rh isoimmunization of newborn",
    "O99.281": "Endocrine, nutritional and metabolic diseases complicating pregnancy, first trimester",
    "O35.0": "Maternal care for (suspected) central nervous system malformation in fetus",
    "N46.021": "Azoospermia due to drug therapy",
    "P70.4": "Other neonatal hypoglycemia",
    "E10.0": "Type 1 diabetes mellitus with hyperosmolarity",
    "J09.X2": "Influenza due to identified novel influenza A virus with other respiratory manifestations",
    "J10.1": "Influenza due to other identified influenza virus with other respiratory manifestations",
    "P59.0": "Neonatal jaundice associated with preterm delivery",
    "P59.9": "Neonatal jaundice, unspecified",
    "E70.0": "Classical phenylketonuria",
    "E71.1": "Other disorders of branched-chain amino-acid metabolism",
    "N94.3": "Premenstrual tension syndrome",
    "F32.81": "Premenstrual dysphoric disorder",
    "D50.0": "Iron deficiency anemia secondary to blood loss (chronic)",
    "G25.81": "Restless legs syndrome",
    "F33.9": "Major depressive disorder, recurrent, unspecified",
    "F29": "Unspecified psychosis not due to a substance or known physiological condition",
    "D35.00": "Benign neoplasm of unspecified adrenal gland",
    "R20.9": "Unspecified disturbances of skin sensation",
    "C7A.010": "Malignant carcinoid tumor of the duodenum",
    "E03.0": "Congenital hypothyroidism with diffuse goiter",
    "R82.5": "Elevated urine levels of drugs, medicaments and biological substances",
    "I48.91": "Unspecified atrial fibrillation",
    "Z00.121": "Encounter for routine child health examination with abnormal findings",
    "N18.1": "Chronic kidney disease, stage 1",
    "N18.6": "End stage renal disease",
    "E83.110b": "Hereditary hemochromatosis (alternate)",
    "E84.0": "Cystic fibrosis with pulmonary manifestations",
    "J84.10": "Pulmonary fibrosis, unspecified",
    "O02.1": "Missed abortion",
    "O26.61": "Liver and biliary tract disorders in pregnancy, first trimester",
    "E82.955": "G6PD deficiency, quantitative",
    "B96.1": "Klebsiella pneumoniae as the cause of diseases classified elsewhere",
    "F41.1": "Generalized anxiety disorder",
    "M06.00": "Rheumatoid arthritis without rheumatoid factor, unspecified site",
    "K82.9": "Disease of gallbladder, unspecified",
    "R82.79": "Other abnormal findings on microbiological examination of urine",
    "Z13.88b": "Encounter for screening for disorder, not elsewhere classified",
    "T78.40XA": "Allergy, unspecified, initial encounter",
    "P29.3": "Persistent pulmonary hypertension of newborn",
    "E28.2": "Polycystic ovarian syndrome",
    "D68.51b": "Activated protein C resistance (Factor V Leiden)",
    "D68.52b": "Prothrombin gene mutation (G20210A)",
    "E83.118b": "Other hemochromatosis",
    "Z84.89b": "Family history of other specified conditions",
    "B87.338": "H pylori stool antigen",
    "D84.1b": "Defects in the complement system",
    "B87.430": "Strep A rapid test",
    "B87.880": "Strep A culture",
    "B86.592": "RPR test",
    "B86.780": "FTA-ABS test",
    "B86.695": "HSV-1 IgG",
    "B86.696": "HSV-2 IgG",
    "B86.694": "HSV IgM",
    "B87.529": "HSV PCR",
    "B87.661": "Trichomonas NAAT",
    "B87.563": "Mycoplasma genitalium NAAT",
    "B87.510": "BV testing",
    "B86.480": "QuantiFERON-TB",
    "B86.481": "T-SPOT.TB",
    "B86.580": "TB skin test",
    "B86.644": "CMV IgG",
    "B86.645": "CMV IgM",
    "B86.787": "VZV IgG",
    "B86.762": "Rubella IgG",
    "B86.765": "Measles IgG",
    "B86.735": "Mumps IgG",
    "B86.710": "Influenza antibody",
    "B86.789": "West Nile IgM/IgG",
    "B86.769": "SARS-CoV-2 antibody",
    "B87.635": "SARS-CoV-2 PCR",
    "Z87.09": "Personal history of other diseases of the respiratory system",
    "N18.1b": "CKD stage 1",
    "R09.0": "Asphyxia and hypoxemia",
    "E87.3": "Alkalosis",
    "C34.10": "Malignant neoplasm of upper lobe, unspecified bronchus or lung",
    "J84.116b": "Interstitial lung disease",
    "R82.4b": "Acetonuria",
    "K84.145": "DCP/PIVKA-II test code",  # simplified
    "B86.308": "Mono Spot (Heterophile Antibody)",
    "B86.777": "Toxoplasma IgG",
    "B86.778": "Toxoplasma IgM",
    "B86.677": "H. pylori antibody",
    "B87.338b": "H. pylori antigen stool",
    "B83.013": "H. pylori breath test 13C",
    "B83.014": "H. pylori breath test 14C",
    "E82.127": "Pancreatic elastase",
    "E82.710": "Fecal fat test",
    "K91.065": "SIBO breath test",
    "E82.938": "Gastrin, fasting",
    "E82.941": "Gastrin, stimulated",
    "E82.239": "Bile acids test",
    "Z13.220b": "Encounter for screening for lipoid disorders",
    "D57.1b": "Sickle cell disease without crisis (dup)",
    "D57.3b": "Sickle cell trait (dup)",
    "D55.0b": "G6PD deficiency (dup)",
    "R80.0b": "Isolated proteinuria (dup)",
    "E84.9b": "Cystic fibrosis unspecified (dup)",
    "E87.2b": "Acidosis (dup)",
    "N18.9b": "CKD unspecified (dup)",
    "N39.0b": "UTI (dup)",
    "E11.9b": "T2DM without complications (dup)",
    "Z34.00b": "Supervision of normal first pregnancy (dup)",
    "B18.1b": "Chronic HBV without delta (dup)",
    "N97.0b": "Female infertility anovulation (dup)",
    "E28.319b": "Premature menopause unspecified (dup)",
    "C50.919b": "Malignant neoplasm breast (dup)",
    "D64.9b": "Anemia unspecified (dup)",
    "D50.9b": "Iron deficiency anemia unspecified (dup)",
    "D70.9b": "Neutropenia unspecified (dup)",
    "E03.9b": "Hypothyroidism unspecified (dup)",
    "E05.90b": "Thyrotoxicosis unspecified (dup)",
    "K74.60b": "Cirrhosis of liver unspecified (dup)",
    "K70.30b": "Alcoholic cirrhosis (dup)",
    "M06.9b": "RA unspecified (dup)",
    "B18.2b": "Chronic HCV (dup)",
    "I21.9b": "Acute MI unspecified (dup)",
    "R07.9b": "Chest pain unspecified (dup)",
    "I50.9b": "Heart failure unspecified (dup)",
    "J18.9b": "Pneumonia unspecified organism (dup)",
    "I25.10b": "Atherosclerotic heart disease (dup)",
    "E55.9b": "Vitamin D deficiency unspecified (dup)",
    "E53.8b": "Deficiency of other B vitamins (dup)",
    "G62.9b": "Polyneuropathy unspecified (dup)",
    "D52.9b": "Folate deficiency anemia unspecified (dup)",
    "D51.9b": "Vitamin B12 deficiency anemia unspecified (dup)",
    "E50.9b": "Vitamin A deficiency unspecified (dup)",
    "E56.0b": "Vitamin E deficiency (dup)",
    "E60b": "Dietary zinc deficiency (dup)",
    "E59b": "Dietary selenium deficiency (dup)",
    "M10.00b": "Idiopathic gout (dup)",
    "N20.0b": "Calculus of kidney (dup)",
    "C90.00b": "Multiple myeloma (dup)",
    "C83.90b": "Non-follicular lymphoma (dup)",
    "E72.11b": "Homocystinuria (dup)",
    "Z13.88b2": "Encounter for screening (dup)",
    "Z71.3b": "Dietary counseling (dup)",
    "E78.5b": "Hyperlipidemia unspecified (dup)",
    "E78.00b": "Pure hypercholesterolemia (dup)",
    "K90.0b": "Celiac disease (dup)",
    "B96.81b": "H pylori (dup)",
    "K25.9b": "Gastric ulcer (dup)",
    "E27.1b": "Primary adrenocortical insufficiency (dup)",
    "E28.319c": "Premature menopause (dup2)",
    "R53.83b": "Other fatigue (dup)",
    "E29.1b": "Testicular hypofunction (dup)",
    "E28.1b": "Androgen excess (dup)",
    "F41.9b": "Anxiety disorder unspecified (dup)",
    "E24.9b": "Cushing syndrome unspecified (dup)",
    "E27.40b": "Unspecified adrenocortical insufficiency (dup)",
    "N91.0b": "Primary amenorrhea (dup)",
    "E22.0b": "Acromegaly (dup)",
    "E23.0b": "Hypopituitarism (dup)",
    "I10b": "Essential hypertension (dup)",
    "E26.09b": "Other primary hyperaldosteronism (dup)",
    "D84.9b": "Immunodeficiency unspecified (dup)",
    "B82.9b": "Intestinal parasitism (dup)",
    "J45.50b": "Severe persistent asthma (dup)",
    "L20.9b": "Atopic dermatitis (dup)",
    "A41.9b": "Sepsis unspecified (dup)",
    "R50.9b": "Fever unspecified (dup)",
    "B99.9b": "Other infectious disease (dup)",
    "D76.1b": "HLH (dup)",
    "D84.1c": "Complement system defects (dup)",
    "D83.9b": "Common variable immunodeficiency (dup)",
    "D80.0b": "Hereditary hypogammaglobulinemia (dup)",
    "D80.2b": "Selective IgA deficiency (dup)",
    "C88.0b": "Waldenstrom (dup)",
    "D80.9b": "Immunodeficiency with antibody defects (dup)",
    "D80.3b": "Selective IgG subclass deficiency (dup)",
    "B20b": "HIV disease (dup)",
    "Z21b": "Asymptomatic HIV (dup)",
    "C90.10b": "Plasma cell leukemia (dup)",
    "D89.2b": "Hypergammaglobulinemia (dup)",
    "M32.9b": "SLE unspecified (dup)",
    "M35.00b": "Sicca syndrome (dup)",
    "D68.61b": "Antiphospholipid syndrome (dup)",
    "M34.0b": "Progressive systemic sclerosis (dup)",
    "M34.9b": "Systemic sclerosis (dup)",
    "M34.1b": "CREST syndrome (dup)",
    "M33.20b": "Polymyositis (dup)",
    "J84.116c": "Cryptogenic organizing pneumonia (dup)",
    "M05.79b": "RA with rheumatoid factor (dup)",
    "M31.30b": "Wegener granulomatosis (dup)",
    "M31.7b": "Microscopic polyangiitis (dup)",
    "M30.1b": "Churg-Strauss (dup)",
    "M45.9b": "Ankylosing spondylitis (dup)",
    "E06.3b": "Autoimmune thyroiditis (dup)",
    "C73b": "Malignant neoplasm of thyroid (dup)",
    "D89.1b": "Cryoglobulinemia (dup)",
    "D68.59b": "Other primary thrombophilia (dup)",
    "E83.110b": "Hereditary hemochromatosis (dup)",
    "E83.01b": "Wilson disease (dup)",
    "E86.0b": "Dehydration (dup)",
    "T51.0X1Ab": "Toxic effects ethanol (dup)",
    "K82.355": "Kidney stone analysis",
    "N84.105": "Phosphorus urine",
    "K84.133": "Potassium urine",
    "K84.300": "Sodium urine",
    "N82.232": "Beta-2 microglobulin urine",
    "N86.849": "Galectin-3 / ST2",
    "N83.519": "Myeloperoxidase test",
    "N84.591": "Tryptophan plasma",
    "N82.139": "GABA plasma",
    "N83.150": "HVA urine",
    "D86.692": "Hepatitis D antibody",
    "D86.699": "Hepatitis E antibody",
    "B86.618": "Lyme ELISA",
    "B86.617": "Lyme Western Blot",
    "B86.000": "RMSF antibody",
    "I82.401b": "DVT (dup)",
    "Z79.01b": "Anticoagulant use (dup)",
    "E83.50b": "Calcium metabolism disorder (dup)",
    "E21.0b": "Primary hyperparathyroidism (dup)",
    "E20.9b": "Hypoparathyroidism (dup)",
    "E83.30b": "Phosphorus metabolism disorder (dup)",
    "D50.1b": "Sideropenic dysphagia (dup)",
    "E83.10b": "Hemochromatosis unspecified (dup)",
    "R71.0b": "Hematocrit abnormality (dup)",
    "Z79.899b": "Other long-term drug therapy (dup)",
    "E82.382": "Catecholamines urine",
    "E82.383": "Catecholamines urine norepinephrine",
    "E83.835": "Metanephrines urine",
    "E84.260": "Serotonin serum",
    "Z86.19b": "Personal history other infectious diseases (dup)",
    "E87.1b": "Hyponatremia (dup)",
    "K84.155": "Total protein alternate code",
    "D59.9b": "Acquired hemolytic anemia (dup)",
    "C80.1b": "Malignant neoplasm unspecified (dup)",
    "M62.9b": "Disorder of muscle (dup)",
    "I48.91b": "Unspecified atrial fibrillation (dup)",
    "E87.6b": "Hypokalemia (dup)",
    "E87.5b": "Hyperkalemia (dup)",
    "E87.0b": "Hypernatremia (dup)",
    "E87.8b": "Other electrolyte disorders (dup)",
    "R79.89b": "Other abnormal blood chemistry findings (dup)",
    "T57.2XXA": "Toxic effects of manganese and its compounds, accidental, initial encounter",
    "E61.3": "Manganese deficiency",
    "E61.5": "Molybdenum deficiency",
    "E00.9b": "Congenital iodine-deficiency (dup)",
    "E01.8c": "Other iodine-deficiency thyroid disorders (dup)",
    "E83.40b": "Magnesium metabolism disorder (dup)",
    "E83.42b": "Hypomagnesemia (dup)",
    "K74.60c": "Cirrhosis unspecified (dup2)",
    "M85.80b": "Bone density disorder (dup)",
    "E44.0b": "Moderate protein-calorie malnutrition (dup)",
    "R78.89b": "Other substances in blood (dup)",
    "J43.9b": "Emphysema unspecified (dup)",
    "K74.69b": "Other cirrhosis (dup)",
    "K72.90b": "Hepatic failure (dup)",
    "G93.41b": "Metabolic encephalopathy (dup)",
    "E72.20b": "Urea cycle disorder (dup)",
    "E83.01c": "Wilson disease (dup2)",
    "K74.00b": "Hepatic fibrosis (dup)",
    "E80.4b": "Gilbert syndrome (dup)",
    "R17b": "Jaundice (dup)",
    "D59.9c": "Acquired hemolytic anemia (dup2)",
    "K80.20b": "Gallbladder calculus (dup)",
    "B18.2c": "Chronic HCV (dup2)",
    "B18.1c": "Chronic HBV (dup2)",
    "B18.0b": "Chronic HBV with delta (dup)",
    "O26.61b": "Liver disorders pregnancy (dup)",
    "K84.080": "ALP isoenzymes",
    "J84.10b": "Pulmonary fibrosis (dup)",
    "B86.663": "EBV VCA IgM",
    "B86.664": "EBV VCA IgG",
    "B86.665": "EBV EBNA",
    "B87.350": "HBeAg",
    "B86.707": "anti-HBe",
    "B87.517": "HBV DNA viral load",
    "B86.803": "HCV antibody",
    "B87.522": "HCV RNA viral load",
    "B87.902": "HCV genotype",
    "B86.703": "HIV 1+2 antibody",
    "B87.389": "HIV Ag/Ab 4th gen",
    "B87.536": "HIV RNA viral load",
    "B87.491": "Chlamydia NAAT",
    "B87.591": "Gonorrhea NAAT",
    "B86.592b": "RPR (dup)",
    "B86.780b": "FTA-ABS (dup)",
    "N82.570": "Urine creatinine",
    "N83.935": "Osmolality urine",
    "N83.930": "Osmolality serum",
    "N80.069": "Kidney function panel",
    "B87.086": "Urine culture bacteria",
    "E82.340": "Calcium urine 24hr",
    "N84.300b": "Sodium urine (dup)",
    "K84.156": "Protein urine",
    "E82.043": "Microalbumin urine",
    "N82.610": "Cystatin C",
    "D68.9b": "Coagulation defect (dup)",
    "I26.99b": "Pulmonary embolism (dup)",
    "D65b": "DIC (dup)",
    "D68.8b": "Other coagulation defects (dup)",
    "D68.2b": "Hereditary clotting factor deficiency (dup)",
    "D69.1b": "Qualitative platelet defects (dup)",
    "D68.0b": "Von Willebrand disease (dup)",
    "D66b": "Hemophilia A (dup)",
    "D67b": "Hemophilia B (dup)",
    "D89.1c": "Cryoglobulinemia (dup2)",
    "E83.00b": "Copper metabolism disorder (dup)",
    "K82.390": "Ceruloplasmin test",
    "K82.525": "Copper serum in liver context",
    "K82.977": "GGTP/GGT test",
    "K82.140": "Ammonia test",
    "K82.103": "Alpha-1 antitrypsin test",
    "K85.610": "PT/INR liver context",
    "K80.076": "Hepatic function panel",
    "K82.247": "Total bilirubin",
    "K82.248": "Direct bilirubin",
    "K84.460": "ALT test",
    "K84.450": "AST test",
    "K84.075": "ALP test",
    "K82.040": "Albumin serum",
    "K84.155b": "Total protein (dup)",
    "N86.200": "Anti-CCP",
    "M86.235": "Anti-nuclear antibody subtypes",
    "M86.596": "ANCA test",
    "M86.147": "Anticardiolipin antibody",
    "M86.148": "Anti-beta2 glycoprotein",
    "M85.613": "Lupus anticoagulant",
    "M86.812": "HLA-B27",
    "N86.376": "Anti-TPO (autoimmune)",
    "N86.800": "Anti-thyroglobulin (autoimmune)",
    "N82.595": "Cryoglobulins test",
    "N86.141": "hs-CRP (inflammation)",
    "N86.140": "CRP quantitative",
    "N85.652": "ESR test",
    "N84.145": "Procalcitonin",
    "N83.519b": "IL-6 test",
    "N83.519c": "TNF-Alpha test",
    "N82.728": "Ferritin (inflammation)",
    "N85.025": "WBC differential",
    "N86.160": "Complement C3",
    "N86.161": "Complement C4",
    "N86.162": "Total complement CH50",
    "N82.784": "Immunoglobulin levels",
    "N82.785": "Total IgE",
    "N82.787": "IgG subclasses",
    "N86.360": "CD4/CD8 ratio",
    "N86.355": "NK cells",
    "N82.232b": "Beta-2 microglobulin",
    "N84.165": "SPEP test",
    "N86.334": "Immunofixation",
    "N83.519d": "Serum free light chains",
    "B86.704": "HBc total antibody",
    "B86.705": "HBc IgM antibody",
    "B86.706": "HBs antibody",
    "B87.340": "HBsAg",
    "B86.708": "HAV total antibody",
    "B86.709": "HAV IgM",
    "D86.803b": "HCV antibody (dup)",
    "F31.0": "Bipolar disorder, current episode hypomanic",
    "K84.166": "UPEP test",
    "B82.104": "AFP L3%",
    "B86.304": "CA-125",
    "B86.305": "HE4",
    "B86.849": "Galectin-3 / tryptase",
    "B82.308": "Calcitonin (cancer)",
    "B86.316": "Chromogranin A / NSE / CA 72-4 / CYFRA / SCC",
    "B82.088": "5-HIAA urine",
    "B84.432": "Thyroglobulin (cancer)",
    "B86.300": "CA 15-3 / CA 27-29",
    "B86.301": "CA 19-9",
    "B82.378": "CEA",
    "B82.105": "AFP",
    "B84.702": "Beta-HCG quantitative",
    "B84.703": "Beta-HCG qualitative",
    "B83.615": "LDH (cancer)",
    "B84.153": "PSA total",
    "B84.154": "PSA free",
    "B86.336": "Inhibin B (cancer)",
    "N81.291": "MTHFR gene analysis",
    "N81.241": "Factor V Leiden",
    "N81.240": "Prothrombin G20210A",
    "N81.256": "HFE gene",
    "N81.162": "BRCA1/BRCA2",
    "N81.292": "Lynch syndrome panel",
    "N81.201": "APC gene",
    "N81.317": "PALB2 gene",
    "N81.408": "ATM gene",
    "N81.403": "CHEK2 gene",
    "N81.401": "ApoE genotype",
    "N81.225": "CYP2C19 genotype",
    "N81.226": "CYP2D6 genotype",
    "N81.227": "CYP2C9 genotype",
    "N81.355": "VKORC1 genotype",
    "N81.335": "TPMT genotype",
    "N81.381": "HLA-DQ2/DQ8",
    "N81.243": "Fragile X",
    "N81.271": "Huntington disease gene",
    "N81.220": "CF carrier screen",
    "N81.329": "SMA carrier",
    "N81.361": "Sickle cell genotyping",
    "N81.406": "Wilson disease gene",
    "N81.328": "SLCO1B1",
    "N86.003": "Specific IgE",
    "N82.785b": "Total IgE (allergy)",
    "T82.270": "Occult blood fecal guaiac",
    "T82.274": "Occult blood fecal FIT",
    "T81.528": "Cologuard stool DNA",
    "T87.177": "Ova and parasites",
    "T87.329": "Giardia antigen",
    "T87.272": "Cryptosporidium antigen",
    "T87.493": "C. difficile toxin",
    "T87.045": "Stool culture",
    "T83.993": "Calprotectin fecal",
    "T83.519": "Lactoferrin fecal",
    "T82.127": "Pancreatic elastase",
    "T82.710": "Fecal fat",
    "T91.065": "SIBO breath test",
    "E82.938b": "Gastrin test",
    "K82.239": "Bile acids serum",
    "K84.080b": "ALP isoenzymes (dup)",
    "N84.255": "5-nucleotidase",
    "N87.800": "Gut microbiome analysis",
    "D86.663": "EBV VCA IgM (dup)",
    "D86.664": "EBV VCA IgG (dup)",
    "D86.665": "EBV EBNA (dup)",
    "B87.070": "Strep A culture",
    "B87.804": "Flu rapid test",
    "E84.030": "PKU phenylalanine",
    "N82.382": "Catecholamines urine (dup)",
    "N82.383": "Catecholamines norepinephrine (dup)",
    "N83.835": "Metanephrines urine (dup)",
    "N84.260": "Serotonin serum (dup)",
    "N84.591b": "Tryptophan plasma (dup)",
    "N82.139b": "GABA plasma (dup)",
    "N83.150b": "HVA urine (dup)",
    "E82.677": "Estriol (E3)",
    "E84.144": "Progesterone",
    "E84.143": "17-OH Progesterone",
    "E83.001": "FSH",
    "E83.002": "LH",
    "E84.146": "Prolactin",
    "E82.627": "DHEA-S",
    "E82.626": "DHEA unconjugated",
    "E82.157": "Androstenedione",
    "E82.533": "Cortisol AM",
    "E82.530": "Cortisol 24hr urine / salivary",
    "E82.024": "ACTH",
    "E84.305": "IGF-1",
    "E83.003": "Growth hormone",
    "E82.088": "Aldosterone serum / urine",
    "E84.244": "Renin activity / direct",
    "E84.402": "Free testosterone",
    "E84.403": "Total testosterone",
    "E82.670": "Estradiol",
    "E82.679": "Estrone",
    "E84.270": "SHBG",
    "E86.291": "AMH",
    "E86.336": "Inhibin B (fertility)",
    "E82.672": "Total estrogen / estrogen metabolites",
    "E84.140": "Pregnenolone",
    "E83.519": "Melatonin / specialty hormone test",
    "B87.086b": "Urine culture (dup)",
    "B86.900": "ABO blood type",
    "B86.901": "Rh factor",
    "B86.850": "Antibody screen / indirect Coombs",
    "K84.443": "TSH (pregnancy)",
    "K82.951": "Glucose challenge / OGTT",
    "K84.163": "PAPP-A",
    "K81.420": "Cell-free DNA (NIPT)",
    "K88.235": "Chromosomal analysis amnio",
    "K88.267": "Chromosomal analysis CVS",
    "K86.762b": "Rubella IgG (pregnancy)",
    "K87.340": "HBsAg (pregnancy)",
    "K87.389": "HIV screening (pregnancy)",
    "K86.592": "Syphilis RPR (pregnancy)",
    "K87.086": "Urine culture (pregnancy)",
    "K87.081": "GBS culture",
    "K84.702": "Beta-HCG quantitative (pregnancy)",
    "K84.703": "Beta-HCG qualitative (pregnancy)",
    "K86.777": "Toxoplasma IgG (pregnancy)",
    "K86.778": "Toxoplasma IgM (pregnancy)",
    "K86.644": "CMV IgG (pregnancy)",
    "K86.645": "CMV IgM (pregnancy)",
    "E89.300": "Semen analysis",
    "E89.330": "Sperm DNA fragmentation",
    "P13.228": "Newborn metabolic screen",
    "P83.655": "Lead blood pediatric",
    "P85.018": "Hemoglobin pediatric",
    "P85.014": "Hematocrit pediatric",
    "P82.728": "Ferritin pediatric",
    "P83.540": "Iron pediatric",
    "P83.550": "TIBC pediatric",
    "P85.025": "CBC pediatric",
    "P83.036": "HbA1c pediatric",
    "P82.947": "Glucose fasting pediatric",
    "P80.061": "Lipid panel pediatric",
    "P84.443": "TSH pediatric",
    "P82.306": "Vitamin D pediatric",
    "P87.880": "Strep A rapid pediatric",
    "P87.070": "Strep A culture pediatric",
    "P87.804": "Flu rapid pediatric",
    "P86.200": "Celiac screen pediatric",
    "P82.784": "Total IgA pediatric",
    "P85.660": "HbS screen pediatric",
    "P83.020": "Hemoglobin electrophoresis pediatric",
    "P82.955": "G6PD screen pediatric",
    "P82.247": "Bilirubin neonatal",
    "P84.030": "PKU screen",
    "E80.178": "Lithium level drug monitoring",
    "E80.162": "Digoxin level",
    "E80.185": "Phenytoin level",
    "E80.186": "Phenytoin free level",
    "E80.164": "Valproic acid level",
    "E80.156": "Carbamazepine level",
    "E80.157": "Carbamazepine free level",
    "E80.184": "Phenobarbital level",
    "E80.175": "Lamotrigine level",
    "E80.177": "Levetiracetam level",
    "E80.182": "Oxcarbazepine level",
    "E80.201": "Topiramate level",
    "E80.203": "Zonisamide level",
    "E80.154": "Clonazepam level",
    "E80.171": "Gabapentin level",
    "E80.202": "Vancomycin level",
    "E80.170": "Gentamicin level",
    "E80.200": "Tobramycin level",
    "E80.150": "Amikacin level",
    "E80.158": "Cyclosporine level",
    "E80.197": "Tacrolimus level",
    "E80.195": "Sirolimus level",
    "E80.198": "Theophylline level",
    "E80.143": "Acetaminophen level",
    "E80.196": "Salicylate / ibuprofen level",
    "E80.155": "Caffeine level",
    "E80.159": "Clozapine level",
    "E80.173": "Haloperidol level",
    "E80.169": "TCA level",
    "E80.182b": "Nortriptyline / methotrexate / MPA level",
    "D35.00b": "Benign neoplasm adrenal (dup)",
    "R20.9b": "Skin sensation disturbances (dup)",
    "N95.1b": "Menopausal states (dup)",
    "F32.81b": "PMDD (dup)",
    "N94.3b": "PMS (dup)",
    "G25.81b": "RLS (dup)",
    "D50.9c": "Iron deficiency anemia (dup2)",
    "F32.9b": "MDD (dup)",
    "R53.83c": "Fatigue (dup2)",
    "D64.9c": "Anemia (dup2)",
    "E03.9c": "Hypothyroidism (dup2)",
    "E05.90c": "Thyrotoxicosis (dup2)",
    "E55.9c": "Vitamin D deficiency (dup2)",
    "E53.8c": "B vitamin deficiency (dup2)",
    "E83.40c": "Magnesium disorder (dup2)",
    "E60c": "Zinc deficiency (dup2)",
    "E29.1c": "Testicular hypofunction (dup2)",
    "E28.319d": "Premature menopause (dup3)",
    "E27.49b": "Other adrenocortical insufficiency (dup)",
    "F41.9c": "Anxiety (dup2)",
    "E72.11c": "Homocystinuria (dup2)",
    "G30.9b": "Alzheimer (dup)",
    "E82.726": "Omega-3 index / fatty acid profile",
    "E78.5c": "Hyperlipidemia (dup2)",
    "I25.10c": "ASCVD (dup2)",
    "R09.89b": "Other circulatory/respiratory symptoms (dup)",
    "N84.484": "Troponin I",
    "N83.880": "BNP / NT-proBNP",
    "N82.552": "CK total",
    "N82.553": "CK-MB",
    "N83.874": "Myoglobin",
    "N83.698": "Lp-PLA2",
    "N82.977": "GGT (cardiovascular)",
    "B86.880": "Mono Spot",
    "B87.040": "Blood culture",
    "Z34.00c": "Normal pregnancy (dup2)",
    "O09.90b": "High risk pregnancy (dup)",
    "O00.90b": "Ectopic pregnancy (dup)",
    "O02.9b": "Abnormal product of conception (dup)",
    "O24.419b": "GDM (dup)",
    "O28.1b": "Abnormal biochemical finding prenatal (dup)",
    "Z36b": "Antenatal screening (dup)",
    "Z32.01b": "Pregnancy test positive (dup)",
    "P55.0b": "Rh isoimmunization newborn (dup)",
    "O28.5b": "Abnormal finding antenatal screening (dup)",
    "P36.10b": "Neonatal sepsis strep (dup)",
    "N46.11b": "Organic oligospermia (dup)",
    "Z31.41b": "Fertility testing (dup)",
    "N97.0c": "Female infertility (dup2)",
    "E28.319e": "Premature menopause (dup4)",
    "N91.0c": "Amenorrhea (dup2)",
    "N46.021b": "Azoospermia drug therapy (dup)",
    "P70.4b": "Neonatal hypoglycemia (dup)",
    "E10.0b": "T1DM hyperosmolarity (dup)",
    "P59.0b": "Neonatal jaundice preterm (dup)",
    "P59.9b": "Neonatal jaundice (dup)",
    "E70.0b": "PKU (dup)",
    "E71.1b": "Branched-chain amino acid disorder (dup)",
    "Z13.228b": "Screening metabolic disorders (dup)",
    "D57.0b": "HbSS disease (dup)",
    "D56.1b": "Beta thalassemia (dup)",
    "D55.0c": "G6PD deficiency (dup2)",
    "J09.X2b": "Novel influenza A (dup)",
    "J10.1b": "Other influenza virus (dup)",
    "J11.1b": "Influenza unidentified (dup)",
    "K90.0c": "Celiac disease (dup2)",
    "D57.1c": "Sickle cell without crisis (dup2)",
    "D57.3c": "Sickle cell trait (dup2)",
    "E83.01d": "Wilson disease (dup3)",
    "Z31.82b": "Rh incompatibility (dup)",
    "O99.281b": "Endocrine disease pregnancy (dup)",
    "O35.0b": "CNS malformation fetus (dup)",
    "P37.1b": "Congenital toxoplasmosis (dup)",
    "B58.9b": "Toxoplasmosis (dup)",
    "P35.1b": "Congenital CMV (dup)",
    "E82.955b": "G6PD screen (dup)",
    "E82.960": "G6PD quantitative",
    "D86.038": "ANA screen IFA",
    "D86.039": "ANA titer and pattern",
    "D86.225": "Anti-dsDNA antibody",
    "E84.550": "Uric acid",
    "N83.605": "Lactate (lactic acid)",
    "E84.100": "Phosphorus (phosphate)",
    "E82.310": "Calcium serum",
    "E82.330": "Calcium ionized",
    "E83.735": "Magnesium serum",
    "E84.295": "Sodium",
    "E84.132": "Potassium",
    "E82.435": "Chloride",
    "E82.374": "CO2 bicarbonate",
    "E84.520": "BUN",
    "E82.565": "Creatinine serum",
    "E80.053": "CMP",
    "E80.048": "BMP",
    "E80.051": "Electrolyte panel",
    "E82.947": "Glucose fasting",
    "E82.948": "Glucose random",
    "E82.950": "Glucose post-prandial",
    "E82.951": "OGTT",
    "E83.036": "HbA1c",
    "E83.525": "Insulin fasting",
    "E84.681": "C-peptide",
    "E81.003": "Glucose urine",
    "E82.009": "Ketones serum",
    "E82.010": "Beta-hydroxybutyrate",
    "E82.985": "Fructosamine",
    "E80.061": "Lipid panel",
    "E82.465": "Total cholesterol",
    "E83.718": "HDL cholesterol",
    "E83.721": "LDL direct",
    "E84.478": "Triglycerides / VLDL",
    "E82.172": "ApoB / ApoA-1",
    "E83.695": "Lp(a)",
    "E83.704": "NMR LipoProfile / CardioIQ / VAP",
    "E86.141": "hs-CRP (cardiovascular)",
    "E86.140": "CRP standard (cardiovascular)",
    "E83.090": "Homocysteine (cardiovascular)",
    "E84.484": "Troponin I (cardiovascular)",
    "E83.880": "BNP / NT-proBNP (cardiovascular)",
    "E86.849": "Galectin-3 / ST2 (cardiovascular)",
    "E82.552": "CK total (cardiovascular)",
    "E82.553": "CK-MB (cardiovascular)",
    "E83.874": "Myoglobin (cardiovascular)",
    "E85.384": "Fibrinogen (cardiovascular)",
    "E83.698": "Lp-PLA2 (cardiovascular)",
    "E82.977": "GGT (cardiovascular)",
    "E84.550b": "Uric acid (cardiovascular)",
    "E82.306": "Vitamin D 25-OH",
    "E82.652": "Vitamin D 1,25-dihydroxy",
    "E82.607": "Vitamin B12",
    "E82.746": "Folate serum",
    "E82.747": "Folate RBC",
    "E83.921": "Methylmalonic acid",
    "E84.425": "Vitamin B1 (thiamine)",
    "E84.252": "Vitamin B2 (riboflavin)",
    "E84.591": "Vitamin B3 / B5 / specialty vitamins",
    "E84.207": "Vitamin B6 (pyridoxine)",
    "E82.380": "Vitamin A (retinol)",
    "E82.180": "Vitamin C",
    "E84.446": "Vitamin E",
    "E84.597": "Vitamin K1 / K2",
    "E84.630": "Zinc serum",
    "E82.525": "Copper serum",
    "E84.255": "Selenium serum",
    "E84.999": "Iodine serum/urine",
    "E82.495": "Chromium",
    "E83.785": "Manganese",
    "E83.986": "Molybdenum",
    "E83.015": "Heavy metals panel",
    "E83.655": "Lead blood",
    "E83.825": "Mercury blood",
    "E82.175": "Arsenic blood/urine",
    "E82.300": "Cadmium blood/urine",
    "N81.001": "Urinalysis complete",
    "N81.003": "Urinalysis dipstick",
    "N81.002": "Urinalysis non-automated",
    "N87.086c": "Urine culture (kidney)",
    "N82.565": "Creatinine serum (kidney)",
    "N84.520": "BUN (kidney)",
    "N82.610b": "Cystatin C (kidney)",
    "N82.043": "Microalbumin urine",
    "N84.156": "Protein urine",
    "N84.550": "Uric acid (kidney)",
    "N82.570b": "Urine creatinine (kidney)",
    "N83.935b": "Osmolality urine (kidney)",
    "N83.930b": "Osmolality serum (kidney)",
    "N80.069b": "Kidney function panel (kidney)",
    "N84.105": "Phosphorus urine",
    "N82.340": "Calcium urine 24hr",
    "N84.133": "Potassium urine",
    "N84.300c": "Sodium urine (kidney)",
    "N82.232c": "Beta-2 microglobulin urine (kidney)",
    "N82.355": "Kidney stone analysis",
    "E82.082": "Aldosterone:renin ratio",
    "B87.800": "Gut microbiome (verify)",
    "D86.880": "Direct Coombs (DAT)",
    "D86.850": "Indirect Coombs (IAT)",
    "D86.900": "ABO blood type",
    "D86.901": "Rh factor",
    "R09.02b": "Hypoxemia (dup)",
    "D75.1b": "Polycythemia (dup)",
    "D69.6b": "Thrombocytopenia (dup)",
    "D69.59b": "Secondary thrombocytopenia (dup)",
    "D61.9b": "Aplastic anemia (dup)",
    "B55.0b": "Leishmaniasis (dup)",
    "D57.0c": "HbSS disease (dup2)",
    "D56.1c": "Beta thalassemia (dup2)",
    "D55.0d": "G6PD deficiency (dup3)",
    "D59.1b": "AIHA (dup)",
    "P55.9b": "HDN (dup)",
    "T80.30XAb": "ABO incompatibility (dup)",
    "Z01.83b": "Blood typing encounter (dup)",
    "O29.90b": "Anesthesia complication pregnancy (dup)",
    "L93.0b": "Discoid lupus (dup)",
    "M30.3b": "Kawasaki (dup)",
    "E87.2c": "Acidosis (dup2)",
    "E10.10b": "T1DM ketoacidosis (dup)",
    "E11.10b": "T2DM ketoacidosis (dup)",
    "R81b": "Glycosuria (dup)",
    "R82.4c": "Acetonuria (dup2)",
    "D58.2b": "Other hemoglobinopathies (dup)",
    "E79.0b": "Hyperuricemia (dup)",
    "E16.0b": "Drug-induced hypoglycemia (dup)",
    "E16.1b": "Other hypoglycemia (dup)",
    "R73.01b": "Impaired fasting glucose (dup)",
    "R73.09b": "Other abnormal glucose (dup)",
    "Z13.1b": "Screening diabetes (dup)",
    "E11.9c": "T2DM (dup2)",
    "E10.9b": "T1DM (dup)",
    "N18.9c": "CKD (dup2)",
    "Z00.00b": "General adult exam (dup)",
    "B86.812b": "HLA-B27 (dup)",
    "M45.9c": "AS (dup2)",
    "M07.60b": "Enteropathic arthropathy (dup)",
    "M08.1b": "Juvenile AS (dup)",
    "M32.89b": "Other SLE (dup)",
    "M35.09b": "Other sicca syndrome (dup)",
    "M31.0b": "Hypersensitivity angiitis (dup)",
    "N08b": "Glomerular disorders (dup)",
    "M32.10b": "SLE organ involvement (dup)",
    "M32.12b": "SLE renal (dup)",
    "E06.3c": "Autoimmune thyroiditis (dup2)",
    "E05.00b": "Graves disease (dup)",
    "C73c": "Thyroid malignancy (dup2)",
    "O26.119b": "Low weight gain pregnancy (dup)",
}

# Assign UUIDs to ICD-10 codes
icd10_uuids = {}
icd10_counter = 1
for code in sorted(all_icd10.keys()):
    uuid = f"b{icd10_counter:07d}-0000-0000-0000-000000000000"
    desc = ICD10_DESCRIPTIONS.get(code, f"ICD-10 code {code}")
    icd10_uuids[code] = {"uuid": uuid, "code": code, "description": desc}
    icd10_counter += 1

print(f"Found {len(icd10_uuids)} unique ICD-10 codes", file=sys.stderr)

# Generate SQL
output_lines = []

def w(line=""):
    output_lines.append(line)

w("-- LabLooker seed-full.sql")
w("-- Generated from test-database-research.md")
w(f"-- Tests: {len(tests)} | ICD-10 Codes: {len(icd10_uuids)} | Labs: 10 | Symptoms: 19 | States: 51")
w()
w("-- Clear existing data")
w("TRUNCATE tests, labs, icd10_codes, test_icd10_codes, states, symptoms CASCADE;")
w()
w("-- ============================================================")
w("-- TESTS")
w("-- ============================================================")
w()

for test in tests:
    name = escape_sql(test["name"])
    desc = escape_sql(test["description"])
    notes = escape_sql(test["notes"])
    category = test["category"]
    fasting = test["fasting"]
    cpt = test["cpt_codes"]
    uuid = test["uuid"]

    w(f"INSERT INTO tests (id, test_name, description, cpt_codes, category, fasting_required, notes)")
    w(f"VALUES ('{uuid}', '{name}', '{desc}', {cpt}, '{category}', {fasting}, '{notes}');")
    w()

w("-- ============================================================")
w("-- ICD-10 CODES")
w("-- ============================================================")
w()

for code in sorted(icd10_uuids.keys()):
    info = icd10_uuids[code]
    desc = escape_sql(info["description"])
    uuid = info["uuid"]
    w(f"INSERT INTO icd10_codes (id, code, description)")
    w(f"VALUES ('{uuid}', '{code}', '{desc}');")
    w()

w("-- ============================================================")
w("-- TEST_ICD10_CODES (Junction Table)")
w("-- ============================================================")
w()

for test in tests:
    for code in test["icd10_codes"]:
        if code in icd10_uuids:
            test_uuid = test["uuid"]
            icd10_uuid = icd10_uuids[code]["uuid"]
            w(f"INSERT INTO test_icd10_codes (test_id, icd10_code_id) VALUES ('{test_uuid}', '{icd10_uuid}');")

w()
w("-- ============================================================")
w("-- LABS")
w("-- ============================================================")
w()

labs = [
    ("d0000001-0000-0000-0000-000000000000", "Ulta Lab Tests", "https://ultalabtests.com", "intermediary", "Quest Diagnostics"),
    ("d0000002-0000-0000-0000-000000000000", "Walk-In Lab", "https://walkinlab.com", "intermediary", "Quest + LabCorp"),
    ("d0000003-0000-0000-0000-000000000000", "Request A Test", "https://requestatest.com", "intermediary", "Quest + LabCorp"),
    ("d0000004-0000-0000-0000-000000000000", "HealthLabs.com", "https://healthlabs.com", "intermediary", "Quest + LabCorp"),
    ("d0000005-0000-0000-0000-000000000000", "Any Lab Test Now", "https://anylabtestnow.com", "regional", "Independent labs"),
    ("d0000006-0000-0000-0000-000000000000", "Labcorp OnDemand", "https://ondemand.labcorp.com", "direct", "LabCorp"),
    ("d0000007-0000-0000-0000-000000000000", "Everlywell", "https://everlywell.com", "at_home", "Various"),
    ("d0000008-0000-0000-0000-000000000000", "LetsGetChecked", "https://letsgetchecked.com", "at_home", "Various"),
    ("d0000009-0000-0000-0000-000000000000", "Function Health", "https://functionhealth.com", "intermediary", "Quest"),
    ("d0000010-0000-0000-0000-000000000000", "Inside Tracker", "https://insidetracker.com", "intermediary", "Quest"),
]

for lab in labs:
    w(f"INSERT INTO labs (id, lab_name, website, ordering_type, uses_network)")
    w(f"VALUES ('{lab[0]}', '{lab[1]}', '{lab[2]}', '{lab[3]}', '{lab[4]}');")
    w()

w("-- ============================================================")
w("-- SYMPTOMS")
w("-- ============================================================")
w()

# Build symptom data with actual test UUID references
# We need to find tests by name and map to their UUIDs
def find_test_uuid(name_fragment):
    """Find a test UUID by name fragment (case-insensitive partial match)"""
    fragment_lower = name_fragment.lower()
    for test in tests:
        if fragment_lower in test["name"].lower():
            return test["uuid"]
    return None

def find_test_uuids(name_fragments):
    """Find multiple test UUIDs"""
    uuids = []
    for frag in name_fragments:
        uuid = find_test_uuid(frag)
        if uuid:
            uuids.append(uuid)
    return uuids

symptoms = [
    {
        "uuid": "c0000001-0000-0000-0000-000000000000",
        "name": "Fatigue / Low Energy",
        "keywords": ["fatigue", "tired", "exhaustion", "low energy", "weakness", "lethargy"],
        "test_names": ["TSH", "Free T4", "Free T3", "CBC with Differential", "Ferritin", "Iron, Serum", "Vitamin B12", "Vitamin D, 25-OH", "HbA1c", "CMP", "Cortisol, AM", "Testosterone, Total", "Magnesium, Serum", "hs-CRP"]
    },
    {
        "uuid": "c0000002-0000-0000-0000-000000000000",
        "name": "Hair Loss / Thinning Hair",
        "keywords": ["hair loss", "alopecia", "thinning hair", "balding"],
        "test_names": ["TSH", "Free T4", "Ferritin", "Iron, Serum", "TIBC", "Zinc, Serum", "Vitamin D, 25-OH", "Testosterone, Total", "DHEA-Sulfate", "ANA", "CBC with Differential", "Cortisol, AM"]
    },
    {
        "uuid": "c0000003-0000-0000-0000-000000000000",
        "name": "Weight Gain (Unexplained)",
        "keywords": ["weight gain", "obesity", "unexplained weight", "metabolism"],
        "test_names": ["TSH", "Free T4", "Free T3", "HbA1c", "Insulin, Fasting", "Glucose, Fasting", "Lipid Panel", "CMP", "Cortisol, AM", "Testosterone, Total", "DHEA-Sulfate", "hs-CRP"]
    },
    {
        "uuid": "c0000004-0000-0000-0000-000000000000",
        "name": "Anxiety / Mood Changes",
        "keywords": ["anxiety", "mood swings", "depression", "irritability", "panic"],
        "test_names": ["TSH", "Free T4", "Cortisol, AM", "Vitamin D, 25-OH", "Vitamin B12", "Magnesium, Serum", "CBC with Differential", "CMP", "Testosterone, Total", "Estradiol", "Progesterone", "Folate, Serum", "Homocysteine", "hs-CRP"]
    },
    {
        "uuid": "c0000005-0000-0000-0000-000000000000",
        "name": "Joint Pain / Inflammation",
        "keywords": ["joint pain", "arthritis", "swelling", "stiffness", "inflammation"],
        "test_names": ["ESR", "hs-CRP", "CRP, Standard", "Uric Acid", "ANA", "Rheumatoid Factor", "Anti-CCP", "CBC with Differential", "CMP", "Vitamin D, 25-OH", "HLA-B27", "Lyme Disease Antibody"]
    },
    {
        "uuid": "c0000006-0000-0000-0000-000000000000",
        "name": "Digestive Issues",
        "keywords": ["bloating", "diarrhea", "constipation", "nausea", "stomach pain", "IBS"],
        "test_names": ["Celiac Disease Antibody Panel", "tTG-IgA", "Calprotectin, Fecal", "CMP", "CBC with Differential", "TSH", "H. Pylori Antigen, Stool", "Pancreatic Elastase-1", "Occult Blood, Fecal (Immunochemical, FIT)", "Ova & Parasites, Stool"]
    },
    {
        "uuid": "c0000007-0000-0000-0000-000000000000",
        "name": "Frequent Infections",
        "keywords": ["infections", "sick often", "immune", "cold", "flu", "recurring"],
        "test_names": ["CBC with Differential", "Immunoglobulin G", "Immunoglobulin A", "Immunoglobulin M", "CMP", "Vitamin D, 25-OH", "Zinc, Serum", "HIV Ag/Ab 4th Generation", "CD4/CD8 Ratio", "Protein Electrophoresis"]
    },
    {
        "uuid": "c0000008-0000-0000-0000-000000000000",
        "name": "Skin Problems",
        "keywords": ["rash", "acne", "eczema", "dry skin", "hives", "itching"],
        "test_names": ["CBC with Differential", "Total IgE", "ANA", "TSH", "Ferritin", "Vitamin D, 25-OH", "Zinc, Serum", "Celiac Disease Antibody Panel", "Testosterone, Total", "DHEA-Sulfate", "Estradiol"]
    },
    {
        "uuid": "c0000009-0000-0000-0000-000000000000",
        "name": "Brain Fog / Memory Issues",
        "keywords": ["brain fog", "memory", "concentration", "focus", "cognitive"],
        "test_names": ["TSH", "Free T4", "Vitamin B12", "Folate, Serum", "Vitamin D, 25-OH", "Ferritin", "CMP", "HbA1c", "CBC with Differential", "Homocysteine", "Cortisol, AM", "Testosterone, Total", "Magnesium, Serum"]
    },
    {
        "uuid": "c0000010-0000-0000-0000-000000000000",
        "name": "Bone / Muscle Pain",
        "keywords": ["bone pain", "muscle aches", "cramps", "weakness", "osteoporosis"],
        "test_names": ["Vitamin D, 25-OH", "Calcium, Serum", "Phosphorus", "Parathyroid Hormone", "Magnesium, Serum", "CMP", "ALP", "CK", "TSH", "CBC with Differential", "ESR"]
    },
    {
        "uuid": "c0000011-0000-0000-0000-000000000000",
        "name": "Heart Palpitations",
        "keywords": ["palpitations", "racing heart", "irregular heartbeat", "tachycardia"],
        "test_names": ["TSH", "Free T4", "CMP", "Magnesium, Serum", "Potassium", "Calcium, Serum", "CBC with Differential", "Troponin I", "BNP", "Ferritin", "Cortisol, AM"]
    },
    {
        "uuid": "c0000012-0000-0000-0000-000000000000",
        "name": "Frequent Urination / Thirst",
        "keywords": ["urination", "thirst", "polyuria", "polydipsia", "diabetes"],
        "test_names": ["HbA1c", "Glucose, Fasting", "CMP", "Urinalysis, Complete with Microscopy", "Insulin, Fasting", "Calcium, Serum", "TSH", "Microalbumin, Urine"]
    },
    {
        "uuid": "c0000013-0000-0000-0000-000000000000",
        "name": "Bruising / Bleeding Easily",
        "keywords": ["bruising", "bleeding", "nosebleeds", "heavy periods"],
        "test_names": ["CBC with Differential", "Prothrombin Time", "aPTT", "Fibrinogen", "Platelet Count", "Von Willebrand Factor Antigen", "Von Willebrand Factor Activity", "D-Dimer", "Vitamin K1"]
    },
    {
        "uuid": "c0000014-0000-0000-0000-000000000000",
        "name": "Numbness / Tingling",
        "keywords": ["numbness", "tingling", "neuropathy", "pins and needles"],
        "test_names": ["Vitamin B12", "Methylmalonic Acid", "Folate, Serum", "HbA1c", "Glucose, Fasting", "CMP", "TSH", "Vitamin B6", "Copper, Serum", "CBC with Differential", "Magnesium, Serum"]
    },
    {
        "uuid": "c0000015-0000-0000-0000-000000000000",
        "name": "Swollen Lymph Nodes",
        "keywords": ["lymph nodes", "swollen glands", "lumps"],
        "test_names": ["CBC with Differential", "CMP", "LDH", "ESR", "hs-CRP", "EBV Panel", "HIV Ag/Ab 4th Generation", "Mono Spot", "Protein Electrophoresis", "Beta-2 Microglobulin"]
    },
    {
        "uuid": "c0000016-0000-0000-0000-000000000000",
        "name": "Infertility / Hormonal Issues",
        "keywords": ["infertility", "irregular periods", "low libido", "hormonal"],
        "test_names": ["FSH", "LH", "Estradiol", "Progesterone", "Testosterone, Total", "TSH", "Prolactin", "AMH", "DHEA-Sulfate", "SHBG", "Free T4", "Insulin, Fasting"]
    },
    {
        "uuid": "c0000017-0000-0000-0000-000000000000",
        "name": "Chest Pain / Shortness of Breath",
        "keywords": ["chest pain", "shortness of breath", "dyspnea"],
        "test_names": ["Troponin I", "BNP", "D-Dimer", "CBC with Differential", "CMP", "CK", "Prothrombin Time", "hs-CRP", "TSH", "Lipid Panel"]
    },
    {
        "uuid": "c0000018-0000-0000-0000-000000000000",
        "name": "Abdominal Pain",
        "keywords": ["abdominal pain", "stomach ache", "belly pain", "cramping"],
        "test_names": ["CMP", "Hepatic Function Panel", "Lipase", "CBC with Differential", "Urinalysis, Complete with Microscopy", "H. Pylori Antigen, Stool", "Calprotectin, Fecal", "Celiac Disease Antibody Panel", "Occult Blood, Fecal (Immunochemical, FIT)", "tTG-IgA"]
    },
    {
        "uuid": "c0000019-0000-0000-0000-000000000000",
        "name": "Chronic Pain / Fibromyalgia",
        "keywords": ["chronic pain", "fibromyalgia", "widespread pain"],
        "test_names": ["ESR", "hs-CRP", "ANA", "Rheumatoid Factor", "TSH", "Vitamin D, 25-OH", "Vitamin B12", "Magnesium, Serum", "CBC with Differential", "CMP", "Ferritin"]
    },
]

for symptom in symptoms:
    # Find UUIDs for test names
    related_uuids = find_test_uuids(symptom["test_names"])

    keywords_array = "ARRAY[" + ",".join(f"'{escape_sql(k)}'" for k in symptom["keywords"]) + "]"
    if related_uuids:
        related_array = "ARRAY[" + ",".join(f"'{u}'" for u in related_uuids) + "]::uuid[]"
    else:
        related_array = "'{}'::uuid[]"

    name = escape_sql(symptom["name"])
    w(f"INSERT INTO symptoms (id, name, keywords, related_test_ids)")
    w(f"VALUES ('{symptom['uuid']}', '{name}', {keywords_array}, {related_array});")
    w()

w("-- ============================================================")
w("-- STATES")
w("-- ============================================================")
w()

states = [
    ("AL", "Alabama", "allowed", None),
    ("AK", "Alaska", "allowed", None),
    ("AZ", "Arizona", "allowed", None),
    ("AR", "Arkansas", "allowed", None),
    ("CA", "California", "allowed", None),
    ("CO", "Colorado", "allowed", None),
    ("CT", "Connecticut", "allowed", None),
    ("DE", "Delaware", "allowed", None),
    ("FL", "Florida", "allowed", None),
    ("GA", "Georgia", "allowed", None),
    ("HI", "Hawaii", "allowed", None),
    ("ID", "Idaho", "allowed", None),
    ("IL", "Illinois", "allowed", None),
    ("IN", "Indiana", "allowed", None),
    ("IA", "Iowa", "allowed", None),
    ("KS", "Kansas", "allowed", None),
    ("KY", "Kentucky", "allowed", None),
    ("LA", "Louisiana", "allowed", None),
    ("ME", "Maine", "allowed", None),
    ("MD", "Maryland", "restricted", "LabCorp blocked, Quest allowed"),
    ("MA", "Massachusetts", "restricted", "LabCorp blocked, Quest allowed"),
    ("MI", "Michigan", "allowed", None),
    ("MN", "Minnesota", "allowed", None),
    ("MS", "Mississippi", "allowed", None),
    ("MO", "Missouri", "allowed", None),
    ("MT", "Montana", "allowed", None),
    ("NE", "Nebraska", "allowed", None),
    ("NV", "Nevada", "allowed", None),
    ("NH", "New Hampshire", "allowed", None),
    ("NJ", "New Jersey", "prohibited", "Direct-to-consumer lab testing not allowed"),
    ("NM", "New Mexico", "allowed", None),
    ("NY", "New York", "prohibited", "Direct-to-consumer lab testing not allowed"),
    ("NC", "North Carolina", "allowed", None),
    ("ND", "North Dakota", "allowed", None),
    ("OH", "Ohio", "allowed", None),
    ("OK", "Oklahoma", "allowed", None),
    ("OR", "Oregon", "allowed", None),
    ("PA", "Pennsylvania", "allowed", None),
    ("RI", "Rhode Island", "prohibited", "Direct-to-consumer lab testing not allowed"),
    ("SC", "South Carolina", "allowed", None),
    ("SD", "South Dakota", "allowed", None),
    ("TN", "Tennessee", "allowed", None),
    ("TX", "Texas", "allowed", None),
    ("UT", "Utah", "allowed", None),
    ("VT", "Vermont", "allowed", None),
    ("VA", "Virginia", "allowed", None),
    ("WA", "Washington", "allowed", None),
    ("WV", "West Virginia", "allowed", None),
    ("WI", "Wisconsin", "allowed", None),
    ("WY", "Wyoming", "allowed", None),
    ("DC", "District of Columbia", "allowed", None),
]

for state in states:
    notes_val = f"'{escape_sql(state[3])}'" if state[3] else "NULL"
    w(f"INSERT INTO states (state_code, state_name, dtc_allowed, notes)")
    w(f"VALUES ('{state[0]}', '{state[1]}', '{state[2]}', {notes_val});")
    w()

w("-- ============================================================")
w("-- SEED COMPLETE")
w("-- ============================================================")

# Write output
with open(OUTPUT_FILE, "w") as f:
    f.write("\n".join(output_lines))

print(f"Generated {OUTPUT_FILE} with {len(output_lines)} lines", file=sys.stderr)
