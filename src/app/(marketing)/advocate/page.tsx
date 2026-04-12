'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { TEST_BUNDLES, type TestBundle } from '@/config/test-bundles'

// Symptom tag → test name mapping for search-by-symptom
const SYMPTOM_TAGS: Record<string, string[]> = {
  fatigue: ['Ferritin', 'Free T3 (Triiodothyronine, Free)', 'TSH (Thyroid Stimulating Hormone)', 'Vitamin D, 25-OH (Total)', 'Vitamin B12 (Cobalamin)', 'Cortisol, AM (Serum)', 'CBC with Differential (CBC w/ Diff)', 'Magnesium, Serum'],
  weight: ['TSH (Thyroid Stimulating Hormone)', 'Free T3 (Triiodothyronine, Free)', 'HbA1c (Hemoglobin A1c)', 'Insulin, Fasting', 'Cortisol, AM (Serum)', 'Testosterone, Total'],
  mood: ['Free T3 (Triiodothyronine, Free)', 'Vitamin D, 25-OH (Total)', 'Vitamin B12 (Cobalamin)', 'Magnesium, Serum', 'Estradiol (E2)', 'Progesterone', 'Cortisol, AM (Serum)', 'DHEA-Sulfate (DHEA-S)'],
  hormones: ['Estradiol (E2)', 'Progesterone', 'Testosterone, Total', 'DHEA-Sulfate (DHEA-S)', 'Cortisol, AM (Serum)', 'SHBG (Sex Hormone Binding Globulin)', 'FSH (Follicle Stimulating Hormone)', 'LH (Luteinizing Hormone)'],
  thyroid: ['TSH (Thyroid Stimulating Hormone)', 'Free T4 (Thyroxine, Free)', 'Free T3 (Triiodothyronine, Free)', 'Reverse T3 (rT3)', 'Anti-TPO (Thyroid Peroxidase Antibody)', 'Anti-Thyroglobulin Antibody (TgAb)'],
}

// Keyword → bundle slug mapping for search suggestions
const BUNDLE_KEYWORDS: Record<string, string[]> = {
  'thyroid-complete': ['thyroid', 'hashimoto', 'hypothyroid', 'hyperthyroid', 'tsh'],
  'hormone-baseline': ['bhrt', 'menopause', 'perimenopause', 'hrt', 'hormone replacement', 'hot flash'],
  'bhrt-monitoring': ['bhrt monitoring', 'hormone monitoring'],
  'trt-monitoring': ['trt', 'low t', 'testosterone replacement', 'low testosterone'],
  'weight-metabolism': ['weight loss', 'weight gain', 'metabolism', 'metabolic', 'obesity', 'insulin resistance'],
  'iron-deep-dive': ['iron', 'anemia', 'ferritin low', 'iron deficiency', 'tired all the time'],
  'pcos-panel': ['pcos', 'irregular period', 'hirsutism', 'polycystic'],
  'energy-fatigue': ['fatigue', 'tired', 'energy', 'exhausted', 'burnout', 'no energy'],
  'inflammation-immune': ['inflammation', 'autoimmune', 'lupus', 'rheumatoid', 'ra ', 'joint pain'],
  'gut-health': ['gut', 'digestive', 'ibs', 'sibo', 'bloating', 'celiac'],
  'nutrient-deficiencies': ['vitamin', 'deficiency', 'nutrient', 'supplement', 'malabsorption'],
  'mood-brain-health': ['mood', 'depression', 'anxiety', 'brain fog', 'mental health', 'focus', 'cognitive'],
  'preventive-health': ['longevity', 'preventive', 'annual', 'checkup', 'baseline', 'wellness'],
  'cycle-health': ['cycle', 'fertility', 'ovulation', 'period', 'menstrual'],
}

function findMatchingBundle(query: string): TestBundle | null {
  const q = query.toLowerCase().trim()
  if (q.length < 3) return null
  for (const [slug, keywords] of Object.entries(BUNDLE_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) {
      return TEST_BUNDLES.find(b => b.slug === slug) ?? null
    }
  }
  return null
}

type SavedProviderOption = {
  id: string
  nickname: string
  provider_name: string
}

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

const REASON_CHIPS = [
  'Monitoring a known condition',
  'Investigating new symptoms',
  'Annual wellness baseline',
  'Preparing for a specialist visit',
]

