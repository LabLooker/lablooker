#!/usr/bin/env node
/**
 * Ulta Lab Tests price scraper
 * Uses Playwright to load partner microsite pages and extract current pricing.
 * 
 * Usage: node scripts/scrape-ulta-prices.js
 * 
 * The partner URL format is:
 *   https://www.ultalabtests.com/partners/lablooker/test/[slug]
 * 
 * Pages show two prices: retail (first) and partner price (second).
 * We always take the SECOND price found on the page.
 */

const { chromium } = require('playwright')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ULTA_LAB_ID = 'b0000003-0000-0000-0000-000000000000'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  console.error('   Run: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/scrape-ulta-prices.js')
  process.exit(1)
}
const PARTNER_BASE = 'https://www.ultalabtests.com/partners/lablooker/test'
const DELAY_BETWEEN_REQUESTS = 1500 // ms — be polite to their server

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/** Convert a test name to a URL-safe slug */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[()]/g, ' ')        // remove parens
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '-')         // spaces to hyphens
    .replace(/-+/g, '-')          // collapse multiple hyphens
}

/** Generate candidate slugs for a test name, most specific first */
function generateSlugs(testName) {
  const candidates = new Set()

  // 1. Full name slugified
  candidates.add(slugify(testName))

  // 2. Strip parenthetical content entirely, then slugify
  const withoutParens = testName.replace(/\s*\([^)]*\)/g, '').trim()
  if (withoutParens !== testName) {
    candidates.add(slugify(withoutParens))
  }

  // 3. Strip common suffixes: ", Serum" / ", Plasma" / ", Total" / ", Free" / ", Blood"
  const stripped = withoutParens
    .replace(/,\s*(Serum|Plasma|Total|Blood|Free|Direct|Random|Fasting|AM|Panel|Test)$/i, '')
    .trim()
  candidates.add(slugify(stripped))

  // 4. First word only (for simple single-word tests like "Ferritin", "TSH", "Cortisol")
  const firstWord = stripped.split(/[\s,]/)[0]
  if (firstWord.length > 2) candidates.add(slugify(firstWord))

  // 5. First two words
  const firstTwo = stripped.split(/[\s,]/).slice(0, 2).join(' ')
  if (firstTwo !== firstWord) candidates.add(slugify(firstTwo))

  // 6. With "-test" suffix on the stripped name
  candidates.add(slugify(stripped) + '-test')

  // 7. With "-blood-test" suffix
  candidates.add(slugify(firstWord) + '-blood-test')

  return [...candidates].filter(s => s.length > 1)
}

/** Fetch the partner price for a given slug. Returns null if slug not found. */
async function fetchPrice(page, slug) {
  try {
    const url = `${PARTNER_BASE}/${slug}`
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    })

    // Check if we were redirected to search (bad slug)
    const finalUrl = page.url()
    if (finalUrl.includes('/testing/search') || finalUrl.includes('/search')) {
      return null
    }

    // Wait for JS to render prices
    await page.waitForTimeout(3000)

    const bodyText = await page.evaluate(() => document.body.innerText)

    // Find all dollar amounts
    const matches = [...bodyText.matchAll(/\$(\d+\.\d{2})/g)]
    if (matches.length < 2) return null

    // Second price is always the partner/discounted price
    const partnerPrice = parseFloat(matches[1][1])
    return isNaN(partnerPrice) ? null : partnerPrice
  } catch (e) {
    return null
  }
}

async function main() {
  console.log(`\n🧪 Ulta Lab Tests Price Scraper — ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`)
  console.log('='.repeat(60))

  // Load all Ulta-priced tests from DB
  const { data: pricingRows, error } = await supabase
    .from('pricing')
    .select('id, price, test_id, tests(test_name)')
    .eq('lab_id', ULTA_LAB_ID)

  if (error || !pricingRows) {
    console.error('❌ Failed to load pricing rows:', error?.message)
    process.exit(1)
  }

  console.log(`\nChecking ${pricingRows.length} Ulta tests...\n`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  // Suppress console noise from the target site
  page.on('console', () => {})

  const results = { updated: [], unchanged: [], notFound: [] }

  for (const row of pricingRows) {
    const testName = row.tests?.test_name || 'Unknown'
    const currentPrice = row.price
    const slugs = generateSlugs(testName)

    let foundPrice = null
    let foundSlug = null

    for (const slug of slugs) {
      const price = await fetchPrice(page, slug)
      if (price !== null) {
        foundPrice = price
        foundSlug = slug
        break
      }
      await new Promise(r => setTimeout(r, 500)) // short delay between slug attempts
    }

    if (foundPrice === null) {
      results.notFound.push(testName)
      process.stdout.write(`❌ ${testName}\n`)
    } else if (Math.abs(foundPrice - currentPrice) < 0.02) {
      results.unchanged.push({ testName, price: foundPrice })
      process.stdout.write(`✓  ${testName}: $${foundPrice.toFixed(2)} (unchanged)\n`)
    } else {
      // Price changed — update DB
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

    // Polite delay between tests
    await new Promise(r => setTimeout(r, DELAY_BETWEEN_REQUESTS))
  }

  await browser.close()

  // Summary
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

  if (results.notFound.length > 0) {
    console.log('\n🔍 Tests needing manual slug lookup:')
    results.notFound.slice(0, 20).forEach(n => console.log(`   - ${n}`))
    if (results.notFound.length > 20) {
      console.log(`   ... and ${results.notFound.length - 20} more`)
    }
  }

  console.log('\nDone.\n')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
