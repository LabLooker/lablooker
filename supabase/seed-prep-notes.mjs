#!/usr/bin/env node
/**
 * seed-prep-notes.mjs
 * Fetches all tests from Supabase and updates each with prep_notes
 * based on test name matching.
 *
 * Prerequisites: run the migration SQL first!
 *   ALTER TABLE tests ADD COLUMN IF NOT EXISTS prep_notes TEXT;
 *   (See MIGRATION-NOTES.md for instructions)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cbeazeiehgiwhklxtdir.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_xT7abHdrbszgED4H4vNQ0A_OeFe-uLT'

// ---------------------------------------------------------------------------
// Prep notes lookup — keyed by search terms (lowercase)
// Each entry: { keywords: string[], notes: string }
// ---------------------------------------------------------------------------
const PREP_RULES = [
  // THYROID
  {
    keywords: ['tsh', 'free t4', 'free t3', 'ft4', 'ft3', 'thyroid panel', 'thyroid stimulating', 'thyroxine', 'triiodothyronine'],
    notes: "If taking T3 medication (liothyronine/Cytomel), draw at least 12–24 hours after your last dose for an accurate TSH. If splitting T3 doses, draw at your natural trough. Biotin supplements — even in multivitamins — can falsely skew thyroid results: discontinue at least 2 days before testing. No fasting required unless combined with other tests.",
  },
  {
    keywords: ['reverse t3', 'rt3', 'reverse triiodothyronine'],
    notes: "No special prep required. Draw at your typical trough if on thyroid medication. Labs typically prefer morning draws. Biotin may interfere — discontinue 48 hours before if possible.",
  },
  {
    keywords: ['tpo', 'thyroid peroxidase', 'tgab', 'thyroglobulin antibod', 'tsi', 'thyroid antibod', 'thyroid stimulating immunoglobulin'],
    notes: "No special prep. Biotin can falsely lower antibody readings — discontinue 48 hours before testing. Results are not significantly affected by time of day.",
  },

  // HORMONES
  {
    keywords: ['testosterone'],
    notes: "Draw in the early morning (7–10 AM) when testosterone is at its daily peak. If on testosterone BHRT injections, draw at trough — just before your next scheduled injection — for the most clinically meaningful result. Quest may report inflated values for women on BHRT; CPL or LabCorp recommended for trending.",
  },
  {
    keywords: ['estradiol', 'estrogen', 'e2', 'oestradiol'],
    notes: "Draw at a consistent point in your cycle if cycling (typically Day 3 for baseline, or Day 21 for luteal phase progesterone). If on BHRT injections, draw at trough (just before next injection). Results vary significantly by time in cycle.",
  },
  {
    keywords: ['progesterone'],
    notes: "For cycling women, draw on Day 21 (7 days after presumed ovulation) for luteal phase assessment. If on BHRT, draw at trough. Fasting not required.",
  },
  {
    keywords: ['fsh', 'lh', 'follicle stimulating', 'luteinizing'],
    notes: "For cycling women, Day 2–4 is standard for baseline. Draw in the morning when LH peaks. If post-menopausal, timing is less critical.",
  },
  {
    keywords: ['dhea'],
    notes: "Morning draw preferred as DHEA follows a diurnal pattern. No fasting required. Avoid high-dose DHEA supplements for 48 hours before testing.",
  },
  {
    keywords: ['cortisol am', 'morning cortisol', 'am cortisol', 'cortisol, am'],
    notes: "Must be drawn between 7–9 AM to match published reference ranges. Cortisol peaks 30–45 minutes after waking. Stress, poor sleep, illness, and recent exercise can elevate results. Avoid intense exercise the morning of the draw.",
  },
  {
    keywords: ['cortisol pm', 'afternoon cortisol', 'pm cortisol', 'cortisol, pm'],
    notes: "Draw between 3–5 PM. Avoid stress and exercise beforehand.",
  },
  {
    keywords: ['cortisol'],
    notes: "Timing matters for cortisol. AM draws should be between 7–9 AM; PM draws between 3–5 PM. Stress, poor sleep, illness, and recent exercise can all elevate cortisol. Avoid intense exercise before drawing.",
  },
  {
    keywords: ['prolactin'],
    notes: "Draw in the morning after at least 20 minutes of rest. Avoid breast stimulation, sexual activity, exercise, and stress for several hours before testing — all can temporarily elevate prolactin.",
  },
  {
    keywords: ['igf-1', 'igf1', 'insulin-like growth factor', 'insulin like growth factor'],
    notes: "Fasting preferred. Draw in the morning. Results can be affected by nutritional status — avoid dramatic changes to diet in the days before testing.",
  },

  // IRON & BLOOD
  {
    keywords: ['cbc', 'complete blood count', 'blood count', 'hemogram'],
    notes: "No fasting required unless combined with other tests. Vigorous exercise and dehydration can temporarily affect WBC and hematocrit.",
  },
  {
    keywords: ['ferritin'],
    notes: "Fasting preferred for most accurate results (inflammation and recent eating can slightly affect levels). Recent illness, infection, or stress can falsely elevate ferritin regardless of true iron stores.",
  },
  {
    keywords: ['iron panel', 'iron saturation', 'tibc', 'total iron binding', 'serum iron', 'iron, total'],
    notes: "Fasting required (8–12 hours). Draw in the morning — iron levels follow a diurnal rhythm, peaking in the morning. Iron supplements should be discontinued 24–48 hours before testing per some guidelines (check with your provider).",
  },
  {
    keywords: ['vitamin b12', 'b12', 'cobalamin', 'cyanocobalamin'],
    notes: "No fasting required. If supplementing B12 (oral or injection), discuss timing with your provider — recent supplementation can affect results. MMA and homocysteine are more sensitive markers of functional B12 status.",
  },
  {
    keywords: ['folate', 'folic acid', 'vitamin b9'],
    notes: "No fasting required. Avoid folate supplements for 24 hours before testing for most accurate baseline.",
  },
  {
    keywords: ['mma', 'methylmalonic acid'],
    notes: "No special prep. More sensitive than B12 alone for detecting functional deficiency.",
  },

  // METABOLIC
  {
    keywords: ['cmp', 'bmp', 'comprehensive metabolic', 'basic metabolic', 'metabolic panel'],
    notes: "Fasting 8–12 hours required. Drink water freely. Glucose and some kidney markers are affected by recent eating.",
  },
  {
    keywords: ['fasting glucose', 'glucose, fasting', 'blood glucose', 'fasting blood sugar'],
    notes: "Fasting 8–12 hours required. Water is fine. Even small amounts of food, juice, or gum can affect results.",
  },
  {
    keywords: ['hba1c', 'hemoglobin a1c', 'glycated hemoglobin', 'glycohemoglobin', 'a1c'],
    notes: "No fasting required. Reflects average blood sugar over the past 2–3 months. Recent illness, anemia, or blood transfusions can affect accuracy.",
  },
  {
    keywords: ['fasting insulin', 'insulin, fasting', 'insulin fasting'],
    notes: "Fasting 8–12 hours required. Insulin is highly sensitive to recent carbohydrate intake.",
  },
  {
    keywords: ['insulin'],
    notes: "Fasting 8–12 hours required. Insulin is highly sensitive to recent carbohydrate intake.",
  },
  {
    keywords: ['glucose'],
    notes: "Fasting 8–12 hours required for most accurate results. Water is fine. Even small amounts of food, juice, or gum can affect results.",
  },

  // VITAMINS & MINERALS
  {
    keywords: ['vitamin d, 25', '25-oh vitamin d', '25-hydroxyvitamin d', 'vitamin d (25', 'calcidiol', '25-oh-d', '25ohd'],
    notes: "No special prep. Results not significantly affected by fasting or time of day. Morning draw preferred for consistency.",
  },
  {
    keywords: ['vitamin d, 1,25', '1,25-dihydroxy', '1,25-oh', 'calcitriol', 'dihydroxyvitamin'],
    notes: "No special prep. Different from 25-OH D — measures the active hormone form. Affected by kidney function and PTH levels.",
  },
  {
    keywords: ['vitamin d'],
    notes: "No special prep. Results not significantly affected by fasting or time of day. Morning draw preferred for consistency.",
  },
  {
    keywords: ['rbc magnesium', 'magnesium rbc', 'red blood cell magnesium', 'erythrocyte magnesium'],
    notes: "No special prep. More accurate than serum for assessing intracellular magnesium status. Preferred marker for detecting functional magnesium deficiency.",
  },
  {
    keywords: ['magnesium'],
    notes: "No special prep. Note: serum magnesium reflects only ~1% of body magnesium stores. A normal serum result does not rule out intracellular deficiency.",
  },
  {
    keywords: ['calcium'],
    notes: "No special prep required. Results should be interpreted alongside albumin — low albumin falsely lowers total calcium. Corrected calcium = Measured Ca + 0.8 × (4.0 − Albumin).",
  },
  {
    keywords: ['pth', 'parathyroid hormone', 'intact pth'],
    notes: "Draw fasting in the morning. PTH follows a diurnal pattern, peaking at night. Calcium, Vitamin D, and phosphorus levels directly affect PTH — ideally draw all simultaneously.",
  },
  {
    keywords: ['zinc'],
    notes: "Fasting preferred (food intake can lower zinc). Draw in the morning. Avoid zinc supplements for 24 hours before testing.",
  },
  {
    keywords: ['phosphorus', 'phosphate'],
    notes: "Fasting required. Phosphorus rises significantly after eating. Draw in the morning.",
  },

  // LIPIDS
  {
    keywords: ['lipid panel', 'lipid profile', 'cholesterol panel', 'total cholesterol', 'ldl', 'hdl', 'triglyceride', 'lipoprotein'],
    notes: "Fasting 9–12 hours required for triglycerides and LDL calculation. Recent high-fat meals, alcohol, and illness affect results. Draw in the morning.",
  },
  {
    keywords: ['hs-crp', 'hscrp', 'high sensitivity crp', 'high-sensitivity c-reactive', 'c-reactive protein'],
    notes: "No fasting required. Any recent infection, illness, injury, or strenuous exercise can significantly elevate CRP — wait at least 2 weeks after illness before drawing for baseline assessment.",
  },
  {
    keywords: ['homocysteine'],
    notes: "Fasting preferred. B vitamins (especially B12, B6, folate) significantly affect homocysteine — avoid supplementing for 48 hours before testing for a true baseline.",
  },

  // KIDNEY / LIVER
  {
    keywords: ['bun', 'creatinine', 'egfr', 'blood urea nitrogen', 'kidney function'],
    notes: "No special prep. Avoid high-protein meals and strenuous exercise 24 hours before testing — both can elevate creatinine and BUN.",
  },
  {
    keywords: ['uric acid', 'urate'],
    notes: "Fasting preferred. Avoid high-purine foods (red meat, shellfish, alcohol) 24 hours before testing.",
  },
  {
    keywords: ['alt', 'ast', 'ggt', 'alp', 'alanine aminotransferase', 'aspartate aminotransferase', 'gamma-glutamyl', 'alkaline phosphatase', 'liver enzyme', 'liver function'],
    notes: "No fasting required. Avoid strenuous exercise 24–48 hours before — ALT and AST can be elevated by muscle breakdown after exercise.",
  },
  {
    keywords: ['albumin'],
    notes: "No special prep. Dehydration can elevate albumin. Reflects nutritional status over weeks to months.",
  },

  // AUTOIMMUNE / INFLAMMATION
  {
    keywords: ['ana', 'antinuclear antibod'],
    notes: "No special prep. Some medications can cause false-positive ANA — discuss current medications with your provider.",
  },
  {
    keywords: ['esr', 'sed rate', 'erythrocyte sedimentation', 'sedimentation rate'],
    notes: "No special prep. Recent infection, pregnancy, and anemia affect results. Draw before starting anti-inflammatory medications for baseline.",
  },
  {
    keywords: ['celiac', 'ttg', 'ttg-iga', 'tissue transglutaminase', 'endomysial antibod'],
    notes: "Must be on a gluten-containing diet for accurate results. Going gluten-free before testing will falsely lower antibodies and produce a false negative.",
  },

  // CANCER MARKERS
  {
    keywords: ['psa', 'prostate specific antigen', 'prostate-specific antigen'],
    notes: "Avoid ejaculation, vigorous cycling, or prostate exam for 48 hours before testing — all can temporarily elevate PSA.",
  },
]

// ---------------------------------------------------------------------------
// Match a test name to the best prep notes
// ---------------------------------------------------------------------------
function findPrepNotes(testName) {
  const lower = testName.toLowerCase()
  for (const rule of PREP_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        return rule.notes
      }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('🔬 LabLooker prep_notes seeder')
  console.log('━'.repeat(50))

  // Step 1: Check if prep_notes column exists by doing a test fetch
  console.log('\n1. Checking if prep_notes column exists...')
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/tests?select=id,prep_notes&limit=1`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  })

  if (!checkRes.ok) {
    const err = await checkRes.text()
    if (err.includes('prep_notes') || err.includes('column')) {
      console.error('\n❌ Column "prep_notes" does not exist yet.')
      console.error('\n📋 To add it, run this SQL in the Supabase dashboard:')
      console.error('   https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/editor')
      console.error('\n   ALTER TABLE tests ADD COLUMN IF NOT EXISTS prep_notes TEXT;')
      console.error('\nThen re-run this script.')
      process.exit(1)
    }
    console.error('❌ Unexpected error checking column:', err)
    process.exit(1)
  }

  const checkData = await checkRes.json()
  // If column doesn't exist, Supabase returns an error in the JSON
  if (checkData && checkData.message && checkData.message.includes('prep_notes')) {
    console.error('\n❌ Column "prep_notes" does not exist yet.')
    console.error('\n📋 To add it, run this SQL in the Supabase dashboard:')
    console.error('   https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/editor')
    console.error('\n   ALTER TABLE tests ADD COLUMN IF NOT EXISTS prep_notes TEXT;')
    console.error('\nThen re-run this script.')
    process.exit(1)
  }

  console.log('   ✅ Column exists')

  // Step 2: Fetch all tests
  console.log('\n2. Fetching all tests...')
  let allTests = []
  let offset = 0
  const pageSize = 1000

  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/tests?select=id,test_name&limit=${pageSize}&offset=${offset}&order=id`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
      }
    )
    if (!res.ok) {
      console.error('❌ Failed to fetch tests:', await res.text())
      process.exit(1)
    }
    const page = await res.json()
    if (!page.length) break
    allTests = allTests.concat(page)
    offset += pageSize
    if (page.length < pageSize) break
  }

  console.log(`   Found ${allTests.length} tests`)

  // Step 3: Match and update
  console.log('\n3. Updating prep_notes...')
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const test of allTests) {
    const notes = findPrepNotes(test.test_name)
    if (!notes) {
      skipped++
      continue
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/tests?id=eq.${test.id}`, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ prep_notes: notes }),
    })

    if (!res.ok) {
      console.error(`   ❌ Failed to update "${test.test_name}": ${await res.text()}`)
      errors++
    } else {
      console.log(`   ✅ ${test.test_name}`)
      updated++
    }
  }

  // Summary
  console.log('\n' + '━'.repeat(50))
  console.log(`✅ Updated:  ${updated}`)
  console.log(`⏭  Skipped:  ${skipped} (no matching prep notes)`)
  if (errors > 0) console.log(`❌ Errors:   ${errors}`)
  console.log('━'.repeat(50))
  console.log('Done!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
