'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Test, ICD10Code } from '@/types/database'
import Button from '@/components/ui/Button'
import { useStateRestriction, StateRestrictionBanner } from '@/components/StateRestrictionProvider'

const CATEGORY_LABELS: Record<string, string> = {
  thyroid: 'Thyroid', hormones: 'Hormones', iron_blood: 'Iron & Blood',
  hematology: 'Hematology', iron: 'Iron', coagulation: 'Coagulation',
  metabolic: 'Metabolic', lipids: 'Lipids', cardiovascular: 'Cardiovascular',
  vitamins: 'Vitamins', vitamins_minerals: 'Vitamins & Minerals',
  minerals: 'Minerals', kidney: 'Kidney', kidney_liver: 'Kidney & Liver',
  liver: 'Liver', inflammation: 'Inflammation', immune: 'Immune',
  autoimmune: 'Autoimmune', autoimmune_gi: 'Autoimmune / GI',
  infectious: 'Infectious Disease', cancer: 'Cancer Markers',
  cancer_screening: 'Cancer Screening', genetics: 'Genetics',
  allergy: 'Allergy', gi_digestive: 'GI & Digestive',
  nutrition: 'Nutrition', drug_monitoring: 'Drug Monitoring',
  pregnancy: 'Pregnancy & Fertility', pediatric: 'Pediatric',
  mental_health: 'Mental Health', longevity: 'Longevity', cardiac: 'Cardiac',
}

const PLACEHOLDER_LABS = [
  'Quest Diagnostics', 'LabCorp', 'Ulta Lab Tests', 'Walk-In Lab',
  'Any Lab Test Now', 'Request A Test', 'HealthLabs.com', 'Private MD Labs',
  'DirectLabs', 'Personalabs', 'Life Extension',
]

