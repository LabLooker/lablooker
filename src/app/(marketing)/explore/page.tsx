'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Test, Symptom } from '@/types/database'

// ── Static symptom categories for the browsing UI ──────────────────────────
const SYMPTOM_CATEGORIES = [
  {
    label: 'Energy & Fatigue',
    icon: '⚡',
    slugs: ['fatigue', 'brain-fog', 'low-energy', 'poor-sleep', 'weakness'],
  },
  {
    label: 'Thyroid',
    icon: '🦋',
    slugs: ['weight-gain', 'feeling-cold', 'hair-loss', 'brain-fog', 'constipation', 'palpitations', 'anxiety', 'weight-loss'],
  },
  {
    label: 'Hormones',
    icon: '⚖️',
    slugs: ['low-libido', 'mood-swings', 'irregular-periods', 'hot-flashes', 'night-sweats', 'low-testosterone', 'infertility'],
  },
  {
    label: 'Mood & Mental Health',
    icon: '🧠',
    slugs: ['depression', 'anxiety', 'brain-fog', 'poor-sleep', 'irritability'],
  },
  {
    label: 'Metabolic & Blood Sugar',
    icon: '💪',
    slugs: ['weight-gain', 'sugar-cravings', 'frequent-urination', 'increased-thirst', 'blurred-vision', 'fatigue'],
  },
  {
    label: 'Heart & Cholesterol',
    icon: '❤️',
    slugs: ['chest-pain', 'shortness-of-breath', 'high-cholesterol', 'high-blood-pressure', 'leg-swelling'],
  },
  {
    label: 'Iron & Anemia',
    icon: '🩸',
    slugs: ['fatigue', 'pale-skin', 'shortness-of-breath', 'hair-loss', 'cold-hands-feet', 'brittle-nails'],
  },
  {
    label: 'Gut & Digestion',
    icon: '🫁',
    slugs: ['bloating', 'constipation', 'diarrhea', 'abdominal-pain', 'nausea', 'food-intolerances'],
  },
  {
    label: 'Vitamins & Minerals',
    icon: '💊',
    slugs: ['fatigue', 'brain-fog', 'muscle-cramps', 'bone-pain', 'tingling', 'hair-loss', 'brittle-nails'],
  },
  {
    label: 'Immune & Inflammation',
    icon: '🛡️',
    slugs: ['frequent-illness', 'joint-pain', 'rashes', 'swollen-lymph-nodes', 'autoimmune'],
  },
  {
    label: 'Sexual & Reproductive Health',
    icon: '🌺',
    slugs: ['low-libido', 'irregular-periods', 'infertility', 'std-screening', 'pelvic-pain'],
  },
  {
    label: 'Kidney & Liver',
    icon: '🫘',
    slugs: ['fatigue', 'swelling', 'frequent-urination', 'dark-urine', 'yellowing-skin', 'abdominal-pain'],
  },
]

// ── Health goals (condition-first entry points) ─────────────────────────────
const HEALTH_GOALS = [
  { label: 'Annual wellness check', icon: '📋', query: 'wellness' },
  { label: 'I started TRT / HRT', icon: '💉', query: 'trt monitoring' },
  { label: 'I feel tired all the time', icon: '😴', query: 'fatigue' },
  { label: 'Weight I can\'t lose', icon: '⚖️', query: 'weight metabolism' },
  { label: 'Thyroid symptoms', icon: '🦋', query: 'thyroid' },
  { label: 'Mood & brain fog', icon: '🧠', query: 'mood brain fog' },
  { label: 'STD / sexual health screening', icon: '🔒', query: 'sexual health std' },
  { label: 'Autoimmune workup', icon: '🛡️', query: 'autoimmune inflammation' },
  { label: 'Pre-pregnancy / fertility', icon: '🌸', query: 'fertility pregnancy' },
  { label: 'Longevity & preventive labs', icon: '🔬', query: 'longevity preventive' },
]

