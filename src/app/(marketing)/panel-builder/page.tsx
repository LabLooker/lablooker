'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Test, Lab } from '@/types/database'
import Button from '@/components/ui/Button'
import { useStateRestriction, StateRestrictionBanner } from '@/components/StateRestrictionProvider'

const FREE_TIER_LIMIT = 3

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

export default function PanelBuilderPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [labs, setLabs] = useState<Lab[]>([])
  const [panel, setPanel] = useState<Test[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  // For demo purposes, treat as free tier. In production, check user plan.
  const isPremium = false
  const { userState, isRestricted, setShowStatePicker } = useStateRestriction()

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [testsRes, labsRes] = await Promise.all([
        supabase.from('tests').select('*').order('test_name'),
        supabase.from('labs').select('*').order('lab_name'),
      ])
      if (testsRes.data) setTests(testsRes.data)
      if (labsRes.data) setLabs(labsRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return tests
      .filter(
        (t) =>
          !panel.some((p) => p.id === t.id) &&
          (t.test_name.toLowerCase().includes(q) ||
            t.cpt_codes.some((c) => c.includes(q)) ||
            (t.category && t.category.toLowerCase().includes(q)))
      )
      .slice(0, 8)
  }, [tests, query, panel])

  function addTest(test: Test) {
    if (!isPremium && panel.length >= FREE_TIER_LIMIT) {
      setShowUpgrade(true)
      return
    }
    setPanel((prev) => [...prev, test])
    setQuery('')
  }

  function removeTest(testId: string) {
    setPanel((prev) => prev.filter((t) => t.id !== testId))
  }

  // Build coverage matrix: for each lab, show which panel tests it could carry
  // Since we don't have real pricing yet, we simulate availability
  const displayLabs = labs.filter((l) =>
    ['direct', 'intermediary'].includes(l.ordering_type)
  ).slice(0, 8)

  return (
    <section className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm text-[#2d6a5e]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
            </span>
            New Feature
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1a2e2b] sm:text-5xl">
            Panel Builder
          </h1>
          <p className="mt-4 text-lg text-[#577572]">
            Build a custom lab panel, compare coverage across labs, and find the cheapest combination.
          </p>
        </div>

        {/* Search to add tests */}
        <div className="mx-auto mt-8 max-w-2xl">
          <label className="mb-2 block text-sm font-medium text-[#577572]">
            Add tests to your panel
          </label>
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#577572]"
              fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search tests to add (e.g. TSH, CBC, Vitamin D)..."
              className="w-full rounded-xl border border-[#e0ebe9] bg-white py-3 pl-12 pr-4 text-[#1a2e2b] placeholder-[#a3bfbb] transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {/* Search dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border border-[#e0ebe9] bg-white shadow-xl">
                {searchResults.map((test) => (
                  <button
                    key={test.id}
                    onMouseDown={() => addTest(test)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#faf8f5] first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1a2e2b]">{test.test_name}</p>
                      <p className="text-xs text-[#577572]">
                        CPT: {test.cpt_codes.join(', ')}
                        {test.category && ` · ${CATEGORY_LABELS[test.category] || test.category}`}
                      </p>
                    </div>
                    <svg className="ml-3 h-4 w-4 shrink-0 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
          {!isPremium && (
            <p className="mt-2 text-xs text-[#577572]">
              Free tier: {panel.length}/{FREE_TIER_LIMIT} tests.{' '}
              <Link href="/signup" className="text-primary-400 hover:underline">
                Upgrade to Premium
              </Link>{' '}
              for unlimited panel building.
            </p>
          )}
          {!userState && (
            <button
              onClick={() => setShowStatePicker(true)}
              className="mt-1 text-xs text-[#577572] underline hover:text-[#577572]"
            >
              Set your state to check DTC ordering availability
            </button>
          )}
        </div>

        {/* Panel tests list */}
        {panel.length > 0 && (
          <div className="mx-auto mt-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#577572]">
                Your Panel ({panel.length} tests)
              </h2>
              <button
                onClick={() => setPanel([])}
                className="text-xs text-[#577572] hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {panel.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/search/${test.id}`}
                      className="text-sm font-medium text-[#1a2e2b] hover:text-primary-400 transition-colors"
                    >
                      {test.test_name}
                    </Link>
                    <p className="text-xs font-mono text-[#577572]">CPT: {test.cpt_codes.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => removeTest(test.id)}
                    className="ml-3 shrink-0 text-[#577572] hover:text-red-400 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State restriction banner */}
        {panel.length > 0 && isRestricted && (
          <div className="mx-auto mt-8 max-w-2xl">
            <StateRestrictionBanner />
          </div>
        )}

        {/* Coverage Matrix */}
        {panel.length > 0 && !isRestricted && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#577572] text-center">
              Lab Coverage Matrix
            </h2>
            <p className="mt-1 text-center text-xs text-[#577572]">
              Showing which labs can run each test in your panel
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-[#faf8f5] px-4 py-3 text-left text-xs font-medium text-[#577572] border-b border-[#e0ebe9]">
                      Test
                    </th>
                    {displayLabs.map((lab) => (
                      <th
                        key={lab.id}
                        className="px-3 py-3 text-center text-xs font-medium text-[#577572] border-b border-[#e0ebe9] whitespace-nowrap"
                      >
                        {lab.lab_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {panel.map((test, i) => (
                    <tr key={test.id} className={i % 2 === 0 ? 'bg-[#faf8f5]' : ''}>
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm text-[#1a2e2b] border-b border-[#e0ebe9]">
                        <span className="truncate block max-w-[200px]">{test.test_name}</span>
                      </td>
                      {displayLabs.map((lab) => {
                        // Placeholder: simulate availability (most labs carry common tests)
                        const isCommon = ['metabolic', 'thyroid', 'iron_blood', 'hematology', 'vitamins', 'vitamins_minerals', 'hormones'].includes(test.category || '')
                        const isAvailable = isCommon || Math.random() > 0.3
                        return (
                          <td
                            key={lab.id}
                            className="px-3 py-3 text-center border-b border-[#e0ebe9]"
                          >
                            {isAvailable ? (
                              <span className="text-xs text-[#577572]">Price TBD</span>
                            ) : (
                              <span className="text-[#e0ebe9]">--</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#e0ebe9]">
                    <td className="sticky left-0 z-10 bg-[#faf8f5] px-4 py-3 text-sm font-semibold text-[#1a2e2b]">
                      Estimated Total
                    </td>
                    {displayLabs.map((lab) => (
                      <td key={lab.id} className="px-3 py-3 text-center">
                        <span className="text-xs text-[#577572]">Coming soon</span>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Optimization suggestion placeholder */}
        {panel.length >= 3 && (
          <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-primary-500/20 bg-primary-500/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10">
                <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1a2e2b]">Smart Optimization</h3>
                <p className="mt-1 text-sm text-[#577572]">
                  Once pricing data is loaded, we&apos;ll automatically find the cheapest lab combination for your panel — including split-ordering across labs when it saves money.
                </p>
                {!isPremium && (
                  <Button href="/signup" size="sm" className="mt-4">
                    Upgrade for Optimization
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Export & Save */}
        {panel.length > 0 && (
          <div className="mx-auto mt-6 flex max-w-2xl justify-center gap-3">
            <button
              onClick={() => {
                const text = panel
                  .map((t) => `${t.test_name} — CPT: ${t.cpt_codes.join(', ')}`)
                  .join('\n')
                navigator.clipboard.writeText(text)
              }}
              className="flex items-center gap-2 rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-4 py-2 text-sm font-medium text-[#4a6b67] transition-colors hover:border-[#2d6a5e] hover:text-[#1a2e2b]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              Copy Panel List
            </button>
            <button
              onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-2 rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-4 py-2 text-sm font-medium text-[#4a6b67] transition-colors hover:border-[#2d6a5e] hover:text-[#1a2e2b]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-2 rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-4 py-2 text-sm font-medium text-[#4a6b67] transition-colors hover:border-[#2d6a5e] hover:text-[#1a2e2b]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              Save Panel
            </button>
          </div>
        )}

        {/* Empty state */}
        {panel.length === 0 && !loading && (
          <div className="mx-auto mt-16 max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#faf8f5]">
              <svg className="h-8 w-8 text-[#577572]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#1a2e2b]">Build your custom panel</h3>
            <p className="mt-2 text-sm text-[#577572]">
              Search for tests above and add them to your panel. We&apos;ll show you which labs carry
              each test and help you find the cheapest combination.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Thyroid Panel', 'Metabolic Panel', 'Hormone Panel', 'Iron Panel'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion.split(' ')[0].toLowerCase())}
                  className="rounded-full border border-[#e0ebe9] px-3 py-1.5 text-xs text-[#577572] transition-colors hover:border-primary-500/30 hover:text-primary-400"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade modal */}
        {showUpgrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-2xl border border-[#e0ebe9] bg-white p-8">
              <h3 className="text-xl font-bold text-[#1a2e2b]">Upgrade to Premium</h3>
              <p className="mt-3 text-sm text-[#577572]">
                Unlock unlimited panel building, price comparison across all labs, smart optimization,
                PDF export, and saved panels.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'Unlimited tests per panel',
                  'Real pricing from 15+ labs',
                  'Smart lab combination optimizer',
                  'Export panel as PDF',
                  'Save and share panels',
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-[#4a6b67]">
                    <svg className="h-4 w-4 shrink-0 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Button href="/signup" className="flex-1">
                  Start Free Trial — $6/mo
                </Button>
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="rounded-lg border border-[#e0ebe9] px-4 py-2 text-sm text-[#577572] hover:text-[#1a2e2b] transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
