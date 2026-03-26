'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { checkPlausibility, type PlausibilityFlag } from '@/lib/plausibility'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type ParsedResult = {
  rawTestName: string
  value: number
  unit: string
  referenceRange: string | null
  matchedTest: { id: string; test_name: string } | null
  selected: boolean
  manuallyAssigned?: boolean
  qualifier?: string
}

type ApiResponse = {
  results: {
    rawTestName: string
    value: number
    unit: string
    referenceRange: string | null
    matchedTest: { id: string; test_name: string } | null
    qualifier?: string
  }[]
  collectedDate: string | null
  totalExtracted: number
  matchedCount: number
  error?: string
}

export default function PdfImportModal({ isOpen, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload')
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<ParsedResult[]>([])
  const [collectedDate, setCollectedDate] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState(0)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [physicianName, setPhysicianName] = useState('')
  const [assignSearch, setAssignSearch] = useState<Record<number, string>>({})
  const [assignResults, setAssignResults] = useState<Record<number, { id: string; test_name: string }[]>>({})
  const [assignOpen, setAssignOpen] = useState<number | null>(null)
  const [verifiedRows, setVerifiedRows] = useState<Set<number>>(new Set())
  const [reviewed, setReviewed] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  function handleClose() {
    setStep('upload')
    setFileName('')
    setResults([])
    setCollectedDate(null)
    setError('')
    setImportedCount(0)
    setPhysicianName('')
    setAssignSearch({})
    setAssignResults({})
    setAssignOpen(null)
    setVerifiedRows(new Set())
    setReviewed(false)
    if (pdfUrl) { URL.revokeObjectURL(pdfUrl); setPdfUrl(null) }
    onClose()
  }

  // useMemo must be called unconditionally — before any early returns
  const plausibilityFlags = useMemo(() => {
    if (results.length === 0) return []
    return checkPlausibility(
      results.filter(r => r.matchedTest).map(r => ({
        testName: r.matchedTest!.test_name,
        value: r.value,
        unit: r.unit,
      }))
    )
  }, [results])

  const matchedResults = useMemo(() => results.filter(r => r.matchedTest), [results])
  const selectedCount = useMemo(() => results.filter(r => r.selected && r.matchedTest).length, [results])
  const allSelected = matchedResults.length > 0 && matchedResults.every(r => r.selected)
  const someSelected = matchedResults.some(r => r.selected) && !allSelected

  // Set indeterminate state on header checkbox
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  function toggleAll() {
    const shouldSelectAll = !allSelected
    setResults(prev => prev.map(r => r.matchedTest ? { ...r, selected: shouldSelectAll } : r))
  }

  async function searchTests(query: string, rowIdx: number) {
    setAssignSearch(prev => ({ ...prev, [rowIdx]: query }))
    if (query.length < 2) { setAssignResults(prev => ({ ...prev, [rowIdx]: [] })); return }
    const { data } = await supabase
      .from('tests')
      .select('id, test_name')
      .ilike('test_name', `%${query}%`)
      .limit(10)
    setAssignResults(prev => ({ ...prev, [rowIdx]: data ?? [] }))
  }

  function assignTest(rowIdx: number, test: { id: string; test_name: string }) {
    setResults(prev => prev.map((r, i) => i === rowIdx ? { ...r, matchedTest: test, selected: true, manuallyAssigned: true } : r))
    setAssignOpen(null)
    setAssignSearch(prev => ({ ...prev, [rowIdx]: '' }))
    setAssignResults(prev => ({ ...prev, [rowIdx]: [] }))
  }

  const parseFile = useCallback(async (file: File) => {
    setError('')
    setFileName(file.name)
    setParsing(true)
    setPdfUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file) })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData })
      const data: ApiResponse = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to parse PDF')
        setParsing(false)
        return
      }

      if (data.results.length === 0) {
        setError('No lab results found in this PDF. It may use a format we don\'t support yet.')
        setParsing(false)
        return
      }

      setResults(data.results.map(r => ({ ...r, selected: r.matchedTest !== null })))
      setCollectedDate(data.collectedDate)
      setStep('preview')
    } catch {
      setError('Failed to upload file. Please try again.')
    } finally {
      setParsing(false)
    }
  }, [])

  async function handleImport() {
    setImporting(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Not signed in.')
        setImporting(false)
        return
      }

      const selectedRows = results.filter(r => r.selected && r.matchedTest)
      const importSessionId = crypto.randomUUID()
      const trimmedPhysician = physicianName.trim() || null
      const inserts = selectedRows.map(r => ({
        user_id: user.id,
        test_id: r.matchedTest!.id,
        value: r.value,
        unit: r.unit || null,
        drawn_at: collectedDate || new Date().toISOString().split('T')[0],
        lab_name: null,
        notes: r.referenceRange ? `Ref: ${r.referenceRange} | PDF: ${r.rawTestName}` : `PDF: ${r.rawTestName}`,
        ref_range_low: r.referenceRange ? parseRefLow(r.referenceRange) : null,
        ref_range_high: r.referenceRange ? parseRefHigh(r.referenceRange) : null,
        import_session_id: importSessionId,
        physician_name: trimmedPhysician,
        value_qualifier: r.qualifier || null,
      }))

      let insertResult = await supabase.from('lab_results').insert(inserts)
      if (insertResult.error && (insertResult.error.message.includes('import_session_id') || insertResult.error.message.includes('physician_name') || insertResult.error.message.includes('value_qualifier'))) {
        const fallbackInserts = inserts.map(({ import_session_id, physician_name, value_qualifier, ...rest }) => rest)
        insertResult = await supabase.from('lab_results').insert(fallbackInserts)
      }
      const insertError = insertResult.error
      setImporting(false)

      if (insertError) {
        setError(insertError.message)
      } else {
        setImportedCount(inserts.length)
        setStep('done')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error during import. Please try again.')
      setImporting(false)
    }
  }

  function toggleRow(idx: number) {
    setResults(prev => prev.map((r, i) => i === idx ? { ...r, selected: !r.selected } : r))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') parseFile(file)
    else setError('Please drop a PDF file.')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 py-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-[#e0ebe9] bg-white shadow-xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0ebe9] px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">Import from PDF</h2>
            {step === 'preview' && fileName && (
              <p className="text-xs text-[#577572] mt-0.5 truncate max-w-sm">{fileName}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#577572] hover:bg-[#faf8f5] hover:text-[#1a2e2b] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="p-6 overflow-y-auto">
            <div className="space-y-4">
              <div
                ref={dropRef}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
                  dragOver ? 'border-[#2d6a5e] bg-[#2d6a5e]/5' : 'border-[#e0ebe9] bg-[#faf8f5] hover:border-[#2d6a5e]/50'
                }`}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2d6a5e]/10">
                  <svg className="h-6 w-6 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                {fileName ? (
                  <p className="text-sm font-medium text-[#1a2e2b]">{fileName}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-[#1a2e2b]">Upload your lab results PDF</p>
                    <p className="mt-1 text-xs text-[#577572]">Drag & drop or click to browse</p>
                  </>
                )}
                <p className="mt-3 text-xs text-[#577572]">Supports Quest, LabCorp, CPL, and most standard lab formats</p>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) parseFile(f)
                }}
              />

              {parsing && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
                  <span className="text-sm text-[#577572]">Parsing PDF...</span>
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Preview — split pane */}
        {step === 'preview' && (
          <div className="flex flex-1 min-h-0">

            {/* Left pane — PDF reference (desktop only) */}
            <div className="hidden md:flex md:w-[38%] flex-col border-r border-[#e0ebe9] shrink-0">
              <div className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#577572] bg-[#f0f7f6] border-b border-[#e0ebe9]">
                Your PDF
              </div>
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="flex-1 w-full border-0"
                  title="Your PDF"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d6a5e]/10">
                    <svg className="h-7 w-7 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <p className="text-xs text-[#577572]">PDF preview loading...</p>
                </div>
              )}
            </div>

            {/* Right pane — parsed results */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

              {/* Pane header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#f0f7f6] border-b border-[#e0ebe9] shrink-0">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#577572]">Parsed Results</span>
                <span className="text-xs font-semibold text-[#2d6a5e]">{selectedCount} SELECTED</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Physician name */}
                <div>
                  <label htmlFor="physician-name" className="block text-xs font-medium text-[#4a6b67] mb-1">
                    Prescribing physician (optional)
                  </label>
                  <input
                    id="physician-name"
                    type="text"
                    value={physicianName}
                    onChange={(e) => setPhysicianName(e.target.value)}
                    placeholder="e.g. Dr. Smith"
                    className="w-full rounded-lg border border-[#e0ebe9] px-3 py-2 text-sm placeholder-[#577572]/50 focus:border-[#2d6a5e] focus:outline-none"
                  />
                </div>

                {/* Plausibility warning */}
                {plausibilityFlags.length > 0 && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 space-y-1.5">
                    <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                      <span>⚠️</span> {plausibilityFlags.length} value{plausibilityFlags.length > 1 ? 's look' : ' looks'} unusual — verify against your PDF before saving
                    </p>
                    <ul className="text-xs text-amber-700 space-y-0.5 pl-5 list-disc">
                      {plausibilityFlags.map((f, i) => (
                        <li key={i}>{f.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Results table */}
                <div className="overflow-x-auto rounded-lg border border-[#e0ebe9]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#faf8f5] text-[#4a6b67]">
                        <th className="px-3 py-2 text-left font-medium w-8">
                          <input
                            ref={headerCheckboxRef}
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            className="h-3.5 w-3.5 rounded border-[#e0ebe9] text-[#2d6a5e] focus:ring-[#2d6a5e] cursor-pointer"
                          />
                        </th>
                        <th className="px-2 py-2 text-left font-medium">Test Name</th>
                        <th className="px-2 py-2 text-left font-medium">Value</th>
                        <th className="px-2 py-2 text-left font-medium hidden sm:table-cell">Unit</th>
                        <th className="px-2 py-2 text-left font-medium hidden sm:table-cell">Ref Range</th>
                        <th className="px-2 py-2 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => {
                        const isFlagged = plausibilityFlags.some(f => f.testName === r.matchedTest?.test_name)
                        const isVerified = verifiedRows.has(i)
                        return (
                          <tr
                            key={i}
                            onClick={() => r.matchedTest && toggleRow(i)}
                            className={`border-t border-[#e0ebe9] ${!r.matchedTest ? 'bg-amber-50/40' : r.selected ? '' : 'opacity-50'} ${r.matchedTest ? 'cursor-pointer hover:bg-[#f0f7f6]' : ''}`}
                          >
                            {/* Checkbox */}
                            <td className="px-3 py-2">
                              {r.matchedTest && (
                                <input
                                  type="checkbox"
                                  checked={r.selected}
                                  onChange={() => toggleRow(i)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-3.5 w-3.5 rounded border-[#e0ebe9] text-[#2d6a5e] focus:ring-[#2d6a5e]"
                                />
                              )}
                            </td>
                            {/* Test name */}
                            <td className="px-2 py-2 text-[#1a2e2b]">
                              {r.rawTestName}
                              {r.manuallyAssigned && (
                                <span className="ml-1 text-[10px] text-[#577572] italic">manually assigned</span>
                              )}
                            </td>
                            {/* Value */}
                            <td className="px-2 py-2 text-[#1a2e2b] font-medium">
                              {r.qualifier ? `${r.qualifier}${r.value}` : r.value}
                            </td>
                            {/* Unit */}
                            <td className="px-2 py-2 text-[#577572] hidden sm:table-cell">{r.unit || '—'}</td>
                            {/* Ref range */}
                            <td className="px-2 py-2 text-[#577572] hidden sm:table-cell">{r.referenceRange || '—'}</td>
                            {/* Status */}
                            <td className="px-2 py-2">
                              {!r.matchedTest ? (
                                <div className="relative">
                                  <div className="flex items-center gap-1">
                                    <span className="text-amber-600 text-[10px]">No match</span>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); setAssignOpen(assignOpen === i ? null : i) }}
                                      className="text-[#2d6a5e] text-[10px] underline hover:text-[#245549]"
                                    >
                                      Assign
                                    </button>
                                  </div>
                                  {assignOpen === i && (
                                    <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-lg border border-[#e0ebe9] bg-white shadow-lg p-1.5">
                                      <input
                                        type="text"
                                        value={assignSearch[i] ?? ''}
                                        onChange={(e) => searchTests(e.target.value, i)}
                                        placeholder="Search tests..."
                                        autoFocus
                                        className="w-full rounded border border-[#e0ebe9] px-2 py-1 text-xs placeholder-[#577572]/50 focus:border-[#2d6a5e] focus:outline-none"
                                      />
                                      {(assignResults[i] ?? []).length > 0 && (
                                        <ul className="mt-1 max-h-32 overflow-y-auto">
                                          {(assignResults[i] ?? []).map(t => (
                                            <li key={t.id}>
                                              <button
                                                type="button"
                                                onClick={() => assignTest(i, t)}
                                                className="w-full text-left px-2 py-1 text-xs text-[#1a2e2b] hover:bg-[#f0f7f6] rounded transition-colors"
                                              >
                                                {t.test_name}
                                              </button>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : isFlagged && !isVerified ? (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setVerifiedRows(prev => new Set([...prev, i])) }}
                                  className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 hover:bg-amber-100 transition-colors whitespace-nowrap"
                                >
                                  ⚠ verify value
                                </button>
                              ) : isFlagged && isVerified ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                  Verified ✓
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                                  matched
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Verification reminder */}
                <div className="rounded-lg bg-[#f0f7f6] border border-[#e0ebe9] px-3 py-2.5 flex gap-2">
                  <span className="text-sm shrink-0">💡</span>
                  <p className="text-xs text-[#4a6b67] leading-relaxed">
                    <span className="font-semibold text-[#1a2e2b]">Always verify against your original lab report.</span>{' '}
                    PDF parsing isn't perfect — confirm test names and values match before saving.
                  </p>
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
                )}

                {/* Reviewed checkbox */}
                <label className="flex items-center gap-2.5 text-xs text-[#4a6b67] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={reviewed}
                    onChange={e => setReviewed(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#e0ebe9] text-[#2d6a5e] focus:ring-[#2d6a5e]"
                  />
                  I have reviewed these results and confirmed they match my lab report
                </label>

                {/* Actions */}
                <div className="flex gap-3 pb-1">
                  <button
                    onClick={() => { setStep('upload'); setResults([]); setFileName(''); setError(''); setVerifiedRows(new Set()); setReviewed(false) }}
                    className="rounded-xl border border-[#e0ebe9] px-4 py-2.5 text-sm font-semibold text-[#577572] transition-colors hover:bg-[#faf8f5]"
                  >
                    Back
                  </button>
                  {selectedCount > 0 && (
                    <button
                      onClick={handleImport}
                      disabled={importing || !reviewed}
                      className="rounded-xl bg-[#2d6a5e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {importing ? 'Importing...' : `Save ${selectedCount} result${selectedCount === 1 ? '' : 's'} to Tracker`}
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 'done' && (
          <div className="p-6 overflow-y-auto">
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d6a5e]/10">
                <svg className="h-7 w-7 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-[#1a2e2b]">
                Successfully imported {importedCount} result{importedCount === 1 ? '' : 's'}
              </p>
              <button
                onClick={() => { onSuccess(); handleClose() }}
                className="rounded-xl bg-[#2d6a5e] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function parseRefLow(ref: string): number | null {
  const m = ref.match(/^([\d\.]+)\s*[-–]/)
  if (m) return parseFloat(m[1])
  return null
}

function parseRefHigh(ref: string): number | null {
  const m = ref.match(/[-–]\s*([\d\.]+)$/)
  if (m) return parseFloat(m[1])
  const lt = ref.match(/^<\s*([\d\.]+)/)
  if (lt) return parseFloat(lt[1])
  return null
}
