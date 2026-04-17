'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import type { Test, Symptom } from '@/types/database'

const CATEGORIES: { label: string; keywords: string[] }[] = [
  { label: 'Energy & Fatigue', keywords: ['fatigue', 'tired', 'energy', 'exhausted', 'brain fog', 'crash', 'insomnia', 'sleep', 'weakness'] },
  { label: 'Thyroid', keywords: ['thyroid', 'hashimoto', 'tsh', 'graves', 'cold intolerance', 'goiter', 'nodule', 'thinning eyebrow'] },
  { label: 'Hormones', keywords: ['hormone', 'estrogen', 'estradiol', 'testosterone', 'progesterone', 'perimenopause', 'menopause', 'pcos', 'libido', 'hot flash', 'night sweat', 'period', 'fertility', 'infertil'] },
  { label: 'Mood & Mental Health', keywords: ['anxiety', 'depression', 'mood', 'irritab', 'rage', 'panic', 'racing thoughts', 'motivation'] },
  { label: 'Weight & Metabolism', keywords: ['weight', 'metabol', 'blood sugar', 'insulin', 'belly fat', 'sugar craving', 'hba1c', 'diabetes', 'prediabetes'] },
  { label: 'Heart & Circulation', keywords: ['heart', 'chest', 'cholesterol', 'blood pressure', 'palpitation', 'circulation', 'stroke', 'cardiovascular', 'lipid'] },
  { label: 'Joints, Muscles & Pain', keywords: ['joint', 'muscle', 'pain', 'fibromyalgia', 'cramp', 'stiffness', 'arthritis', 'inflammation'] },
  { label: 'Gut & Digestion', keywords: ['bloat', 'digest', 'gut', 'reflux', 'sibo', 'constipat', 'diarrhea', 'abdominal', 'nausea', 'gallbladder', 'leaky'] },
  { label: 'Autoimmune & Immunity', keywords: ['autoimmune', 'immune', 'lupus', 'infection', 'lymph', 'titer', 'antibod', 'lyme', 'mast cell'] },
  { label: 'Sexual & Reproductive Health', keywords: ['std', 'sti', 'sexual', 'erectile', 'vaginal', 'genital', 'miscarriage', 'utis', 'discharge'] },
  { label: 'Blood & Nutrients', keywords: ['iron', 'ferritin', 'anemia', 'b12', 'vitamin d', 'folate', 'magnesium', 'zinc', 'pale', 'bruising'] },
  { label: 'Skin & Hair', keywords: ['hair', 'skin', 'nail', 'acne', 'rash', 'eczema', 'psoriasis', 'eyebrow', 'dry'] },
]

