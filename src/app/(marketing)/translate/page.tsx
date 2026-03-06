'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { getLabDisplayName } from '@/config/labs'

// ─── Types ───────────────────────────────────────────────────────────────────

type TestResult = {
  id: string
  test_name: string
  cpt_codes: string[]
  category: string | null
}

type LabCode = {
  lab_name: string
  proprietary_code: string
  code_type: string
}

type PricingRow = {
  price: number
  website: string | null
  lab_name: string
}

type TranslatedTest = {
  test: TestResult
  sourceCodes: LabCode[]
  targetCodes: LabCode[]
  pricing: PricingRow[]
}

type TermStatus = 'matched' | 'suggestion' | 'notfound'

type ParsedTerm = {
  raw: string
  status: TermStatus
  matched?: TestResult
  suggestions?: TestResult[]
}

// ─── TermChip ─────────────────────────────────────────────────────────────────

function TermChip({
  term,
  onAccept,
  onRemove,
}: {
  term: ParsedTerm
  onAccept: (test: TestResult) => void
  onRemove: () => void
}) {
  const [showDropdown, setShowDropdown] = useState(false)

  if (term.status === 'matched') {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
        style={{ backgroundColor: '#f0f7f6', border: '1px solid #2d6a5e', color: '#2d6a5e' }}
      >
        <span className="text-xs">✓</span>
        <span>{term.matched!.test_name}</span>
        <button
          onClick={onRemove}
          className="ml-1 opacity-50 hover:opacity-100 text-xs font-bold leading-none"
          aria-label="Remove"
        >×</button>
      </div>
    )
  }

  if (term.status === 'suggestion') {
    return (
      <div className="relative">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer select-none"
          style={{ backgroundColor: '#fff8f0', border: '1px solid #c0826a', color: '#c0826a' }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="text-xs">?</span>
          <span>&ldquo;{term.raw}&rdquo; → {term.matched!.test_name}</span>
          <span className="text-xs ml-0.5 opacity-60">▾</span>
          <button
            onClick={(e) => { e.stopPropagation(); onAccept(term.matched!) }}
            className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold text-white"
            style={{ backgroundColor: '#c0826a' }}
            title="Accept this match"
          >✓</button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="opacity-50 hover:opacity-100 text-xs font-bold leading-none"
            aria-label="Remove"
          >×</button>
        </div>
        {showDropdown && term.suggestions && term.suggestions.length > 0 && (
          <div
            className="absolute z-20 left-0 mt-1 bg-white rounded-lg shadow-lg border min-w-56"
            style={{ borderColor: '#e0ebe9' }}
          >
            <div
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#6b8c88', borderBottom: '1px solid #e0ebe9' }}
            >
              Did you mean?
            </div>
            {term.suggestions.map(s => (
              <button
                key={s.id}
                onClick={() => { onAccept(s); setShowDropdown(false) }}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#f0f7f6] border-b last:border-b-0 transition-colors"
                style={{ color: '#1a2e2b', borderColor: '#e0ebe9' }}
              >
                {s.test_name}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // notfound
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
      style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626' }}
    >
      <span className="text-xs">✕</span>
      <span>{term.raw}</span>
      <button
        onClick={onRemove}
        className="ml-1 opacity-50 hover:opacity-100 text-xs font-bold leading-none"
        aria-label="Remove"
      >×</button>
    </div>
  )
}

// ─── LabRow ───────────────────────────────────────────────────────────────────

function LabRow({
  sourceLab,
  targetLab,
  allLabs,
  onSourceChange,
  onTargetChange,
}: {
  sourceLab: string
  targetLab: string
  allLabs: string[]
  onSourceChange: (lab: string) => void
  onTargetChange: (lab: string) => void
}) {
  const [sourceQuery, setSourceQuery] = useState('')
  const [targetQuery, setTargetQuery] = useState('')
  const [showSource, setShowSource] = useState(false)
  const [showTarget, setShowTarget] = useState(false)

  const sourceFiltered = allLabs.filter(
    l => l !== targetLab && (!sourceQuery || l.toLowerCase().includes(sourceQuery.toLowerCase()))
  )
  const targetFiltered = allLabs.filter(
    l => l !== sourceLab && (!targetQuery || l.toLowerCase().includes(targetQuery.toLowerCase()))
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 mb-4" style={{ borderColor: '#e0ebe9' }}>
      <div className="text-sm font-semibold mb-3" style={{ color: '#6b8c88' }}>
        Translate between labs
      </div>
      <div className="flex items-end gap-3">

        {/* Source */}
        <div className="flex-1 relative">
          <div className="text-xs font-medium mb-1.5" style={{ color: '#6b8c88' }}>From</div>
          {sourceLab ? (
            <button
              onClick={() => onSourceChange('')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-all"
              style={{ backgroundColor: '#2d6a5e', color: 'white' }}
            >
              <span className="truncate">{getLabDisplayName(sourceLab)}</span>
              <span className="text-xs ml-2 opacity-70 shrink-0">× change</span>
            </button>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={sourceQuery}
                onChange={(e) => { setSourceQuery(e.target.value); setShowSource(true) }}
                onFocus={() => setShowSource(true)}
                onBlur={() => setTimeout(() => setShowSource(false), 150)}
                placeholder="Search lab..."
                className="w-full px-3 py-2.5 rounded-lg border-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/20"
                style={{ borderColor: '#2d6a5e', color: '#1a2e2b' }}
              />
              {showSource && sourceFiltered.length > 0 && (
                <div
                  className="absolute z-20 w-full mt-1 bg-white rounded-lg border shadow-lg max-h-52 overflow-y-auto"
                  style={{ borderColor: '#e0ebe9' }}
                >
                  {sourceFiltered.map(lab => (
                    <button
                      key={lab}
                      onMouseDown={() => { onSourceChange(lab); setSourceQuery(''); setShowSource(false) }}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#f0f7f6] border-b last:border-b-0 transition-colors"
                      style={{ color: '#1a2e2b', borderColor: '#e0ebe9' }}
                    >
                      {getLabDisplayName(lab)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-xl font-light pb-2.5" style={{ color: '#6b8c88' }}>→</div>

        {/* Target */}
        <div className="flex-1 relative">
          <div className="text-xs font-medium mb-1.5" style={{ color: '#6b8c88' }}>To</div>
          {targetLab ? (
            <button
              onClick={() => onTargetChange('')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-all"
              style={{ backgroundColor: '#f0f7f6', border: '2px solid #2d6a5e', color: '#2d6a5e' }}
            >
              <span className="truncate">{getLabDisplayName(targetLab)}</span>
              <span className="text-xs ml-2 opacity-70 shrink-0">× change</span>
            </button>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={targetQuery}
                onChange={(e) => { setTargetQuery(e.target.value); setShowTarget(true) }}
                onFocus={() => setShowTarget(true)}
                onBlur={() => setTimeout(() => setShowTarget(false), 150)}
                placeholder="Search lab..."
                className="w-full px-3 py-2.5 rounded-lg border-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/20"
                style={{ borderColor: '#2d6a5e', color: '#1a2e2b' }}
              />
              {showTarget && targetFiltered.length > 0 && (
                <div
                  className="absolute z-20 w-full mt-1 bg-white rounded-lg border shadow-lg max-h-52 overflow-y-auto"
                  style={{ borderColor: '#e0ebe9' }}
                >
                  {targetFiltered.map(lab => (
                    <button
                      key={lab}
                      onMouseDown={() => { onTargetChange(lab); setTargetQuery(''); setShowTarget(false) }}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#f0f7f6] border-b last:border-b-0 transition-colors"
                      style={{ color: '#1a2e2b', borderColor: '#e0ebe9' }}
                    >
                      {getLabDisplayName(lab)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── ResultsSection ───────────────────────────────────────────────────────────

function ResultsSection({
  translatedTests,
  sourceLab,
  targetLab,
}: {
  translatedTests: TranslatedTest[]
  sourceLab: string
  targetLab: string
}) {
  const isSingle = translatedTests.length === 1

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#e0ebe9' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1a2e2b' }}>Translation Results</h2>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <span className="font-semibold" style={{ color: '#1a2e2b' }}>{getLabDisplayName(sourceLab)}</span>
            <span style={{ color: '#6b8c88' }}>→</span>
            <span className="font-semibold" style={{ color: '#2d6a5e' }}>{getLabDisplayName(targetLab)}</span>
          </div>
        </div>
        <button
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#faf8f5', color: '#2d6a5e', border: '1px solid #e0ebe9' }}
        >
          🖨️ Print
        </button>
      </div>

      {/* Multi-test table */}
      {!isSingle && (
        <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid #e0ebe9' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#f0f7f6', borderBottom: '2px solid #e0ebe9' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1a2e2b' }}>Test</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#6b8c88' }}>CPT</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#6b8c88' }}>
                  {getLabDisplayName(sourceLab)}
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#2d6a5e' }}>
                  {getLabDisplayName(targetLab)}
                </th>
              </tr>
            </thead>
            <tbody>
              {translatedTests.map(({ test, sourceCodes, targetCodes }, i) => (
                <tr
                  key={test.id}
                  className="hover:bg-[#faf8f5] transition-colors"
                  style={{ borderBottom: i < translatedTests.length - 1 ? '1px solid #e0ebe9' : 'none' }}
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/search/${test.id}`}
                      className="font-medium hover:underline"
                      style={{ color: '#1a2e2b' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {test.test_name}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#6b8c88' }}>
                    {test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#4a6b67' }}>
                    {sourceCodes.length > 0
                      ? sourceCodes.map(c => c.proprietary_code).join(', ')
                      : <span className="italic not-italic" style={{ color: '#c0826a', fontFamily: 'inherit' }}>N/A</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: '#2d6a5e' }}>
                    {targetCodes.length > 0
                      ? targetCodes.map(c => c.proprietary_code).join(', ')
                      : <span className="italic font-normal" style={{ color: '#c0826a', fontFamily: 'inherit' }}>N/A</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Single-test card */}
      {isSingle && (() => {
        const { test, sourceCodes, targetCodes } = translatedTests[0]
        return (
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #e0ebe9' }}>
            <div className="px-5 py-4" style={{ backgroundColor: '#f0f7f6' }}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="font-semibold text-base" style={{ color: '#1a2e2b' }}>{test.test_name}</div>
                <a
                  href={`/search/${test.id}`}
                  className="text-xs underline shrink-0"
                  style={{ color: '#2d6a5e' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View details →
                </a>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b8c88' }}>CPT Code</div>
                  <div className="font-mono" style={{ color: '#1a2e2b' }}>
                    {test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b8c88' }}>
                    {getLabDisplayName(sourceLab)}
                  </div>
                  <div className="font-mono" style={{ color: '#4a6b67' }}>
                    {sourceCodes.length > 0
                      ? sourceCodes.map(c => c.proprietary_code).join(', ')
                      : <span className="italic" style={{ color: '#c0826a', fontFamily: 'inherit' }}>Not in database</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#2d6a5e' }}>
                    {getLabDisplayName(targetLab)}
                  </div>
                  <div className="font-mono font-semibold" style={{ color: '#2d6a5e' }}>
                    {targetCodes.length > 0
                      ? targetCodes.map(c => c.proprietary_code).join(', ')
                      : (
                        <div>
                          <span className="italic font-normal" style={{ color: '#c0826a', fontFamily: 'inherit' }}>Not in database</span>
                          {test.cpt_codes?.length > 0 && (
                            <div className="mt-2 text-xs font-normal rounded px-2.5 py-2" style={{ backgroundColor: '#fff8f5', border: '1px solid #e8d5cc', color: '#4a6b67' }}>
                              Use CPT <span className="font-semibold" style={{ color: '#1a2e2b' }}>{test.cpt_codes.join(', ')}</span> — accepted at most labs
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Price highlights */}
      {translatedTests.some(t => t.pricing.length > 0) && (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6b8c88' }}>
            💰 Best self-pay prices
          </div>
          <div className="space-y-2">
            {translatedTests.filter(t => t.pricing.length > 0).map(({ test, pricing }) => {
              const best = pricing[0]
              return (
                <div
                  key={test.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg flex-wrap"
                  style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
                >
                  <div className="flex items-center gap-3">
                    {!isSingle && (
                      <span className="text-sm font-medium" style={{ color: '#1a2e2b' }}>{test.test_name}</span>
                    )}
                    <span className="text-base font-bold" style={{ color: '#15803d' }}>
                      ${Number(best.price).toFixed(2)}
                    </span>
                    <span className="text-xs" style={{ color: '#4a6b67' }}>{best.lab_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href={`/search/${test.id}`} className="text-xs underline" style={{ color: '#2d6a5e' }}>
                      Compare all →
                    </a>
                    {best.website && (
                      <a
                        href={best.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                        style={{ backgroundColor: '#2d6a5e' }}
                      >
                        Order →
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-5 rounded-lg p-4 text-xs" style={{ backgroundColor: '#fff8f5', border: '1px solid #e8d5cc', color: '#4a6b67' }}>
        <p className="font-semibold mb-1" style={{ color: '#c0826a' }}>
          ⚠️ REFERENCE DOCUMENT — NOT A PHYSICIAN&apos;S ORDER
        </p>
        <p>
          This translation is a reference tool only. Always present it alongside your original physician&apos;s order.
          Lab codes may change — confirm with the lab before your visit. LabLooker does not store any personal health information.
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TranslatePage() {
  const supabase = createClient()

  const [bulkInput, setBulkInput] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [parsedTerms, setParsedTerms] = useState<ParsedTerm[]>([])
  const [sourceLab, setSourceLab] = useState('')
  const [targetLab, setTargetLab] = useState('')
  const [allLabs, setAllLabs] = useState<string[]>([])
  const [translatedTests, setTranslatedTests] = useState<TranslatedTest[]>([])
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    async function fetchLabs() {
      const { data } = await supabase.from('lab_codes').select('lab_name')
      if (data) {
        const unique = [...new Set(data.map((r: { lab_name: string }) => r.lab_name))].sort() as string[]
        setAllLabs(unique)
      }
    }
    fetchLabs()
  }, [])

  const parseAndMatch = useCallback(async () => {
    if (!bulkInput.trim()) return
    setIsParsing(true)
    setTranslatedTests([])

    const rawTerms = bulkInput
      .split(/[,\n]+/)
      .map(t => t.trim())
      .filter(t => t.length >= 2)

    if (rawTerms.length === 0) { setIsParsing(false); return }

    const results = await Promise.all(
      rawTerms.map(async (raw): Promise<ParsedTerm> => {
        try {
          const words = raw.toLowerCase().split(/\s+/).filter(Boolean)
          const firstWord = words[0]

          const [{ data: nameData }, { data: codeData }] = await Promise.all([
            supabase
              .from('tests')
              .select('id, test_name, cpt_codes, category')
              .ilike('test_name', `%${firstWord}%`)
              .limit(10),
            supabase
              .from('lab_codes')
              .select('test_id')
              .ilike('proprietary_code', `%${raw}%`)
              .limit(5),
          ])

          const nameMatches: TestResult[] = (nameData || []).filter((t: TestResult) =>
            words.every(w => t.test_name.toLowerCase().includes(w))
          )

          let codeMatches: TestResult[] = []
          if (codeData?.length) {
            const ids = [...new Set(codeData.map((r: { test_id: string }) => r.test_id))]
            const { data: ct } = await supabase
              .from('tests')
              .select('id, test_name, cpt_codes, category')
              .in('id', ids)
            codeMatches = ct || []
          }

          const seen = new Set<string>()
          const all: TestResult[] = []
          for (const t of [...codeMatches, ...nameMatches]) {
            if (!seen.has(t.id)) { seen.add(t.id); all.push(t) }
          }

          if (all.length === 0) return { raw, status: 'notfound' }
          if (all.length === 1) return { raw, status: 'matched', matched: all[0] }

          const exact = all.find(t => t.test_name.toLowerCase() === raw.toLowerCase())
          if (exact) return { raw, status: 'matched', matched: exact }

          return { raw, status: 'suggestion', matched: all[0], suggestions: all.slice(0, 5) }
        } catch {
          return { raw, status: 'notfound' }
        }
      })
    )

    setParsedTerms(results)
    setIsParsing(false)
  }, [bulkInput])

  const acceptSuggestion = (index: number, test: TestResult) =>
    setParsedTerms(prev => prev.map((t, i) =>
      i === index ? { ...t, status: 'matched' as TermStatus, matched: test } : t
    ))

  const removeTerm = (index: number) =>
    setParsedTerms(prev => prev.filter((_, i) => i !== index))

  const confirmedTests = parsedTerms
    .filter(t => t.status === 'matched' && t.matched)
    .map(t => t.matched!)
    .filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i)

  const canTranslate = confirmedTests.length > 0 && sourceLab && targetLab && sourceLab !== targetLab

  const translate = async () => {
    if (!canTranslate) return
    setIsTranslating(true)
    try {
      const testIds = confirmedTests.map(t => t.id)

      const [{ data: allCodes }, { data: allPricing }] = await Promise.all([
        supabase
          .from('lab_codes')
          .select('test_id, lab_name, proprietary_code, code_type')
          .in('test_id', testIds)
          .in('lab_name', [sourceLab, targetLab]),
        supabase
          .from('pricing')
          .select('test_id, price, website, labs(lab_name)')
          .in('test_id', testIds)
          .order('price', { ascending: true }),
      ])

      const results: TranslatedTest[] = confirmedTests.map(test => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const codes = (allCodes || []).filter((c: any) => c.test_id === test.id)
        const pricing = (allPricing || [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((p: any) => p.test_id === test.id)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((p: any) => ({
            price: p.price,
            website: p.website,
            lab_name: p.labs?.lab_name ?? '',
          }))
        return {
          test,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sourceCodes: codes.filter((c: any) => c.lab_name === sourceLab),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          targetCodes: codes.filter((c: any) => c.lab_name === targetLab),
          pricing,
        }
      })

      setTranslatedTests(results)
    } catch (e) {
      console.error('Translation error:', e)
    }
    setIsTranslating(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1a2e2b' }}>
            Lab Code Translator
          </h1>
          <p className="text-lg" style={{ color: '#4a6b67' }}>
            Type or paste your ordered tests — we&apos;ll translate the codes for any lab.
          </p>
        </div>

        {/* Bulk input */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-4" style={{ borderColor: '#e0ebe9' }}>
          <label className="block text-sm font-semibold mb-1" style={{ color: '#1a2e2b' }}>
            What tests were ordered?
          </label>
          <p className="text-xs mb-3" style={{ color: '#6b8c88' }}>
            Type test names or codes, separated by commas or new lines. Or paste directly from your lab order.
          </p>
          <textarea
            value={bulkInput}
            onChange={(e) => {
              setBulkInput(e.target.value)
              if (parsedTerms.length > 0) setParsedTerms([])
              if (translatedTests.length > 0) setTranslatedTests([])
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                parseAndMatch()
              }
            }}
            placeholder={'TSH, Free T4, Ferritin, Vitamin D\n\nor paste your lab order here...'}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e] transition-colors"
            style={{ borderColor: '#e0ebe9', color: '#1a2e2b', backgroundColor: 'white' }}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs" style={{ color: '#9ca3af' }}>⌘+Enter to search</p>
            <button
              onClick={parseAndMatch}
              disabled={!bulkInput.trim() || isParsing}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: bulkInput.trim() && !isParsing ? '#2d6a5e' : '#e0ebe9',
                color: bulkInput.trim() && !isParsing ? 'white' : '#6b8c88',
                cursor: bulkInput.trim() && !isParsing ? 'pointer' : 'not-allowed',
              }}
            >
              {isParsing ? 'Searching...' : 'Find Tests →'}
            </button>
          </div>
        </div>

        {/* Parsed chips */}
        {parsedTerms.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-5 mb-4" style={{ borderColor: '#e0ebe9' }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6b8c88' }}>
              {confirmedTests.length} of {parsedTerms.length} matched
            </div>
            <div className="flex flex-wrap gap-2">
              {parsedTerms.map((term, i) => (
                <TermChip
                  key={i}
                  term={term}
                  onAccept={(test) => acceptSuggestion(i, test)}
                  onRemove={() => removeTerm(i)}
                />
              ))}
            </div>
            {parsedTerms.some(t => t.status === 'notfound') && (
              <p className="text-xs mt-3" style={{ color: '#c0826a' }}>
                Terms shown in red weren&apos;t recognized — remove them or try an alternate name.
              </p>
            )}
          </div>
        )}

        {/* Lab row */}
        {parsedTerms.length > 0 && confirmedTests.length > 0 && (
          <LabRow
            sourceLab={sourceLab}
            targetLab={targetLab}
            allLabs={allLabs}
            onSourceChange={(lab) => {
              setSourceLab(lab)
              if (targetLab === lab) setTargetLab('')
              setTranslatedTests([])
            }}
            onTargetChange={(lab) => {
              setTargetLab(lab)
              setTranslatedTests([])
            }}
          />
        )}

        {/* Translate button */}
        {confirmedTests.length > 0 && (
          <button
            onClick={translate}
            disabled={!canTranslate || isTranslating}
            className="w-full py-4 rounded-xl text-base font-semibold transition-all mb-8"
            style={{
              backgroundColor: canTranslate ? '#2d6a5e' : '#e0ebe9',
              color: canTranslate ? 'white' : '#6b8c88',
              cursor: canTranslate ? 'pointer' : 'not-allowed',
            }}
          >
            {isTranslating
              ? 'Translating...'
              : !sourceLab || !targetLab
                ? 'Select both labs to translate'
                : `Translate ${confirmedTests.length} test${confirmedTests.length !== 1 ? 's' : ''} →`}
          </button>
        )}

        {/* Results */}
        {translatedTests.length > 0 && (
          <ResultsSection
            translatedTests={translatedTests}
            sourceLab={sourceLab}
            targetLab={targetLab}
          />
        )}

        {/* Help text */}
        {translatedTests.length === 0 && (
          <div className="text-center text-sm mt-6" style={{ color: '#6b8c88' }}>
            <p className="mb-2">
              <strong>How it works:</strong> Each lab uses its own internal codes for the same test.
              We translate them so you can walk into any lab with the right code.
            </p>
            <p>
              <Link href="/search" className="underline" style={{ color: '#2d6a5e' }}>
                Browse all tests →
              </Link>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
