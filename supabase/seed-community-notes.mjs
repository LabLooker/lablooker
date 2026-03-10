#!/usr/bin/env node
/**
 * seed-community-notes.mjs
 * Fetches all tests from Supabase and updates each with community_notes
 * based on test name matching. Reflects thyroid patient community (STTM),
 * BHRT community, and functional medicine knowledge.
 *
 * Prerequisites: run the migration SQL first!
 *   ALTER TABLE tests ADD COLUMN IF NOT EXISTS community_notes TEXT;
 *   (See MIGRATION-NOTES.md for instructions)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cbeazeiehgiwhklxtdir.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

// ---------------------------------------------------------------------------
// Community notes lookup — keyed by search terms (lowercase)
// Each entry: { keywords: string[], notes: string }
// Order matters: more specific rules first
// ---------------------------------------------------------------------------
const COMMUNITY_RULES = [
  // THYROID
  {
    keywords: ['tsh', 'thyroid stimulating hormone'],
    notes: "The thyroid patient community (STTM and others) widely notes that TSH is a pituitary signal, not a direct thyroid hormone measurement. Many functional practitioners consider optimal TSH to be 0.5–2.0 mIU/L — well below the standard lab ceiling of 4.5. For patients on T3 therapy (liothyronine/Cytomel), TSH will typically be suppressed and is less useful as a standalone indicator of thyroid status. Free T3 and Free T4 are considered more informative by most functional practitioners.",
  },
  {
    keywords: ['free t3', 'ft3', 'free triiodothyronine'],
    notes: "STTM and the thyroid patient community recommend drawing Free T3 at your natural trough — typically 12–18 hours after your last T3 dose (or just before your next dose if splitting). For 3x-daily T3, draw before your first morning dose. This gives the most stable, comparable result for trending over time. Free T3 in the upper third of the reference range is considered optimal by many functional practitioners (e.g., ~3.5–4.2 pg/mL on a Quest range of 2.0–4.4).",
  },
  {
    keywords: ['free t4', 'ft4', 'free thyroxine'],
    notes: "Many thyroid patients and functional practitioners target Free T4 in the middle-to-upper half of the reference range, rather than anywhere 'in range.' A low-normal Free T4 combined with low-normal Free T3 is considered suboptimal by functional practitioners even if TSH is 'normal.'",
  },
  {
    keywords: ['reverse t3', 'rt3', 'reverse triiodothyronine'],
    notes: "Elevated reverse T3 (above 15–20 ng/dL) is considered significant by the functional medicine community as evidence of poor T4→T3 conversion, often driven by chronic stress, cortisol elevation, inflammation, or low iron. Standard medicine largely disregards rT3 as clinically meaningful. The STTM community recommends calculating the Free T3:Reverse T3 ratio — a ratio above 20 (using pg/mL:ng/dL) is generally considered adequate conversion.",
  },
  {
    keywords: ['tpo', 'thyroid peroxidase', 'tgab', 'thyroglobulin antibod', 'thyroid antibod'],
    notes: "The STTM community notes that any detectable thyroid antibodies may be clinically significant, even if below the lab's flagged threshold. A TPO Ab of 30 IU/mL may be 'negative' by lab standards but represent early autoimmune activity. Functional practitioners typically aim to drive antibodies as low as possible through intervention (gluten-free diet, selenium, vitamin D optimization, etc.).",
  },

  // HORMONES
  {
    keywords: ['testosterone'],
    notes: "Quest Diagnostics uses an immunoassay method that is known to report falsely elevated testosterone values in women on BHRT pellets or injections. The BHRT patient community strongly recommends using LabCorp or CPL (which use LC/MS/MS methodology) for women on testosterone therapy, as these provide more accurate results. Draw at trough — just before your next injection — for the most clinically meaningful and comparable results between draws.",
  },
  {
    keywords: ['estradiol', 'oestradiol'],
    notes: "For women on BHRT estradiol injections or pellets, draw at trough (just before your next injection) for the most stable baseline. The BHRT community notes that estradiol levels vary widely based on delivery method and individual metabolism — ranges considered 'normal' by standard labs (typically <200 pg/mL) may be subtherapeutic for women on BHRT who feel best at higher levels. Symptom correlation matters as much as numbers.",
  },
  {
    keywords: ['progesterone'],
    notes: "Progesterone reference ranges on standard lab reports typically reflect cycling women. Post-menopausal women on progesterone BHRT often have levels above these ranges, which is expected and not clinically concerning per the BHRT community. Oral progesterone (Prometrium) is metabolized differently than vaginal or topical forms — discuss expected levels for your delivery method with your provider.",
  },
  {
    keywords: ['dhea'],
    notes: "The functional medicine community commonly aims for DHEA-S in the upper-normal range for age, or at the level that was optimal in the patient's 20s (roughly 200–350 µg/dL for women). Standard medicine rarely addresses low-normal DHEA-S. BHRT practitioners often supplement DHEA to support cortisol production, libido, and immune function.",
  },
  {
    keywords: ['cortisol am', 'am cortisol', 'cortisol, am', 'morning cortisol'],
    notes: "A single morning cortisol draw can be 'normal' while the daily cortisol rhythm is dysregulated. The functional medicine community strongly recommends 4-point salivary cortisol testing to assess the full diurnal curve — morning peak, midday, afternoon, and evening — rather than relying on a single serum draw. Three mildly elevated AM cortisol results may indicate HPA axis dysregulation even if no single result is flagged.",
  },
  {
    keywords: ['salivary cortisol', 'cortisol saliva', '4-point cortisol', 'diurnal cortisol', 'cortisol profile'],
    notes: "This is the test preferred by functional practitioners and STTM for assessing adrenal function. Draw at: waking, noon, 4–5 PM, and bedtime — following the lab's specific instructions. Avoid eating, brushing teeth, or exercising for 30 minutes before each collection. The pattern (not just the numbers) is clinically important: a flat curve, a reversed curve, or an elevated evening cortisol each suggest different patterns of dysregulation.",
  },

  // IRON & BLOOD
  {
    keywords: ['ferritin'],
    notes: "Standard lab reference ranges for ferritin (e.g., Quest: 10–232 ng/mL for women) are population-based and set a very low floor. The functional medicine and thyroid patient communities consider optimal ferritin to be 50–150 ng/mL, with 70–100 ng/mL often cited as the sweet spot for optimal hair, energy, and thyroid hormone conversion. A ferritin of 20 ng/mL is technically 'in range' by lab standards but functionally deficient for many patients — commonly associated with hair loss, fatigue, poor T4→T3 conversion, and restless legs.",
  },

  // VITAMINS & MINERALS
  {
    keywords: ['vitamin d, 25', '25-oh vitamin d', '25-hydroxyvitamin d', 'vitamin d (25', 'calcidiol', '25-oh-d', '25ohd', 'vitamin d'],
    notes: "The functional medicine community and many integrative practitioners target Vitamin D at 50–80 ng/mL for immune support, autoimmune conditions, and bone health — significantly above the 30 ng/mL lab floor. Patients with autoimmune thyroid disease (Hashimoto's, Graves'), hypoparathyroidism, or chronic illness are often targeted to the higher end of this range. Note: for patients with hyperparathyroidism history or kidney disease, high-normal Vitamin D can affect calcium — discuss targets with your provider.",
  },
  {
    keywords: ['rbc magnesium', 'magnesium rbc', 'red blood cell magnesium', 'erythrocyte magnesium'],
    notes: "RBC magnesium is the functional medicine community's preferred marker for assessing intracellular magnesium — far more sensitive than serum. Optimal RBC magnesium per functional practitioners is typically 5.0–6.5 mg/dL (or the upper half of the reference range). Many patients experiencing muscle cramps, migraine, anxiety, or poor sleep benefit from magnesium optimization even when serum levels are 'normal.'",
  },
  {
    keywords: ['magnesium'],
    notes: "The thyroid and chronic illness patient communities widely note that serum magnesium is a poor marker of intracellular stores — approximately 99% of body magnesium is intracellular. A 'normal' serum magnesium does not rule out functional deficiency. The functional medicine community strongly prefers RBC magnesium for assessing true magnesium status. Symptoms of low magnesium (muscle cramps, fasciculations, poor sleep, migraine, anxiety) frequently persist even with normal serum levels.",
  },
  {
    keywords: ['calcium'],
    notes: "For patients post-parathyroidectomy or with hypoparathyroidism, standard reference ranges may not reflect clinical targets set by their endocrinologist. Corrected calcium (adjusted for albumin) is more meaningful than total calcium alone: Corrected Ca = Measured Ca + 0.8 × (4.0 − Albumin). The functional medicine community also notes that calcium should always be interpreted alongside PTH, Vitamin D, and magnesium — not in isolation.",
  },
]

// ---------------------------------------------------------------------------
// Match a test name to community notes
// ---------------------------------------------------------------------------
function findCommunityNotes(testName) {
  const lower = testName.toLowerCase()
  for (const rule of COMMUNITY_RULES) {
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
  console.log('🔬 LabLooker community_notes seeder')
  console.log('━'.repeat(50))

  // Step 1: Check if community_notes column exists
  console.log('\n1. Checking if community_notes column exists...')
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/tests?select=id,community_notes&limit=1`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  })

  if (!checkRes.ok) {
    const err = await checkRes.text()
    if (err.includes('community_notes') || err.includes('column')) {
      console.error('\n❌ Column "community_notes" does not exist yet.')
      console.error('\n📋 To add it, run this SQL in the Supabase dashboard:')
      console.error('   https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/editor')
      console.error('\n   ALTER TABLE tests ADD COLUMN IF NOT EXISTS community_notes TEXT;')
      console.error('\nThen re-run this script.')
      process.exit(1)
    }
    console.error('❌ Unexpected error checking column:', err)
    process.exit(1)
  }

  const checkData = await checkRes.json()
  if (checkData && checkData.message && checkData.message.includes('community_notes')) {
    console.error('\n❌ Column "community_notes" does not exist yet.')
    console.error('\n📋 To add it, run this SQL in the Supabase dashboard:')
    console.error('   https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/editor')
    console.error('\n   ALTER TABLE tests ADD COLUMN IF NOT EXISTS community_notes TEXT;')
    console.error('\nThen re-run this script.')
    process.exit(1)
  }

  // Check for error response (Supabase returns 200 with error object if column doesn't exist in some cases)
  if (!Array.isArray(checkData)) {
    console.error('\n❌ Unexpected response. The community_notes column may not exist.')
    console.error('Response:', JSON.stringify(checkData))
    console.error('\n📋 To add it, run this SQL in the Supabase dashboard:')
    console.error('   https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/editor')
    console.error('\n   ALTER TABLE tests ADD COLUMN IF NOT EXISTS community_notes TEXT;')
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
  console.log('\n3. Updating community_notes...')
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const test of allTests) {
    const notes = findCommunityNotes(test.test_name)
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
      body: JSON.stringify({ community_notes: notes }),
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
  console.log(`⏭  Skipped:  ${skipped} (no matching community notes)`)
  if (errors > 0) console.log(`❌ Errors:   ${errors}`)
  console.log('━'.repeat(50))
  console.log('Done!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
