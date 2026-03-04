'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useStateRestriction } from '@/components/StateRestrictionProvider'

// ─── Awin Affiliate Config ────────────────────────────────────────────────────
// Publisher ID: 2796790
// Fill in awinmid values once advertiser programs are approved in Awin dashboard.
const AWIN_PUBLISHER_ID = '2796790'
const AWIN_ADVERTISERS: Record<string, string> = {
  'HealthLabs.com':   '',   // pending approval
  'Ulta Lab Tests':   '',   // pending approval
  'Walk-In Lab':      '',   // pending approval
  'Request A Test':   '',   // pending approval
  'Any Lab Test Now': '',   // pending approval
  'Private MD Labs':  '',   // pending approval
  'DirectLabs':       '',   // pending approval
  'Personalabs':      '',   // pending approval
  'Life Extension':   '',   // pending approval
  'DrSays':           '',   // pending approval
}

function affiliateUrl(directUrl: string, labName: string): string {
  const mid = AWIN_ADVERTISERS[labName]
  if (!mid) return directUrl
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_PUBLISHER_ID}&ued=${encodeURIComponent(directUrl)}`
}
// ─────────────────────────────────────────────────────────────────────────────

type TestResult = {
  id: string
  test_name: string
  cpt_codes: string[]
  fasting_required: boolean
  category: string | null
}

type PriceRow = {
  price: number
  requires_rx: boolean
  lab_name: string
  website: string | null
  notes: string | null
}

export default function ComparePage() {
  const supabase = createClient()
  const { isRestricted, userState, setShowStatePicker } = useStateRestriction()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TestResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null)
  const [pricing, setPricing] = useState<PriceRow[]>([])
  const [loadingPricing, setLoadingPricing] = useState(false)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return }
    setSearching(true)
    const { data } = await supabase
      .from('tests')
      .select('id, test_name, cpt_codes, fasting_required, category')
      .ilike('test_name', `%${q}%`)
      .limit(12)
    setResults(data ?? [])
    setSearching(false)
  }, [supabase])

  async function selectTest(test: TestResult) {
    setSelectedTest(test)
    setResults([])
    setQuery(test.test_name)
    setLoadingPricing(true)
    const { data } = await supabase
      .from('pricing')
      .select('price, requires_rx, labs(lab_name, website, notes)')
      .eq('test_id', test.id)
      .order('price', { ascending: true })
    setPricing(
      (data ?? []).map((row: any) => ({
        price: row.price,
        requires_rx: row.requires_rx,
        lab_name: row.labs?.lab_name ?? '',
        website: row.labs?.website ?? null,
        notes: row.labs?.notes ?? null,
      }))
    )
    setLoadingPricing(false)
  }

  function clearSearch() {
    setQuery('')
    setResults([])
    setSelectedTest(null)
    setPricing([])
  }

  const cheapestPrice = pricing.length > 0 ? Math.min(...pricing.map(p => p.price)) : null

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <div className="border-b border-[#e0ebe9] bg-white px-4 py-12 text-center md:py-16">
        <h1 className="text-3xl font-bold text-[#1a2e2b] md:text-4xl">Compare self-pay lab prices</h1>
        <p className="mt-3 text-base text-[#6b8c88]">
          Search any test to see prices across all major self-pay labs — sorted cheapest first.
        </p>

        {/* Search bar */}
        <div className="relative mx-auto mt-8 max-w-xl">
          <div className="flex items-center rounded-xl border-2 border-[#2d6a5e] bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#2d6a5e]/20">
            <svg className="h-5 w-5 shrink-0 text-[#6b8c88]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); search(e.target.value) }}
              placeholder="Search a test — Ferritin, TSH, Vitamin D..."
              className="ml-3 flex-1 bg-transparent text-[#1a2e2b] placeholder-[#a3bfbb] focus:outline-none"
              autoFocus
            />
            {query && (
              <button onClick={clearSearch} className="ml-2 text-[#6b8c88] hover:text-[#1a2e2b] transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Live results dropdown */}
          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-[#e0ebe9] bg-white shadow-lg">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => selectTest(r)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#faf8f5] border-b border-[#e0ebe9] last:border-b-0"
                >
                  <span className="text-sm font-medium text-[#1a2e2b]">{r.test_name}</span>
                  {r.category && (
                    <span className="ml-3 shrink-0 rounded-full bg-[#2d6a5e]/10 px-2.5 py-0.5 text-xs font-medium text-[#2d6a5e]">
                      {r.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        {/* No test selected yet */}
        {!selectedTest && !query && (
          <div className="text-center">
            <p className="text-sm text-[#6b8c88]">
              Popular searches:{' '}
              {['Ferritin', 'TSH', 'Vitamin D', 'Testosterone', 'HbA1c', 'Free T3'].map((name) => (
                <button
                  key={name}
                  onClick={() => { setQuery(name); search(name) }}
                  className="ml-1 inline-block rounded-full border border-[#e0ebe9] bg-white px-3 py-1 text-xs font-medium text-[#4a6b67] transition-colors hover:border-[#2d6a5e] hover:text-[#2d6a5e]"
                >
                  {name}
                </button>
              ))}
            </p>
          </div>
        )}

        {/* Price comparison results */}
        {selectedTest && (
          <div>
            {/* Test header */}
            <div className="mb-6 rounded-xl border border-[#e0ebe9] bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1a2e2b]">{selectedTest.test_name}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTest.cpt_codes?.length > 0 && (
                      <span className="rounded-full bg-[#faf8f5] border border-[#e0ebe9] px-3 py-1 text-xs font-medium text-[#4a6b67]">
                        CPT: {selectedTest.cpt_codes.join(', ')}
                      </span>
                    )}
                    {selectedTest.fasting_required && (
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                        ⚡ Fasting required
                      </span>
                    )}
                    {selectedTest.category && (
                      <span className="rounded-full bg-[#2d6a5e]/10 px-3 py-1 text-xs font-medium text-[#2d6a5e]">
                        {selectedTest.category}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/search/${selectedTest.id}`}
                  className="shrink-0 text-xs text-[#6b8c88] underline hover:text-[#2d6a5e] transition-colors"
                >
                  Full details →
                </Link>
              </div>
            </div>

            {/* State restriction */}
            {isRestricted && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                Direct-to-consumer lab ordering isn&apos;t available in your state. You can still use this page to research pricing before requesting a test through your doctor.
              </div>
            )}

            {/* Pricing table */}
            <div className="rounded-xl border border-[#e0ebe9] bg-white p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">
                  Self-Pay Pricing
                </h3>
                {cheapestPrice !== null && (
                  <span className="text-xs text-[#6b8c88]">
                    From <span className="font-semibold text-[#1a2e2b]">${cheapestPrice.toFixed(2)}</span>
                  </span>
                )}
              </div>
              <p className="mb-4 text-[11px] text-[#6b8c88]">
                LabLooker may earn a commission through lab links. This does not affect pricing or rankings.
              </p>

              {loadingPricing ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
                </div>
              ) : pricing.length > 0 ? (
                <div className="space-y-2">
                  {pricing.map((p, i) => {
                    const isCheapest = p.price === cheapestPrice
                    const orderUrl = p.website ? affiliateUrl(p.website, p.lab_name) : null
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                          isCheapest
                            ? 'border-2 border-[#2d6a5e] bg-[#2d6a5e]/5'
                            : 'border border-[#e0ebe9] bg-[#faf8f5]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#1a2e2b]">{p.lab_name}</span>
                            {isCheapest && (
                              <span className="rounded-full bg-[#2d6a5e] px-2 py-0.5 text-[10px] font-semibold text-white">
                                Best price
                              </span>
                            )}
                          </div>
                          {p.notes && (
                            <p className="mt-0.5 text-[11px] text-[#6b8c88]">{p.notes}</p>
                          )}
                        </div>
                        <div className="ml-4 flex shrink-0 items-center gap-3">
                          <span className="text-sm font-bold text-[#1a2e2b]">
                            ${p.price.toFixed(2)}
                          </span>
                          {orderUrl && !isRestricted && (
                            <a
                              href={orderUrl}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className={`rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-colors ${
                                isCheapest
                                  ? 'bg-[#2d6a5e] hover:bg-[#245549]'
                                  : 'bg-[#4a6b67] hover:bg-[#3a5b57]'
                              }`}
                            >
                              Order →
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-[#6b8c88]">
                  No self-pay pricing found for this test yet.{' '}
                  <Link href={`/search/${selectedTest.id}`} className="text-[#2d6a5e] underline">
                    View full test details →
                  </Link>
                </p>
              )}

              {!userState && !isRestricted && (
                <button
                  onClick={() => setShowStatePicker(true)}
                  className="mt-4 text-xs text-[#6b8c88] underline hover:text-[#2d6a5e] transition-colors"
                >
                  Set your state to check ordering availability
                </button>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              Prices are verified periodically but may change. Always confirm price at checkout. LabLooker is a research tool — we do not collect or store personal health information.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
