'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Dot,
} from 'recharts'
import { createClient } from '@/lib/supabase'
import ResultLogModal from '@/components/tracker/ResultLogModal'
import GoalSetModal from '@/components/tracker/GoalSetModal'

// Hardcoded functional medicine ranges for common tests
// Matched by test_name (case-insensitive contains)
const FUNCTIONAL_RANGES: { match: string; low: number; high: number; unit: string }[] = [
  { match: 'ferritin', low: 50, high: 150, unit: 'ng/mL' },
  { match: 'vitamin d', low: 50, high: 80, unit: 'ng/mL' },
  { match: 'tsh', low: 0.5, high: 2.0, unit: 'mIU/L' },
  { match: 'free t4', low: 1.1, high: 1.8, unit: 'ng/dL' },
  { match: 'free t3', low: 3.2, high: 4.2, unit: 'pg/mL' },
  { match: 'hemoglobin a1c', low: 4.5, high: 5.5, unit: '%' },
  { match: 'fasting glucose', low: 70, high: 90, unit: 'mg/dL' },
  { match: 'insulin', low: 2, high: 6, unit: 'µIU/mL' },
  { match: 'cortisol', low: 15, high: 23, unit: 'µg/dL' },
  { match: 'magnesium', low: 2.0, high: 2.5, unit: 'mg/dL' },
  { match: 'zinc', low: 90, high: 130, unit: 'µg/dL' },
  { match: 'b12', low: 600, high: 1000, unit: 'pg/mL' },
  { match: 'folate', low: 15, high: 30, unit: 'ng/mL' },
  { match: 'homocysteine', low: 4, high: 7, unit: 'µmol/L' },
  { match: 'crp', low: 0, high: 0.5, unit: 'mg/L' },
  { match: 'testosterone', low: 400, high: 700, unit: 'ng/dL' },
  { match: 'dhea', low: 150, high: 350, unit: 'µg/dL' },
]

type LabResult = {
  id: string
  value: number
  unit: string | null
  drawn_at: string
  lab_name: string | null
  ref_range_low: number | null
  ref_range_high: number | null
  notes: string | null
}

type LabGoal = {
  target_value: number | null
  target_direction: string
  target_low: number | null
  target_high: number | null
  notes: string | null
}

type ChartPoint = {
  date: string
  value: number
  unit: string | null
  lab: string | null
  notes: string | null
  ref_low: number | null
  ref_high: number | null
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as ChartPoint
  return (
    <div className="rounded-xl border border-[#e0ebe9] bg-white p-3 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-[#1a2e2b]">{d.value}{d.unit ? ` ${d.unit}` : ''}</p>
      <p className="text-[#6b8c88]">{formatDate(d.date)}</p>
      {d.lab && <p className="text-[#4a6b67]">{d.lab}</p>}
      {d.notes && <p className="italic text-[#6b8c88] max-w-[200px]">{d.notes}</p>}
      {d.ref_low !== null && d.ref_high !== null && (
        <p className="text-[#6b8c88]">Ref: {d.ref_low}–{d.ref_high}</p>
      )}
    </div>
  )
}

function CustomDot(props: any) {
  const { cx, cy } = props
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#2d6a5e"
      stroke="white"
      strokeWidth={2}
    />
  )
}

