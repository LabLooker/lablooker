'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import ResultLogModal from '@/components/tracker/ResultLogModal'
import ImportModal from '@/components/tracker/ImportModal'
import PdfImportModal from '@/components/dashboard/PdfImportModal'

type Profile = {
  full_name: string | null
  plan: string
  plan_status: string
  is_premium?: boolean
}

type MarkerResult = {
  id: string
  test_id: string
  value: number
  unit: string | null
  drawn_at: string
  lab_name: string | null
  ref_range_low: number | null
  ref_range_high: number | null
  notes: string | null
}

type MarkerGoal = {
  target_value: number | null
  target_direction: string
  target_low: number | null
  target_high: number | null
}

type StatusCategory = 'out_of_range' | 'suboptimal' | 'optimal' | 'no_range'

type Marker = {
  testId: string
  testName: string
  latestValue: number
  unit: string | null
  statusCategory: StatusCategory
  statusLabel: string
  trend: string
  date: string
  resultCount: number
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const yr = String(d.getUTCFullYear()).slice(-2)
  return `${mo}/${day}/${yr}`
}

function getStatusCategory(result: MarkerResult, goal: MarkerGoal | null): { category: StatusCategory; label: string } {
  const { value, ref_range_low, ref_range_high } = result

  // If no reference range at all
  if (ref_range_low === null || ref_range_high === null) {
    return { category: 'no_range', label: 'No Range' }
  }

  // Out of lab range entirely
  if (value < ref_range_low || value > ref_range_high) {
    return { category: 'out_of_range', label: value < ref_range_low ? 'Low' : 'High' }
  }

  // In lab range — check if user has a goal/optimal target
  if (goal) {
    if (goal.target_direction === 'range' && goal.target_low !== null && goal.target_high !== null) {
      if (value < goal.target_low || value > goal.target_high) {
        return { category: 'suboptimal', label: 'Suboptimal' }
      }
      return { category: 'optimal', label: 'Optimal' }
    }
    if (goal.target_direction === 'above' && goal.target_value !== null) {
      if (value < goal.target_value) {
        return { category: 'suboptimal', label: 'Suboptimal' }
      }
      return { category: 'optimal', label: 'Optimal' }
    }
    if (goal.target_direction === 'below' && goal.target_value !== null) {
      if (value > goal.target_value) {
        return { category: 'suboptimal', label: 'Suboptimal' }
      }
      return { category: 'optimal', label: 'Optimal' }
    }
  }

  // In range, no goal set
  return { category: 'optimal', label: 'In Range' }
}

function getTrend(results: MarkerResult[]): string {
  if (results.length < 2) return '—'

  const sorted = [...results].sort((a, b) => new Date(a.drawn_at).getTime() - new Date(b.drawn_at).getTime())
  const latest = sorted[sorted.length - 1].value
  const prev = sorted[sorted.length - 2].value
  const diff = latest - prev

  if (Math.abs(diff) < 0.001) return '→'
  return diff > 0 ? '↑' : '↓'
}

const STATUS_CONFIG: Record<StatusCategory, { dot: string; pillBg: string; pillText: string }> = {
  out_of_range: { dot: 'bg-[#b85c5c]', pillBg: 'bg-[#b85c5c]/10', pillText: 'text-[#b85c5c]' },
  suboptimal: { dot: 'bg-[#c59030]', pillBg: 'bg-[#c59030]/10', pillText: 'text-[#c59030]' },
  optimal: { dot: 'bg-[#2d6a5e]', pillBg: 'bg-[#2d6a5e]/10', pillText: 'text-[#2d6a5e]' },
  no_range: { dot: 'bg-[#577572]', pillBg: 'bg-[#e0ebe9]', pillText: 'text-[#577572]' },
}

const TREND_LABELS: Record<string, string> = {
  '↑': 'Rising',
  '↓': 'Declining',
  '→': 'Stable',
  '—': 'First result',
}

type FilterKey = 'all' | 'out_of_range' | 'suboptimal' | 'optimal'

function DashboardContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [upgradeBanner, setUpgradeBanner] = useState(false)

  const [showLogModal, setShowLogModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPdfImportModal, setShowPdfImportModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ testId: string; testName: string; resultCount: number } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Handle ?upgraded=true — fallback premium activation if webhook didn't fire
  useEffect(() => {
    if (searchParams.get('upgraded') !== 'true') return
    if (profile === null || profile.is_premium) return

    let cancelled = false
    async function activatePremium() {
      try {
        const res = await fetch('/api/stripe/activate-premium', { method: 'POST' })
        const data = await res.json()
        if (!cancelled && data.activated) {
          setUpgradeBanner(true)
          loadData()
          setTimeout(() => setUpgradeBanner(false), 6000)
        }
      } catch (err) {
        console.error('Failed to activate premium:', err)
      }
    }
    activatePremium()
    return () => { cancelled = true }
  }, [searchParams, profile])

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, plan, plan_status, is_premium')
      .eq('id', user.id)
      .single()
    if (profileData) setProfile(profileData)

    // Load all lab results
    const { data: resultsData } = await supabase
      .from('lab_results')
      .select('id, test_id, value, unit, drawn_at, lab_name, ref_range_low, ref_range_high, notes')
      .eq('user_id', user.id)
      .order('drawn_at', { ascending: false })

    // Load goals
    const { data: goalsData } = await supabase
      .from('lab_goals')
      .select('test_id, target_value, target_direction, target_low, target_high')
      .eq('user_id', user.id)

    if (!resultsData || resultsData.length === 0) {
      setMarkers([])
      setLoading(false)
      return
    }

    // Group results by test_id
    const byTestId: Record<string, MarkerResult[]> = {}
    for (const r of resultsData) {
      if (!byTestId[r.test_id]) byTestId[r.test_id] = []
      byTestId[r.test_id].push(r)
    }

    // Fetch test names
    const testIds = Object.keys(byTestId)
    const { data: testsData } = await supabase
      .from('tests')
      .select('id, test_name')
      .in('id', testIds)

    const testsById: Record<string, string> = {}
    for (const t of testsData ?? []) {
      testsById[t.id] = t.test_name
    }

    const goalsById: Record<string, MarkerGoal> = {}
    for (const g of goalsData ?? []) {
      goalsById[g.test_id] = {
        target_value: g.target_value,
        target_direction: g.target_direction,
        target_low: g.target_low,
        target_high: g.target_high,
      }
    }

    // Build marker data
    const markersData: Marker[] = testIds.map((tid) => {
      const results = byTestId[tid]
      const latestResult = results[0]
      const { category, label } = getStatusCategory(latestResult, goalsById[tid] || null)
      const trend = getTrend(results)

      return {
        testId: tid,
        testName: testsById[tid] ?? 'Unknown Test',
        latestValue: latestResult.value,
        unit: latestResult.unit,
        statusCategory: category,
        statusLabel: label,
        trend,
        date: formatDate(latestResult.drawn_at),
        resultCount: results.length,
      }
    })

    // Sort by most recent result
    markersData.sort((a, b) => {
      const aResult = byTestId[a.testId][0]
      const bResult = byTestId[b.testId][0]
      return new Date(bResult.drawn_at).getTime() - new Date(aResult.drawn_at).getTime()
    })

    setMarkers(markersData)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleDeleteMarker() {
    if (!deleteConfirm) return
    setDeleting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setDeleting(false); return }

    await supabase
      .from('lab_results')
      .delete()
      .eq('user_id', user.id)
      .eq('test_id', deleteConfirm.testId)

    setMarkers(prev => prev.filter(m => m.testId !== deleteConfirm.testId))
    setDeleteConfirm(null)
    setDeleting(false)
  }

  // Filter markers by search + status filter
  const filteredMarkers = markers.filter(marker => {
    if (searchQuery && !marker.testName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (activeFilter === 'out_of_range') return marker.statusCategory === 'out_of_range'
    if (activeFilter === 'suboptimal') return marker.statusCategory === 'suboptimal'
    if (activeFilter === 'optimal') return marker.statusCategory === 'optimal'
    return true
  })

  // Counts for filter pills
  const counts = {
    all: markers.length,
    out_of_range: markers.filter(m => m.statusCategory === 'out_of_range').length,
    suboptimal: markers.filter(m => m.statusCategory === 'suboptimal').length,
    optimal: markers.filter(m => m.statusCategory === 'optimal').length,
  }

  const isPremium = profile?.is_premium === true

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Premium activated banner */}
      {upgradeBanner && (
        <div className="rounded-xl border border-[#2d6a5e]/30 bg-[#2d6a5e]/10 px-6 py-4 text-center">
          <p className="text-base font-semibold text-[#2d6a5e]">Welcome to Premium! 🎉</p>
          <p className="mt-1 text-sm text-[#4a6b67]">Your account has been upgraded. Enjoy unlimited tracking.</p>
        </div>
      )}

      {/* Premium upgrade nudge */}
      {!isPremium && (
        <div className="rounded-xl border border-[#2d6a5e]/20 bg-[#f0f7f6] px-6 py-5 text-center">
          <h3 className="text-lg font-semibold text-[#1a2e2b]">Your results are ready.</h3>
          <p className="mt-2 text-sm text-[#577572]">
            Upgrade to Premium to save them to your dashboard and track changes over time.
          </p>
          <a
            href="/pricing"
            className="mt-4 inline-block rounded-xl bg-[#2d6a5e] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
          >
            Upgrade — $8/month or $59/year
          </a>
        </div>
      )}

      {isPremium && (
        <div className="rounded-2xl border border-[#e0ebe9] bg-white p-5 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-[#1a2e2b]">Your Results</h1>
              <p className="text-sm text-[#577572] mt-0.5">
                {markers.length} marker{markers.length !== 1 ? 's' : ''} tracked
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPdfImportModal(true)}
                className="rounded-xl bg-[#2d6a5e] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
              >
                Upload Lab Report
              </button>
              <button
                onClick={() => setShowLogModal(true)}
                className="rounded-xl border border-[#e0ebe9] px-4 py-2 text-sm font-medium text-[#577572] transition-colors hover:border-[#2d6a5e] hover:text-[#2d6a5e]"
              >
                Log Result
              </button>
            </div>
          </div>

          {markers.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0ebe9] py-16 px-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d6a5e]/10">
                <svg className="h-7 w-7 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#1a2e2b]">No results yet</h2>
              <p className="mt-2 max-w-sm text-sm text-[#577572]">
                Upload a lab report or log a result to get started.
              </p>
              <button
                onClick={() => setShowPdfImportModal(true)}
                className="mt-4 rounded-xl bg-[#2d6a5e] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
              >
                Upload Lab Report
              </button>
            </div>
          ) : (
            <>
              {/* Search bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search your tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#e0ebe9] px-4 py-2.5 text-sm placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
                />
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 mb-5 text-xs flex-wrap">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-[#2d6a5e] text-white'
                      : 'bg-[#f0f7f6] text-[#577572] hover:bg-[#e0ebe9]'
                  }`}
                >
                  All ({counts.all})
                </button>
                {counts.out_of_range > 0 && (
                  <button
                    onClick={() => setActiveFilter('out_of_range')}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                      activeFilter === 'out_of_range'
                        ? 'bg-[#b85c5c] text-white'
                        : 'bg-[#b85c5c]/10 text-[#b85c5c] hover:bg-[#b85c5c]/20'
                    }`}
                  >
                    Out of range ({counts.out_of_range})
                  </button>
                )}
                {counts.suboptimal > 0 && (
                  <button
                    onClick={() => setActiveFilter('suboptimal')}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                      activeFilter === 'suboptimal'
                        ? 'bg-[#c59030] text-white'
                        : 'bg-[#c59030]/10 text-[#c59030] hover:bg-[#c59030]/20'
                    }`}
                  >
                    Suboptimal ({counts.suboptimal})
                  </button>
                )}
                {counts.optimal > 0 && (
                  <button
                    onClick={() => setActiveFilter('optimal')}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                      activeFilter === 'optimal'
                        ? 'bg-[#2d6a5e] text-white'
                        : 'bg-[#2d6a5e]/10 text-[#2d6a5e] hover:bg-[#2d6a5e]/20'
                    }`}
                  >
                    Optimal ({counts.optimal})
                  </button>
                )}
              </div>

              {/* Marker rows */}
              <div className="divide-y divide-[#e0ebe9] rounded-xl border border-[#e0ebe9]">
                {filteredMarkers.map((marker) => {
                  const config = STATUS_CONFIG[marker.statusCategory]
                  return (
                    <div
                      key={marker.testId}
                      onClick={() => router.push(`/dashboard/tracker/${marker.testId}`)}
                      className="group flex items-center justify-between px-4 py-3 hover:bg-[#f0f7f6] cursor-pointer transition-colors"
                    >
                      {/* Left: dot + name */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0`} />
                        <span className="font-medium text-[#1a2e2b] truncate">{marker.testName}</span>
                      </div>

                      {/* Right: value, trend, status pill, date, delete, chevron */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="hidden sm:inline text-sm font-semibold text-[#1a2e2b] w-24 text-left">
                          {marker.latestValue}{marker.unit ? ` ${marker.unit}` : ''}
                        </span>
                        <span
                          className="hidden md:inline text-xs text-[#577572] w-12 text-center"
                          title={TREND_LABELS[marker.trend]}
                        >
                          {marker.trend}
                        </span>
                        <span className={`text-xs font-medium ${config.pillText} ${config.pillBg} px-2 py-0.5 rounded-full w-24 text-center hidden sm:inline-block`}>
                          {marker.statusLabel}
                        </span>
                        <span className="hidden lg:inline text-xs text-[#577572] w-16 text-right">{marker.date}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirm({ testId: marker.testId, testName: marker.testName, resultCount: marker.resultCount })
                          }}
                          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 rounded-lg text-[#577572] hover:text-[#b85c5c] hover:bg-[#b85c5c]/10 transition-all flex-shrink-0"
                          title="Delete test results"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                        <svg className="w-4 h-4 text-[#577572] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )
                })}
                {filteredMarkers.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-[#577572]">
                    No markers match your search.
                  </div>
                )}
              </div>

              <p className="text-xs text-[#577572] text-center mt-4">
                Click any row for trend charts, range details, and full history
              </p>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <ResultLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSuccess={loadData}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={loadData}
      />

      <PdfImportModal
        isOpen={showPdfImportModal}
        onClose={() => setShowPdfImportModal(false)}
        onSuccess={loadData}
      />

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#e0ebe9] bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[#1a2e2b]">Delete {deleteConfirm.testName}?</h3>
            <p className="mt-2 text-sm text-[#577572]">
              This will remove all {deleteConfirm.resultCount} saved result{deleteConfirm.resultCount !== 1 ? 's' : ''} for this test. This cannot be undone.
            </p>
            <div className="mt-5 flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="rounded-xl border border-[#e0ebe9] px-4 py-2 text-sm font-medium text-[#577572] transition-colors hover:bg-[#faf8f5]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMarker}
                disabled={deleting}
                className="rounded-xl bg-[#b85c5c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a04e4e] disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
