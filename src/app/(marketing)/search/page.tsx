'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Test, Symptom } from '@/types/database'

type RedFlagGroup = {
  keywords: string[]
  resource: { label: string; url: string }
}

const RED_FLAG_GROUPS: RedFlagGroup[] = [
  {
    keywords: ['chest pain', 'chest tightness', 'heart attack'],
    resource: { label: 'Learn warning signs — American Heart Association', url: 'https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack' },
  },
  {
    keywords: ['stroke', 'numbness', 'paralysis', 'slurred speech'],
    resource: { label: 'Stroke warning signs — American Stroke Association', url: 'https://www.stroke.org/en/about-stroke/stroke-symptoms' },
  },
  {
    keywords: ['difficulty breathing', 'shortness of breath', 'can\'t breathe', 'trouble breathing'],
    resource: { label: 'When to seek emergency care — American Lung Association', url: 'https://www.lung.org/lung-health-diseases/warning-signs-of-lung-disease/shortness-of-breath/symptoms-diagnosis' },
  },
  {
    keywords: ['suicidal', 'suicide', 'self-harm'],
    resource: { label: 'Call or text 988 — Suicide & Crisis Lifeline', url: 'https://988lifeline.org/' },
  },
  {
    keywords: ['seizure', 'convulsions'],
    resource: { label: 'Seizure first aid — Epilepsy Foundation', url: 'https://www.epilepsy.com/first-aid/seizure-first-aid' },
  },
  {
    keywords: ['severe allergic', 'anaphylaxis'],
    resource: { label: 'Anaphylaxis emergency — ACAAI', url: 'https://acaai.org/allergies/allergic-conditions/anaphylaxis/' },
  },
  {
    keywords: ['severe bleeding', 'coughing blood', 'vomiting blood'],
    resource: { label: 'When bleeding is an emergency — Red Cross', url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/bleeding.html' },
  },
  {
    keywords: ['vision loss', 'sudden vision', 'loss of vision', 'blind'],
    resource: { label: 'Sudden vision loss — American Academy of Ophthalmology', url: 'https://www.aao.org/eye-health/symptoms/sudden-vision-loss' },
  },
  {
    keywords: ['loss of consciousness', 'fainting', 'unconscious'],
    resource: { label: 'Fainting — when to call 911 — Mayo Clinic', url: 'https://www.mayoclinic.org/first-aid/first-aid-fainting/basics/art-20056606' },
  },
]

function getRedFlagMatch(query: string): RedFlagGroup | null {
  const q = query.toLowerCase().trim()
  if (!q) return null
  return RED_FLAG_GROUPS.find((group) =>
    group.keywords.some((kw) => q.includes(kw))
  ) || null
}

function isRedFlagQuery(query: string): boolean {
  return getRedFlagMatch(query) !== null
}

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

const HEALTH_TOPICS = [
  { icon: '🦋', label: 'Thyroid & Endocrine', categories: ['thyroid', 'hormones'] },
  { icon: '❤️', label: 'Heart & Cholesterol', categories: ['cardiovascular', 'lipids', 'cardiac'] },
  { icon: '💪', label: 'Testosterone & TRT', searchQuery: 'testosterone' },
  { icon: '🌸', label: 'Menopause & BHRT', searchQuery: 'estradiol progesterone FSH LH DHEA' },
  { icon: '🔥', label: 'Inflammation & Autoimmune', categories: ['inflammation', 'autoimmune', 'autoimmune_gi'] },
  { icon: '⚖️', label: 'Weight & Metabolism', categories: ['metabolic'] },
  { icon: '🩸', label: 'Iron & Anemia', categories: ['iron', 'iron_blood', 'hematology'] },
  { icon: '💊', label: 'Vitamins & Minerals', categories: ['vitamins', 'vitamins_minerals', 'minerals'] },
  { icon: '🧠', label: 'Mood & Mental Health', searchQuery: 'cortisol DHEA serotonin B12 folate thyroid' },
  { icon: '🍬', label: 'Diabetes & Blood Sugar', searchQuery: 'glucose A1c insulin' },
  { icon: '🫘', label: 'Kidney & Liver', categories: ['kidney', 'liver', 'kidney_liver'] },
  { icon: '🛡️', label: 'Immune & Infections', categories: ['immune', 'infectious'] },
]

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-28 pb-20 sm:pt-36 text-center"><p className="text-[#6b8c88]">Loading...</p></div>}>
      <SearchPageInner />
    </Suspense>
  )
}

