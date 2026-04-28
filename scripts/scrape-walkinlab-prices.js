#!/usr/bin/env node
/**
 * Walk-In Lab price scraper
 * Uses curl (no Playwright needed — WIL serves prices in static HTML)
 *
 * Usage: node scripts/scrape-walkinlab-prices.js
 */

const { execSync } = require('child_process')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Known Walk-In Lab URL slugs for common tests (CPT code → slug mapping)
// Add more as we discover them
const WIL_SLUG_MAP = {
  '82728': 'ferritin-serum-test',                                          // Ferritin
  '11111': 'ferritin-serum-test',                                          // fallback
  '84443': 'thyroid-stimulating-hormone-tsh-blood-test',                  // TSH
  '84480': 'tri-iodothyronine-t3-free-serum-blood-test',                  // Free T3
  '82306': 'vitamin-d25-hydroxy-blood-test',                              // Vitamin D
  '84402': 'testosteronefree-direct-serum-test-with-total-testosterone',  // Free Testosterone
  '84403': 'testosteronefree-direct-serum-test-with-total-testosterone',  // Total Testosterone
  '82670': 'estradiol-blood-test',                                        // Estradiol
  '80053': 'complete-comprehensive-metabolic-panel-cmp-14-blood-test',    // CMP
  '85025': 'complete-blood-count-cbc-with-differential-platelets-blood-test', // CBC
  '82533': 'cortisol-am-blood-test',                                      // Cortisol AM
  '84270': 'shbg-sex-hormone-binding-globulin-blood-test',                // SHBG
  '83001': 'fsh-follicle-stimulating-hormone-blood-test',                 // FSH
  '83002': 'luteinizing-hormone-lh-blood-test',                          // LH
  '84146': 'prolactin-blood-test',                                        // Prolactin
  '84153': 'psa-total-blood-test',                                        // PSA
}

const WIL_BASE = 'https://www.walkinlab.com/products/view'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const DELAY_MS = 1200

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function fetchPrice(slug) {
  try {
    const url = `${WIL_BASE}/${slug}`
    const html = execSync(
      `curl -s --max-time 15 -A "${UA}" "${url}"`,
      { encoding: 'utf8', timeout: 20000 }
    )
    const matches = [...html.matchAll(/\$(\d+\.\d{2})/g)]
    if (matches.length === 0) return null
    return parseFloat(matches[0][1])
  } catch {
    return null
  }
}

async function main() {
  console.log(`\n🧪 Walk-In Lab Price Scraper — ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`)
  console.log('='.repeat(60))

  // Find Walk-In Lab lab_id
  const { data: labRow } = await supabase
    .from('labs')
    .select('id')
    .ilike('lab_name', '%walk%in%lab%')
    .limit(1)
    .single()

  if (!labRow) {
    console.error('❌ Could not find Walk-In Lab in labs table')
    process.exit(1)
  }
  const WIL_LAB_ID = labRow.id
  console.log(`Walk-In Lab ID: ${WIL_LAB_ID}`)

  // Load all WIL-priced tests
  const { data: pricingRows, error } = await supabase
    .from('pricing')
    .select('id, price, test_id, tests(test_name, cpt_codes)')
    .eq('lab_id', WIL_LAB_ID)

  if (error || !pricingRows) {
    console.error('❌ Failed to load pricing rows:', error?.message)
    process.exit(1)
  }

  console.log(`\nChecking ${pricingRows.length} Walk-In Lab tests...\n`)

  const results = { updated: [], unchanged: [], notFound: [] }

  for (const row of pricingRows) {
    const testName = row.tests?.test_name || 'Unknown'
    const cptCodes = row.tests?.cpt_codes || []
    const currentPrice = row.price

    // Find slug via CPT code map
    let slug = null
    for (const cpt of cptCodes) {
      if (WIL_SLUG_MAP[cpt]) { slug = WIL_SLUG_MAP[cpt]; break }
    }

    if (!slug) {
      results.notFound.push(testName)
      process.stdout.write(`❌ ${testName} (no slug mapping)\n`)
      continue
    }

    const foundPrice = fetchPrice(slug)

    if (foundPrice === null) {
      results.notFound.push(testName)
      process.stdout.write(`❌ ${testName} (fetch failed)\n`)
    } else if (Math.abs(foundPrice - currentPrice) < 0.02) {
      results.unchanged.push({ testName, price: foundPrice })
      process.stdout.write(`✓  ${testName}: $${foundPrice.toFixed(2)} (unchanged)\n`)
    } else {
      const { error: updateError } = await supabase
        .from('pricing')
        .update({
          price: foundPrice,
          last_verified: new Date().toISOString().split('T')[0],
        })
        .eq('id', row.id)

      if (updateError) {
        console.error(`   ⚠️  DB update failed for ${testName}:`, updateError.message)
      } else {
        results.updated.push({ testName, oldPrice: currentPrice, newPrice: foundPrice })
        const direction = foundPrice < currentPrice ? '↓' : '↑'
        process.stdout.write(`✅ ${testName}: $${currentPrice.toFixed(2)} → $${foundPrice.toFixed(2)} ${direction} UPDATED\n`)
      }
    }

    await sleep(DELAY_MS)
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 Summary:`)
  console.log(`   ✅ Updated:   ${results.updated.length} tests`)
  console.log(`   ✓  Unchanged: ${results.unchanged.length} tests`)
  console.log(`   ❌ Not found: ${results.notFound.length} tests`)

  if (results.updated.length > 0) {
    console.log('\n💰 Price changes:')
    for (const r of results.updated) {
      const diff = r.newPrice - r.oldPrice
      const sign = diff > 0 ? '+' : ''
      console.log(`   ${r.testName}: $${r.oldPrice.toFixed(2)} → $${r.newPrice.toFixed(2)} (${sign}$${diff.toFixed(2)})`)
    }
  }

  // Return summary for cron delivery
  return results
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
