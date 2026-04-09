#!/usr/bin/env node
/**
 * Populate related_tests for all tests based on category + curated medical relationships.
 * Each test gets up to 6 related tests from its category (excluding itself).
 * Priority: manually curated groups first, then same-category fallback.
 * 
 * Usage: node scripts/populate-related-tests.js [--dry-run]
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cbeazeiehgiwhklxtdir.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_KEY) { console.error('SUPABASE_SERVICE_ROLE_KEY env var required'); process.exit(1) }
const MAX_RELATED = 6
const DRY_RUN = process.argv.includes('--dry-run')

// Curated medical relationship groups — tests that are commonly ordered together.
// Tests within the same group are prioritized as "related" over generic category matches.
const CURATED_GROUPS = [
  // Thyroid
  ['TSH', 'Free T3', 'Free T4', 'Reverse T3', 'Anti-TPO', 'Anti-Thyroglobulin', 'Thyroglobulin', 'T3 Total', 'T4 Total', 'Thyroid Peroxidase'],
  // Iron panel
  ['Iron', 'Ferritin', 'TIBC', 'Iron Saturation', 'Transferrin', 'UIBC', 'Soluble Transferrin Receptor'],
  // Lipid panel
  ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides', 'VLDL', 'Non-HDL Cholesterol', 'Lipoprotein(a)', 'ApoB', 'Apolipoprotein A-1', 'LDL Particle Number', 'LDL Particle Size', 'Oxidized LDL', 'sdLDL'],
  // Metabolic / Blood sugar
  ['Glucose', 'HbA1c', 'Insulin', 'C-Peptide', 'HOMA-IR', 'Fructosamine'],
  // Kidney
  ['BUN', 'Creatinine', 'eGFR', 'Cystatin C', 'BUN/Creatinine Ratio', 'Uric Acid', 'Microalbumin'],
  // Liver
  ['ALT', 'AST', 'ALP', 'GGT', 'Bilirubin Total', 'Bilirubin Direct', 'Albumin', 'Total Protein'],
  // CBC
  ['WBC', 'RBC', 'Hemoglobin', 'Hematocrit', 'MCV', 'MCH', 'MCHC', 'RDW', 'Platelets', 'MPV', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils'],
  // Hormones — male
  ['Testosterone Total', 'Testosterone Free', 'SHBG', 'LH', 'FSH', 'Estradiol', 'Prolactin', 'DHT', 'DHEA-S'],
  // Hormones — female
  ['Estradiol', 'Progesterone', 'LH', 'FSH', 'Testosterone Total', 'Testosterone Free', 'SHBG', 'AMH', 'Prolactin', 'DHEA-S'],
  // Vitamins
  ['Vitamin D', 'Vitamin B12', 'Folate', 'Vitamin A', 'Vitamin E', 'Vitamin K'],
  // Minerals
  ['Calcium', 'Magnesium', 'Phosphorus', 'Zinc', 'Copper', 'Selenium', 'Potassium', 'Sodium'],
  // Inflammation
  ['CRP', 'hs-CRP', 'ESR', 'Homocysteine', 'Fibrinogen', 'IL-6', 'TNF-alpha'],
  // Autoimmune
  ['ANA', 'Anti-dsDNA', 'RF', 'Anti-CCP', 'C3', 'C4', 'CH50'],
  // Coagulation
  ['PT', 'INR', 'PTT', 'D-Dimer', 'Fibrinogen', 'Antithrombin III'],
  // Calcium / Parathyroid
  ['Calcium', 'PTH', 'Ionized Calcium', 'Vitamin D', 'Phosphorus', 'Magnesium'],
  // Cortisol / Adrenal
  ['Cortisol', 'DHEA-S', 'ACTH', 'Aldosterone', 'Renin'],
]

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  
  // Fetch all tests
  const { data: tests, error } = await supabase
    .from('tests')
    .select('id, test_name, category')
    .order('test_name')
  
  if (error) { console.error('Error fetching tests:', error.message); process.exit(1) }
  console.log(`Loaded ${tests.length} tests`)
  
  // Build name -> test lookup (fuzzy matching)
  const byName = new Map()
  tests.forEach(t => {
    byName.set(t.test_name.toLowerCase(), t)
  })
  
  // Build category -> tests lookup
  const byCategory = new Map()
  tests.forEach(t => {
    const cat = t.category || 'other'
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat).push(t)
  })
  
  // For each test, find curated group matches first, then fill with category
  let updated = 0
  let skipped = 0
  
  for (const test of tests) {
    const relatedIds = new Set()
    
    // 1. Check curated groups — find all groups this test belongs to
    for (const group of CURATED_GROUPS) {
      const isInGroup = group.some(name => {
        const lower = name.toLowerCase()
        return test.test_name.toLowerCase().includes(lower) || lower.includes(test.test_name.toLowerCase())
      })
      
      if (isInGroup) {
        // Add all other tests from this group
        for (const name of group) {
          const lower = name.toLowerCase()
          for (const [testName, t] of byName) {
            if (t.id !== test.id && (testName.includes(lower) || lower.includes(testName))) {
              relatedIds.add(t.id)
            }
          }
        }
      }
    }
    
    // 2. Fill remaining slots with same-category tests
    if (relatedIds.size < MAX_RELATED && test.category) {
      const catTests = byCategory.get(test.category) || []
      for (const ct of catTests) {
        if (ct.id !== test.id && !relatedIds.has(ct.id)) {
          relatedIds.add(ct.id)
          if (relatedIds.size >= MAX_RELATED) break
        }
      }
    }
    
    // Trim to max
    const related = [...relatedIds].slice(0, MAX_RELATED)
    
    if (related.length === 0) {
      skipped++
      continue
    }
    
    if (DRY_RUN) {
      const relNames = tests.filter(t => related.includes(t.id)).map(t => t.test_name)
      console.log(`${test.test_name} -> [${relNames.join(', ')}]`)
      updated++
      continue
    }
    
    // Update in DB
    const { error: updateError } = await supabase
      .from('tests')
      .update({ related_tests: related })
      .eq('id', test.id)
    
    if (updateError) {
      console.error(`Error updating ${test.test_name}:`, updateError.message)
    } else {
      updated++
    }
  }
  
  console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}Updated: ${updated}, Skipped: ${skipped}`)
}

main().catch(console.error)
