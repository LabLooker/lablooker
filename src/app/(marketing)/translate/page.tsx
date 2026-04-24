'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
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

type TermStatus = 'matched' | 'suggestion' | 'notfound' | 'manual'

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
  onKeepManual,
  onUpdateRaw,
}: {
  term: ParsedTerm
  onAccept: (test: TestResult) => void
  onRemove: () => void
  onKeepManual: () => void
  onUpdateRaw: (newRaw: string) => void
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [editValue, setEditValue] = useState(term.raw)
  const [isEditing, setIsEditing] = useState(false)
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && editRef.current) editRef.current.focus()
  }, [isEditing])

  // Row style: left border accent, name + actions, no nested pill-in-box
  const rowBase = "flex items-center gap-2 px-3 py-2 rounded-lg w-full text-sm group min-w-0"

  if (term.status === 'matched') {
    const hasOptions = term.suggestions && term.suggestions.length > 1
    return (
      <div className="w-full">
        <div
          className={rowBase}
          style={{ backgroundColor: '#f0fdf4', borderLeft: '3px solid #22c55e', color: '#166534' }}
        >
          <span className="text-xs shrink-0 opacity-70">✓</span>
          <span className="flex-1 min-w-0 font-medium truncate">{term.matched!.test_name}</span>
          {term.raw.toLowerCase() !== term.matched!.test_name.toLowerCase() && (
            <span className="text-xs opacity-40 shrink-0 hidden sm:inline">({term.raw})</span>
          )}
          {hasOptions && (
            <button onClick={() => setShowDropdown(d => !d)} className="text-xs opacity-40 hover:opacity-80 shrink-0" title="Change">✎</button>
          )}
          <button onClick={onRemove} className="opacity-0 group-hover:opacity-40 hover:!opacity-80 text-xs font-bold shrink-0 transition-opacity" aria-label="Remove">×</button>
        </div>
        {showDropdown && hasOptions && (
          <div className="mt-1 ml-4 bg-white rounded-lg shadow-lg border py-1" style={{ borderColor: '#e0ebe9', minWidth: '180px', zIndex: 10 }}>
            {term.suggestions!.map(s => (
              <button key={s.id} onClick={() => { onAccept(s); setShowDropdown(false) }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#f0f7f6]"
                style={{ color: s.id === term.matched!.id ? '#2d6a5e' : '#1a2e2b' }}
              >
                <span className="text-xs w-3 shrink-0">{s.id === term.matched!.id ? '●' : '○'}</span>
                {s.test_name}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (term.status === 'suggestion') {
    const options = term.suggestions && term.suggestions.length > 0 ? term.suggestions : [term.matched!]
    return (
      <div className="w-full">
        <button onClick={() => setShowDropdown(d => !d)}
          className={rowBase + " cursor-pointer w-full text-left"}
          style={{ backgroundColor: '#fffbeb', borderLeft: '3px solid #f59e0b', color: '#92400e' }}
        >
          <span className="text-xs shrink-0 opacity-60">?</span>
          <span className="flex-1 min-w-0 font-medium truncate">{term.matched!.test_name}</span>
          {term.raw.toLowerCase() !== term.matched!.test_name.toLowerCase() && (
            <span className="text-xs opacity-40 shrink-0 hidden sm:inline">({term.raw})</span>
          )}
          <span className="text-xs opacity-50 shrink-0">{showDropdown ? '▲' : '▼'}</span>
          <span onClick={(e) => { e.stopPropagation(); onRemove() }} className="opacity-0 group-hover:opacity-40 hover:!opacity-80 text-xs font-bold shrink-0 transition-opacity cursor-pointer">×</span>
        </button>
        {showDropdown && (
          <div className="mt-1 ml-4 bg-white rounded-lg shadow-lg border py-1" style={{ borderColor: '#e0ebe9', minWidth: '180px', zIndex: 10 }}>
            {options.map(s => (
              <button key={s.id} onClick={() => { onAccept(s); setShowDropdown(false) }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#f0f7f6]"
                style={{ color: s.id === term.matched!.id ? '#2d6a5e' : '#1a2e2b' }}
              >
                <span className="text-xs w-3 shrink-0">{s.id === term.matched!.id ? '●' : '○'}</span>
                {s.test_name}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // manual (kept, now in editing mode to add a name)
  if (term.status === 'manual') {
    return (
      <div
        className={rowBase}
        style={{ backgroundColor: '#f9fafb', borderLeft: '3px solid #9ca3af', padding: '6px 12px' }}
      >
        <span className="text-xs shrink-0 opacity-60">✏️</span>
        <input
          ref={editRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && editValue.trim()) {
              onAccept({ id: `manual-${editValue.trim()}`, test_name: editValue.trim(), cpt_codes: [], category: null })
            }
            if (e.key === 'Escape') { setEditValue(''); onRemove() }
          }}
          autoFocus
          className="flex-1 min-w-0 text-sm bg-white rounded border px-2 py-0.5 focus:outline-none focus:ring-1"
          style={{ borderColor: '#9ca3af', color: '#374151' }}
          placeholder="Edit or type test name..."
        />
        <button
          onClick={() => {
            if (editValue.trim()) onAccept({ id: `manual-${editValue.trim()}`, test_name: editValue.trim(), cpt_codes: [], category: null })
          }}
          className="text-xs px-2 py-0.5 rounded shrink-0"
          style={{ backgroundColor: '#2d6a5e', color: 'white' }}
        >Done</button>
        <button onClick={onRemove} className="opacity-40 hover:opacity-80 text-xs font-bold shrink-0">×</button>
      </div>
    )
  }

  // notfound
  return (
    <div className="w-full">
      <div
        className={rowBase + " group"}
        style={{ backgroundColor: '#fef2f2', borderLeft: '3px solid #f87171', color: '#991b1b' }}
      >
        <span className="flex-1 min-w-0 truncate">{term.raw}</span>
        <button
          onClick={() => { onKeepManual(); setEditValue(term.raw); setIsEditing(true) }}
          className="text-xs px-2 py-0.5 rounded shrink-0 transition-opacity hover:opacity-100 opacity-80"
          style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}
        >add</button>
        <button onClick={onRemove} className="opacity-40 hover:opacity-90 text-xs font-bold shrink-0" aria-label="Remove">×</button>
      </div>
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
      <div className="text-sm font-semibold mb-3" style={{ color: '#577572' }}>
        Translate between labs
      </div>
      <div className="flex items-end gap-3">

        {/* Source */}
        <div className="flex-1 relative">
          <div className="text-xs font-medium mb-1.5" style={{ color: '#577572' }}>From</div>
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
                onBlur={() => setTimeout(() => {
                  setShowSource(false)
                  if (sourceQuery.trim()) {
                    const q = sourceQuery.toLowerCase()
                    const filtered = allLabs.filter(l => l !== targetLab && l.toLowerCase().includes(q))
                    const exact = filtered.find(l => l.toLowerCase() === q)
                    const pick = exact ?? (filtered.length === 1 ? filtered[0] : null)
                    if (pick) { onSourceChange(pick); setSourceQuery('') }
                  }
                }, 150)}
                placeholder="Search lab..."
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#2d6a5e] text-sm text-[#1a2e2b] placeholder-[#577572] focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/20"
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

        <div className="text-xl font-light pb-2.5" style={{ color: '#577572' }}>→</div>

        {/* Target */}
        <div className="flex-1 relative">
          <div className="text-xs font-medium mb-1.5" style={{ color: '#577572' }}>To</div>
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
                onBlur={() => setTimeout(() => {
                  setShowTarget(false)
                  if (targetQuery.trim()) {
                    const q = targetQuery.toLowerCase()
                    const filtered = allLabs.filter(l => l !== sourceLab && l.toLowerCase().includes(q))
                    const exact = filtered.find(l => l.toLowerCase() === q)
                    const pick = exact ?? (filtered.length === 1 ? filtered[0] : null)
                    if (pick) { onTargetChange(pick); setTargetQuery('') }
                  }
                }, 150)}
                placeholder="Search lab..."
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#2d6a5e] text-sm text-[#1a2e2b] placeholder-[#577572] focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/20"
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
  manualTerms,
}: {
  translatedTests: TranslatedTest[]
  sourceLab: string
  targetLab: string
  manualTerms?: string[]
}) {
  const isSingle = translatedTests.length === 1

  return (
    <div className="print-results bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#e0ebe9' }}>

      {/* Print-only header */}
      <div className="hidden print:block mb-6 pb-5" style={{ borderBottom: '2px solid #2d6a5e' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: '#1a2e2b' }}>LabLooker</div>
            <div className="text-xs" style={{ color: '#577572' }}>lablooker.com · Lab Code Translation Tool</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: '#577572' }}>Printed {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm font-medium" style={{ color: '#1a2e2b' }}>
          <span>{getLabDisplayName(sourceLab)}</span>
          <span style={{ color: '#2d6a5e' }}>→</span>
          <span style={{ color: '#2d6a5e' }}>{getLabDisplayName(targetLab)}</span>
        </div>
        <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>
          Reference only — present alongside your original physician&apos;s order. Lab codes may change — confirm with the lab before your visit.
        </div>
      </div>

      {/* Screen header */}
      <div className="flex items-center justify-between mb-5 print:hidden">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1a2e2b' }}>Translation Results</h2>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <span className="font-semibold" style={{ color: '#1a2e2b' }}>{getLabDisplayName(sourceLab)}</span>
            <span style={{ color: '#577572' }}>→</span>
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
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#577572' }}>
                  {getLabDisplayName(sourceLab)}
                </th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#2d6a5e', borderLeft: '3px solid #2d6a5e' }}>
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
                      className="font-semibold hover:underline"
                      style={{ color: '#1a2e2b' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {test.test_name}
                      {test.cpt_codes?.length > 0 && (
                        <span className="font-normal ml-1" style={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                          (CPT {test.cpt_codes.join(', ')})
                        </span>
                      )}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#4a6b67' }}>
                    {sourceCodes.length > 0
                      ? sourceCodes.map(c => c.proprietary_code).join(', ')
                      : <span className="italic not-italic" style={{ color: '#b85c5c', fontFamily: 'inherit' }}>N/A</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-semibold" style={{ color: '#2d6a5e', backgroundColor: '#f0f7f6', borderLeft: '3px solid #2d6a5e' }}>
                    {targetCodes.length > 0
                      ? targetCodes.map(c => c.proprietary_code).join(', ')
                      : test.cpt_codes?.length > 0
                        ? <span className="font-normal text-xs" style={{ color: '#4a6b67', fontFamily: 'inherit' }}>Use CPT <span className="font-semibold" style={{ color: '#1a2e2b' }}>{test.cpt_codes.join(', ')}</span></span>
                        : <span className="italic font-normal text-xs" style={{ color: '#b85c5c', fontFamily: 'inherit' }}>N/A</span>}
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
        const cptLabel = test.cpt_codes?.length > 0 ? ` (CPT ${test.cpt_codes.join(', ')})` : ''
        return (
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #e0ebe9' }}>
            <div className="px-5 py-4" style={{ backgroundColor: '#f0f7f6' }}>
              {/* Test name + CPT inline */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="font-semibold text-base" style={{ color: '#1a2e2b' }}>
                  {test.test_name}
                  {cptLabel && (
                    <span className="font-normal text-xs ml-1" style={{ color: '#9ca3af' }}>{cptLabel}</span>
                  )}
                </div>
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
              {/* Source → Target — same box style, aligned */}
              <div className="grid grid-cols-2 gap-3">
                {/* Source */}
                <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: 'white', border: '1px solid #e0ebe9' }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1.5 leading-tight" style={{ color: '#577572' }}>
                    {getLabDisplayName(sourceLab)}
                  </div>
                  <div className="font-mono text-sm" style={{ color: '#4a6b67' }}>
                    {sourceCodes.length > 0
                      ? sourceCodes.map(c => c.proprietary_code).join(', ')
                      : <span className="italic text-xs" style={{ color: '#b85c5c', fontFamily: 'inherit' }}>Not in database</span>}
                  </div>
                </div>
                {/* Target */}
                <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: '#f0f7f6', border: '2px solid #2d6a5e' }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1.5 leading-tight" style={{ color: '#2d6a5e' }}>
                    {getLabDisplayName(targetLab)}
                  </div>
                  <div className="font-mono font-semibold text-sm" style={{ color: '#2d6a5e' }}>
                    {targetCodes.length > 0
                      ? targetCodes.map(c => c.proprietary_code).join(', ')
                      : (
                        <div>
                          <span className="italic font-normal text-xs" style={{ color: '#b85c5c', fontFamily: 'inherit' }}>Not in database</span>
                          {test.cpt_codes?.length > 0 && (
                            <div className="mt-2 text-xs font-normal rounded px-2 py-1.5" style={{ backgroundColor: '#fff8f5', border: '1px solid #e8d5cc', color: '#4a6b67' }}>
                              Use CPT <span className="font-semibold" style={{ color: '#1a2e2b' }}>{test.cpt_codes.join(', ')}</span>
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

      {/* Price highlights — screen only */}
      {translatedTests.some(t => t.pricing.length > 0) && (
        <div className="mt-5 print:hidden">
          <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#577572' }}>
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

      {/* Manual fill-in rows */}
      {manualTerms && manualTerms.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#577572' }}>
            ✏️ Fill in manually ({manualTerms.length})
          </div>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #e0ebe9' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f8faf9' }}>
                  <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: '#577572', width: '35%' }}>Test (you entered)</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: '#577572', width: '32.5%' }}>{getLabDisplayName(sourceLab)} Code</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: '#577572', width: '32.5%' }}>{getLabDisplayName(targetLab)} Code</th>
                </tr>
              </thead>
              <tbody>
                {manualTerms.map((raw, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #e0ebe9' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a2e2b' }}>{raw}</td>
                    <td className="px-4 py-3" style={{ color: '#9ca3af', borderLeft: '1px dashed #e0ebe9' }}>
                      <span className="inline-block w-24 border-b" style={{ borderColor: '#9ca3af' }}>&nbsp;</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#9ca3af', borderLeft: '1px dashed #e0ebe9' }}>
                      <span className="inline-block w-24 border-b" style={{ borderColor: '#9ca3af' }}>&nbsp;</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-5 rounded-lg p-4 text-xs" style={{ backgroundColor: '#fff8f5', border: '1px solid #e8d5cc', color: '#4a6b67' }}>
        <p className="font-semibold mb-1" style={{ color: '#b85c5c' }}>
          ⚠️ REFERENCE DOCUMENT — NOT A PHYSICIAN&apos;S ORDER
        </p>
        <p>
          This translation is a reference tool only. Always present it alongside your original physician&apos;s order.
          Lab codes may change — confirm with the lab before your visit. LabLooker does not store any personal health information.
        </p>
      </div>

      {/* Print-only footer */}
      <div className="hidden print:block mt-8 pt-4 text-xs" style={{ borderTop: '1px solid #e0ebe9', color: '#9ca3af' }}>
        <div className="flex items-center justify-between">
          <span>Generated by <strong style={{ color: '#2d6a5e' }}>LabLooker</strong> · lablooker.com</span>
          <span>Free lab code translation tool for patients</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TranslatePage() {
  const supabase = createClient()

  const [bulkInput, setBulkInput] = useState('')
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedTerms, setParsedTerms] = useState<ParsedTerm[]>([])
  const [sourceLab, setSourceLab] = useState('')
  const [targetLab, setTargetLab] = useState('')
  const [allLabs, setAllLabs] = useState<string[]>([])
  const [translatedTests, setTranslatedTests] = useState<TranslatedTest[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handlePdfUpload = useCallback(async (file: File) => {
    setPdfError(null)
    if (!file) { setPdfError('No file selected.'); return }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setPdfError(`File "${file.name}" doesn't look like a PDF. Make sure it ends in .pdf`)
      return
    }
    setIsPdfLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/extract-pdf-text', { method: 'POST', body: formData })
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`Server error ${res.status}: ${body}`)
      }
      const json = await res.json()
      if (json.error || !json.text) throw new Error(json.error || 'No text extracted')
      // Strip extra whitespace but keep line breaks so test names stay separated
      const cleaned = json.text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
      setBulkInput(prev => prev ? prev + '\n' + cleaned : cleaned)
      if (translatedTests.length > 0) setTranslatedTests([])
    } catch (e) {
      console.error('PDF upload error:', e)
      setPdfError(`Could not read PDF: ${e instanceof Error ? e.message : 'unknown error'}. Try copying and pasting the test names instead.`)
    }
    setIsPdfLoading(false)
  }, [translatedTests])

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

    // Additive: skip terms already in existing parsedTerms (any status)
    const existingRaws = new Set(parsedTerms.map(t => t.raw.toLowerCase()))
    const newTerms = rawTerms.filter(r => !existingRaws.has(r.toLowerCase()))
    if (newTerms.length === 0) { setIsParsing(false); setBulkInput(''); return }

    const results = await Promise.all(
      newTerms.map(async (raw): Promise<ParsedTerm> => {
        try {
          const words = raw.toLowerCase().split(/\s+/).filter(Boolean)
          const firstWord = words[0]

          const [{ data: nameData }, { data: codeData }] = await Promise.all([
            supabase
              .from('tests')
              .select('id, test_name, cpt_codes, category')
              .ilike('test_name', `%${firstWord}%`)
              .limit(25),
            supabase
              .from('lab_codes')
              .select('test_id')
              .ilike('proprietary_code', `%${raw}%`)
              .limit(5),
          ])

          const nameMatches: TestResult[] = (nameData || []).filter((t: TestResult) =>
            words.every(w => {
              const name = t.test_name.toLowerCase()
              // Short words (≤2 chars): must appear as a whole token, not embedded inside another word
              // e.g. "d" should match "Vitamin D" but not "Pyridoxine"
              if (w.length <= 2) {
                return new RegExp(`(^|[\\s,(/])${w}([\\s,)./]|$)`, 'i').test(name)
              }
              return name.includes(w)
            })
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

          // Name matches always take priority over code matches
          const seen = new Set<string>()
          const all: TestResult[] = []
          for (const t of [...nameMatches, ...codeMatches]) {
            if (!seen.has(t.id)) { seen.add(t.id); all.push(t) }
          }

          if (all.length === 0) return { raw, status: 'notfound' }
          if (all.length === 1) return { raw, status: 'matched', matched: all[0] }

          const rawLower = raw.toLowerCase()

          // Exact name match
          const exact = all.find(t => t.test_name.toLowerCase() === rawLower)
          if (exact) return { raw, status: 'matched', matched: exact }

          // Strong prefix match: typed term is clearly the start of one test name
          // e.g. "TSH" → "TSH (Thyroid Stimulating Hormone)" or "TSH, 3rd Gen"
          const prefixMatches = all.filter(t => {
            const name = t.test_name.toLowerCase()
            const starts = name.startsWith(rawLower + ' ') ||
              name.startsWith(rawLower + ',') ||
              name.startsWith(rawLower + '(') ||
              name.startsWith(rawLower + ';')
            if (!starts) return false
            // Don't auto-match compound panels (e.g. "Free Testosterone + Total Testosterone")
            const remainder = name.slice(rawLower.length).trim()
            return !/^[+&]/.test(remainder)
          })
          if (prefixMatches.length === 1) return { raw, status: 'matched', matched: prefixMatches[0] }

          // For suggestions: only show tests where the name is actually relevant
          // (contains the query words) — this prevents code matches with unrelated
          // test names from polluting the suggestion list
          const nameSuggestions = all.filter(t =>
            words.some(w => {
              const name = t.test_name.toLowerCase()
              if (w.length <= 2) {
                return new RegExp(`(^|[\\s,(/])${w}([\\s,)./]|$)`, 'i').test(name)
              }
              return name.includes(w)
            })
          )
          const suggestionPool = nameSuggestions.length > 0 ? nameSuggestions : all

          // Auto-match: if only one candidate in suggestion pool, accept it
          if (suggestionPool.length === 1) return { raw, status: 'matched', matched: suggestionPool[0] }

          // Score each candidate: how many query words appear in the name?
          const scored = suggestionPool.map(t => {
            const name = t.test_name.toLowerCase()
            const hits = words.filter(w => {
              if (w.length <= 2) return new RegExp(`(^|[\\s,(/])${w}([\\s,)./]|$)`, 'i').test(name)
              return name.includes(w)
            }).length
            return { t, hits }
          })
          const maxHits = Math.max(...scored.map(s => s.hits))
          const topScored = scored.filter(s => s.hits === maxHits).map(s => s.t)

          // If one candidate covers all query words, auto-match it
          if (topScored.length === 1 && maxHits === words.length) {
            return { raw, status: 'matched', matched: topScored[0] }
          }

          return { raw, status: 'suggestion', matched: topScored[0] ?? suggestionPool[0], suggestions: topScored.slice(0, 5).length > 0 ? topScored.slice(0, 5) : suggestionPool.slice(0, 5) }
        } catch {
          return { raw, status: 'notfound' }
        }
      })
    )

    // Append new results to existing terms
    setParsedTerms(prev => [...prev.filter(t => t.status === 'matched' || t.status === 'suggestion' || t.status === 'notfound' || t.status === 'manual'), ...results])
    setBulkInput('')
    setIsParsing(false)
  }, [bulkInput, parsedTerms])

  const acceptSuggestion = (index: number, test: TestResult) =>
    setParsedTerms(prev => prev.map((t, i) =>
      i === index ? { ...t, status: 'matched' as TermStatus, matched: test } : t
    ))

  const revertToSuggestion = (index: number) =>
    setParsedTerms(prev => prev.map((t, i) =>
      i === index ? { ...t, status: 'suggestion' as TermStatus } : t
    ))

  const removeTerm = (index: number) =>
    setParsedTerms(prev => prev.filter((_, i) => i !== index))

  const keepManual = (index: number) =>
    setParsedTerms(prev => prev.map((t, i) =>
      i === index ? { ...t, status: 'manual' as TermStatus } : t
    ))

  const updateRaw = (index: number, newRaw: string) =>
    setParsedTerms(prev => prev.map((t, i) =>
      i === index ? { ...t, raw: newRaw.trim() || t.raw } : t
    ))

  // Only fully matched tests count — unresolved suggestions must be reviewed first
  const confirmedTests = parsedTerms
    .filter(t => t.status === 'matched' && t.matched)
    .map(t => t.matched!)
    .filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i)

  const unresolvedCount = parsedTerms.filter(t => t.status === 'suggestion').length

  const matchedWithIndex = parsedTerms.map((t, i) => ({ term: t, index: i })).filter(({ term }) => term.status === 'matched')
  const suggestionsWithIndex = parsedTerms.map((t, i) => ({ term: t, index: i })).filter(({ term }) => term.status === 'suggestion')
  const notfoundWithIndex = parsedTerms.map((t, i) => ({ term: t, index: i })).filter(({ term }) => term.status === 'notfound' || term.status === 'manual')

  const manualCount = parsedTerms.filter(t => t.status === 'manual').length
  const canTranslate = confirmedTests.length > 0 && unresolvedCount === 0 && sourceLab && targetLab && sourceLab !== targetLab

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
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch (e) {
      console.error('Translation error:', e)
    }
    setIsTranslating(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="text-center mb-10 print:hidden">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e2b] mb-3">
            Translate lab codes
          </h1>
          <p className="text-lg" style={{ color: '#4a6b67' }}>
            Type or paste your ordered tests — we&apos;ll translate the codes for any lab.
          </p>
        </div>

        {/* Bulk input */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-4 print:hidden" style={{ borderColor: '#e0ebe9' }}>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold" style={{ color: '#1a2e2b' }}>
              What tests were ordered?
            </label>
            <button
              onClick={() => pdfInputRef.current?.click()}
              disabled={isPdfLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ backgroundColor: '#f0f7f6', color: '#2d6a5e', border: '1px solid #c5deda' }}
              title="Upload a PDF lab order to extract test names automatically"
            >
              {isPdfLoading ? '⏳ Reading PDF...' : '📄 Upload PDF order'}
            </button>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); e.target.value = '' }}
            />
          </div>
          {pdfError && (
            <div className="mt-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
              ⚠️ {pdfError}
            </div>
          )}
          <textarea
            value={bulkInput}
            onChange={(e) => {
              setBulkInput(e.target.value)
              if (translatedTests.length > 0) setTranslatedTests([])
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                parseAndMatch()
              }
            }}
            placeholder={parsedTerms.length > 0 ? "Add more tests..." : "Type test names or codes — comma or line separated, or paste from your order..."}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-[#2d6a5e] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 transition-colors"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="hidden sm:block text-xs" style={{ color: '#9ca3af' }}>⌘+Enter to search</p>
            <button
              onClick={parseAndMatch}
              disabled={!bulkInput.trim() || isParsing}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: bulkInput.trim() && !isParsing ? '#2d6a5e' : '#e0ebe9',
                color: bulkInput.trim() && !isParsing ? 'white' : '#577572',
                cursor: bulkInput.trim() && !isParsing ? 'pointer' : 'not-allowed',
              }}
            >
              {isParsing ? 'Searching...' : 'Find Tests →'}
            </button>
          </div>
        </div>

        {/* Parsed chips */}
        {parsedTerms.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-5 mb-4 print:hidden" style={{ borderColor: '#e0ebe9' }}>

            {/* Amber banner — shown when unresolved suggestions exist */}
            {unresolvedCount > 0 && (
              <div
                className="flex items-start gap-2.5 rounded-lg px-4 py-3 mb-4 text-sm"
                style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', color: '#78350f' }}
              >
                <span className="shrink-0">⚠️</span>
                <span>
                  <strong>{unresolvedCount} test{unresolvedCount !== 1 ? 's' : ''} need{unresolvedCount === 1 ? 's' : ''} your input</strong> — tap the yellow pill{unresolvedCount !== 1 ? 's' : ''} below to pick the right version before translating.
                </span>
              </div>
            )}

            <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#577572' }}>
              {parsedTerms.filter(t => t.status === 'matched').length} of {parsedTerms.filter(t => t.status !== 'notfound').length} confirmed
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Ready (green) */}
              <div className="rounded-xl p-3.5 order-1 md:order-none" style={{ backgroundColor: '#fafafa', border: '1px solid #e5e7eb' }}>
                <div className="flex items-center gap-1.5 mb-2.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#15803d' }}>
                  <span>✓ Ready</span>
                  {matchedWithIndex.length > 0 && <span style={{ fontWeight: 400, opacity: 0.7 }}>({matchedWithIndex.length})</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {matchedWithIndex.length === 0 ? (
                    <p className="text-xs italic" style={{ color: '#9ca3af', padding: '4px 0' }}>No tests matched yet</p>
                  ) : (
                    matchedWithIndex.map(({ term, index }) => (
                      <TermChip key={index} term={term} onAccept={(test) => acceptSuggestion(index, test)} onRemove={() => removeTerm(index)} onKeepManual={() => keepManual(index)} onUpdateRaw={(v) => updateRaw(index, v)} />
                    ))
                  )}
                </div>
              </div>

              {/* Needs input (amber) — first on mobile */}
              <div className="rounded-xl p-3.5 order-first md:order-none" style={{ backgroundColor: '#fafafa', border: '1px solid #e5e7eb' }}>
                <div className="flex items-center gap-1.5 mb-2.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#92400e' }}>
                  <span>~ Needs your input</span>
                  {suggestionsWithIndex.length > 0 && <span style={{ fontWeight: 400, opacity: 0.7 }}>({suggestionsWithIndex.length})</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {suggestionsWithIndex.length === 0 ? (
                    <p className="text-xs italic" style={{ color: '#9ca3af', padding: '4px 0' }}>All resolved ✓</p>
                  ) : (
                    suggestionsWithIndex.map(({ term, index }) => (
                      <TermChip key={index} term={term} onAccept={(test) => acceptSuggestion(index, test)} onRemove={() => removeTerm(index)} onKeepManual={() => keepManual(index)} onUpdateRaw={(v) => updateRaw(index, v)} />
                    ))
                  )}
                </div>
              </div>

              {/* Not found (red) */}
              <div className="rounded-xl p-3.5 order-2 md:order-none" style={{ backgroundColor: '#fafafa', border: '1px solid #e5e7eb' }}>
                <div className="flex items-center gap-1.5 mb-2.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#991b1b' }}>
                  <span>✕ Not found</span>
                  {notfoundWithIndex.length > 0 && <span style={{ fontWeight: 400, opacity: 0.7 }}>({notfoundWithIndex.length})</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {notfoundWithIndex.length === 0 ? (
                    <p className="text-xs italic" style={{ color: '#9ca3af', padding: '4px 0' }}>None — all terms recognized</p>
                  ) : (
                    <>
                      {notfoundWithIndex.map(({ term, index }) => (
                        <TermChip key={index} term={term} onAccept={(test) => acceptSuggestion(index, test)} onRemove={() => removeTerm(index)} onKeepManual={() => keepManual(index)} onUpdateRaw={(v) => updateRaw(index, v)} />
                      ))}
                      <p className="mt-1.5" style={{ fontSize: '11px', color: '#991b1b', opacity: 0.7 }}>Try a different name or remove.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lab row */}
        {parsedTerms.length > 0 && confirmedTests.length > 0 && (
          <div className="print:hidden">
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
          </div>
        )}

        {/* Translate button */}
        {confirmedTests.length > 0 && (
          <button
            onClick={translate}
            disabled={!canTranslate || isTranslating}
            className="w-full py-4 rounded-xl text-base font-semibold transition-all mb-8 print:hidden"
            style={{
              backgroundColor: canTranslate ? '#2d6a5e' : '#e0ebe9',
              color: canTranslate ? 'white' : '#577572',
              cursor: canTranslate ? 'pointer' : 'not-allowed',
            }}
          >
            {isTranslating
              ? 'Translating...'
              : unresolvedCount > 0
                ? `Resolve ${unresolvedCount} test${unresolvedCount !== 1 ? 's' : ''} above to continue`
                : !sourceLab || !targetLab
                  ? 'Select both labs to translate'
                  : `Translate ${parsedTerms.filter(t => t.status === 'matched').length} test${parsedTerms.filter(t => t.status === 'matched').length !== 1 ? 's' : ''} →`}
          </button>
        )}

        {/* Results */}
        {translatedTests.length > 0 && (
          <div ref={resultsRef}>
            <ResultsSection
              translatedTests={translatedTests}
              sourceLab={sourceLab}
              targetLab={targetLab}
              manualTerms={parsedTerms.filter(t => t.status === 'manual').map(t => t.raw)}
            />
          </div>
        )}

        {/* Empty state helper */}
        {translatedTests.length === 0 && parsedTerms.length === 0 && (
          <div className="mt-8 print:hidden">
            <div className="rounded-xl border border-[#e0ebe9] bg-white p-6 max-w-2xl mx-auto">
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2d6a5e] mb-2">What you can paste</div>
                  <p className="text-sm text-[#4a6b67] leading-relaxed">
                    A doctor&apos;s test list, lab order codes, test names from a requisition or patient portal.
                  </p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2d6a5e] mb-2">What you&apos;ll get</div>
                  <p className="text-sm text-[#4a6b67] leading-relaxed">
                    Equivalent test names, matching lab-specific codes, and CPT code context when available.
                  </p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2d6a5e] mb-2">Example</div>
                  <p className="text-sm font-mono text-[#1a2e2b] leading-relaxed">
                    CBC, ferritin, 84443, free T4, 005199
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[#e0ebe9]">
                <p className="text-sm text-[#577572]">
                  <strong className="text-[#1a2e2b]">How it works:</strong> Each lab uses its own internal codes for the same test.
                  Enter what you were given — we&apos;ll match it across providers so you can find the equivalent test anywhere.
                </p>
              </div>
            </div>

            <p className="text-center mt-8 mb-6 text-sm text-[#577572]">
              Free research tool. No account required.{' '}
              <Link href="/search" className="underline text-[#2d6a5e]">
                Browse all tests →
              </Link>
            </p>
          </div>
        )}

        {/* Post-parse help text (when chips are showing but no translation yet) */}
        {translatedTests.length === 0 && parsedTerms.length > 0 && (
          <div className="text-center text-sm mt-6 print:hidden" style={{ color: '#577572' }}>
            <p>
              Confirm your tests above, then pick source and target labs to translate.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
