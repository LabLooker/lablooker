#!/usr/bin/env node
/**
 * Ulta Lab Tests partner price scraper
 * Uses Playwright to load partner microsite pages and extract current pricing.
 * Partner URL: https://www.ultalabtests.com/partners/lablooker/test/[slug]
 * Pages show two prices: retail (first) and partner price (second).
 */

const { chromium } = require('playwright')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const env = fs.readFileSync(require('path').join(__dirname, '..', '.env.local'), 'utf8')
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim()
const SUPABASE_KEY = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim()
const ULTA_LAB_ID = 'b0000003-0000-0000-0000-000000000000'
const PARTNER_BASE = 'https://www.ultalabtests.com/partners/lablooker/test'
const DELAY_MS = 1500

// Known slug overrides — use when auto-generation fails
const SLUG_OVERRIDES = {
  'Vitamin D, 25-OH (Total)': 'vitamin-d-25-hydroxy-total-immunoassay',
  'Free T3 (Triiodothyronine, Free)': 'triiodothyronine-free-t3',
  'Free T4 (Thyroxine, Free)': 'thyroxine-free-t4',
  'DHEA-Sulfate (DHEA-S)': 'dehydroepiandrosterone-sulfate-dhea-s',
  'Cortisol, AM (Serum)': 'cortisol-am',
  'Iron & TIBC Panel': 'iron-and-tibc',
  'HbA1c (Hemoglobin A1c)': 'hemoglobin-a1c-hba1c',
  'Testosterone, Free (Direct)': 'testosterone-free-direct',
  'Comprehensive Thyroid Panel': 'thyroid-panel-comprehensive',
  'CBC without Differential': 'complete-blood-count-cbc-without-differential',
  'BMP (Basic Metabolic Panel)': 'basic-metabolic-panel-bmp',
  'ESR (Erythrocyte Sedimentation Rate)': 'sedimentation-rate-westergren',
  'Urinalysis, Complete with Microscopy': 'urinalysis-complete',
  'Lipid Panel (Standard)': 'lipid-panel',
  'Magnesium, Serum': 'magnesium',
  'Homocysteine': 'homocysteine',
  'hs-CRP (High Sensitivity CRP)': 'c-reactive-protein-high-sensitivity-hs-crp',
  'Progesterone': 'progesterone',
  'Vitamin B12 (Cobalamin)': 'vitamin-b12-cobalamin',
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function slugify(str) {
  return str.toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function generateSlugs(testName) {
  const candidates = new Set()
  candidates.add(slugify(testName))
  const withoutParens = testName.replace(/\s*\([^)]*\)/g, '').trim()
  if (withoutParens !== testName) candidates.add(slugify(withoutParens))
  const stripped = withoutParens
    .replace(/,\s*(Serum|Plasma|Total|Blood|Free|Direct|Random|Fasting|AM|Panel|Test|Standard|Sensitive|Complete)$/i, '')
    .trim()
  candidates.add(slugify(stripped))
  const firstWord = stripped.split(/[\s,]/)[0]
  if (firstWord.length > 2) candidates.add(slugify(firstWord))
  const firstTwo = stripped.split(/[\s,]/).slice(0, 2).join(' ')
  if (firstTwo !== firstWord) candidates.add(slugify(firstTwo))
  candidates.add(slugify(stripped) + '-test')
  return [...candidates].filter(s => s.length > 1)
}

async function fetchPartnerPrice(page, slug) {
  try {
    await page.goto(`${PARTNER_BASE}/${slug}`, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2500)
    const finalUrl = page.url()
    if (finalUrl.includes('/search') || finalUrl.includes('/testing/search')) return null
    const text = await page.evaluate(() => document.body.innerText)
    const prices = [...text.matchAll(/\$(\d+\.\d{2})/g)].map(m => parseFloat(m[1]))
    // Second price is partner/discounted price
    return prices.length >= 2 ? prices[1] : null
  } catch {
    return null
  }
}

async function main() {
  console.log(`\n🧪 Ulta Partner Price Scraper — ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}`)
  console.log('='.repeat(60))

  const { data: pricingRows, error } = await supabase
    .from('pricing')
    .select('id, price, test_id, tests(test_name)')
    .eq('lab_id', ULTA_LAB_ID)

  if (error || !pricingRows) {
    console.error('❌ Failed to load pricing rows:', error?.message)
    process.exit(1)
  }

  console.log(`\nChecking ${pricingRows.length} Ulta tests via partner URL...\n`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.on('console', () => {})

  const results = { updated: [], unchanged: [], notFound: [] }

  for (const row of pricingRows) {
    const testName = row.tests?.test_name || 'Unknown'
    const currentPrice = row.price
    // Use override slug first if available
    const overrideSlug = SLUG_OVERRIDES[testName]
    const slugs = overrideSlug ? [overrideSlug, ...generateSlugs(testName)] : generateSlugs(testName)

    let foundPrice = null
    for (const slug of slugs) {
      const price = await fetchPartnerPrice(page, slug)
      if (price !== null) { foundPrice = price; break }
      await sleep(400)
    }

    if (foundPrice === null) {
      results.notFound.push(testName)
      process.stdout.write(`❌ ${testName}\n`)
    } else if (Math.abs(foundPrice - currentPrice) < 0.02) {
      results.unchanged.push(testName)
      process.stdout.write(`✓  ${testName}: $${foundPrice.toFixed(2)} (unchanged)\n`)
    } else {
      await supabase.from('pricing')
        .update({ price: foundPrice, last_verified: new Date().toISOString().split('T')[0] })
        .eq('id', row.id)
      results.updated.push({ testName, oldPrice: currentPrice, newPrice: foundPrice })
      const dir = foundPrice < currentPrice ? '↓' : '↑'
      process.stdout.write(`✅ ${testName}: $${currentPrice} → $${foundPrice.toFixed(2)} ${dir} UPDATED\n`)
    }

    await sleep(DELAY_MS)
  }

  await browser.close()

  console.log('\n' + '='.repeat(60))
  console.log(`📊 Updated: ${results.updated.length} | Unchanged: ${results.unchanged.length} | Not found: ${results.notFound.length}`)

  if (results.updated.length > 0) {
    console.log('\n💰 Price changes:')
    results.updated.forEach(r => {
      const diff = r.newPrice - r.oldPrice
      console.log(`   ${r.testName}: $${r.oldPrice} → $${r.newPrice.toFixed(2)} (${diff > 0 ? '+' : ''}$${diff.toFixed(2)})`)
    })
  }

  if (results.notFound.length > 0) {
    console.log('\n❌ Not found (needs manual slug):')
    results.notFound.forEach(n => console.log(`   - ${n}`))
  }

  console.log('\nDone.\n')
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
