'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TEST_BUNDLES, type TestBundle } from '@/config/test-bundles'
import { createClient } from '@/lib/supabase'

type TestMatch = {
  name: string
  id: string | null
  found: boolean
}

export function GuideBundleCard({ bundleSlug }: { bundleSlug: string }) {
  const bundle = TEST_BUNDLES.find(b => b.slug === bundleSlug)
  const [expanded, setExpanded] = useState(false)
  const [testMap, setTestMap] = useState<Record<string, string>>({})

  useEffect(() => {
    const supabase = createClient()
    supabase.from('tests').select('id, test_name').then(({ data }) => {
      if (!data) return
      const map: Record<string, string> = {}
      data.forEach((t: { id: string; test_name: string }) => { map[t.test_name] = t.id })
      setTestMap(map)
    })
  }, [])

  if (!bundle) return null

  function getTestMatches(b: TestBundle): TestMatch[] {
    return b.tests.map(name => {
      let id = testMap[name] || null
      if (!id) {
        const lower = name.toLowerCase()
        const entry = Object.entries(testMap).find(([k]) => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()))
        if (entry) id = entry[1]
      }
      return { name, id, found: !!id }
    })
  }

  const matches = getTestMatches(bundle)

  return (
    <div
      className={`rounded-2xl border-[1.5px] bg-white transition-all ${
        expanded ? 'border-[#2d6a5e] shadow-lg shadow-[#2d6a5e]/5' : 'border-[#e0ebe9]'
      }`}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-6 sm:p-8 cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl flex-shrink-0 mt-0.5">{bundle.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-[#1a2e2b] sm:text-xl">
                {bundle.name}
              </h3>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="hidden sm:inline-flex items-center rounded-full bg-[#f0f7f6] px-3 py-1 text-xs font-medium text-[#2d6a5e]">
                  {bundle.tests.length} tests
                </span>
                <svg
                  className={`h-5 w-5 text-[#577572] transition-transform ${expanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-[#577572] leading-relaxed">
              {bundle.description}
            </p>
            <span className="sm:hidden inline-flex items-center mt-2 rounded-full bg-[#f0f7f6] px-3 py-1 text-xs font-medium text-[#2d6a5e]">
              {bundle.tests.length} tests
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-[#e0ebe9]">
          <div className="mt-6 rounded-xl bg-[#f0f7f6] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2d6a5e] mb-2">
              Who should order this?
            </p>
            <p className="text-sm text-[#4a6b67] leading-relaxed">
              {bundle.whoNeeds}
            </p>
          </div>

          <div className="mt-6">
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
                    <Link
                      href={`/search/${test.id}`}
                      className="text-sm text-[#4a6b67] hover:text-[#2d6a5e] transition-colors"
                    >
                      {test.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-[#4a6b67]">{test.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {bundle.notes && (
            <div className="mt-6 flex gap-3 rounded-xl border border-[#e0ebe9] p-4">
              <svg className="h-5 w-5 text-[#c0826a] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-[#4a6b67] leading-relaxed">
                {bundle.notes}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/search?q=${encodeURIComponent(bundle.shortName)}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2d6a5e] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245a50]"
            >
              Search these tests
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f0f7f6] px-4 py-2.5 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#e0ebe9]"
            >
              Compare prices
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
