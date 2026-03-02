'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase'

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

type SelectedTest = TestResult & {
  icd10Codes: ICD10Code[]
}

export default function AdvocatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TestResult[]>([])
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([])
  const [reason, setReason] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)
  const [copied, setCopied] = useState(false)
  const templateRef = useRef<HTMLDivElement>(null)

  // Patient info fields
  const [patientName, setPatientName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [requestDate, setRequestDate] = useState('')

  const supabase = createClient()

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
    setSelectedTests(prev => [...prev, { ...test, icd10Codes }])
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

  const displayName = patientName.trim() || blank()
  const displayDOB = dateOfBirth.trim() || blank()
  const displayDate = requestDate.trim() || blank()
  const displayDoctor = doctorName.trim() || blank(12)

  const getPlainText = () => {
    const lines: string[] = []
    lines.push('PATIENT LAB TEST REQUEST')
    lines.push('')
    lines.push(`Patient: ${patientName.trim() || blank(25)}    Date: ${requestDate.trim() || blank(20)}`)
    lines.push(`Date of Birth: ${dateOfBirth.trim() || blank(20)}`)
    lines.push('')
    lines.push(`Dear Dr. ${doctorName.trim() || blank(12)},`)
    lines.push('')
    lines.push('I am requesting the following laboratory tests for the reasons described below. I understand these will need to be ordered at your discretion.')
    lines.push('')
    lines.push('REQUESTED TESTS:')
    lines.push('─'.repeat(60))
    selectedTests.forEach(test => {
      lines.push(`Test: ${test.test_name}`)
      lines.push(`CPT Code(s): ${test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : 'N/A'}`)
      lines.push(`Common ICD-10 Codes: ${test.icd10Codes.length > 0 ? test.icd10Codes.map(c => `${c.code} (${c.description})`).join('; ') : 'N/A'}`)
      lines.push('')
    })
    if (reason.trim()) {
      lines.push('REASON FOR REQUEST:')
      lines.push(reason.trim())
      lines.push('')
    }
    lines.push('Thank you for considering these tests. I look forward to discussing the results with you.')
    lines.push('')
    lines.push('Patient Signature: ______________________')
    lines.push('Date: __________________________________')
    lines.push('')
    lines.push('─'.repeat(60))
    lines.push('This document was generated by LabLooker.com as a patient communication tool. It is NOT a physician\'s order.')
    return lines.join('\n')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getPlainText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = getPlainText()
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
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1a2e2b' }}>
              Doctor Request Template
            </h1>
            <p className="text-lg" style={{ color: '#4a6b67' }}>
              Generate a printable document to bring to your doctor requesting specific lab tests.
              <br />
              <span className="text-sm" style={{ color: '#6b8c88' }}>This is a communication tool — not a medical order.</span>
            </p>
          </div>

          {/* Step 1: Your Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 no-print" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>1</span>
              Your information
            </h2>
            <p className="text-sm mb-4 ml-9" style={{ color: '#6b8c88' }}>
              Optional — pre-fill the template so you don&apos;t have to hand-write it later.
            </p>

            <div className="ml-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Patient name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                  style={{ borderColor: '#e0ebe9', color: '#1a2e2b', backgroundColor: 'white' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Date of birth</label>
                <input
                  type="text"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  placeholder="MM/DD/YYYY"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                  style={{ borderColor: '#e0ebe9', color: '#1a2e2b', backgroundColor: 'white' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Doctor name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. Smith"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                  style={{ borderColor: '#e0ebe9', color: '#1a2e2b', backgroundColor: 'white' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a6b67' }}>Date of request</label>
                <input
                  type="text"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  placeholder="Today's date"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e]"
                  style={{ borderColor: '#e0ebe9', color: '#1a2e2b', backgroundColor: 'white' }}
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
            <p className="text-sm mb-4 ml-9" style={{ color: '#6b8c88' }}>
              Search and add the lab tests you&apos;d like your doctor to consider.
            </p>

            <div className="relative ml-9">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a test (e.g., TSH, CBC, Vitamin D)..."
                className="w-full px-4 py-3 rounded-lg border-2 text-base focus:outline-none focus:ring-2"
                style={{ borderColor: '#2d6a5e', color: '#1a2e2b', backgroundColor: 'white' }}
              />
              {isSearching && (
                <div className="absolute right-3 top-3.5 text-sm" style={{ color: '#6b8c88' }}>Searching...</div>
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
                        <div className="text-xs mt-0.5" style={{ color: '#6b8c88' }}>CPT: {test.cpt_codes.join(', ')}</div>
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
                        <span className="text-xs ml-2" style={{ color: '#6b8c88' }}>CPT: {test.cpt_codes.join(', ')}</span>
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
          </div>

          {/* Step 3: Reason/symptoms */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 no-print" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>3</span>
              Why are you requesting these tests?
            </h2>
            <p className="text-sm mb-4 ml-9" style={{ color: '#6b8c88' }}>
              Optional — describe your symptoms or reasons. This helps your doctor understand your concerns.
            </p>
            <div className="ml-9">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., I've been experiencing fatigue and want to check my thyroid levels..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30 focus:border-[#2d6a5e] resize-vertical"
                style={{ borderColor: '#e0ebe9', color: '#1a2e2b', backgroundColor: 'white' }}
              />
            </div>
          </div>

          {/* Step 4: Generate */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 no-print" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>4</span>
              Generate your template
            </h2>
            <p className="text-sm mb-4 ml-9" style={{ color: '#6b8c88' }}>
              Create a formatted document to print or copy.
            </p>
            <div className="ml-9">
              <button
                onClick={generateTemplate}
                disabled={selectedTests.length === 0}
                className="w-full py-4 rounded-xl text-lg font-semibold transition-all"
                style={{
                  backgroundColor: selectedTests.length > 0 ? '#2d6a5e' : '#e0ebe9',
                  color: selectedTests.length > 0 ? 'white' : '#6b8c88',
                  cursor: selectedTests.length > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                Generate Template ({selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''})
              </button>
            </div>
          </div>

          {/* Template output */}
          {showTemplate && selectedTests.length > 0 && (
            <div ref={templateRef}>
              {/* Action buttons */}
              <div className="flex gap-3 mb-4 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: '#2d6a5e', color: 'white' }}
                >
                  🖨️ Print
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all"
                  style={{ backgroundColor: '#faf8f5', color: '#2d6a5e', border: '2px solid #2d6a5e' }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                </button>
              </div>

              {/* Printable template */}
              <div className="bg-white rounded-xl shadow-sm border p-8 mb-6 print-template" style={{ borderColor: '#e0ebe9' }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold" style={{ color: '#1a2e2b' }}>Patient Lab Test Request</h2>
                </div>

                <div className="mb-6 text-sm" style={{ color: '#1a2e2b' }}>
                  <div className="flex gap-8 mb-2">
                    <div className="flex gap-2 flex-1">
                      <span className="font-medium shrink-0">Patient:</span>
                      {patientName.trim()
                        ? <span>{patientName.trim()}</span>
                        : <span className="border-b flex-1" style={{ borderColor: '#ccc' }}>&nbsp;</span>
                      }
                    </div>
                    <div className="flex gap-2 flex-1">
                      <span className="font-medium shrink-0">Date:</span>
                      {requestDate.trim()
                        ? <span>{requestDate.trim()}</span>
                        : <span className="border-b flex-1" style={{ borderColor: '#ccc' }}>&nbsp;</span>
                      }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium shrink-0">Date of Birth:</span>
                    {dateOfBirth.trim()
                      ? <span>{dateOfBirth.trim()}</span>
                      : <span className="border-b" style={{ borderColor: '#ccc', minWidth: '180px' }}>&nbsp;</span>
                    }
                  </div>
                </div>

                <div className="mb-6" style={{ color: '#1a2e2b' }}>
                  <p className="mb-4">
                    Dear Dr. {doctorName.trim()
                      ? <span>{doctorName.trim().replace(/^Dr\.?\s*/i, '')},</span>
                      : <span><span style={{ display: 'inline-block', borderBottom: '1px solid #ccc', minWidth: '100px' }}>&nbsp;</span>,</span>
                    }
                  </p>
                  <p className="text-sm leading-relaxed">
                    I am requesting the following laboratory tests for the reasons described below. I understand these will need to be ordered at your discretion.
                  </p>
                </div>

                {/* Tests table */}
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f0' }}>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#ddd', color: '#1a2e2b' }}>Test Name</th>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#ddd', color: '#1a2e2b' }}>CPT Code</th>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#ddd', color: '#1a2e2b' }}>Common ICD-10 Codes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTests.map(test => (
                        <tr key={test.id}>
                          <td className="px-3 py-2 border font-medium" style={{ borderColor: '#ddd', color: '#1a2e2b' }}>
                            {test.test_name}
                          </td>
                          <td className="px-3 py-2 border" style={{ borderColor: '#ddd', color: '#4a6b67' }}>
                            {test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : '—'}
                          </td>
                          <td className="px-3 py-2 border text-xs" style={{ borderColor: '#ddd', color: '#4a6b67' }}>
                            {test.icd10Codes.length > 0
                              ? test.icd10Codes.map(c => `${c.code} — ${c.description}`).join('; ')
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Reason */}
                {reason.trim() && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2 text-sm" style={{ color: '#1a2e2b' }}>Reason for Request:</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#4a6b67' }}>{reason.trim()}</p>
                  </div>
                )}

                {/* Closing */}
                <div className="mb-8 text-sm" style={{ color: '#1a2e2b' }}>
                  <p>Thank you for considering these tests. I look forward to discussing the results with you.</p>
                </div>

                {/* Signature */}
                <div className="mb-8 space-y-3 text-sm" style={{ color: '#1a2e2b' }}>
                  <div className="flex gap-2">
                    <span className="font-medium w-36 shrink-0">Patient Signature:</span>
                    <span className="border-b flex-1" style={{ borderColor: '#ccc' }}>&nbsp;</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium w-36 shrink-0">Date:</span>
                    <span className="border-b flex-1" style={{ borderColor: '#ccc' }}>&nbsp;</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="border-t pt-4 text-xs text-center" style={{ borderColor: '#ddd', color: '#999' }}>
                  <p>This document was generated by LabLooker.com as a patient communication tool. It is NOT a physician&apos;s order.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
