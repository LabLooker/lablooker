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
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Search Lab Tests
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Find any lab test by name, CPT code, or symptom. Free, no account required.
          </p>
        </div>

        {/* Search bar */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
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
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-4 pl-12 pr-4 text-white placeholder-zinc-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSelectedSymptom(null); setCategoryFilter(null) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-6 flex max-w-2xl justify-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
          <button
            onClick={() => { setTab('tests'); setSelectedSymptom(null) }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'tests'
                ? 'bg-primary-500 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tests {!loading && <span className="ml-1 text-xs opacity-70">({tests.length})</span>}
          </button>
          <button
            onClick={() => { setTab('symptoms'); setCategoryFilter(null) }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'symptoms'
                ? 'bg-primary-500 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Symptoms {!loading && <span className="ml-1 text-xs opacity-70">({symptoms.length})</span>}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-primary-500" />
            <p className="mt-4 text-sm text-zinc-500">Loading tests...</p>
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
                    ? 'bg-primary-500 text-white'
                    : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
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
                      ? 'bg-primary-500 text-white'
                      : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="mt-6 text-center text-sm text-zinc-500">
              {filteredTests.length === tests.length
                ? `${tests.length} tests available`
                : `${filteredTests.length} of ${tests.length} tests`}
            </p>

            {/* Test cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="mt-16 text-center">
                <p className="text-lg text-zinc-400">No tests found.</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Try a different search term or browse symptoms.
                </p>
              </div>
            )}
          </>
        )}

        {/* Symptoms tab */}
        {!loading && tab === 'symptoms' && !selectedSymptom && (
          <>
            <p className="mt-6 text-center text-sm text-zinc-500">
              Select a symptom to see commonly ordered lab tests.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => handleSymptomSelect(symptom)}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-left transition-all duration-200 hover:border-primary-500/30 hover:bg-primary-500/5"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-400">
                    {symptom.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    {symptom.related_test_ids.length} related tests
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {symptom.keywords.slice(0, 4).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
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
                <p className="text-lg text-zinc-400">No matching symptoms found.</p>
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
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to symptoms
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h2 className="text-2xl font-bold text-white">{selectedSymptom.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">
                {symptomTests.length} tests commonly associated with this symptom
              </p>
            </div>

            {/* Persistent medical disclaimer banner */}
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-300">Not medical advice</p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-200/70">
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
              <div className="mt-8 text-center text-sm text-zinc-500">
                No tests mapped to this symptom yet.
              </div>
            )}
          </>
        )}

        {/* Red-flag symptom interstitial */}
        {redFlagSymptom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-lg rounded-2xl border border-red-500/30 bg-zinc-900 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Important Safety Notice</h3>
              </div>

              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
                <p className="text-base font-semibold text-red-300">
                  If you are experiencing {redFlagSymptom.name.toLowerCase()}, please seek immediate medical attention.
                </p>
                <p className="mt-3 text-2xl font-bold text-white">
                  Call 911 or go to your nearest emergency room.
                </p>
                <p className="mt-3 text-sm text-red-200/70">
                  This symptom may indicate a medical emergency. Do not delay seeking care to research lab tests.
                </p>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                LabLooker is an educational research tool, not a substitute for emergency medical care.
                The information on the following page is for research purposes only and is not a diagnosis or treatment plan.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setRedFlagSymptom(null)}
                  className="flex-1 rounded-lg border border-zinc-600 px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
                >
                  Go Back
                </button>
                <button
                  onClick={acknowledgeRedFlag}
                  className="flex-1 rounded-lg bg-zinc-700 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
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

function TestCard({ test }: { test: Test }) {
  return (
    <Link
      href={`/search/${test.id}`}
      className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:border-primary-500/30 hover:bg-primary-500/5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-white group-hover:text-primary-400">
          {test.test_name}
        </h3>
        {test.fasting_required && (
          <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
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
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {test.description}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        {test.category && (
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
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
