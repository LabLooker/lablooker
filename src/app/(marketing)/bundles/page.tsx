'use client'

import { useState, useEffect, useMemo } from 'react'
import { TEST_BUNDLES, type TestBundle } from '@/config/test-bundles'
import { createClient } from '@/lib/supabase'
import { trackAffiliateClick } from '@/lib/track-click'

type TestMatch = {
  name: string
  id: string | null
  found: boolean
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'hormones', label: 'Hormones' },
  { key: 'thyroid-energy', label: 'Thyroid & Energy' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'wellness', label: 'Wellness' },
] as const

export default function BundlesPage() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [testMap, setTestMap] = useState<Record<string, string>>({}) // test_name -> id

  // Load all test names + ids for linking
  useEffect(() => {
    const supabase = createClient()
    supabase.from('tests').select('id, test_name').then(({ data }) => {
      if (!data) return
      const map: Record<string, string> = {}
      data.forEach(t => { map[t.test_name] = t.id })
      setTestMap(map)
    })
  }, [])

  const filteredBundles = useMemo(() => {
    if (activeCategory === 'all') return TEST_BUNDLES
    return TEST_BUNDLES.filter(b => b.category === activeCategory)
  }, [activeCategory])

  function toggle(slug: string) {
    setExpandedSlug(prev => prev === slug ? null : slug)
  }

  function getTestMatches(bundle: TestBundle): TestMatch[] {
    return bundle.tests.map(name => {
      // Try exact match first, then partial
      let id = testMap[name] || null
      if (!id) {
        const lower = name.toLowerCase()
        const entry = Object.entries(testMap).find(([k]) => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()))
        if (entry) id = entry[1]
      }
      return { name, id, found: !!id }
    })
  }

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[1.5px] text-[#2d6a5e] mb-3">
            Recommended Panels
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
            Not sure which labs to order?
          </h1>
          <p className="mt-4 text-lg text-[#577572] max-w-2xl mx-auto">
            Curated test panels built from clinical guidelines and patient community experience. Each panel tells you exactly what to order and why.
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setExpandedSlug(null) }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'border-[#2d6a5e] bg-[#2d6a5e] text-white'
                  : 'border-[#e0ebe9] bg-white text-[#577572] hover:border-[#2d6a5e]/30 hover:text-[#2d6a5e]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBundles.map((bundle) => {
            const isExpanded = expandedSlug === bundle.slug
            const matches = getTestMatches(bundle)

            return (
              <div
                key={bundle.slug}
                className={`rounded-2xl border-[1.5px] bg-white transition-all ${
                  isExpanded
                    ? 'border-[#2d6a5e] shadow-lg shadow-[#2d6a5e]/5 col-span-2 lg:col-span-3'
                    : 'border-[#e0ebe9] hover:border-[#2d6a5e]/30'
                }`}
              >
                {/* Card face */}
                <button
                  onClick={() => toggle(bundle.slug)}
                  className="w-full text-left p-4 sm:p-5 cursor-pointer"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-2xl">{bundle.icon}</span>
                    <h2 className="text-sm font-bold text-[#1a2e2b] sm:text-base leading-tight">
                      {bundle.shortName}
                    </h2>
                    <span className="inline-flex self-start items-center rounded-full bg-[#f0f7f6] px-2.5 py-0.5 text-xs font-medium text-[#2d6a5e]">
                      {bundle.tests.length} tests
                    </span>
                    <p className="text-xs text-[#577572] leading-relaxed line-clamp-2">
                      {bundle.description.slice(0, 60)}{bundle.description.length > 60 ? '...' : ''}
                    </p>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-[#e0ebe9]">
                    {/* Full description */}
                    <p className="mt-4 text-sm text-[#577572] leading-relaxed">
                      {bundle.description}
                    </p>

                    {/* Who needs this */}
                    <div className="mt-5 rounded-xl bg-[#f0f7f6] p-4 sm:p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#2d6a5e] mb-2">
                        Who should order this?
                      </p>
                      <p className="text-sm text-[#4a6b67] leading-relaxed">
                        {bundle.whoNeeds}
                      </p>
                    </div>

                    {/* Test list */}
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#577572] mb-3">
                        Tests included
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {matches.map((test, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <svg className="h-4 w-4 text-[#2d6a5e] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            {test.id ? (
                              <a
                                href={`/search/${test.id}`}
                                onClick={() => trackAffiliateClick('Test Detail', test.name, 'bundle')}
                                className="text-sm text-[#4a6b67] hover:text-[#2d6a5e] transition-colors"
                              >
                                {test.name}
                              </a>
                            ) : (
                              <span className="text-sm text-[#4a6b67]">{test.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {bundle.notes && (
                      <div className="mt-5 flex gap-3 rounded-xl border border-[#e0ebe9] p-4">
                        <svg className="h-5 w-5 text-[#b85c5c] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <p className="text-sm text-[#4a6b67] leading-relaxed">
                          {bundle.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href={`/search?q=${encodeURIComponent(bundle.shortName)}`}
                        onClick={() => trackAffiliateClick('Search', bundle.shortName, 'bundle')}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#2d6a5e] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245a50]"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        Search these tests
                      </a>
                      <a
                        href="/compare"
                        onClick={() => trackAffiliateClick('Compare', bundle.shortName, 'bundle')}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#f0f7f6] px-4 py-2.5 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#e0ebe9]"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Compare prices
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#577572]">
            Don't see what you need?{' '}
            <a href="/search" className="font-medium text-[#2d6a5e] hover:underline">
              Search our full database of 390+ tests →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
