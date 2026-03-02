'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

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

type TranslatedTest = {
  test: TestResult
  sourceCodes: LabCode[]
  targetCodes: LabCode[]
}

const POPULAR_LABS = ['Quest', 'LabCorp', 'CPL']

const ALL_LABS = [
  'Quest',
  'LabCorp',
  'CPL',
  'ARUP',
  'Mayo Clinic Labs',
  'DrSays',
  'Cleveland Clinic',
  'Geisinger',
  'Northwell Health',
  'Clinical Labs of Hawaii',
  'American Esoteric Labs',
  'Interpath Laboratory',
]

function LabPicker({
  label,
  stepNumber,
  subtitle,
  selectedLab,
  onSelect,
  excludeLab,
}: {
  label: string
  stepNumber: number
  subtitle: string
  selectedLab: string
  onSelect: (lab: string) => void
  excludeLab?: string
}) {
  const [labQuery, setLabQuery] = useState('')
  const [showLabDropdown, setShowLabDropdown] = useState(false)

  const filteredLabs = ALL_LABS.filter(lab => {
    if (lab === excludeLab) return false
    if (!labQuery) return false
    return lab.toLowerCase().includes(labQuery.toLowerCase())
  })

  const popularFiltered = POPULAR_LABS.filter(lab => lab !== excludeLab)

  const selectLab = (lab: string) => {
    onSelect(lab)
    setLabQuery('')
    setShowLabDropdown(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#e0ebe9' }}>
      <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
        <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>{stepNumber}</span>
        {label}
      </h2>
      <p className="text-sm mb-4 ml-9" style={{ color: '#6b8c88' }}>
        {subtitle}
      </p>

      {/* Selected lab display */}
      {selectedLab && (
        <div className="ml-9 mb-4 flex items-center gap-2">
          <span className="px-4 py-2 rounded-lg font-semibold text-white" style={{ backgroundColor: '#2d6a5e' }}>
            {selectedLab}
          </span>
          <button
            onClick={() => onSelect('')}
            className="text-sm underline"
            style={{ color: '#6b8c88' }}
          >
            change
          </button>
        </div>
      )}

      {!selectedLab && (
        <div className="ml-9">
          {/* Popular quick picks */}
          <div className="flex flex-wrap gap-2 mb-3">
            {popularFiltered.map(lab => (
              <button
                key={lab}
                onClick={() => selectLab(lab)}
                className="px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all hover:border-[#2d6a5e] hover:text-[#2d6a5e]"
                style={{
                  borderColor: '#e0ebe9',
                  backgroundColor: 'white',
                  color: '#1a2e2b',
                }}
              >
                {lab}
              </button>
            ))}
          </div>

          {/* Type-ahead search */}
          <div className="relative">
            <input
              type="text"
              value={labQuery}
              onChange={(e) => {
                setLabQuery(e.target.value)
                setShowLabDropdown(true)
              }}
              onFocus={() => setShowLabDropdown(true)}
              placeholder="Or type your lab name..."
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
              style={{
                borderColor: '#e0ebe9',
                color: '#1a2e2b',
                backgroundColor: 'white',
              }}
            />

            {/* Dropdown */}
            {showLabDropdown && filteredLabs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border shadow-lg max-h-48 overflow-y-auto" style={{ borderColor: '#e0ebe9' }}>
                {filteredLabs.map(lab => (
                  <button
                    key={lab}
                    onClick={() => selectLab(lab)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b last:border-b-0 transition-colors text-sm"
                    style={{ borderColor: '#e0ebe9', color: '#1a2e2b' }}
                  >
                    {lab}
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {showLabDropdown && labQuery.length >= 2 && filteredLabs.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border shadow-lg px-4 py-3 text-sm" style={{ borderColor: '#e0ebe9', color: '#6b8c88' }}>
                No lab found for &ldquo;{labQuery}&rdquo; — <Link href="/search" className="underline" style={{ color: '#2d6a5e' }}>request it</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TranslatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TestResult[]>([])
  const [selectedTests, setSelectedTests] = useState<TestResult[]>([])
  const [sourceLab, setSourceLab] = useState('')
  const [targetLab, setTargetLab] = useState('')
  const [translatedTests, setTranslatedTests] = useState<TranslatedTest[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const supabase = createClient()

  const searchTests = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('id, test_name, cpt_codes, category')
        .ilike('test_name', `%${query}%`)
        .limit(10)

      if (!error && data) {
        const selectedIds = new Set(selectedTests.map(t => t.id))
        setSearchResults(data.filter(t => !selectedIds.has(t.id)))
      }
    } catch (e) {
      console.error('Search error:', e)
    }
    setIsSearching(false)
  }, [selectedTests])

  useEffect(() => {
    const timer = setTimeout(() => searchTests(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchTests])

  const addTest = (test: TestResult) => {
    setSelectedTests(prev => [...prev, test])
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  const removeTest = (testId: string) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId))
    setTranslatedTests(prev => prev.filter(t => t.test.id !== testId))
  }

  const translate = async () => {
    if (selectedTests.length === 0 || !sourceLab || !targetLab) return
    setIsTranslating(true)

    try {
      const testIds = selectedTests.map(t => t.id)

      const { data: allCodes, error } = await supabase
        .from('lab_codes')
        .select('test_id, lab_name, proprietary_code, code_type')
        .in('test_id', testIds)
        .in('lab_name', [sourceLab, targetLab])

      if (error) {
        console.error('Translation error:', error)
        setIsTranslating(false)
        return
      }

      const results: TranslatedTest[] = selectedTests.map(test => {
        const codes = allCodes?.filter(c => c.test_id === test.id) || []
        return {
          test,
          sourceCodes: codes.filter(c => c.lab_name === sourceLab),
          targetCodes: codes.filter(c => c.lab_name === targetLab),
        }
      })

      setTranslatedTests(results)
      setShowResults(true)
    } catch (e) {
      console.error('Translation error:', e)
    }
    setIsTranslating(false)
  }

  const canTranslate = selectedTests.length > 0 && sourceLab && targetLab && sourceLab !== targetLab

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1a2e2b' }}>
            Lab Code Translator
          </h1>
          <p className="text-lg" style={{ color: '#4a6b67' }}>
            Your doctor ordered tests at one lab, but you want to go somewhere else?
            <br />
            Translate the codes so any lab knows exactly what to run.
          </p>
        </div>

        {/* Step 1: Add Tests */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#e0ebe9' }}>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>1</span>
            What tests were ordered?
          </h2>
          <p className="text-sm mb-4 ml-9" style={{ color: '#6b8c88' }}>
            Search and add the tests from your order.
          </p>

          <div className="relative ml-9">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a test (e.g., TSH, CBC, Vitamin D)..."
              className="w-full px-4 py-3 rounded-lg border-2 text-base focus:outline-none focus:ring-2"
              style={{
                borderColor: '#2d6a5e',
                color: '#1a2e2b',
                backgroundColor: 'white',
              }}
            />
            {isSearching && (
              <div className="absolute right-3 top-3.5 text-sm" style={{ color: '#6b8c88' }}>
                Searching...
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border shadow-lg max-h-60 overflow-y-auto" style={{ borderColor: '#e0ebe9' }}>
                {searchResults.map(test => (
                  <button
                    key={test.id}
                    onClick={() => addTest(test)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                    style={{ borderColor: '#e0ebe9' }}
                  >
                    <div className="font-medium" style={{ color: '#1a2e2b' }}>{test.test_name}</div>
                    {test.cpt_codes?.length > 0 && (
                      <div className="text-xs mt-0.5" style={{ color: '#6b8c88' }}>
                        CPT: {test.cpt_codes.join(', ')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedTests.length > 0 && (
            <div className="mt-4 ml-9 space-y-2">
              {selectedTests.map(test => (
                <div
                  key={test.id}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg"
                  style={{ backgroundColor: '#faf8f5', border: '1px solid #e0ebe9' }}
                >
                  <div>
                    <span className="font-medium" style={{ color: '#1a2e2b' }}>{test.test_name}</span>
                    {test.cpt_codes?.length > 0 && (
                      <span className="text-xs ml-2" style={{ color: '#6b8c88' }}>
                        CPT: {test.cpt_codes.join(', ')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeTest(test.id)}
                    className="text-red-400 hover:text-red-600 text-lg font-bold px-2"
                    aria-label={`Remove ${test.test_name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Source lab */}
        <LabPicker
          label="Where was the order written for?"
          stepNumber={2}
          subtitle="Select the lab on your original order."
          selectedLab={sourceLab}
          onSelect={(lab) => {
            setSourceLab(lab)
            if (targetLab === lab) setTargetLab('')
          }}
        />

        {/* Step 3: Target lab */}
        <LabPicker
          label="Where do you want to go instead?"
          stepNumber={3}
          subtitle="Select your preferred lab."
          selectedLab={targetLab}
          onSelect={setTargetLab}
          excludeLab={sourceLab}
        />

        {/* Translate button */}
        <button
          onClick={translate}
          disabled={!canTranslate || isTranslating}
          className="w-full py-4 rounded-xl text-lg font-semibold transition-all mb-8"
          style={{
            backgroundColor: canTranslate ? '#2d6a5e' : '#e0ebe9',
            color: canTranslate ? 'white' : '#6b8c88',
            cursor: canTranslate ? 'pointer' : 'not-allowed',
          }}
        >
          {isTranslating ? 'Translating...' : `Translate ${selectedTests.length} test${selectedTests.length !== 1 ? 's' : ''}`}
        </button>

        {/* Results */}
        {showResults && translatedTests.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#e0ebe9' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#1a2e2b' }}>
                Translation Results
              </h2>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print()
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: '#faf8f5', color: '#2d6a5e', border: '1px solid #e0ebe9' }}
              >
                🖨️ Print
              </button>
            </div>

            <div className="rounded-lg px-4 py-3 mb-6 text-center" style={{ backgroundColor: '#faf8f5', border: '1px solid #e0ebe9' }}>
              <span className="font-semibold" style={{ color: '#1a2e2b' }}>{sourceLab}</span>
              <span className="mx-3" style={{ color: '#6b8c88' }}>→</span>
              <span className="font-semibold" style={{ color: '#2d6a5e' }}>{targetLab}</span>
            </div>

            <div className="space-y-4">
              {translatedTests.map(({ test, sourceCodes, targetCodes }) => (
                <div key={test.id} className="rounded-lg p-4" style={{ backgroundColor: '#faf8f5', border: '1px solid #e0ebe9' }}>
                  <div className="font-semibold mb-2" style={{ color: '#1a2e2b' }}>{test.test_name}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="font-medium mb-1" style={{ color: '#6b8c88' }}>CPT Code</div>
                      <div style={{ color: '#1a2e2b' }}>
                        {test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1" style={{ color: '#6b8c88' }}>{sourceLab} Code</div>
                      <div style={{ color: '#1a2e2b' }}>
                        {sourceCodes.length > 0
                          ? sourceCodes.map(c => c.proprietary_code).join(', ')
                          : <span className="italic" style={{ color: '#c0826a' }}>Not in database yet</span>
                        }
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1" style={{ color: '#2d6a5e' }}>{targetLab} Code</div>
                      <div className="font-semibold" style={{ color: '#2d6a5e' }}>
                        {targetCodes.length > 0
                          ? targetCodes.map(c => c.proprietary_code).join(', ')
                          : <span className="italic font-normal" style={{ color: '#c0826a' }}>Not in database yet</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg p-4 text-xs" style={{ backgroundColor: '#fff8f5', border: '1px solid #e8d5cc', color: '#4a6b67' }}>
              <p className="font-semibold mb-1" style={{ color: '#c0826a' }}>⚠️ REFERENCE DOCUMENT — NOT A PHYSICIAN&apos;S ORDER</p>
              <p>
                This translation is a reference tool only. Always present it alongside your original physician&apos;s order.
                Lab codes are verified against public directories but may change. Confirm with the lab before your visit.
                LabLooker does not collect or store any personal health information.
              </p>
            </div>
          </div>
        )}

        {/* Help text */}
        <div className="text-center text-sm" style={{ color: '#6b8c88' }}>
          <p className="mb-2">
            <strong>How it works:</strong> Lab codes are like zip codes — each lab has its own numbering system for the same test.
          </p>
          <p>
            We translate between them so you can take your order to any lab.
            <Link href="/search" className="ml-1 underline" style={{ color: '#2d6a5e' }}>
              Browse all tests →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
