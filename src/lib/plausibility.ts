/**
 * Plausibility check for imported lab results.
 * Flags values that are physiologically impossible.
 */

type PlausibilityRange = {
  pattern: string
  low: number
  high: number
  unit: string
}

const PLAUSIBILITY_RANGES: PlausibilityRange[] = [
  { pattern: 'calcium',        low: 4.0,   high: 14.0,   unit: 'mg/dL' },
  { pattern: 'sodium',         low: 110,   high: 170,    unit: 'mEq/L' },
  { pattern: 'potassium',      low: 1.5,   high: 7.5,    unit: 'mEq/L' },
  { pattern: 'glucose',        low: 20,    high: 700,    unit: 'mg/dL' },
  { pattern: 'creatinine',     low: 0.2,   high: 20.0,   unit: 'mg/dL' },
  { pattern: 'mchc',           low: 28.0,  high: 38.0,   unit: 'g/dL' },
  { pattern: 'mch',            low: 22.0,  high: 38.0,   unit: 'pg' },
  { pattern: 'hemoglobin',     low: 4.0,   high: 20.0,   unit: 'g/dL' },
  { pattern: 'tsh',            low: 0.001, high: 100,    unit: 'mIU/L' },
  { pattern: 'ferritin',       low: 1.0,   high: 3000,   unit: 'ng/mL' },
  { pattern: 'vitamin d',      low: 4.0,   high: 200,    unit: 'ng/mL' },
  { pattern: '25-oh',          low: 4.0,   high: 200,    unit: 'ng/mL' },
  { pattern: 'albumin',        low: 1.0,   high: 6.0,    unit: 'g/dL' },
  { pattern: 'alt',            low: 1,     high: 1000,   unit: 'U/L' },
  { pattern: 'ast',            low: 1,     high: 1000,   unit: 'U/L' },
  { pattern: 'wbc',            low: 0.5,   high: 50.0,   unit: 'K/uL' },
  { pattern: 'white blood',    low: 0.5,   high: 50.0,   unit: 'K/uL' },
  { pattern: 'platelets',      low: 10,    high: 1000,   unit: 'K/uL' },
  { pattern: 'platelet count', low: 10,    high: 1000,   unit: 'K/uL' },
]

export type PlausibilityFlag = {
  testName: string
  value: number
  unit: string
  message: string
}

/**
 * Check an array of parsed results for physiologically implausible values.
 * Each item needs at minimum { testName: string, value: number, unit?: string }.
 * Optional qualifier ('>' or '<') adjusts flagging:
 *   - '>' and value equals upper bound → don't flag as unusual
 *   - '<' and value equals lower bound → note as below detection limit
 */
export function checkPlausibility(
  results: { testName: string; value: number; unit?: string; qualifier?: string }[]
): PlausibilityFlag[] {
  const flags: PlausibilityFlag[] = []

  for (const r of results) {
    const nameLower = r.testName.toLowerCase()

    for (const range of PLAUSIBILITY_RANGES) {
      if (!nameLower.includes(range.pattern)) continue

      // '>' qualifier at upper bound — value exceeds detection limit, don't flag
      if (r.qualifier === '>' && r.value === range.high) break
      // '<' qualifier at lower bound — below detection limit, note but don't flag as unusual
      if (r.qualifier === '<' && r.value === range.low) {
        flags.push({
          testName: r.testName,
          value: r.value,
          unit: r.unit || range.unit,
          message: `${r.testName}: <${r.value} ${r.unit || range.unit} — below detection limit`,
        })
        break
      }

      if (r.value < range.low || r.value > range.high) {
        const direction = r.value < range.low ? 'unusually low' : 'unusually high'
        flags.push({
          testName: r.testName,
          value: r.value,
          unit: r.unit || range.unit,
          message: `${r.testName}: ${r.qualifier || ''}${r.value} ${r.unit || range.unit} — ${direction}, expected ${range.low}–${range.high}`,
        })
      }
      break // only match first matching range per result
    }
  }

  return flags
}
