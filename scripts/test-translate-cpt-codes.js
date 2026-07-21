const { chromium } = require('playwright')

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3010'

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.addInitScript(() => {
    localStorage.clear()
    localStorage.setItem('ll_sourceLab', 'Quest')
    localStorage.setItem('ll_targetLab', 'LabCorp')
  })
  const page = await context.newPage()

  try {
    await page.goto(`${BASE_URL}/translate`, { waitUntil: 'networkidle' })
    await page.locator('textarea').fill('83970\n82306\n82570\n82340\n80053\n83735')
    await page.getByRole('button', { name: 'Find Tests →' }).click()

    await page.getByText(/confirmed/i).waitFor()

    const body = await page.locator('body').innerText()
    const failures = []

    if (!body.includes('Parathyroid Hormone (PTH)')) failures.push('CPT 83970 did not auto-match PTH')
    if (!body.includes('CMP (Comprehensive Metabolic Panel)')) failures.push('CPT 80053 did not auto-match CMP')
    if (!body.includes('Calcium, Urine (24-hr)')) failures.push('CPT 82340 did not auto-match urine calcium')
    if (!body.includes('3 tests need your input')) failures.push('ambiguous CPT codes did not produce three clarification prompts')
    if (/NOT FOUND\s*\(6\)/i.test(body)) failures.push('all six CPT codes were incorrectly marked not found')

    if (failures.length) {
      console.error('FAIL: CPT translation regression')
      for (const failure of failures) console.error(`- ${failure}`)
      process.exitCode = 1
    } else {
      console.log('PASS: unique CPT codes auto-match and ambiguous CPT codes request clarification')
    }
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
