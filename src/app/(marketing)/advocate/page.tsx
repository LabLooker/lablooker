'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { TEST_BUNDLES, type TestBundle } from '@/config/test-bundles'


const HINT_CHIPS = ['TSH', 'Ferritin', 'Vitamin D', 'HbA1c', 'Testosterone', 'CBC']

type TestResult = {
  id: string
  test_name: string
  cpt_codes: string[]
  category: string | null
  description: string | null
}

type ICD10Code = {
  code: string
  description: string
}

type LabCode = {
  lab_name: string
  proprietary_code: string
}

type SelectedTest = TestResult & {
  icd10Codes: ICD10Code[]
  labCodes: LabCode[]
}

type PanelResult = {
  type: 'panel'
  bundle: TestBundle
  tests: TestResult[]
}

type SearchResultItem =
  | { type: 'test'; test: TestResult }
  | PanelResult

export default function AdvocatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const PLACEHOLDERS = ['TSH', 'Ferritin', 'Vitamin D', 'HbA1c', 'Free T3', 'Cortisol', 'CBC', 'Magnesium']
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  useEffect(() => {
    if (searchQuery) return
    const timer = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 2000)
    return () => clearInterval(timer)
  }, [searchQuery])
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([])
  const [reason, setReason] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [includeCPT, setIncludeCPT] = useState(false)
  const [includeLabCodes, setIncludeLabCodes] = useState(false)
  const [selectedLab, setSelectedLab] = useState('')
  const [availableLabs, setAvailableLabs] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set())
  const [initialized, setInitialized] = useState(false)

  const searchContainerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ll_request_tests')
      if (saved) setSelectedTests(JSON.parse(saved))
    } catch { /* ignore */ }
    setInitialized(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (!initialized) return
    try {
      localStorage.setItem('ll_request_tests', JSON.stringify(selectedTests))
    } catch { /* ignore */ }
  }, [selectedTests, initialized])

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setIsSignedIn(true)
      const { data } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single()
      setIsPremium(data?.is_premium ?? false)
    }
    checkAuth()
  }, [supabase])

  // Load available labs
  useEffect(() => {
    async function loadLabs() {
      const { data } = await supabase
        .from('lab_codes')
        .select('lab_name')
      if (data) {
        const unique = [...new Set(data.map((r: { lab_name: string }) => r.lab_name))].sort()
        setAvailableLabs(unique)
      }
    }
    loadLabs()
  }, [supabase])

  // Click-outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node
      // Only close if tap/click is clearly outside the search container
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        // Small delay on touch to let the tap event register first
        if (e.type === 'touchstart') {
          setTimeout(() => setSearchFocused(false), 100)
        } else {
          setSearchFocused(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  const isTestSelected = useCallback((testId: string) => {
    return selectedTests.some(t => t.id === testId)
  }, [selectedTests])

  const fetchCodesBackground = useCallback(async (testId: string) => {
    let icd10Codes: ICD10Code[] = []
    try {
      const { data: junctionData } = await supabase
        .from('test_icd10_codes')
        .select('icd10_code_id')
        .eq('test_id', testId)
      if (junctionData && junctionData.length > 0) {
        const codeIds = junctionData.map((j: { icd10_code_id: string }) => j.icd10_code_id)
        const { data: codesData } = await supabase
          .from('icd10_codes')
          .select('code, description')
          .in('id', codeIds)
        if (codesData) icd10Codes = codesData
      }
    } catch { /* ignore */ }

    let labCodes: LabCode[] = []
    try {
      const { data: lcData } = await supabase
        .from('lab_codes')
        .select('lab_name, proprietary_code')
        .eq('test_id', testId)
      if (lcData) labCodes = lcData
    } catch { /* ignore */ }

    setSelectedTests(prev => prev.map(t =>
      t.id === testId ? { ...t, icd10Codes, labCodes } : t
    ))
  }, [supabase])

  const addTest = useCallback((test: TestResult) => {
    setSelectedTests(prev => {
      if (prev.some(t => t.id === test.id)) return prev
      return [...prev, { ...test, icd10Codes: [], labCodes: [] }]
    })
    fetchCodesBackground(test.id)
  }, [fetchCodesBackground])

  const removeTest = useCallback((testId: string) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId))
  }, [])

  const toggleTest = useCallback((test: TestResult) => {
    if (isTestSelected(test.id)) {
      removeTest(test.id)
    } else {
      addTest(test)
    }
  }, [isTestSelected, removeTest, addTest])

  // Search logic
  const searchTests = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const q = query.trim().toLowerCase()
      const results: SearchResultItem[] = []

      // 1. Check panel/bundle matches
      for (const bundle of TEST_BUNDLES) {
        const nameMatch = bundle.name.toLowerCase().includes(q) || bundle.slug.includes(q)
        if (nameMatch) {
          const { data: tests } = await supabase
            .from('tests')
            .select('id, test_name, cpt_codes, category, description')
            .in('test_name', bundle.tests)
            .order('test_name')
          if (tests && tests.length > 0) {
            results.push({ type: 'panel', bundle, tests })
          }
        }
      }

      // 2. Individual test search
      const isCptSearch = /^\d{4,5}$/.test(q)
      const words = q.split(/\s+/).filter(Boolean)
      const firstWord = words[0]

      const { data } = await supabase
        .from('tests')
        .select('id, test_name, cpt_codes, category, description')
        .ilike('test_name', `%${firstWord}%`)
        .order('test_name')
        .limit(50)

      if (data) {
        let matched = data.filter(t =>
          words.every(w => t.test_name.toLowerCase().includes(w))
        )

        // CPT code search
        if (isCptSearch || matched.length < 3) {
          const { data: cptData } = await supabase
            .from('tests')
            .select('id, test_name, cpt_codes, category, description')
            .order('test_name')
            .limit(200)
          if (cptData) {
            const cptMatches = cptData.filter(t =>
              !matched.some(m => m.id === t.id) &&
              t.cpt_codes?.some((c: string) => c.includes(q))
            )
            matched = [...matched, ...cptMatches]
          }
        }

        // Sort: starts-with first
        matched.sort((a, b) => {
          const aStarts = a.test_name.toLowerCase().startsWith(q) ? 0 : 1
          const bStarts = b.test_name.toLowerCase().startsWith(q) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.test_name.localeCompare(b.test_name)
        })

        for (const test of matched.slice(0, 10)) {
          results.push({ type: 'test', test })
        }
      }

      setSearchResults(results)
    } catch (e) {
      console.error('Search error:', e)
    }
    setIsSearching(false)
  }, [supabase])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => searchTests(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchTests])

  // Copy list to clipboard
  const getPlainText = useCallback(() => {
    const lines: string[] = []
    selectedTests.forEach(test => {
      const cpt = includeCPT && test.cpt_codes?.length > 0 ? ` (CPT ${test.cpt_codes.join(', ')})` : ''
      const labCode = includeLabCodes && selectedLab
        ? test.labCodes?.find((lc: LabCode) => lc.lab_name === selectedLab)
        : null
      const lc = labCode ? ` [${selectedLab}: ${labCode.proprietary_code}]` : ''
      lines.push(`${test.test_name}${cpt}${lc}`)
    })
    if (reason.trim()) {
      lines.push('')
      lines.push(`Reason: ${reason.trim()}`)
    }
    return lines.join('\n')
  }, [selectedTests, includeCPT, includeLabCodes, selectedLab, reason])

  const copyToClipboard = useCallback(async () => {
    const text = getPlainText()
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [getPlainText])

  const clearAll = useCallback(() => {
    setSelectedTests([])
    try { localStorage.removeItem('ll_request_tests') } catch { /* ignore */ }
  }, [])

  const hasTests = selectedTests.length > 0

  return (
    <>
      <style jsx global>{`
        @media print {
          header, nav, footer, .no-print { display: none !important; }
          body { font-size: 11pt; background: white !important; }
          .print-only { display: block !important; }
        }
      `}</style>

      <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
        <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

          {/* Page Header */}
          <div className="mb-8 no-print">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a2e2b]">
              Build Your Lab Request
            </h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: '#577572' }}>
              Add the tests you want to request. Copy the list to paste into your patient portal, or print it to bring to your appointment.
            </p>
            <div className="mt-3 rounded-lg border border-[#e0ebe9] bg-[#f0f7f6] px-4 py-2.5 text-xs text-[#577572] font-mono">
              <span className="text-[#1a2e2b] font-semibold not-italic">Example output:</span> TSH (CPT 84443) · Ferritin (CPT 82728) · Vitamin D · <span className="italic">Reason: fatigue and hair loss</span>
            </div>
          </div>

          {/* Section 1: Search */}
          <div className="mb-6 no-print" ref={searchContainerRef}>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 text-[#577572]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder={`Try "${PLACEHOLDERS[placeholderIdx]}"...`}
                className={`w-full pl-9 py-3 rounded-xl border-2 border-[#2d6a5e] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/20 ${searchQuery ? 'pr-9' : 'pr-4'}`}
              />
              {isSearching && !searchQuery && (
                <div className="absolute right-3 top-3.5 text-xs text-[#577572]">Searching...</div>
              )}
              {searchQuery && (
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                  className="absolute right-3 top-3 p-0.5 rounded-full text-[#577572] hover:text-[#1a2e2b] hover:bg-[#e0ebe9] transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Hint chips */}
              {searchQuery.length === 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {HINT_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => { setSearchQuery(chip); setSearchFocused(true) }}
                      className="px-2.5 py-1 rounded-full border border-[#e0ebe9] text-xs text-[#4a6b67] hover:border-[#2d6a5e] hover:text-[#2d6a5e] transition-colors bg-white"
                    >
                      {chip}
                    </button>
                  ))}
                  <span className="text-xs text-[#a0b8b4] self-center italic">or search any CPT code</span>
                </div>
              )}

              {/* No results prompt */}
              {searchFocused && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border bg-white shadow-lg px-4 py-4" style={{ borderColor: '#e0ebe9' }}>
                  <p className="text-sm text-[#577572] mb-2">No tests found for &ldquo;{searchQuery}&rdquo;.</p>
                  <p className="text-xs text-[#577572] mb-3">Looking for guidance by symptom or condition? Explore can help you figure out which tests are commonly discussed for what you&apos;re experiencing.</p>
                  <a href="/explore" className="inline-flex items-center gap-1 text-xs font-semibold text-[#2d6a5e] hover:underline">Go to Explore →</a>
                </div>
              )}

              {/* Search results dropdown */}
              {searchFocused && searchResults.length > 0 && (
                <div
                  className="absolute left-0 right-0 z-50 mt-1 rounded-xl border bg-white shadow-lg overflow-y-auto"
                  style={{ borderColor: '#e0ebe9', maxHeight: '24rem' }}
                >
                  {searchResults.map((item, idx) => {
                    if (item.type === 'test') {
                      const added = isTestSelected(item.test.id)
                      return (
                        <div
                          key={`test-${item.test.id}`}
                          onClick={() => toggleTest(item.test)}
                          className="flex items-start justify-between px-4 py-3 border-b last:border-b-0 hover:bg-[#f0f7f6] transition-colors cursor-pointer"
                          style={{ borderColor: '#f5f5f5' }}
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <span className="text-sm font-medium text-[#1a2e2b]">{item.test.test_name}</span>
                            {item.test.description && (
                              <p className="text-xs text-[#577572] mt-0.5 leading-relaxed">{item.test.description}</p>
                            )}
                          </div>
                          <span
                            className={`text-xs font-semibold flex-shrink-0 px-3 py-1 rounded-full border transition-colors ${
                              added
                                ? 'text-[#2d6a5e] bg-[#f0f7f6] border-[#2d6a5e]'
                                : 'text-[#2d6a5e] border-[#2d6a5e] bg-white'
                            }`}
                          >
                            {added ? '\u2713 Added' : '+ Add'}
                          </span>
                        </div>
                      )
                    }

                    if (item.type === 'panel') {
                      const isExpanded = expandedPanels.has(item.bundle.slug)
                      return (
                        <div key={`panel-${item.bundle.slug}`} className="border-b last:border-b-0" style={{ borderColor: '#f5f5f5' }}>
                          <div
                            onClick={() => {
                              setExpandedPanels(prev => {
                                const next = new Set(prev)
                                if (next.has(item.bundle.slug)) next.delete(item.bundle.slug)
                                else next.add(item.bundle.slug)
                                return next
                              })
                            }}
                            className="flex items-center justify-between px-4 py-3 hover:bg-[#f0f7f6] transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-sm font-medium text-[#1a2e2b]">{item.bundle.name}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#f0f7f6] text-[#2d6a5e] border border-[#e0ebe9]">Panel</span>
                            </div>
                            <svg className={`w-4 h-4 flex-shrink-0 text-[#577572] transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                          </div>
                          {isExpanded && (
                            <div className="px-4 pb-3">
                              {item.tests.map(test => {
                                const added = isTestSelected(test.id)
                                return (
                                  <div
                                    key={test.id}
                                    onClick={() => toggleTest(test)}
                                    className="flex items-center justify-between py-2 pl-4 hover:bg-[#f0f7f6] rounded-lg transition-colors cursor-pointer"
                                  >
                                    <span className="text-sm text-[#1a2e2b]">{test.test_name}</span>
                                    <span
                                      className={`text-xs font-semibold flex-shrink-0 px-3 py-1 rounded-full border transition-colors ${
                                        added
                                          ? 'text-[#2d6a5e] bg-[#f0f7f6] border-[#2d6a5e]'
                                          : 'text-[#2d6a5e] border-[#2d6a5e] bg-white'
                                      }`}
                                    >
                                      {added ? '\u2713 Added' : '+ Add'}
                                    </span>
                                  </div>
                                )
                              })}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  item.tests.forEach(test => {
                                    if (!isTestSelected(test.id)) addTest(test)
                                  })
                                }}
                                className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#2d6a5e] text-[#2d6a5e] hover:bg-[#f0f7f6] transition-colors"
                              >
                                Add all
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    }

                    return null
                  })}

                </div>
              )}
            </div>
          </div>

          {/* Section 2: Your list */}
          {hasTests && (
            <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: '#e0ebe9' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-[#1a2e2b]">
                  {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} added
                </span>
                <button
                  onClick={clearAll}
                  className="text-xs text-[#577572] hover:text-[#b85c5c] transition-colors"
                >
                  Clear all
                </button>
              </div>

              <ul className="space-y-1 mb-4">
                {selectedTests.map(test => (
                  <li key={test.id} className="flex items-center justify-between group py-1.5">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-[#1a2e2b]">{test.test_name}</span>
                      {includeCPT && test.cpt_codes?.length > 0 && (
                        <span className="text-xs text-[#577572] ml-1.5">CPT {test.cpt_codes.join(', ')}</span>
                      )}
                      {includeLabCodes && selectedLab && (() => {
                        const lc = test.labCodes?.find((c: LabCode) => c.lab_name === selectedLab)
                        return lc ? (
                          <span className="text-xs text-[#577572] ml-1.5">{selectedLab}: {lc.proprietary_code}</span>
                        ) : null
                      })()}
                    </div>
                    <button
                      onClick={() => removeTest(test.id)}
                      className="ml-2 text-[#d4d4d4] hover:text-[#b85c5c] transition-colors flex-shrink-0 text-lg leading-none no-print"
                      aria-label={`Remove ${test.test_name}`}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>

              {/* Notes field */}
              <div className="mb-4">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason / what to discuss (optional)"
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#e0ebe9] text-[#1a2e2b] placeholder-[#a0b8b4] focus:outline-none focus:border-[#2d6a5e] focus:ring-2 focus:ring-[#2d6a5e]/30 resize-none"
                />
              </div>

              {/* CPT toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCPT}
                  onChange={(e) => setIncludeCPT(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e0ebe9] text-[#2d6a5e] focus:ring-[#2d6a5e]"
                />
                <div>
                  <span className="text-sm text-[#1a2e2b]">Include CPT codes</span>
                  <p className="text-xs text-[#577572] mt-0.5">Billing codes that help your doctor or lab identify the exact test to order.</p>
                </div>
              </label>

              {/* Lab codes toggle — independent of CPT */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLabCodes}
                  onChange={(e) => {
                    setIncludeLabCodes(e.target.checked)
                    if (!e.target.checked) setSelectedLab('')
                  }}
                  className="w-4 h-4 rounded border-[#e0ebe9] text-[#2d6a5e] focus:ring-[#2d6a5e]"
                />
                <div>
                  <span className="text-sm text-[#1a2e2b]">Include lab-specific codes</span>
                  <p className="text-xs text-[#577572] mt-0.5">Some labs use their own internal codes. Useful if you have a preferred lab like Quest or LabCorp.</p>
                </div>
              </label>
              {includeLabCodes && (
                <select
                  value={selectedLab}
                  onChange={(e) => setSelectedLab(e.target.value)}
                  className="mt-1 px-3 py-1.5 rounded-lg border text-sm text-[#1a2e2b] focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30"
                  style={{ borderColor: selectedLab ? '#2d6a5e' : '#e0ebe9' }}
                >
                  <option value="">Select lab...</option>
                  {availableLabs.map(lab => (
                    <option key={lab} value={lab}>{lab}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Section 3: Output */}
          {hasTests && (
            <div className="no-print">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all border-2"
                  style={copied ? { backgroundColor: '#2d6a5e', color: 'white', borderColor: '#2d6a5e' } : { backgroundColor: 'white', color: '#2d6a5e', borderColor: '#2d6a5e' }}
                >
                  {copied ? '\u2713 Copied!' : 'Copy list'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all border-2"
                  style={{ backgroundColor: 'white', color: '#2d6a5e', borderColor: '#2d6a5e' }}
                >
                  Print
                </button>
              </div>

              {/* Share link — premium only */}
              {isSignedIn && isPremium && (
                <button
                  onClick={() => {
                    alert('Shareable links are available with a premium account.')
                  }}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all mb-3"
                  style={{ backgroundColor: 'white', color: '#577572', border: '1px solid #e0ebe9' }}
                >
                  Share link
                </button>
              )}

              <p className="text-center text-xs" style={{ color: '#a0b8b4' }}>
                Your information is not stored or shared. This is for personal reference only.
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
