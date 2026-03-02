'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type TestRecord = { id: string; test_name: string }

type ParsedRow = {
  testName: string
  value: string
  unit: string
  date: string
  labName: string
  notes: string
  matchedTest: TestRecord | null
  status: 'ready' | 'no_match' | 'error'
  errorMsg?: string
}

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  return lines.map((line) => {
    const cols: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"'
          i++
        } else if (ch === '"') {
          inQuotes = false
        } else {
          current += ch
        }
      } else {
        if (ch === '"') {
          inQuotes = true
        } else if (ch === ',') {
          cols.push(current.trim())
          current = ''
        } else {
          current += ch
        }
      }
    }
    cols.push(current.trim())
    return cols
  })
}

function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T00:00:00').getTime())
}

function fuzzyMatch(name: string, tests: TestRecord[]): TestRecord | null {
  const lower = name.toLowerCase().trim()
  // Exact match first
  const exact = tests.find((t) => t.test_name.toLowerCase() === lower)
  if (exact) return exact
  // Substring match
  const sub = tests.find((t) => t.test_name.toLowerCase().includes(lower) || lower.includes(t.test_name.toLowerCase()))
  return sub ?? null
}

function downloadTemplate() {
  const csv = `Test Name,Value,Unit,Date Drawn,Lab Name,Notes\nFerritin,45,ng/mL,2025-01-15,Quest Diagnostics,Fasting\nTSH,2.1,mIU/L,2025-01-15,LabCorp,`
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'lablooker_import_template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function ImportModal({ isOpen, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<'instructions' | 'preview' | 'success'>(
    'instructions'
  )
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)
  const [importedCount, setImportedCount] = useState(0)
  const [error, setError] = useState('')

  function handleClose() {
    setStep('instructions')
    setRows([])
    setError('')
    onClose()
  }

  async function handleFile(file: File) {
    setError('')
    const text = await file.text()
    const parsed = parseCSV(text)
    if (parsed.length < 2) {
      setError('CSV must have a header row and at least one data row.')
      return
    }

    // Fetch all tests for matching
    const { data: allTests } = await supabase
      .from('tests')
      .select('id, test_name')
      .limit(5000)
    const tests: TestRecord[] = allTests ?? []

    const dataRows = parsed.slice(1) // skip header
    const result: ParsedRow[] = dataRows.map((cols) => {
      const [testName = '', value = '', unit = '', date = '', labName = '', notes = ''] = cols
      const row: ParsedRow = {
        testName, value, unit, date, labName, notes,
        matchedTest: null,
        status: 'ready',
      }

      if (!testName || !value) {
        row.status = 'error'
        row.errorMsg = 'Missing test name or value'
        return row
      }
      if (isNaN(Number(value))) {
        row.status = 'error'
        row.errorMsg = 'Value is not a number'
        return row
      }
      if (date && !isValidDate(date)) {
        row.status = 'error'
        row.errorMsg = 'Invalid date format'
        return row
      }

      const match = fuzzyMatch(testName, tests)
      if (!match) {
        row.status = 'no_match'
      } else {
        row.matchedTest = match
      }
      return row
    })

    setRows(result)
    setStep('preview')
  }

  async function handleImport() {
    setImporting(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Not signed in.')
      setImporting(false)
      return
    }

    const readyRows = rows.filter((r) => r.status === 'ready' && r.matchedTest)
    const inserts = readyRows.map((r) => ({
      user_id: user.id,
      test_id: r.matchedTest!.id,
      value: Number(r.value),
      unit: r.unit || null,
      drawn_at: r.date || new Date().toISOString().split('T')[0],
      lab_name: r.labName || null,
      notes: r.notes || null,
    }))

    const { error: insertError } = await supabase.from('lab_results').insert(inserts)
    setImporting(false)

    if (insertError) {
      setError(insertError.message)
    } else {
      setImportedCount(inserts.length)
      setStep('success')
      onSuccess()
    }
  }

  if (!isOpen) return null

  const readyCount = rows.filter((r) => r.status === 'ready').length
  const noMatchCount = rows.filter((r) => r.status === 'no_match').length
  const errorCount = rows.filter((r) => r.status === 'error').length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#e0ebe9] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0ebe9] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1a2e2b]">Import from CSV</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#6b8c88] hover:bg-[#faf8f5] hover:text-[#1a2e2b] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Instructions */}
          {step === 'instructions' && (
            <div className="space-y-4">
              <p className="text-sm text-[#4a6b67]">
                Import multiple lab results at once from a CSV file. Your file should have these columns:
              </p>
              <div className="rounded-lg bg-[#faf8f5] border border-[#e0ebe9] p-3">
                <p className="text-xs font-mono text-[#1a2e2b]">
                  Test Name, Value, Unit, Date Drawn, Lab Name, Notes
                </p>
              </div>
              <ul className="text-xs text-[#6b8c88] space-y-1 list-disc pl-4">
                <li>Test Name and Value are required</li>
                <li>Date format: YYYY-MM-DD (defaults to today if empty)</li>
                <li>Test names are matched to our database automatically</li>
              </ul>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="rounded-xl border border-[#2d6a5e] px-4 py-2.5 text-sm font-semibold text-[#2d6a5e] transition-colors hover:bg-[#2d6a5e]/5"
                >
                  Download Template
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-xl bg-[#2d6a5e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
                >
                  Upload CSV
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                  }}
                />
              </div>
              {error && (
                <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
              )}
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="text-[#2d6a5e] font-medium">✅ {readyCount} ready</span>
                {noMatchCount > 0 && (
                  <span className="text-amber-600 font-medium">⚠️ {noMatchCount} no match</span>
                )}
                {errorCount > 0 && (
                  <span className="text-red-600 font-medium">❌ {errorCount} errors</span>
                )}
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#e0ebe9]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#faf8f5] text-[#4a6b67]">
                      <th className="px-3 py-2 text-left font-medium">Test Name</th>
                      <th className="px-3 py-2 text-left font-medium">Matched To</th>
                      <th className="px-3 py-2 text-left font-medium">Value</th>
                      <th className="px-3 py-2 text-left font-medium">Unit</th>
                      <th className="px-3 py-2 text-left font-medium">Date</th>
                      <th className="px-3 py-2 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr
                        key={i}
                        className={
                          r.status === 'no_match'
                            ? 'bg-amber-50'
                            : r.status === 'error'
                              ? 'bg-red-50'
                              : ''
                        }
                      >
                        <td className="px-3 py-2 text-[#1a2e2b]">{r.testName}</td>
                        <td className="px-3 py-2 text-[#4a6b67]">{r.matchedTest?.test_name ?? '—'}</td>
                        <td className="px-3 py-2 text-[#1a2e2b]">{r.value}</td>
                        <td className="px-3 py-2 text-[#6b8c88]">{r.unit || '—'}</td>
                        <td className="px-3 py-2 text-[#6b8c88]">{r.date || 'today'}</td>
                        <td className="px-3 py-2">
                          {r.status === 'ready' && <span className="text-[#2d6a5e]">✅ Ready</span>}
                          {r.status === 'no_match' && <span className="text-amber-600">⚠️ No match</span>}
                          {r.status === 'error' && (
                            <span className="text-red-600" title={r.errorMsg}>❌ {r.errorMsg}</span>
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
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-[#e0ebe9] px-4 py-2.5 text-sm font-semibold text-[#6b8c88] transition-colors hover:bg-[#faf8f5]"
                >
                  Cancel
                </button>
                {readyCount > 0 && (
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={importing}
                    className="rounded-xl bg-[#2d6a5e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549] disabled:opacity-60"
                  >
                    {importing ? 'Importing...' : `Import ${readyCount} result${readyCount === 1 ? '' : 's'}`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
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
                type="button"
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
