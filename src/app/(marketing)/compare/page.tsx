'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { COMPARE_GROUPS, type CompareGroup, type CompareTestContent } from '@/config/compare-content'

// ── Types ─────────────────────────────────────────────────────────────────────
type PriceMap = Record<string, number | null>  // testId → cheapest price

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(price: number | null): string {
  if (price === null) return ''
  return `from $${price.toFixed(0)}`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TestRow({
  test,
  selected,
  suggested,
  price,
  onToggle,
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
          ? 'border-dashed border-[#6b8c88] bg-white hover:border-[#2d6a5e]'
          : 'border-[#e0ebe9] bg-white hover:border-[#2d6a5e]',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Checkbox circle */}
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

      {price !== undefined && (
        <div className="ml-3 flex-shrink-0 text-xs font-semibold text-[#2d6a5e]">
          {price === null ? '' : formatPrice(price)}
        </div>
      )}
    </button>
  )
}

function InfoCard({
  test,
  price,
  allSelected,
  onAddPair,
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
      {/* Card header */}
      <div className={[
        'px-4 py-3.5 border-b border-[#e0ebe9]',
        test.highlight ? 'bg-[#f0f7f6]' : 'bg-[#faf8f5]',
      ].join(' ')}>
        {test.badge && (
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#2d6a5e] mb-1">{test.badge}</div>
        )}
        <div className="text-sm font-bold text-[#1a2e2b] leading-snug">{test.testName}</div>
        {price !== undefined && price !== null && (
          <div className="mt-1 text-xs font-semibold text-[#2d6a5e]">{formatPrice(price)}</div>
        )}
      </div>

      {/* Card body */}
      <div className="px-4 py-4 flex flex-col gap-3.5 bg-white">
        <div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#6b8c88] mb-1">What it measures</div>
          <div className="text-[13px] text-[#1a2e2b] leading-relaxed">{test.measures}</div>
        </div>

        <div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#6b8c88] mb-1">Order this if…</div>
          <div className="text-[13px] text-[#1a2e2b] leading-relaxed">{test.orderIf}</div>
        </div>

        <div>
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#6b8c88] mb-1">Best for</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {test.bestFor.map((tag) => (
              <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#166534]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-[#faf8f5] border border-[#e0ebe9] px-3 py-2.5">
          <div className="text-[10px] font-bold tracking-wider uppercase text-[#6b8c88] mb-1">Note</div>
          <div className="text-[12px] text-[#4a6b67] leading-relaxed">{test.note}</div>
        </div>

        {/* Pair suggestion */}
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

        {/* CTA */}
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const supabase = createClient()

  const [activeGroup, setActiveGroup] = useState<CompareGroup>(COMPARE_GROUPS[0])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [prices, setPrices] = useState<PriceMap>({})
  const [loadingPrices, setLoadingPrices] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Fetch cheapest prices for the active group
  const fetchPrices = useCallback(async (group: CompareGroup) => {
    setLoadingPrices(true)
    const testIds = group.tests.map(t => t.testId)
    const { data } = await supabase
      .from('pricing')
      .select('test_id, price')
      .in('test_id', testIds)
      .order('price', { ascending: true })

    const map: PriceMap = {}
    for (const id of testIds) map[id] = null  // default: no price found
    for (const row of (data ?? [])) {
      if (map[row.test_id] === null) map[row.test_id] = row.price  // first = cheapest (sorted asc)
    }
    setPrices(map)
    setLoadingPrices(false)
  }, [supabase])

  useEffect(() => {
    fetchPrices(activeGroup)
  }, [activeGroup, fetchPrices])

  // When group changes, clear selection
  function switchGroup(group: CompareGroup) {
    setActiveGroup(group)
    setSelected(new Set())
    setSheetOpen(false)
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
    // Scroll sheet to top to show the new card
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

  // Compute suggested tests (pair suggestions of selected tests, not yet selected)
  const suggested = new Set<string>()
  for (const id of selected) {
    const t = activeGroup.tests.find(x => x.testId === id)
    if (t?.pairWith && !selected.has(t.pairWith.testId)) {
      suggested.add(t.pairWith.testId)
    }
  }

  // Selected tests in display order
  const selectedTests = activeGroup.tests.filter(t => selected.has(t.testId))

  // Sticky button label
  const btnLabel = selected.size === 0
    ? 'Select a test to learn more'
    : selected.size === 1
    ? 'View test details →'
    : `Compare ${selected.size} tests →`

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-32">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2e2b] mb-2">
            Which test should I order?
          </h1>
          <p className="text-[#4a6b67]">
            Select tests to compare what they measure, when to order them, and who they&apos;re best for.
          </p>
        </div>

        {/* Group selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {COMPARE_GROUPS.map((group) => (
            <button
              key={group.id}
              onClick={() => switchGroup(group)}
              className={[
                'flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] text-sm font-semibold transition-all',
                activeGroup.id === group.id
                  ? 'bg-[#2d6a5e] text-white border-[#2d6a5e]'
                  : 'bg-white text-[#4a6b67] border-[#e0ebe9] hover:border-[#2d6a5e] hover:text-[#2d6a5e]',
              ].join(' ')}
            >
              <span>{group.emoji}</span>
              <span>{group.label}</span>
            </button>
          ))}
        </div>

        {/* Group description */}
        <div className="mb-5 p-4 rounded-xl bg-white border border-[#e0ebe9]">
          <p className="text-sm text-[#4a6b67]">{activeGroup.description}</p>
        </div>

        {/* Test list */}
        <div className="flex flex-col gap-2">
          {activeGroup.tests.map((test) => (
            <TestRow
              key={test.testId}
              test={test}
              selected={selected.has(test.testId)}
              suggested={suggested.has(test.testId) && !selected.has(test.testId)}
              price={loadingPrices ? undefined : prices[test.testId]}
              onToggle={toggleTest}
            />
          ))}
        </div>

        {/* Helper text */}
        <p className="mt-4 text-center text-xs text-[#9ca3af]">
          Select one or more tests, then tap the button below to compare
        </p>
      </div>

      {/* Sticky compare button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/95 to-transparent">
        <div className="max-w-2xl mx-auto">
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

      {/* Bottom sheet overlay */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
          onClick={closeSheet}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={[
          'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl',
          'transition-transform duration-300 ease-out max-h-[88vh] flex flex-col',
          sheetOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        {/* Sheet handle + header */}
        <div className="flex-shrink-0 px-5 pt-3 pb-4 border-b border-[#e0ebe9]">
          <div className="w-10 h-1 rounded-full bg-[#e0ebe9] mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1a2e2b]">
                {selectedTests.length === 1 ? selectedTests[0].testName : 'Comparing tests'}
              </h2>
              {selectedTests.length > 1 && (
                <p className="text-xs text-[#6b8c88] mt-0.5">{selectedTests.length} tests selected</p>
              )}
            </div>
            <button
              onClick={closeSheet}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#faf8f5] text-[#6b8c88] hover:text-[#1a2e2b] transition-colors text-lg font-medium"
            >
              ×
            </button>
          </div>
        </div>

        {/* Sheet scrollable content */}
        <div ref={sheetRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {selectedTests.map((test) => (
            <InfoCard
              key={test.testId}
              test={test}
              price={prices[test.testId]}
              allSelected={selected}
              onAddPair={(id) => {
                addPair(id)
              }}
            />
          ))}

          {/* Disclaimer */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 mb-2">
            LabLooker provides educational information only. Always confirm which test is right for you with your healthcare provider.
          </div>
        </div>
      </div>
    </div>
  )
}