function SearchPageInner() {
  const searchParams = useSearchParams()
  const [tests, setTests] = useState<Test[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string[] | null>(null)
  const [redFlagDismissed, setRedFlagDismissed] = useState(false)
  const [redFlagTriggered, setRedFlagTriggered] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [testsRes, symptomsRes] = await Promise.all([
        supabase.from('tests').select('*').order('test_name'),
        supabase.from('symptoms').select('*').order('name'),
      ])
      if (testsRes.data) setTests(testsRes.data)
      if (symptomsRes.data) setSymptoms(symptomsRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(tests.map((t) => t.category).filter(Boolean))
    return Array.from(cats).sort() as string[]
  }, [tests])

  // Show red flag only after explicit submit
  const showRedFlag = redFlagTriggered && !redFlagDismissed

  // Reset flags when query changes
  useEffect(() => {
    setRedFlagDismissed(false)
    setRedFlagTriggered(false)
  }, [query])

  const redFlagMatch = useMemo(() => getRedFlagMatch(query), [query])

  function handleSearchSubmit() {
    if (isRedFlagQuery(query)) {
      setRedFlagTriggered(true)
    }
  }

  // Filter tests
  const filteredTests = useMemo(() => {
    let result = tests
    if (categoryFilter && categoryFilter.length > 0) {
      result = result.filter((t) => t.category && categoryFilter.includes(t.category))
    }
    if (!query.trim()) return result
    const q = query.toLowerCase()
    const words = q.split(/\s+/).filter(Boolean)
    return result.filter(
      (t) =>
        words.every(w => t.test_name.toLowerCase().includes(w)) ||
        t.cpt_codes.some((c) => c.includes(q)) ||
        (t.description && words.every(w => t.description!.toLowerCase().includes(w))) ||
        (t.category && t.category.toLowerCase().includes(q))
    )
  }, [tests, query, categoryFilter])

  // Match symptoms to query
  const matchedSymptoms = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return symptoms.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.toLowerCase().includes(q))
    )
  }, [symptoms, query])

  // Get related tests for matched symptoms (deduplicated)
  const symptomTests = useMemo(() => {
    if (matchedSymptoms.length === 0) return []
    const testIds = new Set<string>()
    matchedSymptoms.forEach((s) => s.related_test_ids.forEach((id) => testIds.add(id)))
    return tests.filter((t) => testIds.has(t.id))
  }, [matchedSymptoms, tests])

  return (
    <section className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1a2e2b] sm:text-5xl">
            Search Lab Tests
          </h1>
          <p className="mt-4 text-lg text-[#6b8c88]">
            Search by test name, CPT code, symptom, or lab code. Free, no account required.
          </p>
        </div>

        {/* Search bar */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b8c88]"
              fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setCategoryFilter(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit()
              }}
              placeholder="Search tests, CPT codes, or symptoms..."
              className="w-full rounded-xl border-[2.5px] border-[#2d6a5e] bg-white py-4 pl-12 pr-4 text-[#1a2e2b] placeholder-[#6b8c88] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/30"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setCategoryFilter(null) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8c88] hover:text-[#1a2e2b]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
            <p className="mt-4 text-sm text-[#6b8c88]">Loading tests...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Health topic cards — show when browsing (no query and no category selected) */}
            {!query.trim() && !categoryFilter && (
              <div className="mt-8 mx-auto max-w-4xl">
                <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-[#6b8c88] mb-4">Lab Tests by Health Topic</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {HEALTH_TOPICS.map((topic) => (
                    <button
                      key={topic.label}
                      onClick={() => {
                        if (topic.categories) {
                          setCategoryFilter(topic.categories)
                        } else if (topic.searchQuery) {
                          setQuery(topic.searchQuery)
                        }
                      }}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-[#e0ebe9] bg-white p-4 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
                    >
                      <span className="text-2xl">{topic.icon}</span>
                      <span className="text-sm font-medium text-[#1a2e2b] group-hover:text-[#2d6a5e] text-center leading-tight">{topic.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-1 border-t border-[#e0ebe9]" />
                  <span className="text-xs text-[#6b8c88]">or browse all {tests.length} tests below</span>
                  <div className="flex-1 border-t border-[#e0ebe9]" />
                </div>
              </div>
            )}

            {/* Category back button — show when a category is active */}
            {!query.trim() && categoryFilter && categoryFilter.length > 0 && (
              <div className="mt-6 mx-auto max-w-5xl">
                <button
                  onClick={() => setCategoryFilter(null)}
                  className="flex items-center gap-2 text-sm text-[#6b8c88] hover:text-[#2d6a5e] transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  Back to all topics
                </button>
              </div>
            )}

            {/* Results count + view toggle */}
            <div className="mt-6 flex items-center justify-between mx-auto max-w-5xl">
              <p className="text-sm text-[#6b8c88]">
                {query.trim() ? (
                  <>
                    {matchedSymptoms.length > 0 && `${matchedSymptoms.length} symptom match${matchedSymptoms.length !== 1 ? 'es' : ''} · `}
                    {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found
                  </>
                ) : (
                  `${filteredTests.length} tests available`
                )}
              </p>
              <div className="flex items-center gap-1 rounded-lg border border-[#e0ebe9] bg-white p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-md p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#2d6a5e] text-white' : 'text-[#6b8c88] hover:text-[#1a2e2b]'}`}
                  title="List view"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#2d6a5e] text-white' : 'text-[#6b8c88] hover:text-[#1a2e2b]'}`}
                  title="Grid view"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Symptom matches — show above test results */}
            {query.trim() && matchedSymptoms.length > 0 && !showRedFlag && (
              <div className="mt-6 mx-auto max-w-5xl">
                {matchedSymptoms.map((symptom) => (
                  <div key={symptom.id} className="mb-6">
                    {/* Symptom header */}
                    <div className="rounded-t-xl border border-[#e0ebe9] bg-white p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2d6a5e]/10">
                          <svg className="h-4 w-4 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1a2e2b]">
                            Symptom match: {symptom.name}
                          </h3>
                          <p className="text-xs text-[#6b8c88]">
                            {symptom.related_test_ids.length} commonly ordered tests
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="border-x border-[#e0ebe9] bg-amber-50 px-5 py-3">
                      <p className="text-xs text-amber-700">
                        ⚠️ These tests are commonly associated with this symptom. This is not medical advice — always consult your healthcare provider.
                      </p>
                    </div>

                    {/* Related tests */}
                    <div className="rounded-b-xl border border-t-0 border-[#e0ebe9] bg-[#faf8f5] p-4">
                      <div className="flex flex-col gap-2">
                        {tests.filter((t) => symptom.related_test_ids.includes(t.id)).map((test) => (
                          <Link
                            key={test.id}
                            href={`/search/${test.id}`}
                            className="group flex items-center gap-4 rounded-lg bg-white border border-[#e0ebe9] px-4 py-3 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-[#1a2e2b] group-hover:text-[#2d6a5e] truncate">
                                {test.test_name}
                              </h4>
                              {test.cpt_codes.length > 0 && (
                                <span className="text-xs font-mono text-[#6b8c88]">CPT: {test.cpt_codes[0]}</span>
                              )}
                            </div>
                            <svg className="h-4 w-4 shrink-0 text-[#6b8c88] group-hover:text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Divider if both symptoms and tests match */}
                {filteredTests.length > 0 && (
                  <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 border-t border-[#e0ebe9]" />
                    <span className="text-xs text-[#6b8c88]">Test results</span>
                    <div className="flex-1 border-t border-[#e0ebe9]" />
                  </div>
                )}
              </div>
            )}

            {/* Test results */}
            {!showRedFlag && (
              <>
                {viewMode === 'grid' ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTests.map((test) => (
                      <TestCard key={test.id} test={test} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 mx-auto max-w-5xl flex flex-col gap-2">
                    {filteredTests.map((test) => (
                      <TestListItem key={test.id} test={test} />
                    ))}
                  </div>
                )}

                {filteredTests.length === 0 && matchedSymptoms.length === 0 && (
                  <div className="mt-16 text-center">
                    <p className="text-lg text-[#6b8c88]">No results found.</p>
                    <p className="mt-2 text-sm text-[#6b8c88]">
                      Try a different search term or browse by category.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Red-flag interstitial */}
        {showRedFlag && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2e2b]/70 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1a2e2b]">Important Safety Notice</h3>
              </div>

              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center">
                <p className="text-2xl font-bold text-[#1a2e2b]">
                  If this is an emergency, call 911.
                </p>
                <p className="mt-3 text-sm text-red-700">
                  These symptoms may indicate a medical emergency. Do not delay seeking care.
                </p>
              </div>

              {redFlagMatch && (
                <a
                  href={redFlagMatch.resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-4 py-3 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#e0ebe9]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {redFlagMatch.resource.label}
                </a>
              )}

              <p className="mt-4 text-xs leading-relaxed text-[#6b8c88]">
                LabLooker is a research tool, not a substitute for emergency medical care.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => { setQuery(''); setRedFlagTriggered(false); setRedFlagDismissed(false) }}
                  className="flex-1 rounded-lg border border-[#e0ebe9] px-4 py-3 text-sm font-medium text-[#4a6b67] transition-colors hover:border-[#2d6a5e] hover:text-[#1a2e2b]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setRedFlagDismissed(true)}
                  className="flex-1 rounded-lg bg-[#4a6b67] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3d5a56]"
                >
                  Continue to search results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function TestListItem({ test }: { test: Test }) {
  return (
    <Link
      href={`/search/${test.id}`}
      className="group flex items-center gap-4 rounded-lg border border-[#e0ebe9] bg-white px-5 py-4 transition-all duration-200 hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#2d6a5e] truncate">
            {test.test_name}
          </h3>
          {test.fasting_required && (
            <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              Fasting
            </span>
          )}
        </div>
        {test.description && (
          <p className="mt-1 text-xs leading-relaxed text-[#6b8c88] line-clamp-1">
            {test.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {test.cpt_codes.length > 0 && (
          <span className="text-xs font-mono text-[#2d6a5e]/70">
            {test.cpt_codes[0]}
          </span>
        )}
        {test.category && (
          <span className="hidden sm:inline-block rounded-full bg-[#f0f7f6] border border-[#e0ebe9] px-2.5 py-0.5 text-[10px] font-medium text-[#2d6a5e]">
            {CATEGORY_LABELS[test.category] || test.category}
          </span>
        )}
        <svg className="h-4 w-4 text-[#6b8c88] group-hover:text-[#2d6a5e] transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  )
}

function TestCard({ test }: { test: Test }) {
  return (
    <Link
      href={`/search/${test.id}`}
      className="group rounded-xl border border-[#e0ebe9] bg-white p-6 transition-all duration-200 hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#2d6a5e]">
          {test.test_name}
        </h3>
        {test.fasting_required && (
          <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
            Fasting
          </span>
        )}
      </div>
      {test.cpt_codes.length > 0 && (
        <p className="mt-1 text-xs font-mono text-[#2d6a5e]/70">
          CPT: {test.cpt_codes.join(', ')}
        </p>
      )}
      {test.description && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6b8c88]">
          {test.description}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        {test.category && (
          <span className="rounded-full bg-[#e0ebe9] px-2 py-0.5 text-xs text-[#6b8c88]">
            {CATEGORY_LABELS[test.category] || test.category}
          </span>
        )}
        <span className="text-xs font-medium text-[#2d6a5e] opacity-0 transition-opacity group-hover:opacity-100">
          View Details →
        </span>
      </div>
    </Link>
  )
}
