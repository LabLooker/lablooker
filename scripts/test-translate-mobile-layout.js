const { chromium } = require('playwright')

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3010'

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.addInitScript(() => {
    localStorage.clear()
    localStorage.setItem('ll_sourceLab', 'CPL')
    localStorage.setItem('ll_targetLab', 'Quest Diagnostics')
  })
  const page = await context.newPage()

  try {
    await page.goto(`${BASE_URL}/translate`, { waitUntil: 'networkidle' })

    const metrics = await page.evaluate(() => {
      const heading = [...document.querySelectorAll('div')]
        .find(element => element.textContent?.trim() === 'Translate between labs')
      const card = heading?.parentElement
      const fromLabel = [...document.querySelectorAll('div')]
        .find(element => element.textContent?.trim() === 'From')
      const toLabel = [...document.querySelectorAll('div')]
        .find(element => element.textContent?.trim() === 'To')
      if (!card || !fromLabel || !toLabel) throw new Error('Could not locate lab selector elements')
      const cardRect = card.getBoundingClientRect()
      const fromRect = fromLabel.parentElement.getBoundingClientRect()
      const toRect = toLabel.parentElement.getBoundingClientRect()
      return {
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
        cardRight: cardRect.right,
        fromTop: fromRect.top,
        toTop: toRect.top,
        toRight: toRect.right,
      }
    })

    const failures = []
    if (metrics.documentWidth > metrics.viewportWidth) {
      failures.push(`page overflows horizontally (${metrics.documentWidth}px > ${metrics.viewportWidth}px)`)
    }
    if (metrics.cardRight > metrics.viewportWidth + 0.5 || metrics.toRight > metrics.viewportWidth + 0.5) {
      failures.push('target lab control extends beyond the mobile viewport')
    }
    if (Math.abs(metrics.fromTop - metrics.toTop) < 20) {
      failures.push('From and To controls remain side-by-side instead of stacking on mobile')
    }

    if (failures.length) {
      console.error('FAIL: mobile lab selector layout')
      for (const failure of failures) console.error(`- ${failure}`)
      process.exitCode = 1
    } else {
      console.log('PASS: mobile lab selectors stack without horizontal overflow')
    }
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