export default function AdvocatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TestResult[]>([])
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([])
  const [reason, setReason] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [dismissedBundles, setDismissedBundles] = useState<Set<string>>(new Set())
  const [suppressAllPanels, setSuppressAllPanels] = useState(false)
  const dismissCount = useRef(0)
  const letterRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [includeICD10, setIncludeICD10] = useState(false)
  const [includeLabCodes, setIncludeLabCodes] = useState(false)
  const [selectedLab, setSelectedLab] = useState('')
  const [availableLabs, setAvailableLabs] = useState<string[]>([])

  // Patient info fields
  const [patientName, setPatientName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')

  // Saved providers state
  const [savedProviders, setSavedProviders] = useState<SavedProviderOption[]>([])
  const [isSignedIn, setIsSignedIn] = useState(false)

  const supabase = createClient()

  // Check auth, load saved providers, and pre-fill user info
  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setIsSignedIn(true)

      // Load profile for name pre-fill
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, date_of_birth')
        .eq('id', user.id)
        .single()
      if (profile?.full_name && !patientName) {
        setPatientName(profile.full_name)
      }
      if (profile?.date_of_birth && !dateOfBirth) {
        setDateOfBirth(profile.date_of_birth)
      }

      // Load saved providers
      const { data } = await supabase
        .from('saved_providers')
        .select('id, nickname, provider_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      if (data) setSavedProviders(data)
    }
    loadUserData()
  }, [supabase])

  // Load available lab names for lab code selector
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

  // Format date for display (YYYY-MM-DD → readable)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // Today's date formatted for the letter
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }, [])

  const searchTests = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const q = query.trim().toLowerCase()
      const selectedIds = new Set(selectedTests.map(t => t.id))

      // Check if query matches a symptom tag — return those tests directly from DB
      const symptomTests = SYMPTOM_TAGS[q]
      if (symptomTests) {
        const { data, error } = await supabase
          .from('tests')
          .select('id, test_name, cpt_codes, category, description')
          .in('test_name', symptomTests)
          .order('test_name')
        if (!error && data) {
          setSearchResults(data.filter(t => !selectedIds.has(t.id)))
          setIsSearching(false)
          return
        }
      }

      // Check if query is a CPT code (all digits, 4-5 chars)
      const isCptSearch = /^\d{4,5}$/.test(q)

      // Normal search: test name ilike + CPT contains
      const words = q.split(/\s+/).filter(Boolean)
      const firstWord = words[0]
      const { data, error } = await supabase
        .from('tests')
        .select('id, test_name, cpt_codes, category, description')
        .ilike('test_name', `%${firstWord}%`)
        .order('test_name')
        .limit(50)

      if (!error && data) {
        let matched = data.filter(t =>
          !selectedIds.has(t.id) &&
          words.every(w => t.test_name.toLowerCase().includes(w))
        )

        // If CPT search or few name matches, also search by CPT code
        if (isCptSearch || matched.length < 3) {
          const { data: cptData } = await supabase
            .from('tests')
            .select('id, test_name, cpt_codes, category, description')
            .order('test_name')
            .limit(200)
          if (cptData) {
            const cptMatches = cptData.filter(t =>
              !selectedIds.has(t.id) &&
              !matched.some(m => m.id === t.id) &&
              t.cpt_codes?.some((c: string) => c.includes(q))
            )
            matched = [...matched, ...cptMatches]
          }
        }

        // Sort: starts-with first, then alphabetical
        matched.sort((a, b) => {
          const aStarts = a.test_name.toLowerCase().startsWith(q) ? 0 : 1
          const bStarts = b.test_name.toLowerCase().startsWith(q) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.test_name.localeCompare(b.test_name)
        })
        setSearchResults(matched.slice(0, 10))
      }
    } catch (e) {
      console.error('Search error:', e)
    }
    setIsSearching(false)
  }, [selectedTests, supabase])

  useEffect(() => {
    const timer = setTimeout(() => searchTests(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchTests])

  // Track count synchronously via ref so useMemo reads current value
  const prevTestCount = useRef(0)

  // Compute suggested bundle — only show when adding (not removing)
  const suggestedBundle = useMemo<TestBundle | null>(() => {
    const isAdding = selectedTests.length >= prevTestCount.current
    prevTestCount.current = selectedTests.length
    if (selectedTests.length === 0) return null
    if (!isAdding) return null
    if (suppressAllPanels) return null
    const selectedNames = new Set(selectedTests.map(t => t.test_name))
    for (const bundle of TEST_BUNDLES) {
      if (dismissedBundles.has(bundle.slug)) continue
      const hasAtLeastOne = bundle.tests.some(name => selectedNames.has(name))
      const hasAll = bundle.tests.every(name => selectedNames.has(name))
      if (hasAtLeastOne && !hasAll) return bundle
    }
    return null
  }, [selectedTests, dismissedBundles, suppressAllPanels])

  const addTest = (test: TestResult) => {
    // 1. Add instantly — no waiting
    setSelectedTests(prev => {
      // Scroll to letter on first add
      if (prev.length === 0) {
        setTimeout(() => letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
      return [...prev, { ...test, icd10Codes: [], labCodes: [] }]
    })
    // 2. Remove from search results
    setSearchResults(prev => prev.filter(t => t.id !== test.id))
    // 3. Fetch codes in background, then update
    ;(async () => {
      let icd10Codes: ICD10Code[] = []
      try {
        const { data: junctionData } = await supabase
          .from('test_icd10_codes')
          .select('icd10_code_id')
          .eq('test_id', test.id)
        if (junctionData && junctionData.length > 0) {
          const codeIds = junctionData.map((j: { icd10_code_id: string }) => j.icd10_code_id)
          const { data: codesData } = await supabase
            .from('icd10_codes')
            .select('code, description')
            .in('id', codeIds)
          if (codesData) icd10Codes = codesData
        }
      } catch (e) { console.error('ICD-10 fetch error:', e) }
      let labCodes: LabCode[] = []
      try {
        const { data: lcData } = await supabase
          .from('lab_codes')
          .select('lab_name, proprietary_code')
          .eq('test_id', test.id)
        if (lcData) labCodes = lcData
      } catch (e) { console.error('Lab code fetch error:', e) }
      setSelectedTests(prev => prev.map(t =>
        t.id === test.id ? { ...t, icd10Codes, labCodes } : t
      ))
    })()
  }

  const removeTest = (testId: string) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId))
  }

  // Build letter plain text for copy
  const getLetterPlainText = () => {
    const lines: string[] = []
    lines.push(todayFormatted)
    lines.push('')
    lines.push('To Whom It May Concern,')
    lines.push('')
    lines.push('I am writing to request the following lab tests for my records and to facilitate a conversation with my healthcare provider:')
    lines.push('')
    selectedTests.forEach(test => {
      const cpt = test.cpt_codes?.length > 0 ? ` — CPT ${test.cpt_codes.join(', ')}` : ''
      const icd = includeICD10 && test.icd10Codes.length > 0 ? ` — ICD-10: ${test.icd10Codes.map(c => c.code).join(', ')}` : ''
      const labCode = includeLabCodes && selectedLab ? test.labCodes.find(lc => lc.lab_name === selectedLab) : null
      const lc = labCode ? ` — ${selectedLab}: ${labCode.proprietary_code}` : ''
      lines.push(`  • ${test.test_name}${cpt}${icd}${lc}`)
    })
    lines.push('')
    if (reason.trim()) {
      lines.push(`Reason for request: ${reason.trim()}`)
      lines.push('')
    }
    const name = patientName.trim() || 'Your name'
    const dob = dateOfBirth ? formatDate(dateOfBirth) : 'Date of birth'
    lines.push(`Patient: ${name}  |  Date of Birth: ${dob}`)
    lines.push('')
    lines.push('─'.repeat(56))
    lines.push('This letter is for personal reference and communication')
    lines.push('purposes only. It does not constitute a medical order.')
    return lines.join('\n')
  }

  const copyToClipboard = async () => {
    const text = getLetterPlainText()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Check if a test is already selected (for toggle in dropdown)
  const isTestSelected = (testId: string) => selectedTests.some(t => t.id === testId)

  // Toggle test add/remove from dropdown
  const toggleTest = (test: TestResult) => {
    if (isTestSelected(test.id)) {
      removeTest(test.id)
    } else {
      addTest(test)
    }
  }

  const hasTests = selectedTests.length > 0

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header, nav, footer, .no-print { display: none !important; }
          body { background: white !important; }
          .print-only { display: block !important; }
          .print-template {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
        <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

          {/* Header */}
          <div className="mb-6 no-print">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a2e2b]">
              Generate Lab Request
            </h1>
            <p className="text-sm mt-1" style={{ color: '#577572' }}>
              Know what you want? Search by test name or CPT code. Not sure? Search a symptom or condition and we&apos;ll suggest relevant tests.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl border p-5 mb-4 no-print" style={{ borderColor: '#e0ebe9' }}>

            {/* Search bar */}
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
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search by test name, symptom, or condition..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-[#2d6a5e] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/20"
              />
              {isSearching && (
                <div className="absolute right-3 top-3.5 text-xs" style={{ color: '#577572' }}>Searching...</div>
              )}
            </div>

            {/* Hint chips — visible before typing */}
            {searchQuery.length === 0 && (
              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className="text-xs text-[#577572] self-center">Try:</span>
                {['fatigue', 'weight', 'mood', 'hormones', 'thyroid'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => { setSearchQuery(chip); setSearchFocused(true) }}
                    className="px-2.5 py-1 rounded-full border border-[#e0ebe9] text-xs text-[#4a6b67] hover:border-[#2d6a5e] hover:text-[#2d6a5e] transition-colors bg-white"
                  >
                    {chip}
                  </button>
                ))}
                <span className="text-xs text-[#a0b8b4] self-center italic">or any CPT code</span>
              </div>
            )}

            {/* Search results dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div
                className="mt-1 rounded-xl border bg-white shadow-lg overflow-hidden"
                style={{ borderColor: '#e0ebe9' }}
                onMouseDown={e => e.preventDefault()}
              >
                {searchResults.map(test => {
                  const added = isTestSelected(test.id)
                  return (
                    <button
                      key={test.id}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => toggleTest(test)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#f0f7f6] border-b last:border-b-0 transition-colors text-left"
                      style={{ borderColor: '#f5f5f5' }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#1a2e2b]">{test.test_name}</span>
                          {test.test_name.toLowerCase().includes('panel') && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#e0ebe9] text-[#2d6a5e]">Lab panel</span>
                          )}
                        </div>
                        {test.description && (
                          <p className="text-xs text-[#577572] mt-0.5 line-clamp-1">{test.description}</p>
                        )}
                      </div>
                      <span
                        className="text-xs font-semibold ml-3 flex-shrink-0"
                        style={{ color: added ? '#b85c5c' : '#2d6a5e' }}
                      >
                        {added ? '✓ Remove' : '+ Add'}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Panel suggestion card */}
            {suggestedBundle && (
              <div
                className="mt-3 rounded-xl border-2 border-dashed border-[#2d6a5e]/40 bg-[#f0f7f6] p-4"
                onMouseDown={e => e.preventDefault()}
              >
                <div className="text-xs font-bold uppercase tracking-widest text-[#2d6a5e] mb-2">💡 Suggested Panel</div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1a2e2b]">
                      {suggestedBundle.name}
                    </p>
                    <p className="text-xs text-[#4a6b67] mt-0.5">
                      {suggestedBundle.description.split('.')[0]}.
                    </p>
                    <p className="text-xs text-[#577572] mt-2">Click any test to add or remove:</p>
                  </div>
                  <button
                    onClick={() => {
                      setDismissedBundles(prev => new Set([...prev, suggestedBundle.slug]))
                      dismissCount.current += 1
                      if (dismissCount.current >= 2) setSuppressAllPanels(true)
                    }}
                    className="text-[#577572] hover:text-[#1a2e2b] text-xl ml-3 flex-shrink-0 leading-none"
                    title={dismissCount.current >= 1 ? 'Dismiss (won\'t suggest more panels)' : 'Dismiss'}
                  >×</button>
                </div>
                <ul className="mt-2 space-y-0.5">
                  {suggestedBundle.tests.map(name => {
                    const alreadyAdded = selectedTests.some(t => t.test_name === name)
                    return (
                      <li key={name}>
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={async () => {
                            if (alreadyAdded) {
                              const match = selectedTests.find(t => t.test_name === name)
                              if (match) removeTest(match.id)
                            } else {
                              const { data } = await supabase
                                .from('tests')
                                .select('id, test_name, cpt_codes, category, description')
                                .eq('test_name', name)
                                .limit(1)
                              if (data && data.length > 0) addTest(data[0])
                            }
                          }}
                          className="flex items-center justify-between w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-medium" style={{ color: alreadyAdded ? '#2d6a5e' : '#1a2e2b' }}>
                            {name}
                          </span>
                          <span className="text-xs font-semibold ml-3 flex-shrink-0" style={{ color: alreadyAdded ? '#b85c5c' : '#2d6a5e' }}>
                            {alreadyAdded ? '✓ Remove' : '+ Add'}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <button
                  onClick={async () => {
                    const existingNames = new Set(selectedTests.map(t => t.test_name))
                    const remaining = suggestedBundle.tests.filter(name => !existingNames.has(name))
                    for (const testName of remaining) {
                      const { data } = await supabase
                        .from('tests')
                        .select('id, test_name, cpt_codes, category, description')
                        .eq('test_name', testName)
                        .limit(1)
                      if (data && data.length > 0) addTest(data[0])
                    }
                  }}
                  className="mt-3 text-xs bg-[#2d6a5e] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#245a50] transition-colors"
                >
                  + Add all {suggestedBundle.tests.filter(name => !selectedTests.some(t => t.test_name === name)).length} remaining
                </button>
              </div>
            )}

            {/* Test count indicator */}
            {hasTests && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e0ebe9]">
                <span className="text-xs font-semibold" style={{ color: '#577572' }}>
                  {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} in letter
                </span>
                <button
                  onClick={() => { setSelectedTests([]); setDismissedBundles(new Set()); setSuppressAllPanels(false); dismissCount.current = 0 }}
                  className="text-xs hover:text-[#b85c5c] transition-colors"
                  style={{ color: '#577572' }}
                >
                  Remove all
                </button>
              </div>
            )}
          </div>

          {/* Live Letter Preview */}
          <div ref={letterRef} className="bg-white rounded-xl shadow-sm border p-8 mb-4 print-template" style={{ borderColor: '#e0ebe9', fontFamily: 'Georgia, "Times New Roman", serif' }}>

            {/* Date — right-aligned */}
            <p className="text-right text-sm mb-6" style={{ color: '#1a2e2b' }}>
              {todayFormatted}
            </p>

            {/* Salutation */}
            <p className="text-sm mb-4" style={{ color: '#1a2e2b' }}>
              To Whom It May Concern,
            </p>

            {/* Body */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#1a2e2b' }}>
              I am writing to request the following lab tests for my records and to facilitate a conversation with my healthcare provider:
            </p>

            {/* Test list */}
            {hasTests ? (
              <ul className="mb-4 space-y-1 ml-4">
                {selectedTests.map(test => {
                  const cpt = test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : null
                  const icd = includeICD10 && test.icd10Codes.length > 0 ? test.icd10Codes.map(c => c.code).join(', ') : null
                  const labCode = includeLabCodes && selectedLab ? test.labCodes.find(lc => lc.lab_name === selectedLab) : null
                  return (
                    <li key={test.id} className="flex items-start justify-between group text-sm" style={{ color: '#1a2e2b' }}>
                      <div className="flex-1 min-w-0">
                        <span className="mr-2">•</span>
                        <span className="font-medium">{test.test_name}</span>
                        {cpt && (
                          <span className="text-[#577572]"> — CPT {cpt}</span>
                        )}
                        {icd && (
                          <span className="text-[#577572]"> — ICD-10: {icd}</span>
                        )}
                        {labCode && (
                          <span className="text-[#577572]"> — {selectedLab}: {labCode.proprietary_code}</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeTest(test.id)}
                        className="ml-2 text-[#d4d4d4] hover:text-[#b85c5c] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 no-print"
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                        aria-label={`Remove ${test.test_name}`}
                      >×</button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mb-4 ml-4 text-sm italic" style={{ color: '#a0b8b4' }}>
                Add tests above to populate this letter
              </p>
            )}

            {/* Reason */}
            {reason.trim() && (
              <p className="text-sm mb-4" style={{ color: '#1a2e2b' }}>
                <span className="font-medium">Reason for request:</span> {reason.trim()}
              </p>
            )}

            {/* Patient info */}
            <p className="text-sm mb-6" style={{ color: '#1a2e2b' }}>
              Patient:{' '}
              <span style={{ color: patientName.trim() ? '#1a2e2b' : '#a0b8b4' }}>
                {patientName.trim() || 'Your name'}
              </span>
              {'  |  Date of Birth: '}
              <span style={{ color: dateOfBirth ? '#1a2e2b' : '#a0b8b4' }}>
                {dateOfBirth ? formatDate(dateOfBirth) : 'DOB'}
              </span>
            </p>

            {/* Divider + disclaimer */}
            <div className="border-t pt-3 text-xs text-center" style={{ borderColor: '#ddd', color: '#999' }}>
              This letter is for personal reference and communication purposes only. It does not constitute a medical order.
            </div>
          </div>

          {/* Patient Details + Options (below letter) */}
          <div className="bg-white rounded-2xl border p-5 mb-4 no-print" style={{ borderColor: '#e0ebe9' }}>

            {/* Patient info fields */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-[#577572] block mb-1">Patient name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#e0ebe9] text-[#1a2e2b] placeholder-[#a0b8b4] focus:outline-none focus:border-[#2d6a5e] focus:ring-2 focus:ring-[#2d6a5e]/30"
                />
              </div>
              <div>
                <label className="text-xs text-[#577572] block mb-1">Date of birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  min="1900-01-01"
                  max="2099-12-31"
                  onChange={(e) => {
                    const year = e.target.value.split('-')[0]
                    if (year && year.length > 4) return
                    setDateOfBirth(e.target.value)
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#e0ebe9] text-[#1a2e2b] focus:outline-none focus:border-[#2d6a5e] focus:ring-2 focus:ring-[#2d6a5e]/30"
                />
              </div>
            </div>

            {/* Reason for request */}
            <div className="mb-4">
              <label className="text-xs text-[#577572] block mb-1">Reason for request <span className="text-[#a0b8b4]">(optional)</span></label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Monitoring thyroid levels, experiencing fatigue and hair loss..."
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#e0ebe9] text-[#1a2e2b] placeholder-[#a0b8b4] focus:outline-none focus:border-[#2d6a5e] focus:ring-2 focus:ring-[#2d6a5e]/30 resize-none"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {REASON_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => setReason(chip)}
                    className="px-2.5 py-1 rounded-full border text-xs transition-colors"
                    style={{
                      borderColor: reason === chip ? '#2d6a5e' : '#e0ebe9',
                      color: reason === chip ? '#2d6a5e' : '#577572',
                      backgroundColor: reason === chip ? '#f0f7f6' : 'white',
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Code toggles */}
            <div className="pt-4 border-t border-[#e0ebe9]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#577572] mb-3">Include in your letter</p>
              <div className="space-y-3">
                {/* ICD-10 toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={includeICD10}
                      onChange={(e) => setIncludeICD10(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 rounded-full bg-[#e0ebe9] peer-checked:bg-[#2d6a5e] transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#1a2e2b]">Diagnostic codes (ICD-10)</span>
                    <span className="text-xs text-[#577572] ml-1.5">— billing justification</span>
                  </div>
                </label>

                {/* Lab-specific codes toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={includeLabCodes}
                      onChange={(e) => {
                        setIncludeLabCodes(e.target.checked)
                        if (!e.target.checked) setSelectedLab('')
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 rounded-full bg-[#e0ebe9] peer-checked:bg-[#2d6a5e] transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#1a2e2b]">Lab-specific order codes</span>
                    {includeLabCodes && (
                      <select
                        value={selectedLab}
                        onChange={(e) => setSelectedLab(e.target.value)}
                        className="px-3 py-1 rounded-lg border text-xs text-[#1a2e2b] focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30"
                        style={{ borderColor: selectedLab ? '#2d6a5e' : '#e0ebe9' }}
                      >
                        <option value="">Select lab...</option>
                        {availableLabs.map(lab => (
                          <option key={lab} value={lab}>{lab}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Saved providers */}
            {isSignedIn && savedProviders.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#e0ebe9]">
                <label className="text-xs text-[#577572] block mb-1">Saved providers</label>
                <select
                  onChange={(e) => {
                    const p = savedProviders.find(sp => sp.id === e.target.value)
                    if (p) setPatientName(prev => prev) // keep name, just noting provider selected
                  }}
                  defaultValue=""
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#e0ebe9] text-[#1a2e2b] focus:outline-none focus:border-[#2d6a5e] focus:ring-2 focus:ring-[#2d6a5e]/30"
                >
                  <option value="" disabled>Select a saved provider...</option>
                  {savedProviders.map(sp => (
                    <option key={sp.id} value={sp.id}>{sp.nickname}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 no-print">
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!hasTests}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#2d6a5e', color: 'white' }}
              >
                {copied ? '✓ Copied!' : 'Copy letter'}
              </button>
              <button
                onClick={() => window.print()}
                disabled={!hasTests}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#faf8f5', color: '#2d6a5e', border: '2px solid #2d6a5e' }}
              >
                Print / Save PDF
              </button>
            </div>
            <button
              onClick={async () => {
                if (!isSignedIn) {
                  window.location.href = '/signup'
                  return
                }
                // Premium-gated shareable link placeholder
                alert('Shareable links are available with a premium account.')
              }}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ backgroundColor: 'white', color: '#577572', border: '1px solid #e0ebe9' }}
            >
              {isSignedIn ? 'Shareable link (Premium)' : 'Shareable link — Sign up'}
            </button>
            <p className="text-center text-xs pt-1" style={{ color: '#a0b8b4' }}>
              Not a medical order · Your info is not stored or shared
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
