import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { execSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

// Use internal path to avoid pdf-parse test file lookup (fails in serverless/Vercel)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse.js')

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type TestRecord = { id: string; test_name: string }

type ParsedResult = {
  rawTestName: string
  value: number
  unit: string
  referenceRange: string | null
  matchedTest: TestRecord | null
}

// Common aliases: PDF name → DB test name
const ALIASES: Record<string, string> = {
  'thyroxine free': 'free t4',
  'thyroxine, free': 'free t4',
  't4 free': 'free t4',
  'free thyroxine': 'free t4',
  'triiodothyronine free': 'free t3',
  'triiodothyronine, free': 'free t3',
  't3 free': 'free t3',
  'free triiodothyronine': 'free t3',
  'reverse t3': 'reverse t3 (rt3)',
  'reverse triiodothyronine': 'reverse t3 (rt3)',
  'rt3': 'reverse t3 (rt3)',
  'thyroid stimulating hormone': 'tsh',
  'hemoglobin a1c': 'hba1c',
  'hgb a1c': 'hba1c',
  'a1c': 'hba1c',
  '25-hydroxy vitamin d': 'vitamin d, 25-oh',
  '25-hydroxyvitamin d': 'vitamin d, 25-oh',
  'vitamin d 25-hydroxy': 'vitamin d, 25-oh',
  'vitamin d, 25-hydroxy': 'vitamin d, 25-oh',
  'ferritin serum': 'ferritin',
  'ferritin, serum': 'ferritin',
  'iron serum': 'iron, serum',
  'iron, serum': 'iron, serum',
  'serum iron': 'iron, serum',
  'glucose': 'glucose, fasting',
  'creatinine': 'creatinine, serum',
  'calcium': 'calcium, serum',
  'cholesterol total': 'total cholesterol',
  'total cholesterol': 'total cholesterol',
  'hdl': 'hdl cholesterol',
  'ldl': 'ldl cholesterol, calculated',
  'ldl cholesterol': 'ldl cholesterol, calculated',
  'white blood cell count': 'wbc count',
  'wbc': 'wbc count',
  'red blood cell count': 'rbc count',
  'rbc': 'rbc count',
  'hemoglobin': 'hemoglobin',
  'hematocrit': 'hematocrit',
  'platelets': 'platelet count',
  'platelet count': 'platelet count',
  'bun': 'bun',
  'blood urea nitrogen': 'bun',
  'sodium': 'sodium',
  'potassium': 'potassium',
  'chloride': 'chloride',
  'co2': 'co2',
  'bicarbonate': 'co2',
  'ast': 'ast',
  'sgot': 'ast',
  'alt': 'alt',
  'sgpt': 'alt',
  'alkaline phosphatase': 'alp',
  'total bilirubin': 'total bilirubin',
  'bilirubin total': 'total bilirubin',
  'total protein': 'total protein',
  'albumin': 'albumin, serum',
  'albumin serum': 'albumin, serum',
  'globulin': 'globulins',
  'triglycerides': 'triglycerides',
  'uric acid': 'uric acid',
  'phosphorus': 'phosphorus (phosphate)',
  'magnesium': 'magnesium, serum',
  'ggt': 'ggt',
  'gamma-glutamyl transferase': 'ggt',
  'esr': 'esr',
  'sed rate': 'esr',
  'sedimentation rate': 'esr',
  'c-reactive protein': 'crp, standard',
  'crp': 'crp, standard',
  'hs-crp': 'hs-crp (high sensitivity crp)',
  'high sensitivity crp': 'hs-crp (high sensitivity crp)',
  'homocysteine': 'homocysteine',
  'vitamin b12': 'vitamin b12 (cobalamin)',
  'b12': 'vitamin b12 (cobalamin)',
  'folate': 'folate, serum',
  'folic acid': 'folate, serum',
  'testosterone': 'testosterone, total',
  'testosterone total': 'testosterone, total',
  'free testosterone': 'testosterone, free (calculated)',
  'dhea-s': 'dhea-sulfate (dhea-s)',
  'dhea sulfate': 'dhea-sulfate (dhea-s)',
  'dhea-sulfate': 'dhea-sulfate (dhea-s)',
  'dehydroepiandrosterone sulfate': 'dhea-sulfate (dhea-s)',
  'estradiol': 'estradiol (e2)',
  'estradiol e2': 'estradiol (e2)',
  'progesterone': 'progesterone',
  'progesterone serum': 'progesterone',
  'prolactin': 'prolactin',
  'fsh': 'fsh (follicle-stimulating hormone)',
  'lh': 'lh (luteinizing hormone)',
  'insulin': 'insulin, fasting',
  'insulin fasting': 'insulin, fasting',
  'vitamin a': 'vitamin a (retinol)',
  'retinol': 'vitamin a (retinol)',
  'vitamin c': 'vitamin c (ascorbic acid)',
  'vitamin e': 'vitamin e (alpha-tocopherol)',
  'zinc': 'zinc, serum',
  'selenium': 'selenium, serum',
  'copper': 'copper, serum',
  'iron binding capacity': 'tibc',
  'tibc': 'tibc',
  'transferrin saturation': 'transferrin saturation',
  'transferrin sat': 'transferrin saturation',
  'mcv': 'mean corpuscular volume (mcv)',
  'mean corpuscular volume': 'mean corpuscular volume (mcv)',
  'rdw': 'rdw',
  'anion gap': 'anion gap',
  'egfr': 'egfr (estimated gfr)',
  'glomerular filtration rate': 'egfr (estimated gfr)',
  'haptoglobin': 'haptoglobin',
  'ldh': 'ldh (lactate dehydrogenase)',
  'lactate dehydrogenase': 'ldh (lactate dehydrogenase)',
  'd-dimer': 'd-dimer',
  'fibrinogen': 'fibrinogen',
  'pt/inr': 'prothrombin time (pt/inr)',
  'inr': 'prothrombin time (pt/inr)',
  'aptt': 'aptt',
  'vitamin d': 'vitamin d, 25-oh (total)',
  'vit d': 'vitamin d, 25-oh (total)',
  'igf-1': 'igf-1',
  'insulin-like growth factor': 'igf-1',
  'shbg': 'shbg',
  'sex hormone binding globulin': 'shbg',
  'anti-tpo': 'anti-tpo',
  'thyroid peroxidase antibody': 'anti-tpo',
  'tpo antibody': 'anti-tpo',
  'tpo antibodies': 'anti-tpo',
  'thyroglobulin antibody': 'anti-thyroglobulin antibody (tgab)',
  'lp(a)': 'lipoprotein(a) [lp(a)]',
  'lipoprotein a': 'lipoprotein(a) [lp(a)]',
  'apolipoprotein b': 'apolipoprotein b (apob)',
  'apob': 'apolipoprotein b (apob)',
}

const UNITS_PATTERN = '(?:ng\\/mL|mIU\\/L|pg\\/mL|mg\\/dL|g\\/dL|IU\\/L|U\\/L|mmol\\/L|umol\\/L|mcg\\/dL|nmol\\/L|mEq\\/L|%|mIU\\/mL|IU\\/mL|ng\\/dL|mcg\\/L|nmol\\/mL|cells\\/uL|cells\\/mcL|10\\^3\\/uL|10\\^6\\/uL|K\\/uL|M\\/uL|fL|pg|g\\/L|mg\\/L|ug\\/dL|pmol\\/L|mL\\/min\\/1\\.73m2|mL\\/min|mm\\/hr|mg\\/24hr|mU\\/L|uIU\\/mL|x10E3\\/uL|x10E6\\/uL|thou\\/uL|mill\\/uL|Thousand\\/uL|Million\\/uL|10\\*3\\/uL|10\\*6\\/uL)'

function extractDate(text: string): string | null {
  // Look in first ~30 lines for collection date
  const topText = text.split('\n').slice(0, 40).join('\n')

  // Explicit labels
  const labelPatterns = [
    /(?:Date Collected|Collection Date|Specimen Collected|Date of Collection|Collected|Date Reported|Report Date|Date of Service)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:Date Collected|Collection Date|Specimen Collected|Date of Collection|Collected)[:\s]+([A-Z][a-z]{2,8}\s+\d{1,2},?\s+\d{4})/i,
  ]

  for (const p of labelPatterns) {
    const m = topText.match(p)
    if (m) return parseDate(m[1])
  }

  // Generic date near top
  const genericDate = topText.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/)
  if (genericDate) return parseDate(genericDate[1])

  return null
}

