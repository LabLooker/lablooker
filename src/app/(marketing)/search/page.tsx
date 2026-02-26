'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Test, Symptom } from '@/types/database'

// Symptoms that should trigger a red-flag 911 interstitial
const RED_FLAG_KEYWORDS = [
  'chest pain', 'chest tightness', 'heart attack',
  'difficulty breathing', 'shortness of breath', 'can\'t breathe', 'trouble breathing',
  'vision loss', 'sudden vision', 'loss of vision', 'blind',
  'stroke', 'numbness', 'paralysis', 'slurred speech',
  'severe bleeding', 'coughing blood', 'vomiting blood',
  'suicidal', 'suicide', 'self-harm',
  'seizure', 'convulsions',
  'severe allergic', 'anaphylaxis',
  'loss of consciousness', 'fainting', 'unconscious',
]

function isRedFlagSymptom(symptom: Symptom): boolean {
  const name = symptom.name.toLowerCase()
  const keywords = symptom.keywords.map((k) => k.toLowerCase())
  return RED_FLAG_KEYWORDS.some(
    (flag) => name.includes(flag) || keywords.some((k) => k.includes(flag))
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  thyroid: 'Thyroid',
  hormones: 'Hormones',
  iron_blood: 'Iron & Blood',
  hematology: 'Hematology',
  iron: 'Iron',
  coagulation: 'Coagulation',
  metabolic: 'Metabolic',
  lipids: 'Lipids',
  cardiovascular: 'Cardiovascular',
  vitamins: 'Vitamins',
  vitamins_minerals: 'Vitamins & Minerals',
  minerals: 'Minerals',
  kidney: 'Kidney',
  kidney_liver: 'Kidney & Liver',
  liver: 'Liver',
  inflammation: 'Inflammation',
  immune: 'Immune',
  autoimmune: 'Autoimmune',
  autoimmune_gi: 'Autoimmune / GI',
  infectious: 'Infectious Disease',
  cancer: 'Cancer Markers',
  cancer_screening: 'Cancer Screening',
  genetics: 'Genetics',
  allergy: 'Allergy',
  gi_digestive: 'GI & Digestive',
  nutrition: 'Nutrition',
  drug_monitoring: 'Drug Monitoring',
  pregnancy: 'Pregnancy & Fertility',
  pediatric: 'Pediatric',
  mental_health: 'Mental Health',
  longevity: 'Longevity',
  cardiac: 'Cardiac',
}

export default function SearchPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'tests' | 'symptoms'>('tests')
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [redFlagSymptom, setRedFlagSymptom] = useState<Symptom | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  function handleSymptomSelect(symptom: Symptom) {
    if (isRedFlagSymptom(symptom)) {
      setRedFlagSymptom(symptom)
    } else {
      setSelectedSymptom(symptom)
    }
  }

  function acknowledgeRedFlag() {
    if (redFlagSymptom) {
      setSelectedSymptom(redFlagSymptom)
      setRedFlagSymptom(null)
    }
  }

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

  const filteredTests = useMemo(() => {
    let result = tests
    if (categoryFilter) {
      result = result.filter((t) => t.category === categoryFilter)
    }
    if (!query.trim()) return result
    const q = query.toLowerCase()
    return result.filter(
      (t) =>
        t.test_name.toLowerCase().includes(q) ||
        t.cpt_codes.some((c) => c.includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
    )
  }, [tests, query, categoryFilter])

  const symptomTests = useMemo(() => {
    if (!selectedSymptom) return []
    return tests.filter((t) => selectedSymptom.related_test_ids.includes(t.id))
  }, [selectedSymptom, tests])

  const filteredSymptoms = useMemo(() => {
    if (!query.trim()) return symptoms
    const q = query.toLowerCase()
    return symptoms.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.toLowerCase().includes(q))
    )
  }, [symptoms, query])

  return (
    <section className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1a2e2b] sm:text-5xl">
            Search Lab Tests
          </h1>
          <p className="mt-4 text-lg text-[#6b8c88]">
            Find any lab test by name, CPT code, or symptom. Free, no account required.
          </p>
        </div>

        {/* Search bar */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b8c88]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedSymptom(null)
              }}
              placeholder="Search by test name, CPT code, or symptom..."
              className="w-full rounded-xl border border-[#e0ebe9] bg-white py-4 pl-12 pr-4 text-[#1a2e2b] placeholder-[#6b8c88] transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSelectedSymptom(null); setCategoryFilter(null) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8c88] hover:text-[#1a2e2b]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-6 flex max-w-2xl justify-center gap-1 rounded-lg border border-[#e0ebe9] bg-white p-1">
          <button
            onClick={() => { setTab('tests'); setSelectedSymptom(null) }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'tests'
                ? 'bg-primary-500 text-[#1a2e2b]'
                : 'text-[#6b8c88] hover:text-[#1a2e2b]'
            }`}
          >
            Tests {!loading && <span className="ml-1 text-xs opacity-70">({tests.length})</span>}
          </button>
          <button
            onClick={() => { setTab('symptoms'); setCategoryFilter(null) }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'symptoms'
                ? 'bg-primary-500 text-[#1a2e2b]'
                : 'text-[#6b8c88] hover:text-[#1a2e2b]'
            }`}
          >
            Symptoms {!loading && <span className="ml-1 text-xs opacity-70">({symptoms.length})</span>}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-primary-500" />
            <p className="mt-4 text-sm text-[#6b8c88]">Loading tests...</p>
          </div>
        )}

        {/* Tests tab */}
        {!loading && tab === 'tests' && (
          <>
            {/* Category filter pills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  !categoryFilter
                    ? 'bg-primary-500 text-[#1a2e2b]'
                    : 'border border-[#e0ebe9] text-[#6b8c88] hover:border-[#2d6a5e] hover:text-[#1a2e2b]'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-primary-500 text-[#1a2e2b]'
                      : 'border border-[#e0ebe9] text-[#6b8c88] hover:border-[#2d6a5e] hover:text-[#1a2e2b]'
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>

            {/* Results count + view toggle */}
            <div className="mt-6 flex items-center justify-between mx-auto max-w-5xl">
              <p className="text-sm text-[#6b8c88]">
                {filteredTests.length === tests.length
                  ? `${tests.length} tests available`
                  : `${filteredTests.length} of ${tests.length} tests`}
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

            {/* Test results */}
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

            {filteredTests.length === 0 && (
              <div className="mt-16 text-center">
                <p className="text-lg text-[#6b8c88]">No tests found.</p>
                <p className="mt-2 text-sm text-[#6b8c88]">
                  Try a different search term or browse symptoms.
                </p>
              </div>
            )}
          </>
        )}

        {/* Symptoms tab */}
        {!loading && tab === 'symptoms' && !selectedSymptom && (
          <>
            <p className="mt-6 text-center text-sm text-[#6b8c88]">
              Select a symptom to see commonly ordered lab tests.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => handleSymptomSelect(symptom)}
                  className="group rounded-xl border border-[#e0ebe9] bg-white p-6 text-left transition-all duration-200 hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
                >
                  <h3 className="text-lg font-semibold text-[#1a2e2b] group-hover:text-primary-400">
                    {symptom.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#6b8c88]">
                    {symptom.related_test_ids.length} related tests
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {symptom.keywords.slice(0, 4).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-[#e0ebe9] px-2 py-0.5 text-xs text-[#6b8c88]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {filteredSymptoms.length === 0 && (
              <div className="mt-16 text-center">
                <p className="text-lg text-[#6b8c88]">No matching symptoms found.</p>
              </div>
            )}
          </>
        )}

        {/* Symptom detail view */}
        {!loading && tab === 'symptoms' && selectedSymptom && (
          <>
            <div className="mt-6">
              <button
                onClick={() => setSelectedSymptom(null)}
                className="flex items-center gap-2 text-sm text-[#6b8c88] hover:text-[#1a2e2b]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to symptoms
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-[#e0ebe9] bg-white p-6">
              <h2 className="text-2xl font-bold text-[#1a2e2b]">{selectedSymptom.name}</h2>
              <p className="mt-2 text-sm text-[#6b8c88]">
                {symptomTests.length} tests commonly associated with this symptom
              </p>
            </div>

            {/* Persistent medical disclaimer banner */}
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-700">Not medical advice</p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-600">
                    These tests are commonly ordered by healthcare providers for patients reporting this symptom.
                    This list is for informational and research purposes only and does not constitute medical advice,
                    diagnosis, or treatment recommendations. Always consult a qualified healthcare provider about
                    which tests are appropriate for your situation.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {symptomTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
            {symptomTests.length === 0 && (
              <div className="mt-8 text-center text-sm text-[#6b8c88]">
                No tests mapped to this symptom yet.
              </div>
            )}
          </>
        )}

        {/* Red-flag symptom interstitial */}
        {redFlagSymptom && (
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

              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-base font-semibold text-red-700">
                  If you are experiencing {redFlagSymptom.name.toLowerCase()}, please seek immediate medical attention.
                </p>
                <p className="mt-3 text-2xl font-bold text-[#1a2e2b]">
                  Call 911 or go to your nearest emergency room.
                </p>
                <p className="mt-3 text-sm text-red-600">
                  This symptom may indicate a medical emergency. Do not delay seeking care to research lab tests.
                </p>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-[#6b8c88]">
                LabLooker is an educational research tool, not a substitute for emergency medical care.
                The information on the following page is for research purposes only and is not a diagnosis or treatment plan.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setRedFlagSymptom(null)}
                  className="flex-1 rounded-lg border border-[#e0ebe9] px-4 py-3 text-sm font-medium text-[#4a6b67] transition-colors hover:border-[#2d6a5e] hover:text-[#1a2e2b]"
                >
                  Go Back
                </button>
                <button
                  onClick={acknowledgeRedFlag}
                  className="flex-1 rounded-lg bg-[#2d6a5e] px-4 py-3 text-sm font-medium text-[#4a6b67] transition-colors hover:bg-[#245649]"
                >
                  I understand — show research info
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
          <span className="rounded-full bg-[#f0f7f6] border border-[#e0ebe9] px-2.5 py-0.5 text-[10px] font-medium text-[#2d6a5e]">
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
        <h3 className="text-sm font-semibold text-[#1a2e2b] group-hover:text-primary-400">
          {test.test_name}
        </h3>
        {test.fasting_required && (
          <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
            Fasting
          </span>
        )}
      </div>
      {test.cpt_codes.length > 0 && (
        <p className="mt-1 text-xs font-mono text-primary-400/80">
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
        <span className="text-xs font-medium text-primary-400 opacity-0 transition-opacity group-hover:opacity-100">
          View Details →
        </span>
      </div>
    </Link>
  )
}