export default function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const [test, setTest] = useState<Test | null>(null)
  const [icd10Codes, setIcd10Codes] = useState<ICD10Code[]>([])
  const [relatedTests, setRelatedTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [pricing, setPricing] = useState<{ price: number; requires_rx: boolean; lab_name: string; website: string; notes: string | null }[]>([])
  const [labCodes, setLabCodes] = useState<{ lab_name: string; proprietary_code: string; code_type: string }[]>([])
  const [copiedCpt, setCopiedCpt] = useState(false)
  const [testId, setTestId] = useState<string>('')
  const { userState, isRestricted, setShowStatePicker } = useStateRestriction()

  useEffect(() => {
    params.then((p) => setTestId(p.testId))
  }, [params])

  useEffect(() => {
    if (!testId) return
    const supabase = createClient()

    async function load() {
      const { data: testData } = await supabase
        .from('tests')
        .select('*')
        .eq('id', testId)
        .single()

      if (!testData) {
        setLoading(false)
        return
      }
      setTest(testData)

      const { data: junctions } = await supabase
        .from('test_icd10_codes')
        .select('icd10_code_id')
        .eq('test_id', testId)

      if (junctions && junctions.length > 0) {
        const codeIds = junctions.map((j) => j.icd10_code_id)
        const { data: codes } = await supabase
          .from('icd10_codes')
          .select('*')
          .in('id', codeIds)
          .order('code')
        if (codes) setIcd10Codes(codes)
      }

      // Fetch pricing with lab details
      const { data: pricingData } = await supabase
        .from('pricing')
        .select('price, requires_rx, labs(lab_name, website, notes)')
        .eq('test_id', testId)
        .order('price', { ascending: true })
      if (pricingData) {
        setPricing(pricingData.map((row: any) => ({
          price: row.price,
          requires_rx: row.requires_rx,
          lab_name: row.labs.lab_name,
          website: row.labs.website,
          notes: row.labs.notes,
        })))
      }

      // Fetch lab codes
      const { data: labCodesData } = await supabase
        .from('lab_codes')
        .select('lab_name, proprietary_code, code_type')
        .eq('test_id', testId)
        .order('lab_name')
      if (labCodesData) setLabCodes(labCodesData)

      if (testData.related_tests && testData.related_tests.length > 0) {
        const { data: related } = await supabase
          .from('tests')
          .select('*')
          .in('id', testData.related_tests)
        if (related) setRelatedTests(related)
      }

      setLoading(false)
    }
    load()
  }, [testId])

  function copyCpt() {
    if (!test) return
    navigator.clipboard.writeText(test.cpt_codes.join(', '))
    setCopiedCpt(true)
    setTimeout(() => setCopiedCpt(false), 2000)
  }

  if (loading) {
    return (
      <section className="pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
          <p className="mt-4 text-sm text-[#6b8c88]">Loading test details...</p>
        </div>
      </section>
    )
  }

  if (!test) {
    return (
      <section className="pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-2xl font-bold text-[#1a2e2b]">Test not found</h1>
          <p className="mt-2 text-[#6b8c88]">This test may have been removed or the link is invalid.</p>
          <Button href="/search" className="mt-6">Back to Search</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6b8c88]">
          <Link href="/search" className="hover:text-[#2d6a5e] transition-colors">Search</Link>
          <span>/</span>
          {test.category && (
            <>
              <Link
                href={`/search?category=${test.category}`}
                className="hover:text-[#2d6a5e] transition-colors"
              >
                {CATEGORY_LABELS[test.category] || test.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#1a2e2b] truncate">{test.test_name}</span>
        </nav>

        {/* Header */}
        <div className="mt-6">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
              {test.test_name}
            </h1>
            {test.fasting_required && (
              <span className="mt-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm font-medium text-amber-700">
                Fasting Required
              </span>
            )}
          </div>

          {/* CPT codes */}
          {test.cpt_codes.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="font-mono text-lg text-[#2d6a5e]">
                CPT: {test.cpt_codes.join(', ')}
              </span>
              <button
                onClick={copyCpt}
                className="flex items-center gap-1.5 rounded-lg border border-[#e0ebe9] bg-white px-3 py-1.5 text-xs font-medium text-[#4a6b67] transition-colors hover:border-[#2d6a5e] hover:text-[#1a2e2b]"
              >
                {copiedCpt ? (
                  <>
                    <svg className="h-3.5 w-3.5 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy CPT
                  </>
                )}
              </button>
            </div>
          )}

          {test.category && (
            <span className="mt-3 inline-block rounded-full bg-[#e0ebe9] px-3 py-1 text-xs font-medium text-[#2d6a5e]">
              {CATEGORY_LABELS[test.category] || test.category}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mt-8 rounded-xl border border-[#e0ebe9] bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">What This Test Measures</h2>
          <p className="mt-3 leading-relaxed text-[#1a2e2b]">{test.description}</p>
        </div>

        {/* Fasting & Timing */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e0ebe9] bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">Preparation</h2>
            <div className="mt-3 flex items-center gap-2">
              {test.fasting_required ? (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50">
                    <svg className="h-3.5 w-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                  </span>
                  <span className="text-sm text-[#1a2e2b]">Fasting required (8-12 hours)</span>
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
                    <svg className="h-3.5 w-3.5 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-sm text-[#1a2e2b]">No fasting required</span>
                </>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-[#e0ebe9] bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">Turnaround Time</h2>
            <p className="mt-3 text-sm text-[#1a2e2b]">{test.turnaround || 'Varies by lab'}</p>
          </div>
        </div>

        {/* Clinical Notes */}
        {test.notes && (
          <div className="mt-6 rounded-xl border border-[#e0ebe9] bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">Clinical Notes</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4a6b67]">{test.notes}</p>
          </div>
        )}

        {/* ICD-10 Codes */}
        {icd10Codes.length > 0 && (
          <div className="mt-6 rounded-xl border border-[#e0ebe9] bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">
              ICD-10 Codes
            </h2>
            <p className="mt-1 text-xs text-[#6b8c88]">
              Common diagnosis codes associated with this test. Codes are assigned by your provider.
            </p>
            <div className="mt-4 space-y-2">
              {icd10Codes.map((code) => (
                <div
                  key={code.id}
                  className="flex items-start gap-3 rounded-lg bg-[#faf8f5] px-4 py-3"
                >
                  <span className="shrink-0 font-mono text-sm font-semibold text-[#2d6a5e]">
                    {code.code}
                  </span>
                  <span className="text-sm text-[#1a2e2b]">{code.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Self-Pay Pricing */}
        <div className="mt-6 rounded-xl border border-[#e0ebe9] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">
              Self-Pay Pricing
            </h2>
            {pricing.length === 0 && (
              <span className="rounded-full bg-[#e0ebe9] px-2.5 py-0.5 text-xs font-medium text-[#2d6a5e]">
                Coming Soon
              </span>
            )}
          </div>

          {isRestricted ? (
            <div className="mt-4">
              <StateRestrictionBanner />
            </div>
          ) : pricing.length > 0 ? (
            <>
              <p className="mt-1 text-[11px] text-[#6b8c88]">
                LabLooker may earn a commission through lab links. This does not affect pricing or rankings.
              </p>
              <div className="mt-4 space-y-2">
                {pricing.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-[#faf8f5] border border-[#e0ebe9] px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-[#1a2e2b]">{p.lab_name}</span>
                      {p.notes && (
                        <p className="text-[11px] text-[#6b8c88] mt-0.5">{p.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-sm font-semibold text-[#1a2e2b]">
                        ${Number(p.price).toFixed(2)}
                      </span>
                      {p.website && (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-[#2d6a5e] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#245549]"
                        >
                          Order
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-xs text-[#6b8c88]">
                Price comparison across labs will be available soon. Here are the labs we&apos;ll cover:
              </p>
              <p className="mt-1 text-[11px] text-[#6b8c88]">
                LabLooker may earn a commission through lab links. This does not affect pricing or rankings.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {PLACEHOLDER_LABS.map((lab) => (
                  <div
                    key={lab}
                    className="flex items-center justify-between rounded-lg bg-[#faf8f5] border border-[#e0ebe9] px-4 py-3"
                  >
                    <span className="text-sm text-[#1a2e2b]">{lab}</span>
                    <span className="text-xs text-[#6b8c88]">--</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {!userState && (
            <button
              onClick={() => setShowStatePicker(true)}
              className="mt-3 text-xs text-[#6b8c88] underline hover:text-[#2d6a5e]"
            >
              Set your state to check DTC availability
            </button>
          )}
        </div>

        {/* Lab Codes */}
        {labCodes.length > 0 && (
          <div className="mt-6 rounded-xl border border-[#e0ebe9] bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">Lab Codes</h2>
            <p className="mt-1 text-xs text-[#6b8c88]">Proprietary codes used by each lab for this test.</p>
            <div className="mt-4 space-y-2">
              {labCodes.map((lc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-[#faf8f5] px-4 py-3"
                >
                  <span className="text-sm text-[#1a2e2b]">{lc.lab_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-[#2d6a5e]">{lc.proprietary_code}</span>
                    {lc.code_type && (
                      <span className="text-[11px] text-[#6b8c88]">({lc.code_type})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Request Template */}
        <div className="mt-6 rounded-xl border border-[#2d6a5e]/20 bg-[#2d6a5e]/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2d6a5e]/10">
              <svg className="h-5 w-5 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1a2e2b]">Generate Doctor Request Template</h3>
              <p className="mt-1 text-sm text-[#4a6b67]">
                Get a pre-filled template with test name, CPT code, and ICD-10 codes to bring to your appointment.
              </p>
              <Button href="/signup" size="sm" className="mt-4">
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>

        {/* Related Tests */}
        {relatedTests.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">Related Tests</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedTests.map((rt) => (
                <Link
                  key={rt.id}
                  href={`/search/${rt.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-[#e0ebe9] bg-white p-4 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a2e2b] group-hover:text-[#2d6a5e] truncate">
                      {rt.test_name}
                    </p>
                    {rt.cpt_codes.length > 0 && (
                      <p className="text-xs font-mono text-[#6b8c88]">CPT: {rt.cpt_codes.join(', ')}</p>
                    )}
                  </div>
                  <svg className="h-4 w-4 shrink-0 text-[#6b8c88] group-hover:text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">For informational purposes only</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-700">
                This page is for educational and research purposes only and does not constitute medical advice,
                diagnosis, or treatment recommendations. ICD-10 and CPT codes are assigned by your healthcare
                provider. Always consult a qualified healthcare provider before ordering any lab test or making
                decisions about your health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