function parseDate(s: string): string | null {
  // MM/DD/YYYY or MM-DD-YYYY
  let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (m) {
    const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]))
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  }
  // MM/DD/YY
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/)
  if (m) {
    const year = Number(m[3]) + 2000
    const d = new Date(year, Number(m[1]) - 1, Number(m[2]))
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  }
  // Month DD, YYYY
  const months: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 }
  m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
  if (m) {
    const mon = months[m[1].toLowerCase().slice(0, 3)]
    if (mon !== undefined) {
      const d = new Date(Number(m[3]), mon, Number(m[2]))
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
    }
  }
  return null
}

function cleanTestName(raw: string): string {
  return raw
    .replace(/\s+[LH]\s*[\d\.]+\s*[-–]\s*[\d\.]+\.?\s*$/, '') // " L9.0-27." suffix
    .replace(/\s*[\d]+\.[\d]+\s*[-–]\s*[\d\.]+\.?\s*$/, '')   // "2.42.2-4." suffix
    .replace(/\s*\d{4,}-\d+\.?\s*$/, '')                       // "3935-25" CPT suffix
    .trim()
}

function matchTest(rawName: string, tests: TestRecord[]): TestRecord | null {
  const normalized = rawName.toLowerCase().replace(/[,\(\)\.]/g, ' ').replace(/\s+/g, ' ').trim()

  // Check aliases first
  const aliasKey = Object.keys(ALIASES).find(k => {
    const kNorm = k.toLowerCase()
    return normalized === kNorm || normalized.includes(kNorm) || kNorm.includes(normalized)
  })

  const targetName = aliasKey ? ALIASES[aliasKey] : normalized

  // Exact match on DB test_name
  const exact = tests.find(t => t.test_name.toLowerCase() === targetName)
  if (exact) return exact

  // DB name contains our target or vice versa
  const contains = tests.find(t => {
    const dbLower = t.test_name.toLowerCase()
    return dbLower.includes(targetName) || targetName.includes(dbLower)
  })
  if (contains) return contains

  // Try matching against normalized DB names (strip parenthetical)
  const fuzzy = tests.find(t => {
    const dbNorm = t.test_name.toLowerCase().replace(/[,\(\)\.]/g, ' ').replace(/\s+/g, ' ').trim()
    return dbNorm.includes(normalized) || normalized.includes(dbNorm)
  })
  if (fuzzy) return fuzzy

  return null
}

