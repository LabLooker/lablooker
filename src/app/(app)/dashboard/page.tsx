'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ResultLogModal from '@/components/tracker/ResultLogModal'
import ImportModal from '@/components/tracker/ImportModal'
import PdfImportModal from '@/components/dashboard/PdfImportModal'

type Profile = {
  full_name: string | null
  plan: string
  plan_status: string
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

type Marker = {
  testId: string
  testName: string
  latestValue: number
  unit: string | null
  status: string
  statusColor: string
  trend: string
  trendColor: string
  goal: string
  goalMet: boolean
  date: string
  resultCount: number
  labs: string[]
  daysSinceUpdate: number
}

type Report = {
  id: string
  date: string
  sourceLab: string | null
  panelTitle: string | null
  markerCount: number
  importMethod: string
  unmatchedCount: number
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getStatus(result: MarkerResult): { status: string; color: string } {
  const { value, ref_range_low, ref_range_high } = result

  if (ref_range_low !== null && ref_range_high !== null) {
    if (value < ref_range_low) return { status: 'Low', color: 'text-[#c0826a] bg-[#c0826a]/10' }
    if (value > ref_range_high) return { status: 'High', color: 'text-[#c0826a] bg-[#c0826a]/10' }
    return { status: 'In Range', color: 'text-[#2d6a5e] bg-[#2d6a5e]/10' }
  }

  return { status: 'No Range', color: 'text-[#577572] bg-[#577572]/10' }
}

function getTrend(results: MarkerResult[]): { trend: string; color: string } {
  if (results.length < 2) return { trend: '→', color: 'text-[#577572]' }

  const sorted = [...results].sort((a, b) => new Date(a.drawn_at).getTime() - new Date(b.drawn_at).getTime())
  const latest = sorted[sorted.length - 1].value
  const prev = sorted[sorted.length - 2].value
  const diff = latest - prev

  if (Math.abs(diff) < 0.001) return { trend: '→', color: 'text-[#577572]' }

  if (diff > 0) return { trend: '↑', color: 'text-[#2d6a5e]' }
  return { trend: '↓', color: 'text-[#c0826a]' }
}

function getGoalStatus(result: MarkerResult, goal: MarkerGoal | null): { goal: string; met: boolean } {
  if (!goal) return { goal: '—', met: false }

  const { value } = result

  if (goal.target_direction === 'above' && goal.target_value !== null) {
    const met = value >= goal.target_value
    return {
      goal: met ? '✓ At goal' : `Below goal (${goal.target_value}+)`,
      met
    }
  }

  if (goal.target_direction === 'below' && goal.target_value !== null) {
    const met = value <= goal.target_value
    return {
      goal: met ? '✓ At goal' : `Above goal (<${goal.target_value})`,
      met
    }
  }

  if (goal.target_direction === 'range' && goal.target_low !== null && goal.target_high !== null) {
    const met = value >= goal.target_low && value <= goal.target_high
    return {
      goal: met ? '✓ At goal' : `Outside range (${goal.target_low}-${goal.target_high})`,
      met
    }
  }

  return { goal: '—', met: false }
}

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'markers' | 'reports'>('markers')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    outOfRange: false,
    belowGoal: false,
    needsUpdate: false
  })

  const [showLogModal, setShowLogModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPdfImportModal, setShowPdfImportModal] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, plan, plan_status')
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

    // Load reports
    const { data: reportsData } = await supabase
      .from('lab_reports')
      .select('id, source_lab, panel_title, import_method, drawn_at, marker_count, unmatched_count, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!resultsData || resultsData.length === 0) {
      setMarkers([])
      setReports(reportsData?.map(r => ({
        id: r.id,
        date: formatDate(r.drawn_at || r.created_at),
        sourceLab: r.source_lab,
        panelTitle: r.panel_title,
        markerCount: r.marker_count || 0,
        importMethod: r.import_method || 'manual',
        unmatchedCount: r.unmatched_count || 0
      })) || [])
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
      const status = getStatus(latestResult)
      const trend = getTrend(results)
      const goalStatus = getGoalStatus(latestResult, goalsById[tid] || null)

      const labs = Array.from(new Set(results.map(r => r.lab_name).filter(Boolean))) as string[]
      const daysSinceUpdate = Math.floor((Date.now() - new Date(latestResult.drawn_at + 'T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24))

      return {
        testId: tid,
        testName: testsById[tid] ?? 'Unknown Test',
        latestValue: latestResult.value,
        unit: latestResult.unit,
        status: status.status,
        statusColor: status.color,
        trend: trend.trend,
        trendColor: trend.color,
        goal: goalStatus.goal,
        goalMet: goalStatus.met,
        date: formatDate(latestResult.drawn_at),
        resultCount: results.length,
        labs,
        daysSinceUpdate
      }
    })

    // Sort markers by most recent result
    markersData.sort((a, b) => {
      const aResult = byTestId[a.testId][0]
      const bResult = byTestId[b.testId][0]
      return new Date(bResult.drawn_at).getTime() - new Date(aResult.drawn_at).getTime()
    })

    setMarkers(markersData)

    // Set reports
    setReports(reportsData?.map(r => ({
      id: r.id,
      date: formatDate(r.drawn_at || r.created_at),
      sourceLab: r.source_lab,
      panelTitle: r.panel_title,
      markerCount: r.marker_count || 0,
      importMethod: r.import_method || 'manual',
      unmatchedCount: r.unmatched_count || 0
    })) || [])

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report and all its results?')) return

    await supabase.from('lab_reports').delete().eq('id', reportId)
    loadData()
  }

  // Filter markers
  const filteredMarkers = markers.filter(marker => {
    if (searchQuery && !marker.testName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    if (filters.outOfRange && marker.status === 'In Range') return false
    if (filters.belowGoal && marker.goalMet) return false
    if (filters.needsUpdate && marker.daysSinceUpdate < 90) return false

    return true
  })

  // Summary stats
  const totalMarkers = markers.length
  const inRange = markers.filter(m => m.status === 'In Range').length
  const outOfRange = markers.filter(m => m.status !== 'In Range' && m.status !== 'No Range').length
  const belowGoal = markers.filter(m => !m.goalMet && m.goal !== '—').length
  const needsUpdate = markers.filter(m => m.daysSinceUpdate > 90).length

  const FREE_LIMIT = 5
  const isAtFreeLimit = profile?.plan === 'free' && totalMarkers >= FREE_LIMIT

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e2b]">Track</h1>
          <p className="text-sm text-[#577572]">Monitor your biomarkers and lab reports</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            disabled={isAtFreeLimit}
            className="rounded-xl bg-[#2d6a5e] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245549] disabled:opacity-60"
          >
            Log Result
          </button>
          <button
            onClick={() => setShowPdfImportModal(true)}
            className="rounded-xl border border-[#2d6a5e] bg-white px-4 py-2 text-sm font-semibold text-[#2d6a5e] transition-colors hover:bg-[#2d6a5e]/5"
          >
            Import PDF
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="rounded-xl border border-[#2d6a5e] bg-white px-4 py-2 text-sm font-semibold text-[#2d6a5e] transition-colors hover:bg-[#2d6a5e]/5"
          >
            Import CSV
          </button>
        </div>
      </div>

      {/* Free limit warning */}
      {isAtFreeLimit && (
        <div className="rounded-xl border border-[#c0826a]/30 bg-[#c0826a]/5 px-5 py-4">
          <p className="text-sm text-[#1a2e2b]">
            <span className="font-semibold">You&apos;ve tracked {FREE_LIMIT} tests</span> — that&apos;s the free plan limit.{' '}
            <a href="/pricing" className="font-medium text-[#2d6a5e] underline hover:no-underline">
              Upgrade to Premium
            </a>{' '}
            to track unlimited tests.
          </p>
        </div>
      )}

      {/* Summary strip */}
      {totalMarkers > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[#f0f7f6] px-3 py-2">
            <span className="text-sm text-[#577572]">Markers tracked</span>
            <span className="font-semibold text-[#1a2e2b]">{totalMarkers}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[#2d6a5e]/10 px-3 py-2">
            <span className="text-sm text-[#2d6a5e]">In range</span>
            <span className="font-semibold text-[#2d6a5e]">{inRange}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[#c0826a]/10 px-3 py-2">
            <span className="text-sm text-[#c0826a]">Out of range</span>
            <span className="font-semibold text-[#c0826a]">{outOfRange}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[#c0826a]/10 px-3 py-2">
            <span className="text-sm text-[#c0826a]">Below goal</span>
            <span className="font-semibold text-[#c0826a]">{belowGoal}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[#577572]/10 px-3 py-2">
            <span className="text-sm text-[#577572]">Needs update (&gt;90 days)</span>
            <span className="font-semibold text-[#577572]">{needsUpdate}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex rounded-lg border border-[#e0ebe9] bg-white p-1">
          <button
            onClick={() => setActiveTab('markers')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'markers'
                ? 'bg-[#2d6a5e] text-white'
                : 'text-[#577572] hover:text-[#1a2e2b]'
            }`}
          >
            Markers
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-[#2d6a5e] text-white'
                : 'text-[#577572] hover:text-[#1a2e2b]'
            }`}
          >
            Reports
          </button>
        </div>

        {/* Search and filters for markers tab */}
        {activeTab === 'markers' && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search markers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-[#e0ebe9] px-3 py-2 text-sm focus:border-[#2d6a5e] focus:outline-none"
            />
            <button
              onClick={() => setFilters(prev => ({ ...prev, outOfRange: !prev.outOfRange }))}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                filters.outOfRange
                  ? 'bg-[#c0826a] text-white'
                  : 'bg-[#f0f7f6] text-[#577572] hover:bg-[#e0ebe9]'
              }`}
            >
              Out of range
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, belowGoal: !prev.belowGoal }))}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                filters.belowGoal
                  ? 'bg-[#c0826a] text-white'
                  : 'bg-[#f0f7f6] text-[#577572] hover:bg-[#e0ebe9]'
              }`}
            >
              Below goal
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, needsUpdate: !prev.needsUpdate }))}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                filters.needsUpdate
                  ? 'bg-[#577572] text-white'
                  : 'bg-[#f0f7f6] text-[#577572] hover:bg-[#e0ebe9]'
              }`}
            >
              Needs update
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'markers' ? (
        /* Markers table */
        totalMarkers === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0ebe9] bg-white py-16 px-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d6a5e]/10">
              <svg className="h-7 w-7 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">No markers yet</h2>
            <p className="mt-2 max-w-sm text-sm text-[#577572]">
              Log your first result to start tracking biomarkers. Import a PDF, CSV, or add results manually.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e0ebe9] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[#e0ebe9]">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-[#1a2e2b]">Marker</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#1a2e2b]">Latest Value</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#1a2e2b]">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#1a2e2b]">Trend</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#1a2e2b]">Goal</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#1a2e2b]">Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#1a2e2b]">Results</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#1a2e2b]">Labs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0ebe9]">
                  {filteredMarkers.map((marker) => (
                    <tr
                      key={marker.testId}
                      onClick={() => router.push(`/dashboard/tracker/${marker.testId}`)}
                      className="cursor-pointer hover:bg-[#f0f7f6] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-[#1a2e2b]">{marker.testName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#1a2e2b]">
                          {marker.latestValue}{marker.unit ? ` ${marker.unit}` : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${marker.statusColor}`}>
                          {marker.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-bold ${marker.trendColor}`}>{marker.trend}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${marker.goalMet ? 'text-[#2d6a5e]' : marker.goal === '—' ? 'text-[#577572]' : 'text-[#c0826a]'}`}>
                          {marker.goal}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#577572]">{marker.date}</td>
                      <td className="px-6 py-4 text-sm text-[#577572]">{marker.resultCount}</td>
                      <td className="px-6 py-4 text-sm text-[#577572]">
                        {marker.labs.length > 0 ? marker.labs.join(', ') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Reports table */
        reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0ebe9] bg-white py-16 px-8 text-center">
            <h2 className="text-lg font-semibold text-[#1a2e2b]">No reports yet</h2>
            <p className="mt-2 max-w-sm text-sm text-[#577572]">
              Import your first lab report via PDF or CSV to see it listed here.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e0ebe9] bg-white overflow-hidden">
            <div className="divide-y divide-[#e0ebe9]">
              {reports.map((report) => (
                <div key={report.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-[#1a2e2b]">{report.date}</span>
                      {report.sourceLab && (
                        <span className="text-sm text-[#577572]">{report.sourceLab}</span>
                      )}
                      <span className="text-sm text-[#1a2e2b]">
                        {report.panelTitle || 'Manual Entry'}
                      </span>
                      <span className="text-xs text-[#577572]">
                        {report.markerCount} marker{report.markerCount !== 1 ? 's' : ''}
                      </span>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        report.importMethod === 'pdf' ? 'bg-red-100 text-red-800' :
                        report.importMethod === 'csv' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.importMethod.toUpperCase()}
                      </span>
                      {report.unmatchedCount > 0 && (
                        <span className="text-xs text-[#c0826a]">
                          {report.unmatchedCount} unmatched
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="rounded-lg border border-[#e0ebe9] bg-white px-3 py-1.5 text-xs font-medium text-[#c0826a] hover:border-[#c0826a] hover:bg-[#c0826a]/5 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
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
    </div>
  )
}
