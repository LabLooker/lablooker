const { chromium } = require('playwright')

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3010'
const staleCodes = ['83970', '82306', '82570', '82340', '80053', '83735']

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.addInitScript(codes => {
    localStorage.clear()
    localStorage.setItem('ll_sourceLab', 'CPL')
    localStorage.setItem('ll_targetLab', 'Quest Diagnostics')
    localStorage.setItem('ll_parsedTerms', JSON.stringify([
      {
        raw: 'Ferritin',
        status: 'matched',
        matched: { id: 'a0000006-0000-0000-0000-000000000000', test_name: 'Ferritin', cpt_codes: ['82728'], category: 'Iron Studies' },
      },
      ...codes.map(raw => ({ raw, status: 'notfound' })),
    ]))
  }, staleCodes)
  const page = await context.newPage()

  try {
    await page.goto(`${BASE_URL}/translate`, { waitUntil: 'networkidle' })

    const queuedInput = await page.locator('textarea').inputValue()
    const bodyBeforeRetry = await page.locator('body').innerText()
    const failures = []

    if (!staleCodes.every(code => queuedInput.includes(code))) {
      failures.push('stale not-found codes were not requeued for the corrected parser')
    }
    if (!bodyBeforeRetry.includes('Ferritin')) {
      failures.push('previously matched tests were not preserved')
    }
    if (/NOT FOUND\s*\(6\)/i.test(bodyBeforeRetry)) {
      failures.push('stale not-found chips remained visible after cache migration')
    }

    if (failures.length === 0) {
      await page.getByRole('button', { name: 'Find Tests →' }).click()
      await page.getByText('Parathyroid Hormone (PTH)', { exact: true }).waitFor()
      const bodyAfterRetry = await page.locator('body').innerText()
      if (!bodyAfterRetry.includes('Parathyroid Hormone (PTH)')) failures.push('requeued CPT 83970 did not match PTH')
      if (!bodyAfterRetry.includes('CMP (Comprehensive Metabolic Panel)')) failures.push('requeued CPT 80053 did not match CMP')
      if (/NOT FOUND\s*\(6\)/i.test(bodyAfterRetry)) failures.push('retried CPT codes remained not found')
    }

    if (failures.length) {
      console.error('FAIL: stale translate results migration')
      for (const failure of failures) console.error(`- ${failure}`)
      process.exitCode = 1
    } else {
      console.log('PASS: stale failures are requeued, retried, and matched while good results remain')
    }
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
