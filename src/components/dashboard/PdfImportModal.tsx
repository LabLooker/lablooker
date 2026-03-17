'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

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
}

type ApiResponse = {
  results: {
    rawTestName: string
    value: number
    unit: string
    referenceRange: string | null
    matchedTest: { id: string; test_name: string } | null
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

  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload')
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<ParsedResult[]>([])
  const [collectedDate, setCollectedDate] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState(0)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  function handleClose() {
    setStep('upload')
    setFileName('')
    setResults([])
    setCollectedDate(null)
    setError('')
    setImportedCount(0)
    onClose()
  }

  const parseFile = useCallback(async (file: File) => {
    setError('')
    setFileName(file.name)
    setParsing(true)

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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Not signed in.')
      setImporting(false)
      return
    }

    const selectedRows = results.filter(r => r.selected && r.matchedTest)
    const importSessionId = crypto.randomUUID()
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
    }))

    // Try with import_session_id first; fall back without it if column doesn't exist yet
    let insertResult = await supabase.from('lab_results').insert(inserts)
    if (insertResult.error && insertResult.error.message.includes('import_session_id')) {
      const fallbackInserts = inserts.map(({ import_session_id, ...rest }) => rest)
      insertResult = await supabase.from('lab_results').insert(fallbackInserts)
    }
    const insertError = insertResult.error
    setImporting(false)

    if (insertError) {
      setError(insertError.message)
    } else {
      setImportedCount(inserts.length)
      setStep('done')
      onSuccess()
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

  const selectedCount = results.filter(r => r.selected && r.matchedTest).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#e0ebe9] bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0ebe9] px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-[#1a2e2b]">Import from PDF</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#577572] hover:bg-[#faf8f5] hover:text-[#1a2e2b] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Step 1: Upload */}
          {step === 'upload' && (
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
                <p className="mt-3 text-xs text-[#577572]">
                  Supports Quest, LabCorp, CPL, and most standard lab formats
                </p>
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
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <p className="text-sm text-[#4a6b67]">
                Found <span className="font-semibold text-[#1a2e2b]">{results.length} results</span>
                {collectedDate && <> from <span className="font-semibold text-[#1a2e2b]">{collectedDate}</span></>}
              </p>

              <div className="overflow-x-auto rounded-lg border border-[#e0ebe9]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#faf8f5] text-[#4a6b67]">
                      <th className="px-2 py-2 text-left font-medium w-8"></th>
                      <th className="px-2 py-2 text-left font-medium">Test Name</th>
                      <th className="px-2 py-2 text-left font-medium">Value</th>
                      <th className="px-2 py-2 text-left font-medium">Unit</th>
                      <th className="px-2 py-2 text-left font-medium">Ref Range</th>
                      <th className="px-2 py-2 text-left font-medium">Matched Test</th>
                      <th className="px-2 py-2 text-center font-medium w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr
                        key={i}
                        className={`border-t border-[#e0ebe9] ${!r.matchedTest ? 'bg-amber-50/50' : r.selected ? '' : 'opacity-50'}`}
                      >
                        <td className="px-2 py-2">
                          {r.matchedTest && (
                            <input
                              type="checkbox"
                              checked={r.selected}
                              onChange={() => toggleRow(i)}
                              className="h-3.5 w-3.5 rounded border-[#e0ebe9] text-[#2d6a5e] focus:ring-[#2d6a5e]"
                            />
                          )}
                        </td>
                        <td className="px-2 py-2 text-[#1a2e2b]">{r.rawTestName}</td>
                        <td className="px-2 py-2 text-[#1a2e2b] font-medium">{r.value}</td>
                        <td className="px-2 py-2 text-[#577572]">{r.unit || '—'}</td>
                        <td className="px-2 py-2 text-[#577572]">{r.referenceRange || '—'}</td>
                        <td className="px-2 py-2 text-[#4a6b67]">
                          {r.matchedTest ? r.matchedTest.test_name : (
                            <span className="text-amber-600">No match — will skip</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {r.matchedTest ? (
                            <span className="text-[#2d6a5e]">✓</span>
                          ) : (
                            <span className="text-amber-500">⚠</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setStep('upload'); setResults([]); setFileName(''); setError('') }}
                  className="rounded-xl border border-[#e0ebe9] px-4 py-2.5 text-sm font-semibold text-[#577572] transition-colors hover:bg-[#faf8f5]"
                >
                  Back
                </button>
                {selectedCount > 0 && (
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="rounded-xl bg-[#2d6a5e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549] disabled:opacity-60"
                  >
                    {importing ? 'Importing...' : `Import ${selectedCount} result${selectedCount === 1 ? '' : 's'}`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
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
                onClick={handleClose}
                className="rounded-xl bg-[#2d6a5e] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
              >
                View Dashboard
              </button>
            </div>
          )}
        </div>
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