// ─── CPL/Sonic PDF Support ────────────────────────────────────────────────────
// CPL uses a 3-column layout (In Range / Out Range / Reference Range).
// pdf-parse loses column positions; pdftotext -layout preserves them.
// We try pdftotext -layout at runtime and fall back gracefully if unavailable.

function getPdftotextLayout(pdfBuffer: Buffer): string | null {
  try {
    const tmpFile = join(tmpdir(), `cpl-${Date.now()}.pdf`)
    writeFileSync(tmpFile, pdfBuffer)
    const result = execSync(`pdftotext -layout "${tmpFile}" -`, {
      maxBuffer: 5 * 1024 * 1024,
      timeout: 10000,
    })
    unlinkSync(tmpFile)
    return result.toString()
  } catch {
    return null // pdftotext not available (e.g. Vercel)
  }
}

function parseCplResults(layoutText: string): ParsedResult[] {
  const results: ParsedResult[] = []
  const seen = new Set<string>()
  const lines = layoutText.split('\n')

  // Lines we should skip entirely
  const SKIP = [
    /Clinical Pathology Lab/i,
    /^9200 Wall/i,
    /^512-339/,
    /^Report Status/i,
    /Specimen Information/i,
    /Patient Information/i,
    /Ordering Physician/i,
    /Client Information/i,
    /Test Name\s+In Range/i,
    /TESTING PERFORMED/i,
    /CLIA NO:/i,
    /UNLESS OTHERWISE/i,
    /LABORATORY DIRECTOR/i,
    /CAP ACCREDITATION/i,
    /\bFinal\b.*Page \d/i,
    /Page \d+ of \d+/i,
    /^\s*This test was/i,
    /^\s*determined by Sonic/i,
    /^\s*cleared or approved/i,
    /^\s*necessary\./i,
    /^\s*regarded as investigational/i,
    /^\s*perform high complexity/i,
    /^\s*Amendments.*CLIA/i,
    /^\s*NOTE:/i,
    /^\s*\*+\s*EXPECTED/i,
    /^\s*\*+\s*INTERPRETIVE/i,
    /PATIENT GENDER/i,
    /AMH REFERENCE/i,
    /FOR FERTILITY/i,
    /^\s*MALE\s*[\.><]/i,
    /^\s*FEMALE\s*$/i,
    /^\s*FOLLICULAR(?:\s+PHASE)?\s+[<\d]/i,
    /^\s*OVULATION\s+[<\d]/i,
    /^\s*LUTEAL PHASE\s+[<\d]/i,
    /^\s*POSTMENOPAUSAL\s+[<\d]/i,
    /^\s*MID-CYCLE/i,
    /^\s*1ST TRIMESTER/i,
    /^\s*2ND TRIMESTER/i,
    /^\s*3RD TRIMESTER/i,
    /^\s*\d{2}-\d{2}\s+[\d\.]+/i,
    /RUSSELL,/i,
    /^DOB:/i,
    /^Fasting:/i,
    /TRINITY/i,
    /WEMPE/i,
    /^3800 QUICK/i,
    /^Specimen:/i,
    /^E Order:/i,
    /^Collected:/i,
    /^Received:/i,
    /^Reported:/i,
    /^Printed:/i,
    /^D[A-Z0-9]+\s*:\s*Final/i,
    /\. \./,   // dot leaders in phase sub-tables
    /SEE BELOW/i, // handled by stripping ref range, not skipping
  ]

  // Panel group headers (no result value — skip)
  const isPanelHeader = (name: string) =>
    /PROFILE$/.test(name) ||
    /FREE\/TOTAL WITH SHBG/.test(name) ||
    name === 'FSH + LH PROFILE'

  // Match: test name (starts caps, may have lowercase like A1c) + 5+ spaces + numeric value + optional H/L flag + rest
  // Handles both in-range (value at ~col 45) and out-of-range (value at ~col 60)
  const CPL_RESULT = /^(\s{0,4})([A-Z][A-Za-z0-9 ,\/\(\)\.\+\-&%]+?)\s{5,}(\d+\.?\d*)\s*([HL])?\s+(.*)/

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (SKIP.some(p => p.test(line))) continue

    const m = CPL_RESULT.exec(line)
    if (!m) continue

    const rawName = m[2].trim()
    const value = parseFloat(m[3])
    const rest = m[5].trim() // everything after value + flag

    if (isNaN(value) || isPanelHeader(rawName)) continue

    // Deduplicate (e.g. TESTOSTERONE appears twice — standalone + in FREE/TOTAL panel)
    const key = rawName.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (seen.has(key)) continue
    seen.add(key)

    // Extract reference range and unit from the rest of the line
    let unit = ''
    let referenceRange: string | null = null

    // "SEE BELOW UNIT" — just grab the unit
    const seeBelowM = rest.match(/^SEE BELOW\s+([A-Za-z\/%]+(?:\/[A-Za-z]+)?)/i)
    if (seeBelowM) {
      unit = seeBelowM[1]
    } else {
      // "<=55 NG/DL" or "9.0-27.0 ng/dL" or "2.2-4.2 PG/ML" or "35-256 UG/DL"
      const refM = rest.match(/^((?:[<>]=?)?[\d\.]+(?:\s*[-\u2013]\s*[\d\.]+)?)\s+([A-Za-z\/%]+(?:\/[A-Za-z]+)?)/)
      if (refM) {
        referenceRange = refM[1].replace(/\s+/g, '')
        unit = refM[2]
      } else {
        // Just a unit at start of rest
        const unitM = rest.match(/^([A-Za-z\/%]+(?:\/[A-Za-z]+)?)/)
        if (unitM) unit = unitM[1]
      }
    }

    results.push({ rawTestName: rawName, value, unit, referenceRange, matchedTest: null })
  }

  return results
}

