'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import ResultLogModal from '@/components/tracker/ResultLogModal'
import ImportModal from '@/components/tracker/ImportModal'
import PdfImportModal from '@/components/dashboard/PdfImportModal'
import ShareModal from '@/components/dashboard/ShareModal'

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
  import_session_id: string | null
  physician_name: string | null
  value_qualifier: string | null
}

type FunctionalRange = {
  functional_low: number | null
  functional_high: number | null
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
  qualifier: string | null
  statusCategory: StatusCategory
  statusLabel: string
  functionalLabel: boolean
  trend: string
  date: string
  resultCount: number
}

type VisitMarker = {
  testName: string
  value: number
  unit: string | null
  ref_range_low: number | null
  ref_range_high: number | null
  status: 'in_range' | 'out_of_range' | 'no_range'
}

type VisitCard = {
  date: string
  dateFormatted: string
  labName: string | null
  physicianName: string | null
  markerCount: number
  markers: VisitMarker[]
  importSessionIds: string[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const yr = String(d.getUTCFullYear()).slice(-2)
  return `${mo}/${day}/${yr}`
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

function getStatusCategory(result: MarkerResult, goal: MarkerGoal | null, isPremium: boolean = false, funcRange: FunctionalRange | null = null): { category: StatusCategory; label: string; functional: boolean } {
  const { value, ref_range_low, ref_range_high } = result
  const functional_low = funcRange?.functional_low ?? null
  const functional_high = funcRange?.functional_high ?? null

  // If no reference range at all
  if (ref_range_low === null || ref_range_high === null) {
    return { category: 'no_range', label: 'No Range', functional: false }
  }

  // Out of lab range entirely
  if (value < ref_range_low || value > ref_range_high) {
    return { category: 'out_of_range', label: 'Out of Range', functional: false }
  }

  // Premium: check functional range (if within lab range but outside functional range)
  if (isPremium && functional_low !== null && functional_high !== null) {
    if (value < functional_low || value > functional_high) {
      return { category: 'suboptimal', label: 'Suboptimal', functional: true }
    }
    return { category: 'optimal', label: 'Optimal', functional: true }
  }

  // User goal (overrides for personalization)
  if (goal) {
    if (goal.target_direction === 'range' && goal.target_low !== null && goal.target_high !== null) {
      if (value < goal.target_low || value > goal.target_high) {
        return { category: 'suboptimal', label: 'Suboptimal', functional: false }
      }
      return { category: 'optimal', label: 'Optimal', functional: false }
    }
    if (goal.target_direction === 'above' && goal.target_value !== null) {
      if (value < goal.target_value) {
        return { category: 'suboptimal', label: 'Suboptimal', functional: false }
      }
      return { category: 'optimal', label: 'Optimal', functional: false }
    }
    if (goal.target_direction === 'below' && goal.target_value !== null) {
      if (value > goal.target_value) {
        return { category: 'suboptimal', label: 'Suboptimal', functional: false }
      }
      return { category: 'optimal', label: 'Optimal', functional: false }
    }
  }

  // In range, no goal set
  return { category: 'optimal', label: 'In Range', functional: false }
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

const STATUS_CONFIG: Record<StatusCategory, { pillBg: string; pillText: string }> = {
  out_of_range: { pillBg: 'bg-[#b85c5c]', pillText: 'text-white' },
  suboptimal: { pillBg: '', pillText: 'text-[#c59030]' },
  optimal: { pillBg: '', pillText: 'text-[#577572]' },
  no_range: { pillBg: '', pillText: '' },
}

const TREND_LABELS: Record<string, string> = {
  '↑': 'Rising',
  '↓': 'Declining',
  '→': 'Stable',
  '—': 'First result',
}

type ShareLink = {
  id: string
  title: string | null
  created_at: string
  share_token: string
  is_active: boolean
}

type FilterKey = 'all' | 'out_of_range' | 'suboptimal' | 'optimal'
type TabKey = 'results' | 'visits'

function DashboardContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [visits, setVisits] = useState<VisitCard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('results')
  const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set())
  const [visitSort, setVisitSort] = useState<'newest' | 'oldest' | 'az'>('newest')
  const [upgradeBanner, setUpgradeBanner] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const [showLogModal, setShowLogModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPdfImportModal, setShowPdfImportModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ testId: string; testName: string; resultCount: number } | null>(null)
  const [showSuboptimalTip, setShowSuboptimalTip] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shares, setShares] = useState<ShareLink[]>([])
  const [deactivatingShare, setDeactivatingShare] = useState<string | null>(null)
  const [deactivateConfirm, setDeactivateConfirm] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState<string | null>(null)
  const [visitDeleteConfirm, setVisitDeleteConfirm] = useState<{ date: string; importSessionIds: string[]; markerCount: number } | null>(null)
  const [visitDeleting, setVisitDeleting] = useState(false)

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
    if (!user) { setLoading(false); setIsLoggedIn(false); return }
    setIsLoggedIn(true)

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, plan, plan_status, is_premium')
      .eq('id', user.id)
      .single()
    if (profileData) setProfile(profileData)

    // Load all lab results (graceful fallback if value_qualifier column doesn't exist yet)
    const labQuery = await supabase
      .from('lab_results')
      .select('id, test_id, value, unit, drawn_at, lab_name, ref_range_low, ref_range_high, notes, import_session_id, physician_name, value_qualifier')
      .eq('user_id', user.id)
      .order('drawn_at', { ascending: false })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resultsData: any[] | null = labQuery.data
    if (labQuery.error) {
      const fallbackQuery = await supabase
        .from('lab_results')
        .select('id, test_id, value, unit, drawn_at, lab_name, ref_range_low, ref_range_high, notes, import_session_id, physician_name')
        .eq('user_id', user.id)
        .order('drawn_at', { ascending: false })
      resultsData = fallbackQuery.data
    }

    // Load goals
    const { data: goalsData } = await supabase
      .from('lab_goals')
      .select('test_id, target_value, target_direction, target_low, target_high')
      .eq('user_id', user.id)

    if (!resultsData || resultsData.length === 0) {
      setMarkers([])
      setVisits([])
      setLoading(false)
      return
    }

    // Group results by test_id
    const byTestId: Record<string, MarkerResult[]> = {}
    for (const r of resultsData) {
      if (!byTestId[r.test_id]) byTestId[r.test_id] = []
      byTestId[r.test_id].push(r)
    }

    // Fetch test names + functional ranges (graceful fallback if columns don't exist yet)
    const testIds = Object.keys(byTestId)
    const testsResult = await supabase
      .from('tests')
      .select('id, test_name, functional_low, functional_high')
      .in('id', testIds)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let testsData: any[] | null = testsResult.data
    if (testsResult.error) {
      const fallback = await supabase.from('tests').select('id, test_name').in('id', testIds)
      testsData = fallback.data
    }

    const testsById: Record<string, { test_name: string; functional_low: number | null; functional_high: number | null }> = {}
    for (const t of testsData ?? []) {
      testsById[t.id] = { test_name: t.test_name, functional_low: t.functional_low ?? null, functional_high: t.functional_high ?? null }
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
    const userIsPremium = profileData?.is_premium === true
    const markersData: Marker[] = testIds.map((tid) => {
      const results = byTestId[tid]
      const latestResult = results[0]
      const funcRange = testsById[tid] ? { functional_low: testsById[tid].functional_low, functional_high: testsById[tid].functional_high } : null
      const { category, label, functional } = getStatusCategory(latestResult, goalsById[tid] || null, userIsPremium, funcRange)
      const trend = getTrend(results)

      return {
        testId: tid,
        testName: testsById[tid]?.test_name ?? 'Unknown Test',
        latestValue: latestResult.value,
        unit: latestResult.unit,
        qualifier: latestResult.value_qualifier ?? null,
        statusCategory: category,
        statusLabel: label,
        functionalLabel: functional,
        trend,
        date: formatDate(latestResult.drawn_at),
        resultCount: results.length,
      }
    })

    // Sort alphabetically by test name
    markersData.sort((a, b) => a.testName.localeCompare(b.testName))

    setMarkers(markersData)

    // Build visit cards grouped by drawn_at date
    const byDate: Record<string, { results: MarkerResult[]; labNames: Set<string>; sessionIds: Set<string>; physicianNames: Set<string> }> = {}
    for (const r of resultsData) {
      const dateKey = r.drawn_at
      if (!byDate[dateKey]) byDate[dateKey] = { results: [], labNames: new Set(), sessionIds: new Set(), physicianNames: new Set() }
      byDate[dateKey].results.push(r)
      if (r.lab_name) byDate[dateKey].labNames.add(r.lab_name)
      if (r.import_session_id) byDate[dateKey].sessionIds.add(r.import_session_id)
      if (r.physician_name) byDate[dateKey].physicianNames.add(r.physician_name)
    }

    const visitsData: VisitCard[] = Object.entries(byDate)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, { results: dateResults, labNames, sessionIds, physicianNames }]) => {
        const visitMarkers: VisitMarker[] = dateResults
          .map(r => {
            let status: 'in_range' | 'out_of_range' | 'no_range' = 'no_range'
            if (r.ref_range_low !== null && r.ref_range_high !== null) {
              status = (r.value < r.ref_range_low || r.value > r.ref_range_high) ? 'out_of_range' : 'in_range'
            }
            return {
              testName: testsById[r.test_id]?.test_name ?? 'Unknown Test',
              value: r.value,
              unit: r.unit,
              ref_range_low: r.ref_range_low,
              ref_range_high: r.ref_range_high,
              status,
            }
          })
          .sort((a, b) => a.testName.localeCompare(b.testName))

        return {
          date,
          dateFormatted: formatDateLong(date),
          labName: labNames.size > 0 ? [...labNames].join(', ') : null,
          physicianName: physicianNames.size > 0 ? [...physicianNames].join(', ') : null,
          markerCount: dateResults.length,
          markers: visitMarkers,
          importSessionIds: [...sessionIds],
        }
      })

    setVisits(visitsData)

    // Load existing share links
    const { data: sharesData } = await supabase
      .from('lab_shares')
      .select('id, title, created_at, share_token, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    setShares(sharesData ?? [])

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

  async function handleDeleteVisit() {
    if (!visitDeleteConfirm) return
    setVisitDeleting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setVisitDeleting(false); return }

    const { date } = visitDeleteConfirm
    // Delete all results for this user on this draw date (covers both session-tracked and legacy imports)
    await supabase
      .from('lab_results')
      .delete()
      .eq('user_id', user.id)
      .eq('drawn_at', date)

    setVisitDeleteConfirm(null)
    setVisitDeleting(false)
    loadData()
  }

  function toggleVisit(date: string) {
    setExpandedVisits(prev => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  // Filter markers by search + status filter
  const filteredMarkers = markers.filter(marker => {
    if (searchQuery && !marker.testName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (activeFilter === 'out_of_range') return marker.statusCategory === 'out_of_range'
    if (activeFilter === 'suboptimal') return marker.statusCategory === 'suboptimal'
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

  if (isLoggedIn === false) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#1a2e2b' }}>
            Track your labs over time
          </h1>
          <p className="text-base mb-2" style={{ color: '#4a6b67' }}>
            Upload your results, see trends, and spot what&apos;s changing — all in one place.
          </p>
          <p className="text-sm mb-8" style={{ color: '#577572' }}>
            Premium feature — $8/month or $59/year. Import from any lab PDF or CSV.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/signup"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#2d6a5e' }}
            >
              Create a free account
            </a>
            <a
              href="/login"
              className="rounded-xl px-6 py-3 text-sm font-semibold border transition-colors"
              style={{ borderColor: '#2d6a5e', color: '#2d6a5e' }}
            >
              Log in
            </a>
          </div>
          <p className="text-xs mt-6" style={{ color: '#577572' }}>
            Already have results saved?{' '}
            <a href="/login" className="underline hover:text-[#2d6a5e]">Log in to view your dashboard.</a>
          </p>
        </div>
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
            href="/plans"
            className="mt-4 inline-block rounded-xl bg-[#2d6a5e] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
          >
            Upgrade — $8/month or $59/year
          </a>
        </div>
      )}

      {isPremium && (
        <>
        <div className="rounded-2xl border border-[#e0ebe9] bg-white p-5 md:p-8">
          {/* Header */}
          <div className="mb-5">
            {/* Row 1: title + primary CTA */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-[#1a2e2b]">Your Results</h1>
                <p className="text-sm text-[#577572] mt-0.5">
                  {markers.length} marker{markers.length !== 1 ? 's' : ''} tracked
                </p>
              </div>
              <button
                onClick={() => setShowPdfImportModal(true)}
                className="flex-shrink-0 rounded-xl bg-[#2d6a5e] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245549] whitespace-nowrap"
              >
                <span className="sm:hidden">Upload Report</span>
                <span className="hidden sm:inline">Upload Lab Report</span>
              </button>
            </div>

            {/* Row 2: secondary actions (only when there are results) */}
            {markers.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="rounded-xl border border-[#e0ebe9] px-3 py-1.5 text-sm font-medium text-[#577572] transition-colors hover:border-[#2d6a5e] hover:text-[#2d6a5e] flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                  </svg>
                  Share
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="rounded-xl border border-[#e0ebe9] px-3 py-1.5 text-sm font-medium text-[#577572] transition-colors hover:border-[#2d6a5e] hover:text-[#2d6a5e] flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export
                    <svg className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {showExportMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                      <div className="absolute left-0 top-full mt-1 z-50 w-52 rounded-xl border border-[#e0ebe9] bg-white py-1 shadow-lg">
                        <a
                          href="/api/export/csv"
                          onClick={() => setShowExportMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1a2e2b] hover:bg-[#f0f7f6] transition-colors"
                        >
                          <svg className="w-4 h-4 text-[#577572]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                          Download CSV
                        </a>
                        <a
                          href="/dashboard/export/print"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowExportMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1a2e2b] hover:bg-[#f0f7f6] transition-colors"
                        >
                          <svg className="w-4 h-4 text-[#577572]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M9.75 8.25h.008v.008H9.75V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                          Print / Save as PDF
                        </a>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowLogModal(true)}
                  className="rounded-xl border border-[#e0ebe9] px-3 py-1.5 text-sm font-medium text-[#577572] transition-colors hover:border-[#2d6a5e] hover:text-[#2d6a5e]"
                >
                  Log Result
                </button>
              </div>
            )}
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-5 border-b border-[#e0ebe9]">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'results'
                  ? 'border-[#2d6a5e] text-[#2d6a5e]'
                  : 'border-transparent text-[#577572] hover:text-[#1a2e2b]'
              }`}
            >
              Latest Results
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'visits'
                  ? 'border-[#2d6a5e] text-[#2d6a5e]'
                  : 'border-transparent text-[#577572] hover:text-[#1a2e2b]'
              }`}
            >
              All Reports
            </button>
          </div>

          {/* My Results tab */}
          {activeTab === 'results' && (
            <>
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
                  <div className="flex gap-2 mb-5 text-xs flex-wrap items-center">
                    {counts.out_of_range > 0 && (
                      <button
                        onClick={() => setActiveFilter(activeFilter === 'out_of_range' ? null : 'out_of_range')}
                        className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                          activeFilter === 'out_of_range'
                            ? 'bg-[#b85c5c] text-white'
                            : 'bg-[#b85c5c]/10 text-[#b85c5c] hover:bg-[#b85c5c]/20'
                        }`}
                      >
                        Out of Range ({counts.out_of_range})
                      </button>
                    )}
                    {counts.suboptimal > 0 && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setActiveFilter(activeFilter === 'suboptimal' ? null : 'suboptimal')}
                          className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                            activeFilter === 'suboptimal'
                              ? 'bg-[#c59030] text-white'
                              : 'bg-[#c59030]/10 text-[#c59030] hover:bg-[#c59030]/20'
                          }`}
                        >
                          Suboptimal ({counts.suboptimal})
                        </button>
                        <div className="relative inline-flex items-center">
                          {showSuboptimalTip && (
                            <div className="fixed inset-0 z-40" onClick={() => setShowSuboptimalTip(false)} />
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowSuboptimalTip(v => !v) }}
                            className="p-2 -m-1 rounded-full text-[#577572] hover:text-[#1a2e2b] transition-colors"
                            aria-label="About Suboptimal ranges"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                          </button>
                          {showSuboptimalTip && (
                            <div className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-lg bg-[#1a2e2b] px-3 py-2.5 text-xs text-white shadow-lg">
                              Suboptimal ranges are based on functional medicine research and may differ from your lab&apos;s standard reference ranges.
                              <div className="absolute top-full left-4 border-4 border-transparent border-t-[#1a2e2b]" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Marker table */}
                  <div className="rounded-xl border border-[#e0ebe9] overflow-hidden">
                    <table className="w-full table-fixed border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-[#f0f7f6] border-b border-[#e0ebe9]">
                          <th className="w-1 p-0" />
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-[#577572]">Marker</th>
                          <th className="w-14 px-3 py-2.5 text-left text-xs font-medium text-[#577572]">Value</th>
                          <th className="w-16 px-3 py-2.5 text-left text-xs font-medium text-[#577572] hidden sm:table-cell">Unit</th>
                          <th className="w-28 px-3 py-2.5 text-left text-xs font-medium text-[#577572]">Status</th>
                          <th className="w-10 p-0 hidden sm:table-cell" />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMarkers.map((marker) => (
                          <tr
                            key={marker.testId}
                            onClick={() => router.push(`/dashboard/tracker/${marker.testId}`)}
                            className="group border-t border-[#e0ebe9] hover:bg-[#f0f7f6] cursor-pointer transition-colors"
                          >
                            {/* Left color chip */}
                            <td className={`w-1 p-0 ${
                              marker.statusCategory === 'out_of_range' ? 'bg-[#b85c5c]' :
                              marker.statusCategory === 'suboptimal' ? 'bg-[#c59030]' : ''
                            }`} />

                            {/* Marker name */}
                            <td className="px-3 py-3 text-sm font-medium text-[#1a2e2b]">
                              <span className="truncate block">{marker.testName}</span>
                            </td>

                            {/* Value */}
                            <td className="px-3 py-3 text-sm font-semibold text-[#1a2e2b]">
                              {marker.qualifier || ''}{marker.latestValue}
                            </td>

                            {/* Unit */}
                            <td className="px-3 py-3 text-sm text-[#577572] hidden sm:table-cell">
                              {marker.unit || '—'}
                            </td>

                            {/* Status */}
                            <td className="px-3 py-3">
                              {marker.statusCategory === 'out_of_range' && (
                                <>
                                  <span className="sm:hidden text-xs font-medium text-[#b85c5c] whitespace-nowrap">Out of Range</span>
                                  <span className="hidden sm:inline bg-[#b85c5c] text-white text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">Out of Range</span>
                                </>
                              )}
                              {marker.statusCategory === 'suboptimal' && (
                                <>
                                  <span className="sm:hidden text-xs font-medium text-[#c59030] whitespace-nowrap">Suboptimal</span>
                                  <span className="hidden sm:inline border border-[#c59030] text-[#c59030] text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">Suboptimal{marker.functionalLabel ? ' *' : ''}</span>
                                </>
                              )}
                              {marker.statusCategory === 'optimal' && (
                                <span className="text-xs text-[#577572] whitespace-nowrap">In Range</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-0 hidden sm:table-cell">
                              <div className="flex items-center justify-end gap-2 px-3 py-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteConfirm({ testId: marker.testId, testName: marker.testName, resultCount: marker.resultCount })
                                  }}
                                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 rounded-lg text-[#577572] hover:text-[#b85c5c] hover:bg-[#b85c5c]/10 transition-all"
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
                            </td>
                          </tr>
                        ))}
                        {filteredMarkers.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#577572]">
                              No markers match your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </>
              )}
            </>
          )}

          {/* Lab Visits tab */}
          {activeTab === 'visits' && (
            <>
              {visits.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0ebe9] py-16 px-8 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d6a5e]/10">
                    <svg className="h-7 w-7 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-[#1a2e2b]">No lab visits yet</h2>
                  <p className="mt-2 max-w-sm text-sm text-[#577572]">
                    Upload a lab report to see your results grouped by visit date.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Sort control */}
                  <div className="flex items-center justify-end gap-1.5 text-xs">
                    <span className="text-[#577572]">Sort:</span>
                    {(['newest', 'oldest', 'az'] as const).map((opt) => {
                      const labels = { newest: 'Newest first', oldest: 'Oldest first', az: 'A\u2013Z' }
                      return (
                        <button
                          key={opt}
                          onClick={() => setVisitSort(opt)}
                          className={`px-2 py-1 rounded-full font-medium transition-colors ${
                            visitSort === opt
                              ? 'bg-[#2d6a5e] text-white'
                              : 'bg-[#f0f7f6] text-[#577572] hover:bg-[#e0ebe9]'
                          }`}
                        >
                          {labels[opt]}
                        </button>
                      )
                    })}
                  </div>
                  {[...visits].sort((a, b) => {
                    if (visitSort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime()
                    if (visitSort === 'az') return (a.labName ?? '').localeCompare(b.labName ?? '')
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                  }).map((visit) => {
                    const isExpanded = expandedVisits.has(visit.date)
                    return (
                      <div
                        key={visit.date}
                        className="rounded-xl border border-[#e0ebe9] overflow-hidden"
                      >
                        {/* Visit header */}
                        <div className="group/visit flex items-center">
                          <button
                            onClick={() => toggleVisit(visit.date)}
                            className="flex-1 flex items-center justify-between px-4 py-3.5 hover:bg-[#f0f7f6] transition-colors text-left"
                          >
                            <div className="min-w-0">
                              <p className="font-semibold text-[#1a2e2b]">{visit.dateFormatted}</p>
                              {(visit.labName || visit.physicianName) && (
                                <p className="text-xs text-[#577572] mt-0.5">
                                  {[visit.labName, visit.physicianName].filter(Boolean).join(' · ')}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-xs text-[#577572]">
                                {visit.markerCount} marker{visit.markerCount !== 1 ? 's' : ''}
                              </span>
                              <svg
                                className={`w-4 h-4 text-[#577572] transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                          {visit.importSessionIds.length > 0 && (
                            <button
                              onClick={() => setVisitDeleteConfirm({ date: visit.date, importSessionIds: visit.importSessionIds, markerCount: visit.markerCount })}
                              className="opacity-100 sm:opacity-0 sm:group-hover/visit:opacity-100 p-2 mr-2 rounded-lg text-[#577572] hover:text-[#b85c5c] hover:bg-[#b85c5c]/10 transition-all flex-shrink-0"
                              title="Delete this import"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Expanded marker table */}
                        {isExpanded && (
                          <div className="border-t border-[#e0ebe9]">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-[#faf8f5] text-[#4a6b67] text-xs">
                                  <th className="px-3 py-2 text-left font-medium">Marker</th>
                                  <th className="px-3 py-2 text-left font-medium">Value</th>
                                  <th className="px-3 py-2 text-left font-medium hidden sm:table-cell">Unit</th>
                                  <th className="px-3 py-2 text-left font-medium">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {visit.markers.map((m, i) => (
                                  <tr
                                    key={i}
                                    className={`border-t border-[#e0ebe9] ${i % 2 === 1 ? 'bg-[#faf8f5]/50' : ''}`}
                                  >
                                    <td className="px-3 py-2 text-[#1a2e2b] font-medium">{m.testName}</td>
                                    <td className="px-3 py-2 text-[#1a2e2b] font-semibold whitespace-nowrap">{m.value}</td>
                                    <td className="px-3 py-2 text-[#577572] hidden sm:table-cell whitespace-nowrap">{m.unit || '—'}</td>
                                    <td className="px-3 py-2">
                                      {m.status === 'in_range' && (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2d6a5e]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a5e]" />
                                          In Range
                                        </span>
                                      )}
                                      {m.status === 'out_of_range' && (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#b85c5c]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#b85c5c]" />
                                          Out of Range
                                        </span>
                                      )}
                                      {m.status === 'no_range' && (
                                        <span className="text-xs text-[#577572]">—</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Shared Links section */}
        {shares.length > 0 && (
          <div className="mt-6 rounded-2xl border border-[#e0ebe9] bg-white p-5 md:p-8">
            <h2 className="text-base font-semibold text-[#1a2e2b] mb-4">Shared Links</h2>
            <div className="divide-y divide-[#e0ebe9] rounded-xl border border-[#e0ebe9]">
              {shares.map((share) => (
                <div key={share.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1a2e2b] truncate">
                      {share.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-[#577572]">
                      {new Date(share.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(`https://lablooker.com/shared/${share.share_token}`)
                        setShareCopied(share.id)
                        setTimeout(() => setShareCopied(null), 2000)
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        shareCopied === share.id
                          ? 'bg-[#2d6a5e]/10 text-[#2d6a5e]'
                          : 'bg-[#2d6a5e] text-white hover:bg-[#245549]'
                      }`}
                    >
                      {shareCopied === share.id ? 'Copied \u2713' : 'Copy'}
                    </button>
                    {deactivateConfirm === share.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={async () => {
                            setDeactivatingShare(share.id)
                            try {
                              const res = await fetch('/api/share/deactivate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ shareId: share.id }),
                              })
                              if (res.ok) {
                                setShares(prev => prev.filter(s => s.id !== share.id))
                              }
                            } catch { /* ignore */ }
                            setDeactivatingShare(null)
                            setDeactivateConfirm(null)
                          }}
                          disabled={deactivatingShare === share.id}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-white bg-[#b85c5c] hover:bg-[#a04e4e] transition-colors disabled:opacity-60"
                        >
                          {deactivatingShare === share.id ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setDeactivateConfirm(null)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#577572] hover:bg-[#f0f7f6] transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeactivateConfirm(share.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#b85c5c] hover:bg-[#b85c5c]/10 transition-colors"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
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

      <ShareModal
        isOpen={showShareModal}
        onClose={() => { setShowShareModal(false); loadData() }}
        tests={markers.map(m => ({ testId: m.testId, testName: m.testName }))}
      />

      {/* Delete confirmation modal (single test) */}
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

      {/* Delete import session confirmation modal */}
      {visitDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="w-full max-w-sm rounded-2xl border border-[#e0ebe9] bg-white p-6 shadow-xl"
            onKeyDown={(e) => { if (e.key === 'Enter' && !visitDeleting) handleDeleteVisit() }}
          >
            <h3 className="text-lg font-semibold text-[#1a2e2b]">Delete this import?</h3>
            <p className="mt-2 text-sm text-[#577572]">
              This will remove all {visitDeleteConfirm.markerCount} result{visitDeleteConfirm.markerCount !== 1 ? 's' : ''} from this lab visit. This cannot be undone.
            </p>
            <div className="mt-5 flex gap-3 justify-end">
              <button
                onClick={() => setVisitDeleteConfirm(null)}
                disabled={visitDeleting}
                autoFocus
                className="rounded-xl border border-[#e0ebe9] px-4 py-2 text-sm font-medium text-[#577572] transition-colors hover:bg-[#faf8f5]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVisit}
                disabled={visitDeleting}
                className="rounded-xl bg-[#b85c5c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a04e4e] disabled:opacity-60"
              >
                {visitDeleting ? 'Deleting...' : 'Delete'}
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
