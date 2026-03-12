'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { TEST_BUNDLES, type TestBundle } from '@/config/test-bundles'

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

export default function AdvocatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TestResult[]>([])
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([])
  const [reason, setReason] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)
  const [copied, setCopied] = useState(false)
  const [outputMode, setOutputMode] = useState<'form' | 'portal'>('form')
  const [includeICD10, setIncludeICD10] = useState(false)
  const [includeLabCodes, setIncludeLabCodes] = useState(false)
  const [selectedLab, setSelectedLab] = useState('')
  const [availableLabs, setAvailableLabs] = useState<string[]>([])
  const templateRef = useRef<HTMLDivElement>(null)

  // Patient info fields
  const [patientName, setPatientName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [requestDate, setRequestDate] = useState('')

  // Saved providers state
  const [savedProviders, setSavedProviders] = useState<SavedProviderOption[]>([])
  const [isSignedIn, setIsSignedIn] = useState(false)

  const supabase = createClient()

  // Check auth and load saved providers
  useEffect(() => {
    async function loadSavedProviders() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setIsSignedIn(true)
      const { data } = await supabase
        .from('saved_providers')
        .select('id, nickname, provider_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      if (data) setSavedProviders(data)
    }
    loadSavedProviders()
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

  // Auto-populate today's date on mount
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    setRequestDate(today)
  }, [])

  const searchTests = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
      const firstWord = words[0]
      const { data, error } = await supabase
        .from('tests')
        .select('id, test_name, cpt_codes, category')
        .ilike('test_name', `%${firstWord}%`)
        .order('test_name')
        .limit(50)
      if (!error && data) {
        const selectedIds = new Set(selectedTests.map(t => t.id))
        const matched = data.filter(t =>
          !selectedIds.has(t.id) &&
          words.every(w => t.test_name.toLowerCase().includes(w))
        )
        // Sort: starts-with first, then alphabetical
        const q = query.trim().toLowerCase()
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
  }, [selectedTests])

  useEffect(() => {
    const timer = setTimeout(() => searchTests(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchTests])

  const addTest = async (test: TestResult) => {
    setSearchQuery('')
    setSearchResults([])
    // Fetch ICD-10 codes for this test
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
        if (codesData) {
          icd10Codes = codesData
        }
      }
    } catch (e) {
      console.error('ICD-10 fetch error:', e)
    }
    // Fetch lab codes for this test
    let labCodes: LabCode[] = []
    try {
      const { data: lcData } = await supabase
        .from('lab_codes')
        .select('lab_name, proprietary_code')
        .eq('test_id', test.id)
      if (lcData) labCodes = lcData
    } catch (e) {
      console.error('Lab code fetch error:', e)
    }
    setSelectedTests(prev => [...prev, { ...test, icd10Codes, labCodes }])
    setShowTemplate(false)
  }

  const removeTest = (testId: string) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId))
    setShowTemplate(false)
  }

  const generateTemplate = () => {
    setShowTemplate(true)
    setTimeout(() => {
      templateRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const blank = (len = 24) => '_'.repeat(len)

  const getFormPlainText = () => {
    const lines: string[] = []
    lines.push('PATIENT LAB TEST REQUEST')
    lines.push('─'.repeat(52))
    lines.push('')
    lines.push(`Patient: ${patientName.trim() || blank(25)}      Date: ${requestDate.trim() || blank(20)}`)
    lines.push(`Date of Birth: ${dateOfBirth.trim() || blank(20)}   Provider: ${doctorName.trim() || blank(20)}`)
    lines.push('')
    lines.push('REQUESTED TESTS:')
    lines.push('')
    selectedTests.forEach(test => {
      lines.push(`  • ${test.test_name}`)
    })
    lines.push('')
    // Code reference section
    lines.push('CODE REFERENCE:')
    lines.push('')
    const nameW = 24, cptW = 12
    let header = `${'Test'.padEnd(nameW)} ${'CPT'.padEnd(cptW)}`
    if (includeICD10) header += ` ${'ICD-10'.padEnd(14)}`
    if (includeLabCodes && selectedLab) header += ` ${selectedLab}`
    lines.push(header)
    lines.push('─'.repeat(header.length + 10))
    selectedTests.forEach(test => {
      const name = test.test_name.slice(0, nameW - 1).padEnd(nameW)
      const cpt = (test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : '—').padEnd(cptW)
      let row = `${name} ${cpt}`
      if (includeICD10) {
        const icd = test.icd10Codes.length > 0 ? test.icd10Codes.map(c => c.code).join(', ') : '—'
        row += ` ${icd.padEnd(14)}`
      }
      if (includeLabCodes && selectedLab) {
        const labCode = test.labCodes.find(lc => lc.lab_name === selectedLab)
        row += ` ${labCode ? labCode.proprietary_code : '—'}`
      }
      lines.push(row)
    })
    lines.push('')
    if (reason.trim()) {
      lines.push('REASON FOR REQUEST:')
      lines.push(reason.trim())
      lines.push('')
    }
    lines.push(`Patient Signature: ${'_'.repeat(24)}    Date: ${'_'.repeat(12)}`)
    lines.push('')
    lines.push('Generated by LabLooker.com — not a physician\'s order.')
    return lines.join('\n')
  }

  const getPortalPlainText = () => {
    const lines: string[] = []
    const greeting = doctorName.trim()
      ? `Hi ${doctorName.trim().match(/^Dr\.?\s*/i) ? doctorName.trim() : 'Dr. ' + doctorName.trim()},`
      : 'Hi there,'
    lines.push(greeting)
    lines.push('')
    lines.push("I'd like to request the following lab tests at my next appointment or as a standing order:")
    lines.push('')
    selectedTests.forEach(test => {
      const cpt = test.cpt_codes?.length > 0 ? ` (CPT: ${test.cpt_codes.join(', ')})` : ''
      const icd = includeICD10 && test.icd10Codes.length > 0 ? ` [ICD-10: ${test.icd10Codes.map(c => c.code).join(', ')}]` : ''
      const labCode = includeLabCodes && selectedLab ? test.labCodes.find(lc => lc.lab_name === selectedLab) : null
      const lc = labCode ? ` {${selectedLab}: ${labCode.proprietary_code}}` : ''
      lines.push(`• ${test.test_name}${cpt}${icd}${lc}`)
    })
    lines.push('')
    if (reason.trim()) {
      lines.push(reason.trim())
      lines.push('')
    }
    lines.push('Could you please add these to my chart? Thank you so much.')
    if (patientName.trim()) {
      lines.push('')
      lines.push(`— ${patientName.trim()}`)
    }
    return lines.join('\n')
  }

  const copyToClipboard = async () => {
    const text = outputMode === 'portal' ? getPortalPlainText() : getFormPlainText()
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
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

          {/* Header */}
          <div className="text-center mb-10 no-print">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e2b] mb-3">
              Generate a lab test request
            </h1>
            <p className="text-lg" style={{ color: '#4a6b67' }}>
              Generate a coded request letter to give your doctor — print it, copy it, or paste it into a patient portal.
              <br />
              <span className="text-sm" style={{ color: '#577572' }}>This is a communication tool — not a medical order.</span>
            </p>
          </div>

          {/* Step 1: Your Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 no-print" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>1</span>
              Your information
            </h2>
            <p className="text-sm mb-1 ml-9" style={{ color: '#577572' }}>
              Optional — pre-fill the template so you don&apos;t have to hand-write it later.
            </p>
            <p className="text-xs mb-4 ml-9 italic" style={{ color: '#a3bfbb' }}>
              🔒 This information is used only to fill in your printable letter. It is never stored, sent to LabLooker, or shared with anyone.
            </p>

            <div className="ml-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Patient name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0ebe9] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Date of birth</label>
                <input
                  type="text"
                  value={dateOfBirth}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
                    let formatted = digits
                    if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`
                    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
                    setDateOfBirth(formatted)
                  }}
                  placeholder="MM/DD/YYYY"
                  maxLength={10}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0ebe9] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                />
              </div>
              <div>
                {isSignedIn && savedProviders.length > 0 ? (
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Saved provider</label>
                    <select
                      onChange={(e) => {
                        const p = savedProviders.find(sp => sp.id === e.target.value)
                        if (p) setDoctorName(p.provider_name)
                      }}
                      defaultValue=""
                      className="w-full px-4 py-2.5 rounded-lg border border-[#e0ebe9] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                    >
                      <option value="" disabled>Select a saved provider...</option>
                      {savedProviders.map(sp => (
                        <option key={sp.id} value={sp.id}>{sp.nickname}</option>
                      ))}
                    </select>
                  </div>
                ) : !isSignedIn ? (
                  <p className="text-xs mb-2" style={{ color: '#577572' }}>
                    <a href="/login" className="underline hover:text-[#2d6a5e]">Sign in</a> to use saved providers
                  </p>
                ) : null}
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Doctor or practice name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. Smith or practice name"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0ebe9] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Date of request</label>
                <input
                  type="text"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  placeholder="Today's date"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e0ebe9] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Search and add tests */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 no-print" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>2</span>
              What tests do you want to request?
            </h2>
            <p className="text-sm mb-4 ml-9" style={{ color: '#577572' }}>
              Search and add the lab tests you&apos;d like your doctor to consider.
            </p>

            <div className="relative ml-9">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a test (e.g., TSH, CBC, Vitamin D)..."
                className="w-full px-4 py-3 rounded-lg border-2 border-[#2d6a5e] text-base text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30"
              />
              {isSearching && (
                <div className="absolute right-3 top-3.5 text-sm" style={{ color: '#577572' }}>Searching...</div>
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
                        <div className="text-xs mt-0.5" style={{ color: '#577572' }}>CPT: {test.cpt_codes.join(', ')}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bundle suggestion card */}
            {searchQuery.trim().length >= 3 && (() => {
              const bundle = findMatchingBundle(searchQuery)
              if (!bundle) return null
              const alreadyAdded = bundle.tests.every(name =>
                selectedTests.some(st => st.test_name === name)
              )
              if (alreadyAdded) return null
              return (
                <div className="mt-3 ml-9 rounded-xl border-2 border-dashed border-[#2d6a5e]/40 bg-[#f0f7f6] p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{bundle.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1a2e2b]">
                        Looking for a full panel? Try the {bundle.name}
                      </div>
                      <p className="text-xs text-[#4a6b67] mt-0.5 leading-relaxed">
                        {bundle.tests.length} tests — {bundle.description.split('.')[0]}.
                      </p>
                      <button
                        onClick={async () => {
                          setSearchQuery('')
                          setSearchResults([])
                          // Add all bundle tests that aren't already selected
                          const existingIds = new Set(selectedTests.map(t => t.id))
                          const supabase = createClient()
                          for (const testName of bundle.tests) {
                            const { data } = await supabase
                              .from('tests')
                              .select('id, test_name, cpt_codes, category')
                              .eq('test_name', testName)
                              .limit(1)
                            if (data && data.length > 0 && !existingIds.has(data[0].id)) {
                              await addTest(data[0])
                              existingIds.add(data[0].id)
                            }
                          }
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#2d6a5e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#245a50] transition-colors"
                      >
                        + Add all {bundle.tests.length} tests
                      </button>
                    </div>
                  </div>
                </div>
              )
            })()}

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
                        <span className="text-xs ml-2" style={{ color: '#577572' }}>CPT: {test.cpt_codes.join(', ')}</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeTest(test.id)}
                      className="text-red-400 hover:text-red-600 text-lg font-bold px-2"
                      aria-label={`Remove ${test.test_name}`}
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Code toggles — inline with test selection */}
            {selectedTests.length > 0 && (
              <div className="mt-5 ml-9 pt-5 border-t border-[#e0ebe9]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#577572] mb-3">Include in your request</p>
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
            )}
          </div>

          {/* Step 3: Reason/symptoms */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 no-print" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>3</span>
              Why are you requesting these tests?
            </h2>
            <p className="text-sm mb-4 ml-9" style={{ color: '#577572' }}>
              Optional — describe your symptoms or reasons. This helps your doctor understand your concerns.
            </p>
            <div className="ml-9">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., I've been experiencing fatigue and want to check my thyroid levels..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#e0ebe9] text-sm text-[#1a2e2b] placeholder-[#577572] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e] resize-vertical"
              />
            </div>
          </div>

          {/* Step 4: Generate */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 no-print" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>4</span>
              Generate your request
            </h2>
            <p className="text-sm mb-4 ml-9" style={{ color: '#577572' }}>
              Create a formatted document to print or copy.
            </p>
            <div className="ml-9">
              <button
                onClick={generateTemplate}
                disabled={selectedTests.length === 0}
                className="w-full py-4 rounded-xl text-lg font-semibold transition-all"
                style={{
                  backgroundColor: selectedTests.length > 0 ? '#2d6a5e' : '#e0ebe9',
                  color: selectedTests.length > 0 ? 'white' : '#577572',
                  cursor: selectedTests.length > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                {selectedTests.length === 0 ? 'Add tests above to generate' : `Generate Template (${selectedTests.length} test${selectedTests.length !== 1 ? 's' : ''})`}
              </button>
            </div>
          </div>

          {/* Template output */}
          {showTemplate && selectedTests.length > 0 && (
            <div ref={templateRef}>
              {/* Output mode toggle */}
              <div className="flex gap-0 mb-4 no-print">
                <button
                  onClick={() => setOutputMode('form')}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-l-xl border-2 transition-all"
                  style={{
                    backgroundColor: outputMode === 'form' ? '#2d6a5e' : 'white',
                    color: outputMode === 'form' ? 'white' : '#2d6a5e',
                    borderColor: '#2d6a5e',
                  }}
                >
                  📄 Printable Form
                </button>
                <button
                  onClick={() => setOutputMode('portal')}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-r-xl border-2 border-l-0 transition-all"
                  style={{
                    backgroundColor: outputMode === 'portal' ? '#2d6a5e' : 'white',
                    color: outputMode === 'portal' ? 'white' : '#2d6a5e',
                    borderColor: '#2d6a5e',
                  }}
                >
                  💬 Portal Message
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mb-4 no-print">
                {outputMode === 'form' && (
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl font-semibold transition-all"
                    style={{ backgroundColor: '#2d6a5e', color: 'white' }}
                  >
                    🖨️ Print
                  </button>
                )}
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: '#faf8f5', color: '#2d6a5e', border: '2px solid #2d6a5e' }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                </button>
              </div>

              {/* Code explainer */}
              <div className="mb-4 rounded-xl px-4 py-3 text-sm no-print" style={{ backgroundColor: '#f0f7f5', border: '1px solid #c8e0da', color: '#2d6a5e' }}>
                <p>
                  <strong>CPT codes</strong> tell the lab what test to run.
                  {includeICD10 && <> <strong>ICD-10 codes</strong> tell your insurance <em>why</em> it&apos;s medically necessary — without a matching code, claims can be denied.</>}
                  {includeLabCodes && selectedLab && <> <strong>{selectedLab} codes</strong> are that lab&apos;s internal order numbers for each test.</>}
                  {' '}Your doctor will confirm which codes apply to your situation.
                </p>
              </div>

              {/* Printable Form */}
              {outputMode === 'form' && (
                <div className="bg-white rounded-xl shadow-sm border p-8 mb-6 print-template" style={{ borderColor: '#e0ebe9' }}>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold tracking-wide uppercase" style={{ color: '#1a2e2b' }}>Patient Lab Test Request</h2>
                    <div className="mt-2 border-b-2" style={{ borderColor: '#1a2e2b' }}></div>
                  </div>

                  {/* Header fields */}
                  <div className="mb-6 text-sm" style={{ color: '#1a2e2b' }}>
                    <div className="flex gap-8 mb-3">
                      <div className="flex gap-2 flex-1 items-baseline">
                        <span className="font-semibold shrink-0">Patient:</span>
                        {patientName.trim()
                          ? <span>{patientName.trim()}</span>
                          : <span className="border-b flex-1" style={{ borderColor: '#999' }}>&nbsp;</span>
                        }
                      </div>
                      <div className="flex gap-2 flex-1 items-baseline">
                        <span className="font-semibold shrink-0">Date:</span>
                        {requestDate.trim()
                          ? <span>{requestDate.trim()}</span>
                          : <span className="border-b flex-1" style={{ borderColor: '#999' }}>&nbsp;</span>
                        }
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="flex gap-2 flex-1 items-baseline">
                        <span className="font-semibold shrink-0">Date of Birth:</span>
                        {dateOfBirth.trim()
                          ? <span>{dateOfBirth.trim()}</span>
                          : <span className="border-b flex-1" style={{ borderColor: '#999' }}>&nbsp;</span>
                        }
                      </div>
                      <div className="flex gap-2 flex-1 items-baseline">
                        <span className="font-semibold shrink-0">Provider:</span>
                        {doctorName.trim()
                          ? <span>{doctorName.trim()}</span>
                          : <span className="border-b flex-1" style={{ borderColor: '#999' }}>&nbsp;</span>
                        }
                      </div>
                    </div>
                  </div>

                  {/* Part 1: Clean test list */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#1a2e2b' }}>Requested Tests</h3>
                    <ul className="space-y-1.5 ml-1">
                      {selectedTests.map(test => (
                        <li key={test.id} className="text-sm" style={{ color: '#1a2e2b' }}>
                          <span className="mr-2">•</span>
                          <span className="font-medium">{test.test_name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Part 2: Code reference table */}
                  <div className="mb-6 pt-4 border-t" style={{ borderColor: '#ddd' }}>
                    <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#577572' }}>Code Reference</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr style={{ backgroundColor: '#f5f5f0' }}>
                            <th className="text-left px-2 py-1.5 border font-semibold" style={{ borderColor: '#ccc', color: '#1a2e2b' }}>Test</th>
                            <th className="text-left px-2 py-1.5 border font-semibold" style={{ borderColor: '#ccc', color: '#1a2e2b' }}>CPT</th>
                            {includeICD10 && (
                              <th className="text-left px-2 py-1.5 border font-semibold" style={{ borderColor: '#ccc', color: '#1a2e2b' }}>ICD-10</th>
                            )}
                            {includeLabCodes && selectedLab && (
                              <th className="text-left px-2 py-1.5 border font-semibold" style={{ borderColor: '#ccc', color: '#1a2e2b' }}>{selectedLab}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTests.map(test => {
                            const labCode = selectedLab ? test.labCodes.find(lc => lc.lab_name === selectedLab) : null
                            return (
                              <tr key={test.id}>
                                <td className="px-2 py-1.5 border" style={{ borderColor: '#ccc', color: '#1a2e2b' }}>
                                  {test.test_name}
                                </td>
                                <td className="px-2 py-1.5 border font-mono" style={{ borderColor: '#ccc', color: '#4a6b67' }}>
                                  {test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : '—'}
                                </td>
                                {includeICD10 && (
                                  <td className="px-2 py-1.5 border" style={{ borderColor: '#ccc', color: '#4a6b67' }}>
                                    {test.icd10Codes.length > 0
                                      ? test.icd10Codes.map(c => `${c.code} — ${c.description}`).join('; ')
                                      : '—'}
                                  </td>
                                )}
                                {includeLabCodes && selectedLab && (
                                  <td className="px-2 py-1.5 border font-mono" style={{ borderColor: '#ccc', color: '#4a6b67' }}>
                                    {labCode ? labCode.proprietary_code : '—'}
                                  </td>
                                )}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Reason */}
                  {reason.trim() && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#1a2e2b' }}>Reason for Request</h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#4a6b67' }}>{reason.trim()}</p>
                    </div>
                  )}

                  {/* Signature */}
                  <div className="mb-6 mt-10 flex gap-8 text-sm" style={{ color: '#1a2e2b' }}>
                    <div className="flex gap-2 flex-[2] items-baseline">
                      <span className="font-semibold shrink-0">Patient Signature:</span>
                      <span className="border-b flex-1" style={{ borderColor: '#999' }}>&nbsp;</span>
                    </div>
                    <div className="flex gap-2 flex-1 items-baseline">
                      <span className="font-semibold shrink-0">Date:</span>
                      <span className="border-b flex-1" style={{ borderColor: '#999' }}>&nbsp;</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t pt-3 text-xs text-center" style={{ borderColor: '#ddd', color: '#999' }}>
                    Generated by LabLooker.com — not a physician&apos;s order.
                  </div>
                </div>
              )}

              {/* Portal Message */}
              {outputMode === 'portal' && (
                <>
                  <div className="mb-4 rounded-xl px-4 py-3 text-sm no-print" style={{ backgroundColor: '#fef9f0', border: '1px solid #f0d9a8', color: '#7a5a1e' }}>
                    <p>💡 <strong>This does not send anything automatically.</strong> Copy the message below and paste it into your patient portal&apos;s messaging system — MyChart, Healow, athenahealth, or wherever you normally message your doctor.</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#e0ebe9' }}>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-[inherit]" style={{ color: '#1a2e2b' }}>
                      {getPortalPlainText()}
                    </pre>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
