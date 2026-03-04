'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import TestSummaryCard, { type LabResult, type LabGoal } from '@/components/tracker/TestSummaryCard'
import ResultLogModal from '@/components/tracker/ResultLogModal'
import ImportModal from '@/components/tracker/ImportModal'
import PdfImportModal from '@/components/dashboard/PdfImportModal'

type Profile = {
  full_name: string | null
  plan: string
  plan_status: string
}

type TrackedTest = {
  testId: string
  testName: string
  results: LabResult[]
  goal: LabGoal | null
}

export default function DashboardPage() {
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [trackedTests, setTrackedTests] = useState<TrackedTest[]>([])
  const [loading, setLoading] = useState(true)
  const [showLogModal, setShowLogModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPdfImportModal, setShowPdfImportModal] = useState(false)
  const [logModalPrefill, setLogModalPrefill] = useState<{
    testId?: string
    testName?: string
    unit?: string | null
  }>({})

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

    // Load all lab_results for this user, joined with test name
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
      setTrackedTests([])
      setLoading(false)
      return
    }

    // Group results by test_id
    const byTestId: Record<string, LabResult[]> = {}
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

    const goalsById: Record<string, LabGoal> = {}
    for (const g of goalsData ?? []) {
      goalsById[g.test_id] = {
        target_value: g.target_value,
        target_direction: g.target_direction,
        target_low: g.target_low,
        target_high: g.target_high,
      }
    }

    const tracked: TrackedTest[] = testIds.map((tid) => ({
      testId: tid,
      testName: testsById[tid] ?? 'Unknown Test',
      results: byTestId[tid],
      goal: goalsById[tid] ?? null,
    }))

    // Sort by most recent result
    tracked.sort((a, b) => {
      const aDate = new Date(a.results[0].drawn_at).getTime()
      const bDate = new Date(b.results[0].drawn_at).getTime()
      return bDate - aDate
    })

    setTrackedTests(tracked)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  function openLogModal(testId?: string, testName?: string, unit?: string | null) {
    setLogModalPrefill({ testId, testName, unit })
    setShowLogModal(true)
  }

  const FREE_LIMIT = 5
  const isAtFreeLimit =
    profile?.plan === 'free' && trackedTests.length >= FREE_LIMIT

  const planBadgeColor =
    profile?.plan === 'business'
      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      : profile?.plan === 'pro'
        ? 'bg-[#2d6a5e]/10 text-[#2d6a5e] border-[#2d6a5e]/20'
        : 'bg-[#faf8f5] text-[#6b8c88] border-[#e0ebe9]'

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e2b]">
            {profile?.full_name ? `${profile.full_name}'s Labs` : 'My Labs'}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            {profile && (
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${planBadgeColor}`}>
                {profile.plan} plan
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <button
            onClick={() => {
              if (isAtFreeLimit) {
                alert('You\'ve tracked 5 tests on the free plan. Upgrade to Premium to track unlimited tests.')
                return
              }
              openLogModal()
            }}
            className="rounded-xl bg-[#2d6a5e] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
          >
            + Add Result
          </button>
          <button
            onClick={() => setShowPdfImportModal(true)}
            className="rounded-xl border border-[#2d6a5e] bg-white px-3 py-2 text-sm font-semibold text-[#2d6a5e] transition-colors hover:bg-[#2d6a5e]/5"
          >
            Import PDF
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="rounded-xl border border-[#e0ebe9] bg-white px-3 py-2 text-sm font-semibold text-[#6b8c88] transition-colors hover:bg-[#faf8f5]"
          >
            Import CSV
          </button>
        </div>
      </div>

      {/* Free limit warning */}
      {isAtFreeLimit && (
        <div className="mb-6 rounded-xl border border-[#c0826a]/30 bg-[#c0826a]/5 px-5 py-4">
          <p className="text-sm text-[#1a2e2b]">
            <span className="font-semibold">You&apos;ve tracked {FREE_LIMIT} tests</span> — that&apos;s the free plan limit.{' '}
            <a href="/pricing" className="font-medium text-[#2d6a5e] underline hover:no-underline">
              Upgrade to Premium
            </a>{' '}
            to track unlimited tests.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
        </div>
      ) : trackedTests.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0ebe9] bg-white py-16 px-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d6a5e]/10">
            <svg className="h-7 w-7 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#1a2e2b]">No results yet</h2>
          <p className="mt-2 max-w-sm text-sm text-[#6b8c88]">
            Log your first result to start your lab history. Add more over time and you&rsquo;ll see your trends here.
          </p>

        </div>
      ) : (
        /* Populated state */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trackedTests.map((t) => (
            <TestSummaryCard
              key={t.testId}
              testId={t.testId}
              testName={t.testName}
              results={t.results}
              goal={t.goal}
              onLogResult={openLogModal}
            />
          ))}
        </div>
      )}

      <ResultLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSuccess={loadData}
        prefillTestId={logModalPrefill.testId}
        prefillTestName={logModalPrefill.testName}
        prefillUnit={logModalPrefill.unit}
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