function parseLabResults(text: string): ParsedResult[] {
  const results: ParsedResult[] = []
  const lines = text.split('\n')
  const seen = new Set<string>()

  const unitsPat = new RegExp(UNITS_PATTERN, 'i')

  // Pattern 1: Quest-style — name (2+ spaces) value (spaces) ref-range (spaces) unit
  const questPattern = new RegExp(
    `^([A-Za-z][A-Za-z0-9\\s,\\(\\)\\/\\-\\.]+?)\\s{2,}(\\d+\\.?\\d*)\\s+(${UNITS_PATTERN.slice(3)}\\s+([\\d\\.]+\\s*[-–]\\s*[\\d\\.]+|[<>]\\s*[\\d\\.]+)?`,
    'i'
  )

  // Pattern 2: name (2+ spaces) value (spaces) refrange (spaces) unit
  const questPattern2 = new RegExp(
    `^([A-Za-z][A-Za-z0-9\\s,\\(\\)\\/\\-\\.]+?)\\s{2,}(\\d+\\.?\\d*)\\s+([\\d\\.]+\\s*[-–]\\s*[\\d\\.]+)\\s+(${UNITS_PATTERN.slice(3)}`,
    'i'
  )

  // Pattern 3: LabCorp — name value unit Reference: range
  const labcorpPattern = new RegExp(
    `^([A-Za-z][A-Za-z0-9\\s,\\(\\)\\/\\-\\.]+?)\\s{2,}(\\d+\\.?\\d*)\\s+(${UNITS_PATTERN.slice(3)}\\s+(?:Reference|Ref(?:erence)? Range|Normal)[:\\s]+([\\d\\.]+\\s*[-–]\\s*[\\d\\.]+|[<>]\\s*[\\d\\.]+)`,
    'i'
  )

  // ─── Quest PDF two-line pattern ───
  // Many Quest PDFs extract as: "TESTNAME<value>" on line N, "Reference Range: low-high unit" on line N+1
  // Also handles: value on same line with no space, unit on next line, ref range on next line
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()

    // Match: TESTNAME followed immediately by a number (no space or minimal space)
    // e.g. "GLUCOSE79" or "CREATININE0.64" or "HS CRP1.8"
    const twoLineMatch = trimmed.match(/^([A-Za-z][A-Za-z0-9\s,\(\)\/\-\.%]+?)(\d+\.?\d*)$/)
    if (twoLineMatch) {
      const name = twoLineMatch[1].trim()
      const val = parseFloat(twoLineMatch[2])

      // Skip headers, footers, page numbers, dates, IDs, false positives
      if (!name || name.length < 2 || isNaN(val)) continue
      if (/^(page|patient|name|dob|date|address|physician|doctor|provider|accession|specimen|lab\s*#|requisition|fax|phone|npi|russell|wempe|trinity|georgetown|client|report|fasting|sex|age|in|non-pregnant|pregnant|postmenopausal|lewisville|irving|san juan|suite)/i.test(name)) continue
      if (/^\d/.test(name)) continue
      if (/AnalyteValue/i.test(trimmed)) continue
      // Skip lines that look like address fragments or reference range descriptions
      if (/\b(TX|CA|NY|FL)\s*$/i.test(name)) continue
      if (/^\w+\s+(TX|CA|NY|FL|OH|PA)$/i.test(name)) continue
      // Skip Z SCORE with negative sign attached to name
      if (/Z SCORE.*-$/i.test(name)) continue
      // Skip phase-specific reference range sub-rows (hormone panels)
      if (/^(follicular|ovulation|luteal|mid-cycle|postmenopausal|premenopausal|prepubertal|male|female\s+\d|adult\s+male|adult\s+female)/i.test(name)) continue
      // Skip lab metadata rows (CLIA numbers, accreditation info)
      if (/clia|accreditation|cap\s+number|cap\s+accreditation/i.test(name)) continue
      // Skip accession/order number rows (1-3 uppercase letters + large number)
      if (/^[A-Z]{1,3}$/.test(name) && val > 99999) continue

      // Look ahead up to 3 lines for reference range and unit
      let unit = ''
      let ref: string | null = null
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const nextLine = lines[j].trim()

        // "Reference Range: 65-99 mg/dL" or "Reference Range: 0.50-1.03 mg/dL"
        const refWithUnit = nextLine.match(new RegExp(
          `Reference Range\\s*:?\\s*([\\d\\.]+\\s*[-–]\\s*[\\d\\.]+)\\s+(${UNITS_PATTERN.slice(3)}`,
          'i'
        ))
        if (refWithUnit) {
          ref = refWithUnit[1].replace(/\s/g, '')
          unit = refWithUnit[2] || ''
          break
        }

        // "Reference Range: > OR = 60 mL/min/1.73m2" or "Reference Range < or = 18.4"
        const refGtLt = nextLine.match(new RegExp(
          `Reference Range\\s*:?\\s*([<>]\\s*(?:OR\\s*=\\s*|or\\s*=\\s*)?[\\d\\.]+)\\s*(${UNITS_PATTERN.slice(3)}`,
          'i'
        ))
        if (refGtLt) {
          ref = refGtLt[1].replace(/\s+/g, '').replace(/OR=/gi, '=')
          unit = refGtLt[2] || ''
          break
        }

        // "Reference Range: <101 pg/mL" — simple inequality
        const refSimple = nextLine.match(new RegExp(
          `Reference Range\\s*:?\\s*([<>]=?\\s*[\\d\\.]+)\\s*(${UNITS_PATTERN.slice(3)}`,
          'i'
        ))
        if (refSimple) {
          ref = refSimple[1].replace(/\s/g, '')
          unit = refSimple[2] || ''
          break
        }

        // Standalone unit line: "mg/L" or "ng/mL"
        const unitOnly = nextLine.match(new RegExp(`^(${UNITS_PATTERN.slice(3)}$`, 'i'))
        if (unitOnly) {
          unit = unitOnly[1]
          continue
        }

        // "Reference Range" without colon, followed by range info — skip interpretive text
        if (/^Reference Range/i.test(nextLine) && !/[\d]/.test(nextLine.replace(/Reference Range\s*:?\s*/i, '').slice(0, 5))) {
          continue
        }

        // Stop if we hit another test name or section header
        if (/^[A-Z][A-Z\s,\(\)\/\-\.]+\d/.test(nextLine) || /^(Analyte|Performing|Quest|Laboratory|This test|Jellinger|Pearson|For ages)/i.test(nextLine)) {
          break
        }
      }

      const key = `${name.toLowerCase()}|${val}`
      if (!seen.has(key)) {
        seen.add(key)
        results.push({ rawTestName: name, value: val, unit, referenceRange: ref, matchedTest: null })
      }
      continue
    }
  }

  // Pattern 4: Generic — "Test Name: X\nResult: Y unit\nReference Range: Z"
  for (let i = 0; i < lines.length; i++) {
    const testNameMatch = lines[i].match(/^Test\s*Name\s*:\s*(.+)/i)
    if (testNameMatch) {
      const name = testNameMatch[1].trim()
      let value: number | null = null
      let unit = ''
      let ref: string | null = null
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const resultMatch = lines[j].match(new RegExp(`Result\\s*:\\s*(\\d+\\.?\\d*)\\s*(${UNITS_PATTERN.slice(3)}`, 'i'))
        if (resultMatch) {
          value = parseFloat(resultMatch[1])
          unit = resultMatch[2] || ''
        }
        const refMatch = lines[j].match(/(?:Reference Range|Ref Range|Normal Range)\s*:\s*([\d\.]+\s*[-–]\s*[\d\.]+|[<>]\s*[\d\.]+)/i)
        if (refMatch) ref = refMatch[1].replace(/\s/g, '')
      }
      if (value !== null) {
        const key = `${name.toLowerCase()}|${value}`
        if (!seen.has(key)) {
          seen.add(key)
          results.push({ rawTestName: name, value, unit, referenceRange: ref, matchedTest: null })
        }
      }
    }
  }

  // Line-by-line patterns (single-line formats)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.length < 3 || trimmed.length > 200) continue
    if (/^(page|patient|name|dob|date of birth|address|physician|doctor|provider|accession|specimen|lab\s*#|requisition|fax|phone|npi)/i.test(trimmed)) continue
    if (/^\d+\s*of\s*\d+$/.test(trimmed)) continue

    let matched = false

    const lcMatch = trimmed.match(labcorpPattern)
    if (lcMatch) {
      const name = lcMatch[1].trim()
      const val = parseFloat(lcMatch[2])
      const u = lcMatch[3] || ''
      const ref = lcMatch[4]?.replace(/\s/g, '') || null
      const key = `${name.toLowerCase()}|${val}`
      if (!seen.has(key) && !isNaN(val)) {
        seen.add(key)
        results.push({ rawTestName: name, value: val, unit: u, referenceRange: ref, matchedTest: null })
        matched = true
      }
    }

    if (!matched) {
      const q2Match = trimmed.match(questPattern2)
      if (q2Match) {
        const name = q2Match[1].trim()
        const val = parseFloat(q2Match[2])
        const ref = q2Match[3]?.replace(/\s/g, '') || null
        const u = q2Match[4] || ''
        const key = `${name.toLowerCase()}|${val}`
        if (!seen.has(key) && !isNaN(val)) {
          seen.add(key)
          results.push({ rawTestName: name, value: val, unit: u, referenceRange: ref, matchedTest: null })
          matched = true
        }
      }
    }

    if (!matched) {
      const q1Match = trimmed.match(questPattern)
      if (q1Match) {
        const name = q1Match[1].trim()
        const val = parseFloat(q1Match[2])
        const u = q1Match[3] || ''
        const ref = q1Match[4]?.replace(/\s/g, '') || null
        const key = `${name.toLowerCase()}|${val}`
        if (!seen.has(key) && !isNaN(val)) {
          seen.add(key)
          results.push({ rawTestName: name, value: val, unit: u, referenceRange: ref, matchedTest: null })
          matched = true
        }
      }
    }

    if (!matched) {
      const fallback = trimmed.match(new RegExp(
        `^([A-Za-z][A-Za-z0-9\\s,\\(\\)\\/\\-\\.]{2,40})\\s*[:\\|]?\\s*(\\d+\\.?\\d*)\\s*(${UNITS_PATTERN.slice(3)}\\s*((?:[\\d\\.]+\\s*[-–]\\s*[\\d\\.]+)|(?:[<>]\\s*[\\d\\.]+))?`,
        'i'
      ))
      if (fallback) {
        const name = fallback[1].trim()
        const val = parseFloat(fallback[2])
        const u = fallback[3] || ''
        const ref = fallback[4]?.replace(/\s/g, '') || null
        if (!isNaN(val) && !/^\d/.test(name) && name.length > 1) {
          const key = `${name.toLowerCase()}|${val}`
          if (!seen.has(key)) {
            seen.add(key)
            results.push({ rawTestName: name, value: val, unit: u, referenceRange: ref, matchedTest: null })
          }
        }
      }
    }
  }

  return results
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await pdfParse(buffer)
    const text = pdf.text

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF. It may be scanned/image-based.' }, { status: 400 })
    }

    // Extract date
    const collectedDate = extractDate(text)

    // CPL/Sonic: use pdftotext -layout for accurate column handling
    let results: ParsedResult[]
    if (text.includes('Clinical Pathology Laboratories')) {
      const layoutText = getPdftotextLayout(buffer)
      if (layoutText) {
        results = parseCplResults(layoutText)
      } else {
        // pdftotext unavailable — fall back to generic parser
        results = parseLabResults(text)
      }
    } else {
      results = parseLabResults(text)
    }

    // Fetch all tests for matching
    const { data: allTests } = await getSupabase()
      .from('tests')
      .select('id, test_name')
      .limit(5000)
    const tests: TestRecord[] = allTests ?? []

    // Match tests (clean name before matching to strip embedded ref ranges)
    for (const r of results) {
      const cleaned = cleanTestName(r.rawTestName)
      r.matchedTest = matchTest(cleaned, tests)
    }

    return NextResponse.json({
      results,
      collectedDate,
      totalExtracted: results.length,
      matchedCount: results.filter(r => r.matchedTest).length,
      rawTextPreview: text.slice(0, 500),
    })
  } catch (err) {
    console.error('PDF parse error:', err)
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
  }
}
