'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase'

type TestResult = {
  id: string
  test_name: string
  cpt_codes: string[]
  category: string | null
  description: string | null
}

export default function AdvocatePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TestResult[]>([])
  const [selectedTests, setSelectedTests] = useState<TestResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [patientName, setPatientName] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [showDocument, setShowDocument] = useState(false)
  const documentRef = useRef<HTMLDivElement>(null)

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
        .select('id, test_name, cpt_codes, category, description')
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
  }

  const removeTest = (testId: string) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId))
  }

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const generateDocument = () => {
    setShowDocument(true)
    setTimeout(() => {
      documentRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const copyToClipboard = () => {
    if (!documentRef.current) return
    const text = documentRef.current.innerText
    navigator.clipboard.writeText(text).then(() => {
      alert('Document copied to clipboard!')
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-document, #printable-document * { visibility: visible !important; }
          #printable-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 40px !important;
            background: white !important;
          }
        }
      `}</style>

      <div className="min-h-screen print:hidden" style={{ backgroundColor: '#faf8f5' }}>
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1a2e2b' }}>
              Doctor Request Generator
            </h1>
            <p className="text-lg" style={{ color: '#4a6b67' }}>
              Build a professional document requesting specific lab tests
              <br />
              from your healthcare provider.
            </p>
          </div>

          {/* Step 1: Search & Add Tests */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>1</span>
              What tests do you want to request?
            </h2>
            <p className="text-sm mb-4 ml-9" style={{ color: '#6b8c88' }}>
              Search and add the lab tests you&apos;d like your doctor to order.
            </p>

            <div className="relative ml-9">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a test (e.g., TSH, CBC, Vitamin D)..."
                className="w-full px-4 py-3 rounded-lg border-2 text-base focus:outline-none focus:ring-2"
                style={{ borderColor: '#2d6a5e', color: '#1a2e2b' }}
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
                    <button onClick={() => removeTest(test.id)} className="text-red-400 hover:text-red-600 text-lg font-bold px-2" aria-label={`Remove ${test.test_name}`}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Patient Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#e0ebe9' }}>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2" style={{ color: '#1a2e2b' }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#2d6a5e' }}>2</span>
              Your information (optional)
            </h2>
            <p className="text-sm mb-4 ml-9" style={{ color: '#6b8c88' }}>
              Add your name and any symptoms or reasons for requesting these tests.
            </p>
            <div className="ml-9 space-y-4">
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 rounded-lg border-2 text-base focus:outline-none focus:ring-2"
                style={{ borderColor: '#e0ebe9', color: '#1a2e2b' }}
              />
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms or reasons (optional)..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 text-base focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: '#e0ebe9', color: '#1a2e2b' }}
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateDocument}
            disabled={selectedTests.length === 0}
            className="w-full py-4 rounded-xl text-lg font-semibold transition-all mb-8"
            style={{
              backgroundColor: selectedTests.length > 0 ? '#2d6a5e' : '#e0ebe9',
              color: selectedTests.length > 0 ? 'white' : '#6b8c88',
              cursor: selectedTests.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Generate Request Document
          </button>

          {/* Generated Document */}
          {showDocument && (
            <div className="mb-8">
              {/* Action buttons */}
              <div className="flex gap-3 mb-4 justify-end">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ backgroundColor: '#faf8f5', color: '#2d6a5e', border: '1px solid #e0ebe9' }}
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ backgroundColor: '#faf8f5', color: '#2d6a5e', border: '1px solid #e0ebe9' }}
                >
                  🖨️ Print
                </button>
              </div>

              <div
                ref={documentRef}
                id="printable-document"
                className="bg-white rounded-xl shadow-sm border p-8 md:p-10"
                style={{ borderColor: '#e0ebe9', fontFamily: 'DM Sans, sans-serif' }}
              >
                {/* Document Header */}
                <div className="text-center mb-8 pb-6" style={{ borderBottom: '2px solid #1a2e2b' }}>
                  <h2 className="text-2xl font-bold tracking-wide" style={{ color: '#1a2e2b' }}>
                    LABORATORY TEST REQUEST
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#6b8c88' }}>Patient-Initiated Request for Consideration</p>
                </div>

                {/* Patient Info & Date */}
                <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#6b8c88' }}>Patient Name</div>
                    <div className="text-base font-medium" style={{ color: '#1a2e2b' }}>
                      {patientName || '________________________________________'}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#6b8c88' }}>Date</div>
                    <div className="text-base font-medium" style={{ color: '#1a2e2b' }}>{today}</div>
                  </div>
                </div>

                {/* Professional Note */}
                <div className="mb-8 text-sm leading-relaxed" style={{ color: '#4a6b67' }}>
                  <p>Dear Provider,</p>
                  <p className="mt-3">
                    I am requesting the following laboratory tests based on my health concerns.
                    I understand these may require clinical justification for insurance coverage.
                    Thank you for considering my request.
                  </p>
                  {symptoms && (
                    <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#faf8f5', border: '1px solid #e0ebe9' }}>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6b8c88' }}>Patient-Reported Symptoms / Reasons</div>
                      <p style={{ color: '#1a2e2b' }}>{symptoms}</p>
                    </div>
                  )}
                </div>

                {/* Tests Table */}
                <div className="mb-8">
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b8c88' }}>
                    Requested Laboratory Tests
                  </div>
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #1a2e2b' }}>
                        <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#1a2e2b' }}>#</th>
                        <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#1a2e2b' }}>Test Name</th>
                        <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#1a2e2b' }}>CPT Code(s)</th>
                        <th className="text-left py-2 font-semibold hidden sm:table-cell" style={{ color: '#1a2e2b' }}>Clinical Rationale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTests.map((test, i) => (
                        <tr key={test.id} style={{ borderBottom: '1px solid #e0ebe9' }}>
                          <td className="py-3 pr-3 align-top" style={{ color: '#6b8c88' }}>{i + 1}</td>
                          <td className="py-3 pr-3 align-top font-medium" style={{ color: '#1a2e2b' }}>{test.test_name}</td>
                          <td className="py-3 pr-3 align-top" style={{ color: '#4a6b67' }}>
                            {test.cpt_codes?.length > 0 ? test.cpt_codes.join(', ') : '—'}
                          </td>
                          <td className="py-3 align-top text-xs hidden sm:table-cell" style={{ color: '#4a6b67' }}>
                            {test.description ? (test.description.length > 120 ? test.description.slice(0, 120) + '…' : test.description) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Mobile rationale */}
                  <div className="sm:hidden mt-4 space-y-3">
                    {selectedTests.filter(t => t.description).map((test, i) => (
                      <div key={test.id} className="text-xs" style={{ color: '#4a6b67' }}>
                        <span className="font-medium" style={{ color: '#1a2e2b' }}>{i + 1}. {test.test_name}:</span>{' '}
                        {test.description && test.description.length > 150 ? test.description.slice(0, 150) + '…' : test.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signature Lines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 pt-6" style={{ borderTop: '1px solid #e0ebe9' }}>
                  <div>
                    <div className="mb-8" style={{ borderBottom: '1px solid #1a2e2b' }}>&nbsp;</div>
                    <div className="text-xs" style={{ color: '#6b8c88' }}>Patient Signature</div>
                  </div>
                  <div>
                    <div className="mb-8" style={{ borderBottom: '1px solid #1a2e2b' }}>&nbsp;</div>
                    <div className="text-xs" style={{ color: '#6b8c88' }}>Provider Signature</div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="rounded-lg p-4 text-xs" style={{ backgroundColor: '#fff8f5', border: '1px solid #e8d5cc', color: '#4a6b67' }}>
                  <p className="font-semibold mb-1" style={{ color: '#c0826a' }}>⚠️ DISCLAIMER</p>
                  <p>
                    This document is a patient-generated request and does not constitute a medical order.
                    Laboratory tests require a licensed provider&apos;s authorization. Your provider may modify,
                    approve, or decline these requests based on clinical judgment. Insurance coverage is not
                    guaranteed and may require medical necessity documentation. This document does not contain
                    medical advice.
                  </p>
                </div>

                {/* Branding */}
                <div className="text-center mt-6 text-xs" style={{ color: '#6b8c88' }}>
                  Generated by <span className="font-semibold" style={{ color: '#2d6a5e' }}>LabLooker</span> — lablooker.com
                </div>
              </div>
            </div>
          )}

          {/* Help text */}
          <div className="text-center text-sm" style={{ color: '#6b8c88' }}>
            <p className="mb-2">
              <strong>How it works:</strong> Search for tests, add them to your list, and generate a professional document to share with your doctor.
            </p>
            <p>
              Your doctor has the final say — this just makes the conversation easier.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
