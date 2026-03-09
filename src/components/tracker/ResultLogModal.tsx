'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

type Test = {
  id: string
  test_name: string
  unit?: string | null
}

const COMMON_UNITS = [
  'ng/mL', 'pg/mL', 'µIU/mL', 'mIU/L', 'mIU/mL', 'ng/dL', 'µg/dL', 'mg/dL',
  'g/dL', 'g/L', 'mmol/L', 'µmol/L', 'nmol/L', 'pmol/L', 'mEq/L', 'IU/L',
  'IU/mL', 'U/mL', '%', 'ratio', 'cells/µL', 'K/µL', 'M/µL', 'fL', 'pg',
  'µg/L', 'mg/L',
]

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  prefillTestId?: string
  prefillTestName?: string
  prefillUnit?: string | null
}

const LAB_SUGGESTIONS = [
  'Quest Diagnostics',
  'LabCorp',
  'CPL',
  'ARUP',
  'Mayo Clinic Labs',
]

export default function ResultLogModal({
  isOpen,
  onClose,
  onSuccess,
  prefillTestId,
  prefillTestName,
  prefillUnit,
}: Props) {
  const supabase = createClient()

  const [testId, setTestId] = useState(prefillTestId ?? '')
  const [testName, setTestName] = useState(prefillTestName ?? '')
  const [testSearch, setTestSearch] = useState(prefillTestName ?? '')
  const [testResults, setTestResults] = useState<Test[]>([])
  const [showTestDropdown, setShowTestDropdown] = useState(false)

  const [value, setValue] = useState('')
  const [unit, setUnit] = useState(prefillUnit ?? '')
  const [drawnAt, setDrawnAt] = useState(() => new Date().toISOString().split('T')[0])
  const [labName, setLabName] = useState('')
  const [showUnitDropdown, setShowUnitDropdown] = useState(false)
  const [showLabSuggestions, setShowLabSuggestions] = useState(false)
  const [refRangeLow, setRefRangeLow] = useState('')
  const [refRangeHigh, setRefRangeHigh] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchRef = useRef<HTMLDivElement>(null)

  // Reset when modal opens with new prefill
  useEffect(() => {
    if (isOpen) {
      setTestId(prefillTestId ?? '')
      setTestName(prefillTestName ?? '')
      setTestSearch(prefillTestName ?? '')
      setUnit(prefillUnit ?? '')
      setValue('')
      setDrawnAt(new Date().toISOString().split('T')[0])
      setLabName('')
      setRefRangeLow('')
      setRefRangeHigh('')
      setNotes('')
      setError('')
    }
  }, [isOpen, prefillTestId, prefillTestName, prefillUnit])

  // Test search typeahead
  useEffect(() => {
    if (prefillTestId) return // no search if prefilled
    if (testSearch.length < 2) {
      setTestResults([])
      return
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('tests')
        .select('id, test_name, unit')
        .ilike('test_name', `%${testSearch}%`)
        .limit(8)
      setTestResults(data ?? [])
      setShowTestDropdown(true)
    }, 250)
    return () => clearTimeout(timer)
  }, [testSearch, prefillTestId, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!testId) { setError('Please select a test.'); return }
    if (!value || isNaN(Number(value))) { setError('Please enter a valid numeric value.'); return }
    if (!drawnAt) { setError('Please enter the draw date.'); return }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not signed in.'); setLoading(false); return }

    const { error: insertError } = await supabase.from('lab_results').insert({
      user_id: user.id,
      test_id: testId,
      value: Number(value),
      unit: unit || null,
      drawn_at: drawnAt,
      lab_name: labName || null,
      ref_range_low: refRangeLow ? Number(refRangeLow) : null,
      ref_range_high: refRangeHigh ? Number(refRangeHigh) : null,
      notes: notes || null,
    })

    setLoading(false)
    if (insertError) {
      setError(insertError.message)
    } else {
      onSuccess()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-[#e0ebe9] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0ebe9] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1a2e2b]">Log Lab Result</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#577572] hover:bg-[#faf8f5] hover:text-[#1a2e2b] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Test search (if not prefilled) */}
          {!prefillTestId && (
            <div ref={searchRef} className="relative">
              <label className="mb-1 block text-xs font-medium text-[#4a6b67]">Test *</label>
              <input
                type="text"
                value={testSearch}
                onChange={(e) => {
                  setTestSearch(e.target.value)
                  setTestId('')
                  setTestName('')
                }}
                placeholder="Search for a test..."
                className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
                autoComplete="off"
              />
              {showTestDropdown && testResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#e0ebe9] bg-white shadow-lg max-h-48 overflow-y-auto">
                  {testResults.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTestId(t.id)
                        setTestName(t.test_name)
                        setTestSearch(t.test_name)
                        setShowTestDropdown(false)
                        if (t.unit) setUnit(t.unit)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#1a2e2b] hover:bg-[#faf8f5] transition-colors"
                    >
                      {t.test_name}
                    </button>
                  ))}
                </div>
              )}
              {testId && (
                <p className="mt-1 text-xs text-[#2d6a5e]">✓ {testName}</p>
              )}
            </div>
          )}

          {/* Value + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#4a6b67]">Value *</label>
              <input
                type="number"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 29"
                className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
                required
              />
            </div>
            <div className="relative">
              <label className="mb-1 block text-xs font-medium text-[#4a6b67]">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value)
                  setShowUnitDropdown(true)
                }}
                onFocus={() => setShowUnitDropdown(true)}
                onBlur={() => setTimeout(() => setShowUnitDropdown(false), 150)}
                placeholder="e.g. ng/mL"
                className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
                autoComplete="off"
              />
              {showUnitDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#e0ebe9] bg-white shadow-lg max-h-40 overflow-y-auto">
                  {COMMON_UNITS.filter((u) =>
                    u.toLowerCase().includes(unit.toLowerCase())
                  ).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onMouseDown={() => {
                        setUnit(u)
                        setShowUnitDropdown(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#1a2e2b] hover:bg-[#faf8f5] transition-colors"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date drawn */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#4a6b67]">Date Drawn *</label>
            <input
              type="date"
              value={drawnAt}
              onChange={(e) => setDrawnAt(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] focus:border-[#2d6a5e] focus:outline-none"
              required
            />
          </div>

          {/* Lab name */}
          <div className="relative">
            <label className="mb-1 block text-xs font-medium text-[#4a6b67]">Lab Name</label>
            <input
              type="text"
              value={labName}
              onChange={(e) => {
                setLabName(e.target.value)
                setShowLabSuggestions(true)
              }}
              onFocus={() => setShowLabSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLabSuggestions(false), 150)}
              placeholder="Quest Diagnostics, LabCorp, or type your own..."
              className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
            />
            {showLabSuggestions && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#e0ebe9] bg-white shadow-lg">
                {LAB_SUGGESTIONS.filter((l) =>
                  l.toLowerCase().includes(labName.toLowerCase())
                ).map((lab) => (
                  <button
                    key={lab}
                    type="button"
                    onMouseDown={() => {
                      setLabName(lab)
                      setShowLabSuggestions(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#1a2e2b] hover:bg-[#faf8f5] transition-colors"
                  >
                    {lab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ref range */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#4a6b67]">
              Reference Range <span className="text-[#577572] font-normal">(optional, from your lab slip)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="any"
                value={refRangeLow}
                onChange={(e) => setRefRangeLow(e.target.value)}
                placeholder="Low"
                className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
              />
              <input
                type="number"
                step="any"
                value={refRangeHigh}
                onChange={(e) => setRefRangeHigh(e.target.value)}
                placeholder="High"
                className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#4a6b67]">
              Notes <span className="text-[#577572] font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., fasting, 3 hours post-medication"
              rows={3}
              className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none resize-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2d6a5e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549] disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Result'}
          </button>
        </form>
      </div>
    </div>
  )
}
