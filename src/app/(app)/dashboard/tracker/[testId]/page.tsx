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

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getStatus(result: LabResult): { status: string; color: string } {
  const { value, ref_range_low, ref_range_high } = result

  if (ref_range_low !== null && ref_range_high !== null) {
    if (value < ref_range_low) return { status: 'Low', color: 'text-[#b85c5c] bg-[#b85c5c]/10' }
    if (value > ref_range_high) return { status: 'High', color: 'text-[#b85c5c] bg-[#b85c5c]/10' }
    return { status: 'In Range', color: 'text-[#2d6a5e] bg-[#2d6a5e]/10' }
  }

  return { status: 'No Range', color: 'text-[#577572] bg-[#577572]/10' }
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as ChartPoint
  return (
    <div className="rounded-xl border border-[#e0ebe9] bg-white p-3 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-[#1a2e2b]">{d.value}{d.unit ? ` ${d.unit}` : ''}</p>
      <p className="text-[#577572]">{formatDate(d.date)}</p>
      {d.lab && <p className="text-[#4a6b67]">{d.lab}</p>}
      {d.notes && <p className="italic text-[#577572] max-w-[200px]">{d.notes}</p>}
      {d.ref_low !== null && d.ref_high !== null && (
        <p className="text-[#577572]">Ref: {d.ref_low}–{d.ref_high}</p>
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
  const [alternateNames, setAlternateNames] = useState<string[]>([])
  const [results, setResults] = useState<LabResult[]>([])
  const [goal, setGoal] = useState<LabGoal | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'all' | '1y' | '6m' | '3m'>('all')

  const [showLabRange, setShowLabRange] = useState(true)
  const [showFunctional, setShowFunctional] = useState(false)
  const [showGoal, setShowGoal] = useState(true)

  const [showLogModal, setShowLogModal] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)

  // Goal setting state
  const [goalType, setGoalType] = useState<'target' | 'range'>('target')
  const [goalValue, setGoalValue] = useState('')
  const [goalLow, setGoalLow] = useState('')
  const [goalHigh, setGoalHigh] = useState('')
  const [goalNote, setGoalNote] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Load test data
    const { data: testData } = await supabase
      .from('tests')
      .select('test_name')
      .eq('id', testId)
      .single()
    setTestName(testData?.test_name ?? 'Unknown Test')

    // Load all results (no more free tier limit per task requirements)
    let query = supabase
      .from('lab_results')
      .select('id, value, unit, drawn_at, lab_name, ref_range_low, ref_range_high, notes')
      .eq('user_id', user.id)
      .eq('test_id', testId)
      .order('drawn_at', { ascending: true })

    // Apply time range filter
    if (timeRange !== 'all') {
      const days = timeRange === '1y' ? 365 : timeRange === '6m' ? 180 : 90
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      query = query.gte('drawn_at', cutoffDate)
    }

    const { data: resultsData } = await query
    setResults(resultsData ?? [])

    // Get alternate names from imported results (different lab naming)
    const uniqueTestNames = new Set<string>()
    // We'd need to store original test names during import to show alternatives
    // For now, just show the canonical name
    setAlternateNames([])

    // Load goal
    const { data: goalData } = await supabase
      .from('lab_goals')
      .select('target_value, target_direction, target_low, target_high, notes')
      .eq('user_id', user.id)
      .eq('test_id', testId)
      .single()

    const goalResult = goalData ?? null
    setGoal(goalResult)

    // Pre-fill goal form if editing
    if (goalResult) {
      setGoalType(goalResult.target_direction === 'range' ? 'range' : 'target')
      setGoalValue(goalResult.target_value?.toString() ?? '')
      setGoalLow(goalResult.target_low?.toString() ?? '')
      setGoalHigh(goalResult.target_high?.toString() ?? '')
      setGoalNote(goalResult.notes ?? '')
    }

    setLoading(false)
  }, [supabase, testId, router, timeRange])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDeleteResult = async (resultId: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return

    await supabase.from('lab_results').delete().eq('id', resultId)
    loadData()
  }

  const handleDeleteAllMarkerData = async () => {
    if (!confirm(`Are you sure you want to delete all ${testName} data? This cannot be undone.`)) return

    await supabase.from('lab_results').delete().eq('test_id', testId)
    router.push('/dashboard')
  }

  const handleSaveGoal = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const goalData: any = {
      user_id: user.id,
      test_id: testId,
      target_direction: goalType,
      notes: goalNote || null
    }

    if (goalType === 'range') {
      goalData.target_low = parseFloat(goalLow) || null
      goalData.target_high = parseFloat(goalHigh) || null
      goalData.target_value = null
    } else {
      goalData.target_value = parseFloat(goalValue) || null
      goalData.target_low = null
      goalData.target_high = null
    }

    await supabase
      .from('lab_goals')
      .upsert(goalData, { onConflict: 'user_id,test_id' })

    loadData()
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
  if (showGoal && goal && goal.target_value !== null && goal.target_value !== undefined) allRefs.push(goal.target_value)
  if (showGoal && goal && goal.target_low !== null && goal.target_high !== null) {
    allRefs.push(goal.target_low, goal.target_high)
  }
  const allY = [...vals, ...allRefs]
  const yMin = allY.length ? Math.floor(Math.min(...allY) * 0.9) : 0
  const yMax = allY.length ? Math.ceil(Math.max(...allY) * 1.1) : 100

  const unit = results[0]?.unit ?? ''
  const latestResult = results[results.length - 1]
  const uniqueLabs = Array.from(new Set(results.map(r => r.lab_name).filter(Boolean)))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[#577572] hover:text-[#2d6a5e] transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e2b]">{testName}</h1>
          {alternateNames.length > 0 && (
            <p className="text-sm text-[#577572]">
              Also imported as: {alternateNames.join(', ')}
            </p>
          )}
        </div>

        {/* Compact summary */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#577572]">
          <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{uniqueLabs.length} lab{uniqueLabs.length !== 1 ? 's' : ''}</span>
          {latestResult && (
            <>
              <span>•</span>
              <span>Last drawn {formatFullDate(latestResult.drawn_at)}</span>
            </>
          )}
        </div>

        {/* Latest value with status */}
        {latestResult && (
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#1a2e2b]">
              {latestResult.value}{latestResult.unit ? ` ${latestResult.unit}` : ''}
            </span>
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatus(latestResult).color}`}>
              {getStatus(latestResult).status}
            </span>
          </div>
        )}
      </div>

      {/* Chart section */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* Range toggle chips and time selector */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowLabRange((v) => !v)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                  showLabRange
                    ? 'bg-gray-200 border-gray-300 text-gray-800'
                    : 'bg-white border-[#e0ebe9] text-[#577572] hover:border-gray-300'
                }`}
              >
                Standard range
              </button>
              <button
                onClick={() => setShowFunctional((v) => !v)}
                disabled={!funcMatch}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                  showFunctional && funcMatch
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-white border-[#e0ebe9] text-[#577572] hover:border-amber-200 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
                title={!funcMatch ? 'No functional medicine range available for this test' : undefined}
              >
                Functional range 🔒
              </button>
              <button
                onClick={() => setShowGoal((v) => !v)}
                disabled={!goal}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                  showGoal && goal
                    ? 'bg-[#2d6a5e]/10 border-[#2d6a5e]/30 text-[#2d6a5e]'
                    : 'bg-white border-[#e0ebe9] text-[#577572] hover:border-[#2d6a5e]/20 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
                title={!goal ? 'No goal set for this test' : undefined}
              >
                My goal
              </button>
            </div>

            {/* Time range selector */}
            <div className="flex rounded-lg border border-[#e0ebe9] bg-white">
              {(['all', '1y', '6m', '3m'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                    timeRange === range
                      ? 'bg-[#2d6a5e] text-white'
                      : 'text-[#577572] hover:text-[#1a2e2b]'
                  }`}
                >
                  {range === 'all' ? 'All time' : range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-[#e0ebe9] bg-white p-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid stroke="#e0ebe9" strokeDasharray="4 4" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#577572' }}
                  tickFormatter={formatDate}
                  tickLine={false}
                  axisLine={{ stroke: '#e0ebe9' }}
                />
                <YAxis
                  domain={[yMin, yMax]}
                  tick={{ fontSize: 11, fill: '#577572' }}
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

                {/* Goal line/range */}
                {showGoal && goal?.target_direction !== 'range' && goal?.target_value !== null && (
                  <ReferenceLine
                    y={goal!.target_value!}
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
        </div>
      )}

      {/* Goal setting card */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#1a2e2b]">Set Your Goal</h2>

        <div className="space-y-4">
          {/* Goal type selector */}
          <div>
            <label className="block text-sm font-medium text-[#1a2e2b] mb-2">Goal Type</label>
            <div className="flex gap-2">
              {(['target', 'range'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setGoalType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    goalType === t
                      ? 'bg-[#2d6a5e] text-white'
                      : 'bg-[#f0f7f6] text-[#577572] hover:bg-[#e0ebe9]'
                  }`}
                >
                  {t === 'target' ? 'Target' : 'Range'}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-[#577572]">
              {goalType === 'target'
                ? "A single number you're aiming for (e.g. Ferritin → 50)"
                : "A window you want to stay within (e.g. Calcium → 8.5–10.0)"}
            </p>
          </div>

          {/* Value fields */}
          {goalType === 'range' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1a2e2b] mb-2">Low</label>
                <input
                  type="number"
                  step="0.01"
                  value={goalLow}
                  onChange={(e) => setGoalLow(e.target.value)}
                  className="w-full rounded-lg border border-[#e0ebe9] px-3 py-2 text-sm focus:border-[#2d6a5e] focus:outline-none"
                  placeholder="e.g. 8.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a2e2b] mb-2">High</label>
                <input
                  type="number"
                  step="0.01"
                  value={goalHigh}
                  onChange={(e) => setGoalHigh(e.target.value)}
                  className="w-full rounded-lg border border-[#e0ebe9] px-3 py-2 text-sm focus:border-[#2d6a5e] focus:outline-none"
                  placeholder="e.g. 10.0"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-[#1a2e2b] mb-2">Target value</label>
              <input
                type="number"
                step="0.01"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                className="w-full rounded-lg border border-[#e0ebe9] px-3 py-2 text-sm focus:border-[#2d6a5e] focus:outline-none"
                placeholder="e.g. 50"
              />
            </div>
          )}

          {/* Note field */}
          <div>
            <label className="block text-sm font-medium text-[#1a2e2b] mb-2">Note (optional)</label>
            <input
              type="text"
              value={goalNote}
              onChange={(e) => setGoalNote(e.target.value)}
              className="w-full rounded-lg border border-[#e0ebe9] px-3 py-2 text-sm focus:border-[#2d6a5e] focus:outline-none"
              placeholder="Why is this your goal?"
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSaveGoal}
            className="rounded-xl bg-[#2d6a5e] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
          >
            Save Goal
          </button>
        </div>
      </div>

      {/* Result history table with delete functionality */}
      {results.length > 0 && (
        <div className="rounded-xl border border-[#e0ebe9] bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e0ebe9] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1a2e2b]">Result History</h2>
            <button
              onClick={handleDeleteAllMarkerData}
              className="text-sm text-[#b85c5c] hover:text-[#1a2e2b] transition-colors"
            >
              Delete All {testName} Data
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#e0ebe9]">
                <tr className="text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-[#1a2e2b]">Date</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#1a2e2b]">Value</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#1a2e2b]">Reference Range</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#1a2e2b]">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#1a2e2b]">Lab</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#1a2e2b]">Source Label</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#1a2e2b]">Notes</th>
                  <th className="px-6 py-3 text-sm font-semibold text-[#1a2e2b]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0ebe9]">
                {[...results].reverse().map((result) => {
                  const status = getStatus(result)
                  return (
                    <tr key={result.id} className="hover:bg-[#f0f7f6] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#1a2e2b]">{formatFullDate(result.drawn_at)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#1a2e2b]">
                        {result.value}{result.unit ? ` ${result.unit}` : ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#577572]">
                        {result.ref_range_low !== null && result.ref_range_high !== null
                          ? `${result.ref_range_low}–${result.ref_range_high}`
                          : '—'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${status.color}`}>
                          {status.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#577572]">{result.lab_name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-[#577572]">—</td>
                      <td className="px-6 py-4 text-sm text-[#577572]">{result.notes || '—'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteResult(result.id)}
                          className="text-[#b85c5c] hover:text-[#1a2e2b] transition-colors p-1"
                          title="Delete result"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowLogModal(true)}
          className="rounded-xl bg-[#2d6a5e] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
        >
          Log New Result
        </button>
      </div>

      {/* Modals */}
      <ResultLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSuccess={loadData}
        prefillTestId={testId}
        prefillTestName={testName}
        prefillUnit={results[0]?.unit}
      />
    </div>
  )
}