export default function TrackerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string

  const supabase = createClient()

  const [testName, setTestName] = useState('')
  const [results, setResults] = useState<LabResult[]>([])
  const [goal, setGoal] = useState<LabGoal | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  const [showLabRange, setShowLabRange] = useState(true)
  const [showFunctional, setShowFunctional] = useState(false)
  const [showGoal, setShowGoal] = useState(true)

  const [showLogModal, setShowLogModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
    setIsPremium(profile?.plan === 'pro' || profile?.plan === 'business')

    const { data: testData } = await supabase
      .from('tests')
      .select('test_name')
      .eq('id', testId)
      .single()
    setTestName(testData?.test_name ?? 'Unknown Test')

    // Free tier: limit to 3 months of history
    const limitDate = isPremium
      ? null
      : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    let query = supabase
      .from('lab_results')
      .select('id, value, unit, drawn_at, lab_name, ref_range_low, ref_range_high, notes')
      .eq('user_id', user.id)
      .eq('test_id', testId)
      .order('drawn_at', { ascending: true })

    if (limitDate) {
      query = query.gte('drawn_at', limitDate)
    }

    const { data: resultsData } = await query
    setResults(resultsData ?? [])

    const { data: goalData } = await supabase
      .from('lab_goals')
      .select('target_value, target_direction, target_low, target_high, notes')
      .eq('user_id', user.id)
      .eq('test_id', testId)
      .single()
    setGoal(goalData ?? null)

    setLoading(false)
  }, [supabase, testId, router, isPremium])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleShare() {
    setShareLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setShareLoading(false); return }

    const { data } = await supabase
      .from('lab_shares')
      .insert({
        user_id: user.id,
        test_ids: [testId],
        title: testName,
      })
      .select('share_token')
      .single()

    setShareLoading(false)
    if (data?.share_token) {
      const url = `${window.location.origin}/shared/${data.share_token}`
      setShareLink(url)
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  // Build chart data
  const chartData: ChartPoint[] = results.map((r) => ({
    date: r.drawn_at,
    value: r.value,
    unit: r.unit,
    lab: r.lab_name,
    notes: r.notes,
    ref_low: r.ref_range_low,
    ref_high: r.ref_range_high,
  }))

  // Most recent ref range
  const latestWithRef = [...results]
    .reverse()
    .find((r) => r.ref_range_low !== null && r.ref_range_high !== null)
  const labRefLow = latestWithRef?.ref_range_low ?? null
  const labRefHigh = latestWithRef?.ref_range_high ?? null

  // Functional range
  const funcMatch = FUNCTIONAL_RANGES.find((fr) =>
    testName.toLowerCase().includes(fr.match.toLowerCase())
  )

  // Y-axis domain
  const vals = chartData.map((d) => d.value)
  const allRefs: number[] = []
  if (showLabRange && labRefLow !== null) allRefs.push(labRefLow)
  if (showLabRange && labRefHigh !== null) allRefs.push(labRefHigh)
  if (showFunctional && funcMatch) { allRefs.push(funcMatch.low, funcMatch.high) }
  if (showGoal && goal?.target_value !== null && goal?.target_value !== undefined) allRefs.push(goal.target_value)
  const allY = [...vals, ...allRefs]
  const yMin = allY.length ? Math.floor(Math.min(...allY) * 0.9) : 0
  const yMax = allY.length ? Math.ceil(Math.max(...allY) * 1.1) : 100

  const unit = results[0]?.unit ?? ''

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
      </div>
    )
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[#6b8c88] hover:text-[#2d6a5e] transition-colors mb-6"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e2b]">{testName}</h1>
          <p className="mt-1 text-sm text-[#6b8c88]">
            {results.length} result{results.length !== 1 ? 's' : ''} tracked
            {!isPremium && ' · Free plan: last 3 months shown'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            className="rounded-xl border border-[#e0ebe9] bg-white px-4 py-2 text-sm font-medium text-[#4a6b67] hover:border-[#2d6a5e]/40 hover:text-[#1a2e2b] transition-colors"
          >
            Log new result
          </button>
          <button
            onClick={() => setShowGoalModal(true)}
            className="rounded-xl border border-[#e0ebe9] bg-white px-4 py-2 text-sm font-medium text-[#4a6b67] hover:border-[#2d6a5e]/40 hover:text-[#1a2e2b] transition-colors"
          >
            {goal ? 'Edit goal' : 'Set goal'}
          </button>
          <button
            onClick={handleShare}
            disabled={shareLoading}
            className="rounded-xl bg-[#2d6a5e] px-4 py-2 text-sm font-medium text-white hover:bg-[#245549] transition-colors disabled:opacity-60"
          >
            {shareLoading ? 'Creating link...' : 'Share results'}
          </button>
        </div>
      </div>

      {shareLink && (
        <div className="mb-6 rounded-xl border border-[#2d6a5e]/20 bg-[#2d6a5e]/5 px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#2d6a5e]">Share link copied to clipboard!</p>
            <p className="text-xs text-[#4a6b67] mt-0.5 break-all">{shareLink}</p>
          </div>
          <button onClick={() => setShareLink('')} className="shrink-0 text-xs text-[#6b8c88] hover:text-[#1a2e2b]">✕</button>
        </div>
      )}

      {/* Toggle pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setShowLabRange((v) => !v)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
            showLabRange
              ? 'bg-gray-200 border-gray-300 text-gray-800'
              : 'bg-white border-[#e0ebe9] text-[#6b8c88] hover:border-gray-300'
          }`}
        >
          Lab Range
        </button>
        <button
          onClick={() => setShowFunctional((v) => !v)}
          disabled={!funcMatch}
          className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
            showFunctional && funcMatch
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-white border-[#e0ebe9] text-[#6b8c88] hover:border-amber-200 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
          title={!funcMatch ? 'No functional medicine range available for this test' : undefined}
        >
          Functional Medicine {!funcMatch && '(N/A)'}
        </button>
        <button
          onClick={() => setShowGoal((v) => !v)}
          disabled={!goal}
          className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
            showGoal && goal
              ? 'bg-[#2d6a5e]/10 border-[#2d6a5e]/30 text-[#2d6a5e]'
              : 'bg-white border-[#e0ebe9] text-[#6b8c88] hover:border-[#2d6a5e]/20 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
          title={!goal ? 'No goal set for this test' : undefined}
        >
          My Goal {!goal && '(none set)'}
        </button>
      </div>

      {/* Chart */}
      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#e0ebe9] bg-white py-16 text-center">
          <p className="text-sm text-[#6b8c88]">No results yet. Log your first result above.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#e0ebe9] bg-white p-6">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="#e0ebe9" strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6b8c88' }}
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={{ stroke: '#e0ebe9' }}
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 11, fill: '#6b8c88' }}
                tickLine={false}
                axisLine={false}
                unit={unit ? ` ${unit}` : undefined}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Lab ref range band */}
              {showLabRange && labRefLow !== null && labRefHigh !== null && (
                <ReferenceArea
                  y1={labRefLow}
                  y2={labRefHigh}
                  fill="#94a3b8"
                  fillOpacity={0.12}
                  label={{ value: 'Lab range', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
                />
              )}

              {/* Functional medicine band */}
              {showFunctional && funcMatch && (
                <ReferenceArea
                  y1={funcMatch.low}
                  y2={funcMatch.high}
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  label={{ value: 'FM range', position: 'insideBottomRight', fontSize: 10, fill: '#d97706' }}
                />
              )}

              {/* Goal line */}
              {showGoal && goal?.target_value !== null && goal?.target_value !== undefined && (
                <ReferenceLine
                  y={goal.target_value}
                  stroke="#2d6a5e"
                  strokeDasharray="6 3"
                  strokeWidth={1.5}
                  label={{ value: 'My goal', position: 'insideTopRight', fontSize: 10, fill: '#2d6a5e' }}
                />
              )}
              {showGoal && goal?.target_direction === 'range' && goal.target_low !== null && goal.target_high !== null && (
                <ReferenceArea
                  y1={goal.target_low}
                  y2={goal.target_high}
                  fill="#2d6a5e"
                  fillOpacity={0.08}
                  stroke="#2d6a5e"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                  label={{ value: 'My goal range', position: 'insideTopRight', fontSize: 10, fill: '#2d6a5e' }}
                />
              )}

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2d6a5e"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 7, fill: '#2d6a5e', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Result history table */}
      {results.length > 0 && (
        <div className="mt-6 rounded-xl border border-[#e0ebe9] bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e0ebe9]">
            <h2 className="text-sm font-semibold text-[#1a2e2b]">Result History</h2>
          </div>
          <div className="divide-y divide-[#e0ebe9]">
            {[...results].reverse().map((r) => (
              <div key={r.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[#1a2e2b]">
                    {r.value}{r.unit ? ` ${r.unit}` : ''}
                  </span>
                  {r.ref_range_low !== null && r.ref_range_high !== null && (
                    <span className="ml-2 text-xs text-[#6b8c88]">
                      (ref: {r.ref_range_low}–{r.ref_range_high})
                    </span>
                  )}
                  {r.notes && (
                    <p className="text-xs text-[#6b8c88] mt-0.5 italic truncate">{r.notes}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-[#4a6b67]">{formatDate(r.drawn_at)}</p>
                  {r.lab_name && <p className="text-xs text-[#6b8c88]">{r.lab_name}</p>}
                </div>
              </div>
            ))}
          </div>
          {!isPremium && (
            <div className="px-5 py-3 bg-[#faf8f5] border-t border-[#e0ebe9]">
              <p className="text-xs text-[#6b8c88]">
                Showing last 3 months only.{' '}
                <a href="/pricing" className="text-[#2d6a5e] underline hover:no-underline">Upgrade to Premium</a>
                {' '}to see full history.
              </p>
            </div>
          )}
        </div>
      )}

      <ResultLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSuccess={loadData}
        prefillTestId={testId}
        prefillTestName={testName}
        prefillUnit={results[0]?.unit}
      />

      <GoalSetModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSuccess={loadData}
        testId={testId}
        testName={testName}
        existingGoal={goal}
      />
    </div>
  )
}
