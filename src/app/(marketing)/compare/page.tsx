'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useStateRestriction } from '@/components/StateRestrictionProvider'
import { COMPARE_GROUPS, type CompareGroup, type CompareTestContent } from '@/config/compare-content'
import { trackAffiliateClick } from '@/lib/track-click'

// ─── Awin Affiliate Config ────────────────────────────────────────────────────
const AWIN_PUBLISHER_ID = '2796790'
const AWIN_ADVERTISERS: Record<string, string> = {
  'HealthLabs.com':   '',
  'Ulta Lab Tests':   '',
  'Walk-In Lab':      '',
  'Request A Test':   '',
  'Any Lab Test Now': '',
  'Private MD Labs':  '',
  'DirectLabs':       '',
  'Personalabs':      '',
  'Life Extension':   '',
  'DrSays':           '',
}

function affiliateUrl(directUrl: string, labName: string): string {
  const mid = AWIN_ADVERTISERS[labName]
  if (!mid) return directUrl
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN_PUBLISHER_ID}&ued=${encodeURIComponent(directUrl)}`
}

// ─── Types ────────────────────────────────────────────────────────────────────
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

type PriceMap = Record<string, number | null>

// ─── Sub-components ───────────────────────────────────────────────────────────

function CompareTestRow({
  test, selected, suggested, price, onToggle,
}: {
  test: CompareTestContent
  selected: boolean
  suggested: boolean
  price: number | null | undefined
  onToggle: (id: string) => void
}) {
  return (
    <button
      onClick={() => onToggle(test.testId)}
      className={[
        'w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-[1.5px] text-left transition-all',
        selected
          ? 'border-[#2d6a5e] bg-[#f0f7f6]'
          : suggested
          ? 'border-dashed border-[#577572] bg-white hover:border-[#2d6a5e]'
          : 'border-[#e0ebe9] bg-white hover:border-[#2d6a5e]',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={[
          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
          selected ? 'bg-[#2d6a5e] border-[#2d6a5e]' : 'border-[#d1d5db]',
        ].join(' ')}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#1a2e2b] leading-snug">{test.testName}</div>
          {test.badge && (
            <div className="mt-0.5 text-[11px] font-semibold text-[#2d6a5e]">{test.badge}</div>
          )}
          {suggested && !selected && (
            <div className="mt-0.5 text-[11px] text-[#2d6a5e]">💡 Commonly ordered with selected test</div>
          )}
        </div>
      </div>
      {price !== undefined && price !== null && (
        <div className="ml-3 flex-shrink-0 text-xs font-semibold text-[#2d6a5e]">
          from ${price.toFixed(0)}
        </div>
      )}
    </button>
  )
}

function InfoCard({
  test, price, allSelected, onAddPair,
}: {
  test: CompareTestContent
  price: number | null | undefined
  allSelected: Set<string>
  onAddPair: (testId: string) => void
}) {
  const hasPair = test.pairWith && !allSelected.has(test.pairWith.testId)

  return (
    <div className={[
      'rounded-xl border-[1.5px] overflow-hidden',
      test.highlight ? 'border-[#2d6a5e]' : 'border-[#e0ebe9]',
    ].join(' ')}>
      <div className={[
        'px-4 py-3.5 border-b border-[#e0ebe9]',
        test.highlight ? 'bg-[#f0f7f6]' : 'bg-[#faf8f5]',
      ].join(' ')}>
        {test.badge && (
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#2d6a5e] mb-1">{test.badge}</div>
        )}
        <div className="text-sm font-bold text-[#1a2e2b] leading-snug">{test.testName}</div>
        {price !== undefined && price !== null && (
          <div className="mt-1 text-xs font-semibold text-[#2d6a5e]">from ${price.toFixed(0)}</div>
        )}
      </div>
      <div className="px-4 py-4 flex flex-col gap-3.5 bg-white">
        <div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#577572] mb-1">What it measures</div>
          <div className="text-[13px] text-[#1a2e2b] leading-relaxed">{test.measures}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#577572] mb-1">Order this if…</div>
          <div className="text-[13px] text-[#1a2e2b] leading-relaxed">{test.orderIf}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#577572] mb-1">Best for</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {test.bestFor.map((tag) => (
              <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#166534]">{tag}</span>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-[#faf8f5] border border-[#e0ebe9] px-3 py-2.5">
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#577572] mb-1">Note</div>
          <div className="text-[12px] text-[#4a6b67] leading-relaxed">{test.note}</div>
        </div>
        {hasPair && test.pairWith && (
          <div className="rounded-lg bg-[#f0f7f6] border border-[#c8e6e1] px-3 py-3">
            <div className="text-[10px] font-bold tracking-wider uppercase text-[#2d6a5e] mb-1">💡 Commonly ordered with</div>
            <div className="text-[12px] font-semibold text-[#1a2e2b] mb-1">{test.pairWith.label}</div>
            <div className="text-[11px] text-[#4a6b67] leading-relaxed mb-2">{test.pairWith.reason}</div>
            <button
              onClick={() => onAddPair(test.pairWith!.testId)}
              className="text-[11px] font-semibold text-[#2d6a5e] underline underline-offset-2 hover:text-[#245a50] transition-colors"
            >
              + Add to comparison
            </button>
          </div>
        )}
        <Link
          href={`/search/${test.testId}`}
          className={[
            'w-full text-center text-[12px] font-semibold py-2.5 rounded-lg border-[1.5px] transition-colors',
            test.highlight
              ? 'bg-[#2d6a5e] text-white border-[#2d6a5e] hover:bg-[#245a50]'
              : 'bg-[#f0f7f6] text-[#2d6a5e] border-[#e0ebe9] hover:border-[#2d6a5e]',
          ].join(' ')}
          onClick={(e) => e.stopPropagation()}
        >
          Compare prices →
        </Link>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const supabase = createClient()
  const { isRestricted, userState, setShowStatePicker } = useStateRestriction()

  // ── Search / price comparison state ──
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TestResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null)
  const [pricing, setPricing] = useState<PriceRow[]>([])
  const [loadingPricing, setLoadingPricing] = useState(false)

  // ── Group comparison state ──
  const [activeGroup, setActiveGroup] = useState<CompareGroup | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [groupPrices, setGroupPrices] = useState<PriceMap>({})
  const [loadingGroupPrices, setLoadingGroupPrices] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  // ── Search functions ──
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

  async function selectSearchTest(test: TestResult) {
    setSelectedTest(test)
    setResults([])
    setQuery(test.test_name)
    setActiveGroup(null) // hide groups when viewing prices
    setSelected(new Set())
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

  // ── Group comparison functions ──
  const fetchGroupPrices = useCallback(async (group: CompareGroup) => {
    setLoadingGroupPrices(true)
    const testIds = group.tests.map(t => t.testId)
    const { data } = await supabase
      .from('pricing')
      .select('test_id, price')
      .in('test_id', testIds)
      .order('price', { ascending: true })
    const map: PriceMap = {}
    for (const id of testIds) map[id] = null
    for (const row of (data ?? [])) {
      if (map[row.test_id] === null) map[row.test_id] = row.price
    }
    setGroupPrices(map)
    setLoadingGroupPrices(false)
  }, [supabase])

  function switchGroup(group: CompareGroup) {
    // If already active, toggle off
    if (activeGroup?.id === group.id) {
      setActiveGroup(null)
      setSelected(new Set())
      return
    }
    setActiveGroup(group)
    setSelected(new Set())
    setSheetOpen(false)
    setSelectedTest(null) // hide price results
    setPricing([])
    setQuery('')
    fetchGroupPrices(group)
  }

  function toggleTest(testId: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(testId)) next.delete(testId)
      else next.add(testId)
      return next
    })
  }

  function addPair(testId: string) {
    setSelected(prev => new Set([...prev, testId]))
    sheetRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openSheet() {
    if (selected.size === 0) return
    setSheetOpen(true)
    document.body.style.overflow = 'hidden'
  }

  function closeSheet() {
    setSheetOpen(false)
    document.body.style.overflow = ''
  }

  // Find the compare group that matches the selected test's category
  function findNudgeGroup(): CompareGroup | null {
    if (!selectedTest) return null
    const testId = selectedTest.id
    const group = COMPARE_GROUPS.find(g => g.tests.some(t => t.testId === testId))
    if (group) return group
    // Fallback: match by name
    const name = selectedTest.test_name.toLowerCase()
    if (name.includes('testosterone') || name.includes('dht')) return COMPARE_GROUPS.find(g => g.id === 'testosterone') ?? null
    if (name.includes('thyroid') || name.includes('tsh') || name.includes('t3') || name.includes('t4')) return COMPARE_GROUPS.find(g => g.id === 'thyroid') ?? null
    if (name.includes('iron') || name.includes('ferritin') || name.includes('tibc') || name.includes('transferrin')) return COMPARE_GROUPS.find(g => g.id === 'iron') ?? null
    if (name.includes('vitamin d') || name.includes('calcitriol')) return COMPARE_GROUPS.find(g => g.id === 'vitamin-d') ?? null
    if (name.includes('cortisol') || name.includes('dhea')) return COMPARE_GROUPS.find(g => g.id === 'cortisol') ?? null
    if (name.includes('estradiol') || name.includes('estrone') || name.includes('estrogen') || name.includes('progesterone')) return COMPARE_GROUPS.find(g => g.id === 'estrogen') ?? null
    return null
  }

  // Derived state
  const cheapestPrice = pricing.length > 0 ? Math.min(...pricing.map(p => p.price)) : null
  const suggested = new Set<string>()
  if (activeGroup) {
    for (const id of selected) {
      const t = activeGroup.tests.find(x => x.testId === id)
      if (t?.pairWith && !selected.has(t.pairWith.testId)) suggested.add(t.pairWith.testId)
    }
  }
  const selectedTests = activeGroup ? activeGroup.tests.filter(t => selected.has(t.testId)) : []
  const nudgeGroup = findNudgeGroup()

  const btnLabel = selected.size === 0
    ? 'Select a test to learn more'
    : selected.size === 1
    ? 'View test details →'
    : `Compare ${selected.size} tests →`

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-32">

        {/* ── Hero ── */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2e2b] mb-2">
            Compare self-pay lab prices
          </h1>
          <p className="text-[#4a6b67] mb-6">
            Search any test to compare pricing across labs — or explore test groups if you&apos;re not sure what to order.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="flex items-center rounded-xl border-2 border-[#2d6a5e] bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#2d6a5e]/20">
              <svg className="h-5 w-5 shrink-0 text-[#577572]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); search(e.target.value) }}
                placeholder="Search a test — Ferritin, TSH, Vitamin D…"
                className="ml-3 flex-1 bg-transparent text-[#1a2e2b] placeholder-[#a3bfbb] focus:outline-none"
                autoFocus
              />
              {query && (
                <button onClick={clearSearch} className="ml-2 text-[#577572] hover:text-[#1a2e2b] transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Live search dropdown */}
            {results.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-[#e0ebe9] bg-white shadow-lg">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => selectSearchTest(r)}
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

          {/* Popular search pills removed — search bar + group comparison is sufficient */}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
           PRICE COMPARISON RESULTS (when a test is searched)
        ══════════════════════════════════════════════════════════════════════ */}
        {selectedTest && (
          <div>
            {/* Test header */}
            <div className="mb-4 rounded-xl border border-[#e0ebe9] bg-white p-5">
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
                  className="shrink-0 text-xs text-[#577572] underline hover:text-[#2d6a5e] transition-colors"
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
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">Self-Pay Pricing</h3>
                {cheapestPrice !== null && (
                  <span className="text-xs text-[#577572]">
                    From <span className="font-semibold text-[#1a2e2b]">${cheapestPrice.toFixed(2)}</span>
                  </span>
                )}
              </div>
              <p className="mb-4 text-[11px] text-[#577572]">
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
                            <p className="mt-0.5 text-[11px] text-[#577572]">{p.notes}</p>
                          )}
                        </div>
                        <div className="ml-4 flex shrink-0 items-center gap-3">
                          <span className="text-sm font-bold text-[#1a2e2b]">${p.price.toFixed(2)}</span>
                          {orderUrl && !isRestricted && (
                            <a
                              href={orderUrl}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              onClick={() => trackAffiliateClick(p.lab_name, selectedTest?.test_name, 'compare')}
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
                <p className="py-6 text-center text-sm text-[#577572]">
                  No self-pay pricing found for this test yet.{' '}
                  <Link href={`/search/${selectedTest.id}`} className="text-[#2d6a5e] underline">
                    View full test details →
                  </Link>
                </p>
              )}

              {!userState && !isRestricted && (
                <button
                  onClick={() => setShowStatePicker(true)}
                  className="mt-4 text-xs text-[#577572] underline hover:text-[#2d6a5e] transition-colors"
                >
                  Set your state to check ordering availability
                </button>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              Prices are verified periodically but may change. Always confirm price at checkout. LabLooker is a research tool — we do not collect or store personal health information.
            </div>

            {/* ── Nudge to group comparison ── */}
            {nudgeGroup && (
              <button
                onClick={() => switchGroup(nudgeGroup)}
                className="mt-5 w-full p-4 rounded-xl border-[1.5px] border-dashed border-[#c8e6e1] bg-[#f0f7f6] text-center hover:border-[#2d6a5e] transition-all"
              >
                <div className="text-sm font-semibold text-[#2d6a5e]">
                  🔬 Not sure this is the right test?
                </div>
                <div className="text-xs text-[#4a6b67] mt-1">
                  Compare {nudgeGroup.tests.length} {nudgeGroup.label.toLowerCase()} test variants side by side → see what each one measures
                </div>
              </button>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
           GROUP BROWSING SECTION (always visible below search in empty state,
           or when a group is actively selected)
        ══════════════════════════════════════════════════════════════════════ */}
        {!selectedTest && (
          <>
            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#e0ebe9]" />
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                Not sure which test to order?
              </span>
              <div className="flex-1 h-px bg-[#e0ebe9]" />
            </div>

            {/* Group pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {COMPARE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  onClick={() => switchGroup(group)}
                  className={[
                    'flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] text-sm font-semibold transition-all',
                    activeGroup?.id === group.id
                      ? 'bg-[#2d6a5e] text-white border-[#2d6a5e]'
                      : 'bg-white text-[#4a6b67] border-[#e0ebe9] hover:border-[#2d6a5e] hover:text-[#2d6a5e]',
                  ].join(' ')}
                >
                  {group.emoji && <span>{group.emoji}</span>}
                  <span>{group.label}</span>
                </button>
              ))}
            </div>

            {/* Active group content */}
            {activeGroup && (
              <>
                <div className="mb-4 p-4 rounded-xl bg-white border border-[#e0ebe9]">
                  <p className="text-sm text-[#4a6b67]">{activeGroup.description}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {activeGroup.tests.map((test) => (
                    <CompareTestRow
                      key={test.testId}
                      test={test}
                      selected={selected.has(test.testId)}
                      suggested={suggested.has(test.testId) && !selected.has(test.testId)}
                      price={loadingGroupPrices ? undefined : groupPrices[test.testId]}
                      onToggle={toggleTest}
                    />
                  ))}
                </div>

                <p className="mt-3 text-center text-xs text-[#9ca3af]">
                  Select one or more tests, then tap the button below to compare
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         STICKY COMPARE BUTTON (only when group is active)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeGroup && !selectedTest && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/95 to-transparent">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={openSheet}
              disabled={selected.size === 0}
              className={[
                'w-full py-4 rounded-2xl text-[15px] font-semibold transition-all',
                selected.size > 0
                  ? 'bg-[#2d6a5e] text-white shadow-lg shadow-[#2d6a5e]/30 hover:bg-[#245a50]'
                  : 'bg-[#e0ebe9] text-[#9ca3af] cursor-default',
              ].join(' ')}
            >
              {btnLabel}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         BOTTOM SHEET (Option C)
      ══════════════════════════════════════════════════════════════════════ */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
          onClick={closeSheet}
        />
      )}
      <div
        className={[
          'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl',
          'transition-transform duration-300 ease-out max-h-[88vh] flex flex-col',
          sheetOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        <div className="flex-shrink-0 px-5 pt-3 pb-4 border-b border-[#e0ebe9]">
          <div className="w-10 h-1 rounded-full bg-[#e0ebe9] mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1a2e2b]">
                {selectedTests.length === 1 ? selectedTests[0].testName : 'Comparing tests'}
              </h2>
              {selectedTests.length > 1 && (
                <p className="text-xs text-[#577572] mt-0.5">{selectedTests.length} tests selected</p>
              )}
            </div>
            <button
              onClick={closeSheet}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#faf8f5] text-[#577572] hover:text-[#1a2e2b] transition-colors text-lg font-medium"
            >
              ×
            </button>
          </div>
        </div>
        <div ref={sheetRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {selectedTests.map((test) => (
            <InfoCard
              key={test.testId}
              test={test}
              price={groupPrices[test.testId]}
              allSelected={selected}
              onAddPair={addPair}
            />
          ))}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 mb-2">
            LabLooker provides educational information only. Always confirm which test is right for you with your healthcare provider.
          </div>
        </div>
      </div>
    </div>
  )
}