function categoryForSymptom(s: Symptom): string {
  const text = (s.name + ' ' + (s.keywords || []).join(' ')).toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(k => text.includes(k))) return cat.label
  }
  return 'Other'
}

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSymptom, setExpandedSymptom] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Safety timeout
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 8000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const base = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (!base || !key) { setError('Missing Supabase config'); setLoading(false); return }

        const headers = { apikey: key, Authorization: `Bearer ${key}` }

        const sRes = await fetch(
          `${base}/rest/v1/symptoms?select=id,name,keywords,description,related_test_ids&order=name&limit=300`,
          { headers }
        )
        if (!sRes.ok) { setError('symptoms fetch: ' + sRes.status); setLoading(false); return }
        const sData = await sRes.json()
        setSymptoms(sData as Symptom[])

        const tRes = await fetch(
          `${base}/rest/v1/tests?select=id,test_name,description,category,cpt_codes&order=test_name&limit=500`,
          { headers }
        )
        if (!tRes.ok) { setError('tests fetch: ' + tRes.status); setLoading(false); return }
        const tData = await tRes.json()
        setTests(tData as Test[])
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const testById = useMemo(() => {
    const m: Record<string, Test> = {}
    tests.forEach(t => { m[t.id] = t })
    return m
  }, [tests])

  // Group symptoms by category
  const byCategory = useMemo(() => {
    const map: Record<string, Symptom[]> = {}
    symptoms.forEach(s => {
      const cat = categoryForSymptom(s)
      if (!map[cat]) map[cat] = []
      map[cat].push(s)
    })
    return map
  }, [symptoms])

  // Search results
  const searchResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q || q.length < 2) return null
    return symptoms.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.keywords || []).some(k => k.toLowerCase().includes(q)) ||
      (s.description || '').toLowerCase().includes(q)
    )
  }, [debouncedQuery, symptoms])

  const isSearching = query.trim().length >= 2

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Hero */}
      <section className="pt-24 pb-10 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e2b] leading-tight mb-3">
            Not sure what to test for?
          </h1>
          <p className="text-base text-[#4a6b67] leading-relaxed mb-6">
            Search by symptom or condition — we&apos;ll show which lab tests are commonly discussed for each.
          </p>
          <div className="relative max-w-lg mx-auto">
            <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-[#577572]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Try fatigue, hair loss, bloating, anxiety..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-[#2d6a5e] text-sm text-[#1a2e2b] placeholder-[#a0b8b4] bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a5e]/20"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-3 p-0.5 rounded-full text-[#577572] hover:text-[#1a2e2b] hover:bg-[#e0ebe9] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-[#a0b8b4]">Educational guidance only — always discuss with your provider.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pb-20">
        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <p className="text-sm text-red-500">Failed to load: {error}</p>
          </div>
        )}

        {/* Loading */}
        {!error && loading && (
          <div className="text-center py-16">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
            <p className="mt-3 text-sm text-[#577572]">Loading...</p>
          </div>
        )}

        {/* Search results */}
        {!loading && !error && isSearching && (
          <div>
            {searchResults === null || searchResults.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#577572]">No symptoms found for &ldquo;{query}&rdquo;.</p>
                <p className="mt-2 text-sm text-[#a0b8b4]">Try a broader term like &ldquo;fatigue&rdquo; or &ldquo;pain&rdquo;.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-xs text-[#577572] mb-2">{searchResults.length} symptom{searchResults.length !== 1 ? 's' : ''} matched</p>
                {searchResults.map(s => (
                  <SymptomCard
                    key={s.id}
                    symptom={s}
                    testById={testById}
                    expanded={expandedSymptom === s.id}
                    onToggle={() => setExpandedSymptom(expandedSymptom === s.id ? null : s.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Browse by category */}
        {!loading && !error && !isSearching && (
          <div>
            {/* Category grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 mb-10">
              {CATEGORIES.filter(cat => byCategory[cat.label]?.length > 0).map(cat => (
                <button
                  key={cat.label}
                  onClick={() => setExpandedCategory(expandedCategory === cat.label ? null : cat.label)}
                  className={`text-left rounded-xl border px-4 py-3 transition-all ${
                    expandedCategory === cat.label
                      ? 'border-[#2d6a5e] bg-[#f0f7f6]'
                      : 'border-[#e0ebe9] bg-white hover:border-[#2d6a5e]/40 hover:bg-[#f0f7f6]/50'
                  }`}
                >
                  <p className="text-sm font-semibold text-[#1a2e2b]">{cat.label}</p>
                  <p className="text-xs text-[#577572] mt-0.5">{byCategory[cat.label]?.length || 0} symptoms</p>
                </button>
              ))}
            </div>

            {/* Expanded category symptoms */}
            {expandedCategory && byCategory[expandedCategory] && (
              <div className="mb-10">
                <h2 className="text-base font-semibold text-[#1a2e2b] mb-3">{expandedCategory}</h2>
                <div className="flex flex-col gap-2">
                  {byCategory[expandedCategory].map(s => (
                    <SymptomCard
                      key={s.id}
                      symptom={s}
                      testById={testById}
                      expanded={expandedSymptom === s.id}
                      onToggle={() => setExpandedSymptom(expandedSymptom === s.id ? null : s.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Topic deep dives */}
            <div className="border-t border-[#e0ebe9] pt-8 mt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#577572] mb-4">Condition guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { href: '/topics/thyroid-labs', label: 'Thyroid Lab Guide', desc: 'TSH, Free T3, T4, antibodies and what they mean' },
                  { href: '/topics/hashimotos-labs', label: "Hashimoto's Labs", desc: 'Key markers for autoimmune thyroid disease' },
                  { href: '/topics/pcos-labs', label: 'PCOS Lab Guide', desc: 'Hormones, insulin, and ovarian function testing' },
                  { href: '/topics/trt-labs', label: 'TRT Monitoring', desc: 'What to track on testosterone therapy' },
                  { href: '/topics/ferritin', label: 'Understanding Ferritin', desc: 'Iron storage, deficiency, and overload explained' },
                  { href: '/topics/order-your-own-labs', label: 'Order Your Own Labs', desc: 'How direct-access lab testing works' },
                ].map(t => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group flex items-start justify-between rounded-xl border border-[#e0ebe9] bg-white px-4 py-3 hover:border-[#2d6a5e]/40 hover:bg-[#f0f7f6]/50 transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1a2e2b] group-hover:text-[#2d6a5e]">{t.label}</p>
                      <p className="text-xs text-[#577572] mt-0.5">{t.desc}</p>
                    </div>
                    <svg className="h-4 w-4 text-[#a0b8b4] group-hover:text-[#2d6a5e] shrink-0 mt-0.5 ml-2 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// Symptom card component
function SymptomCard({
  symptom,
  testById,
  expanded,
  onToggle,
}: {
  symptom: Symptom
  testById: Record<string, Test>
  expanded: boolean
  onToggle: () => void
}) {
  const relatedTests = (symptom.related_test_ids || [])
    .map(id => testById[id])
    .filter(Boolean)
    .slice(0, 8)

  return (
    <div className="rounded-xl border border-[#e0ebe9] bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#f0f7f6]/50 transition-colors"
      >
        <div className="flex-1 min-w-0 mr-3">
          <p className="text-sm font-medium text-[#1a2e2b]">{symptom.name}</p>
          {symptom.description && (
            <p className="text-xs text-[#577572] mt-0.5 line-clamp-1">{symptom.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#577572]">{relatedTests.length} tests</span>
          <svg
            className={`h-4 w-4 text-[#577572] transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#e0ebe9] px-4 py-3">
          <p className="text-xs text-[#577572] mb-3 italic">
            Tests commonly discussed in relation to {symptom.name.toLowerCase()}. Not a diagnosis or treatment recommendation.
          </p>
          {relatedTests.length === 0 ? (
            <p className="text-xs text-[#a0b8b4]">No tests linked yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {relatedTests.map(test => (
                <div key={test.id} className="flex items-center justify-between gap-3 py-1.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#1a2e2b] font-medium truncate">{test.test_name}</p>
                    {test.description && (
                      <p className="text-xs text-[#577572] line-clamp-1">{test.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/compare?q=${encodeURIComponent(test.test_name)}`}
                      className="text-xs font-medium text-[#2d6a5e] hover:underline whitespace-nowrap"
                    >
                      Compare prices
                    </Link>
                    <span className="text-[#e0ebe9]">·</span>
                    <Link
                      href="/advocate"
                      className="text-xs font-medium text-[#2d6a5e] hover:underline whitespace-nowrap"
                    >
                      Add to request
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