// ── How it works steps ──────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Describe what you\'re feeling',
    body: 'Search by symptom ("fatigue"), condition ("Hashimoto\'s"), or health goal ("I want to check my hormones").',
  },
  {
    step: '2',
    title: 'See the relevant tests',
    body: 'We match your input to a curated list of lab tests clinicians use to investigate those symptoms.',
  },
  {
    step: '3',
    title: 'Compare prices & order',
    body: 'Find the best self-pay price across direct labs, generate a request letter, or bring the list to your doctor.',
  },
]

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load all symptoms + tests once
  useEffect(() => {
    const supabase = createClient()
    async function load() {
      try {
        const [symptomsRes, testsRes] = await Promise.all([
          supabase.from('symptoms').select('id, name, keywords, description, related_test_ids').order('name'),
          supabase.from('tests').select('id, test_name, description, category, cpt_codes').order('test_name'),
        ])
        if (symptomsRes.data) setSymptoms(symptomsRes.data as Symptom[])
        if (testsRes.data) setTests(testsRes.data as Test[])
      } catch (e) {
        console.error('Explore load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Debounce query
  useEffect(() => {
    setSearching(true)
    const t = setTimeout(() => {
      setDebouncedQuery(query)
      setSearching(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Build a lookup map: test id → test object
  const testById = useMemo(() => {
    const map: Record<string, Test> = {}
    tests.forEach(t => { map[t.id] = t })
    return map
  }, [tests])

  // Search result: matching symptoms + their tests
  const searchResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return null

    // Find matching symptoms
    const matchingSymptoms = symptoms.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.keywords.some(k => k.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q))
    )

    // Collect unique test ids from all matching symptoms
    const testIdSet = new Set<string>()
    matchingSymptoms.forEach(s => {
      s.related_test_ids.forEach(id => testIdSet.add(id))
    })

    // Also do a direct test name match for anything not covered
    const directTestMatches = tests.filter(t =>
      t.test_name.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q))
    )
    directTestMatches.forEach(t => testIdSet.add(t.id))

    const resolvedTests = Array.from(testIdSet)
      .map(id => testById[id])
      .filter(Boolean)
      .sort((a, b) => a.test_name.localeCompare(b.test_name))

    return {
      symptoms: matchingSymptoms,
      tests: resolvedTests,
    }
  }, [debouncedQuery, symptoms, tests, testById])

  const hasResults = searchResults && (searchResults.symptoms.length > 0 || searchResults.tests.length > 0)
  const isSearching = query.trim().length > 0

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[1.5px] text-[#2d6a5e] mb-3">
            Explore Lab Tests
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e2b] leading-tight mb-4">
            Not sure which test to order?
          </h1>
          <p className="text-lg text-[#4a6b67] leading-relaxed mb-8">
            Describe your symptoms, condition, or health goal — we'll show you which lab tests are typically used to investigate it.
          </p>

          {/* Search bar */}
          <div className="relative">
            <div className="flex items-center rounded-xl border-2 border-[#2d6a5e] bg-white px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-[#2d6a5e]/20">
              <svg className="h-5 w-5 shrink-0 text-[#577572]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. fatigue, hair loss, thyroid, Hashimoto's..."
                className="ml-3 flex-1 bg-transparent text-[#1a2e2b] placeholder-[#577572] focus:outline-none text-base"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="ml-2 text-[#577572] hover:text-[#1a2e2b] transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-[#a0b8b4]">
            Not a diagnostic tool. LabLooker helps you research — always confirm with your doctor.
          </p>
        </div>
      </section>

      {/* ── Loading spinner ────────────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
          <p className="mt-4 text-sm text-[#577572]">Loading...</p>
        </div>
      )}

      {/* ── Search results ─────────────────────────────────────────────── */}
      {!loading && isSearching && (
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-3xl">

            {searching && (
              <div className="text-center py-6">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
              </div>
            )}

            {!searching && !hasResults && (
              <div className="text-center py-12">
                <p className="text-lg text-[#577572] mb-2">
                  No matches for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="text-sm text-[#a0b8b4] mb-6">
                  Try a different symptom, condition name, or body system.
                </p>
                <div className="inline-flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e0ebe9] bg-white px-4 py-2.5 text-sm font-medium text-[#1a2e2b] hover:border-[#2d6a5e]/40 hover:bg-[#f0f7f6] transition-all"
                  >
                    Search by test name instead →
                  </Link>
                  <Link
                    href="/bundles"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e0ebe9] bg-white px-4 py-2.5 text-sm font-medium text-[#1a2e2b] hover:border-[#2d6a5e]/40 hover:bg-[#f0f7f6] transition-all"
                  >
                    Browse curated panels →
                  </Link>
                </div>
              </div>
            )}

            {!searching && hasResults && (
              <>
                {/* Matched symptoms */}
                {searchResults!.symptoms.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#577572] mb-3">
                      Matching symptoms / conditions ({searchResults!.symptoms.length})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {searchResults!.symptoms.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setQuery(s.name)}
                          className="rounded-full border border-[#e0ebe9] bg-white px-4 py-1.5 text-sm font-medium text-[#1a2e2b] hover:border-[#2d6a5e] hover:text-[#2d6a5e] transition-colors"
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching tests */}
                {searchResults!.tests.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#577572] mb-3">
                      Relevant lab tests ({searchResults!.tests.length})
                    </h2>
                    <div className="flex flex-col gap-2">
                      {searchResults!.tests.map(test => (
                        <TestResultRow key={test.id} test={test} />
                      ))}
                    </div>

                    {/* Bottom actions */}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#2d6a5e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#245a50] transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        Search &ldquo;{debouncedQuery}&rdquo; in full database
                      </Link>
                      <Link
                        href="/compare"
                        className="inline-flex items-center gap-2 rounded-lg border border-[#e0ebe9] bg-white px-4 py-2.5 text-sm font-medium text-[#2d6a5e] hover:bg-[#f0f7f6] transition-colors"
                      >
                        Compare prices →
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Browse view (no active search) ────────────────────────────── */}
      {!loading && !isSearching && (
        <>
          {/* Start by goal */}
          <section className="px-4 pb-12">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#577572] text-center mb-5">
                Start with a health goal
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {HEALTH_GOALS.map(goal => (
                  <button
                    key={goal.query}
                    onClick={() => {
                      setQuery(goal.query)
                      inputRef.current?.focus()
                    }}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-[#e0ebe9] bg-white p-4 text-center transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5 cursor-pointer"
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-xs font-medium text-[#1a2e2b] leading-snug group-hover:text-[#2d6a5e]">
                      {goal.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Browse by symptom category */}
          <section className="px-4 pb-16" style={{ backgroundColor: '#f0f7f6' }}>
            <div className="mx-auto max-w-3xl py-12">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#577572] text-center mb-2">
                Browse by symptom area
              </h2>
              <p className="text-center text-sm text-[#a0b8b4] mb-7">
                Select an area to explore which tests are commonly ordered.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SYMPTOM_CATEGORIES.map(cat => (
                  <button
                    key={cat.label}
                    onClick={() => {
                      setQuery(cat.label.toLowerCase())
                      inputRef.current?.focus()
                    }}
                    className="group flex items-center gap-3 rounded-xl border border-[#e0ebe9] bg-white p-4 text-left transition-all hover:border-[#2d6a5e]/30 hover:bg-white/80 cursor-pointer"
                  >
                    <span className="text-xl shrink-0">{cat.icon}</span>
                    <span className="text-sm font-medium text-[#1a2e2b] leading-tight group-hover:text-[#2d6a5e]">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="px-4 py-14">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-semibold text-[#1a2e2b] text-center mb-8">
                How Explore works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {HOW_IT_WORKS.map(step => (
                  <div key={step.step} className="flex flex-col items-center text-center">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white mb-4"
                      style={{ backgroundColor: '#2d6a5e' }}
                    >
                      {step.step}
                    </div>
                    <h3 className="text-sm font-semibold text-[#1a2e2b] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#577572] leading-relaxed">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Difference from Search — contextual nudge */}
          <section className="px-4 pb-16">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-[#e0ebe9] bg-white p-6 md:p-8">
                <h2 className="text-lg font-semibold text-[#1a2e2b] mb-4">
                  Explore vs. Search — what's the difference?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#f0f7f6] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#2d6a5e] mb-2">
                      Explore (you're here)
                    </p>
                    <p className="text-sm text-[#4a6b67] leading-relaxed">
                      Start from symptoms, conditions, or goals. Great when you don't know the test name yet.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#e0ebe9] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#577572] mb-2">
                      Search
                    </p>
                    <p className="text-sm text-[#4a6b67] leading-relaxed">
                      Look up a specific test by name, CPT code, or lab code. Best when you already know what you want.
                    </p>
                    <Link
                      href="/search"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#2d6a5e] hover:underline"
                    >
                      Go to Search →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA row */}
          <section className="px-4 pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm text-[#577572] mb-4">
                Already know what you need?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2d6a5e] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#245a50] transition-colors"
                >
                  Compare prices
                </Link>
                <Link
                  href="/advocate"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e0ebe9] bg-white px-5 py-2.5 text-sm font-medium text-[#1a2e2b] hover:border-[#2d6a5e]/40 hover:bg-[#f0f7f6] transition-colors"
                >
                  Build a lab request
                </Link>
                <Link
                  href="/bundles"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e0ebe9] bg-white px-5 py-2.5 text-sm font-medium text-[#1a2e2b] hover:border-[#2d6a5e]/40 hover:bg-[#f0f7f6] transition-colors"
                >
                  Browse panels
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  )
}

// ── Test result row component ──────────────────────────────────────────────
function TestResultRow({ test }: { test: Test }) {
  const CATEGORY_LABELS: Record<string, string> = {
    thyroid: 'Thyroid', hormones: 'Hormones', iron_blood: 'Iron & Blood',
    hematology: 'Hematology', iron: 'Iron', metabolic: 'Metabolic',
    lipids: 'Lipids', cardiovascular: 'Cardiovascular', vitamins: 'Vitamins',
    vitamins_minerals: 'Vitamins & Minerals', minerals: 'Minerals',
    kidney: 'Kidney', kidney_liver: 'Kidney & Liver', liver: 'Liver',
    inflammation: 'Inflammation', immune: 'Immune', autoimmune: 'Autoimmune',
    infectious: 'Infectious Disease', cancer: 'Cancer Markers',
    gi_digestive: 'GI & Digestive', nutrition: 'Nutrition',
    pregnancy: 'Pregnancy & Fertility', mental_health: 'Mental Health',
    longevity: 'Longevity', cardiac: 'Cardiac',
  }

  return (
    <Link
      href={`/search/${test.id}`}
      className="group flex items-center gap-4 rounded-lg border border-[#e0ebe9] bg-white px-5 py-4 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#2d6a5e]">
            {test.test_name}
          </h3>
          {test.cpt_codes && test.cpt_codes.length > 0 && (
            <span className="shrink-0 text-xs font-mono text-[#577572]">
              CPT {test.cpt_codes[0]}
            </span>
          )}
        </div>
        {test.description && (
          <p className="mt-0.5 text-xs leading-relaxed text-[#577572] line-clamp-1">
            {test.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {test.category && (
          <span className="hidden sm:inline-block rounded-full bg-[#f0f7f6] border border-[#e0ebe9] px-2.5 py-0.5 text-[10px] font-medium text-[#2d6a5e]">
            {CATEGORY_LABELS[test.category] || test.category}
          </span>
        )}
        <svg className="h-4 w-4 text-[#577572] group-hover:text-[#2d6a5e] transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  )
}
