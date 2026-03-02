'use client'

import Link from 'next/link'

export type LabResult = {
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

export type LabGoal = {
  target_value: number | null
  target_direction: string
  target_low: number | null
  target_high: number | null
}

type Props = {
  testId: string
  testName: string
  results: LabResult[]
  goal: LabGoal | null
  onLogResult: (testId: string, testName: string, unit?: string | null) => void
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z') // avoid timezone shift
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getStatusDot(result: LabResult, goal: LabGoal | null): { color: string; title: string } {
  const { value, ref_range_low, ref_range_high } = result

  const inRefRange =
    ref_range_low !== null && ref_range_high !== null
      ? value >= ref_range_low && value <= ref_range_high
      : null

  if (inRefRange === null) {
    // Check if we at least have a goal
    if (!goal) return { color: '⚪', title: 'No reference range known' }
  }

  if (inRefRange === false) {
    return { color: '🔴', title: 'Out of lab reference range' }
  }

  // In range — check against goal
  if (!goal) return { color: '🟢', title: 'Within lab reference range' }

  const atGoal =
    goal.target_direction === 'above' && goal.target_value !== null
      ? value >= goal.target_value
      : goal.target_direction === 'below' && goal.target_value !== null
        ? value <= goal.target_value
        : goal.target_direction === 'range' && goal.target_low !== null && goal.target_high !== null
          ? value >= goal.target_low && value <= goal.target_high
          : true

  if (atGoal) return { color: '🟢', title: 'At or above goal' }
  return { color: '🟡', title: 'In range but not yet at goal' }
}

function getTrendArrow(results: LabResult[], goal: LabGoal | null): string {
  if (results.length < 2) return '→'
  const sorted = [...results].sort(
    (a, b) => new Date(a.drawn_at).getTime() - new Date(b.drawn_at).getTime()
  )
  const latest = sorted[sorted.length - 1].value
  const prev = sorted[sorted.length - 2].value
  const diff = latest - prev

  if (Math.abs(diff) < 0.001) return '→'

  if (!goal) return diff > 0 ? '↑' : '↓'

  // determine if "higher is better"
  const higherIsBetter =
    goal.target_direction === 'above' ||
    (goal.target_direction === 'range' && goal.target_high !== null && latest < (goal.target_high + (goal.target_low ?? 0)) / 2)

  if (diff > 0) return higherIsBetter ? '↑' : '↓'
  return higherIsBetter ? '↓' : '↑'
}

function getGoalProgress(result: LabResult, goal: LabGoal): number | null {
  const { value } = result
  if (goal.target_direction === 'above' && goal.target_value !== null) {
    return Math.min(100, Math.round((value / goal.target_value) * 100))
  }
  if (goal.target_direction === 'below' && goal.target_value !== null) {
    if (value <= goal.target_value) return 100
    // inverse: 0 means far above target
    const worst = goal.target_value * 2
    return Math.max(0, Math.round(((worst - value) / (worst - goal.target_value)) * 100))
  }
  if (goal.target_direction === 'range' && goal.target_low !== null && goal.target_high !== null) {
    if (value >= goal.target_low && value <= goal.target_high) return 100
    if (value < goal.target_low) {
      return Math.max(0, Math.round((value / goal.target_low) * 100))
    }
    // above range
    return Math.max(0, Math.round((goal.target_high / value) * 100))
  }
  return null
}

export default function TestSummaryCard({ testId, testName, results, goal, onLogResult }: Props) {
  const sortedResults = [...results].sort(
    (a, b) => new Date(b.drawn_at).getTime() - new Date(a.drawn_at).getTime()
  )
  const latest = sortedResults[0]

  const status = getStatusDot(latest, goal)
  const trend = getTrendArrow(results, goal)
  const progressPct = goal ? getGoalProgress(latest, goal) : null

  const trendColor =
    trend === '↑'
      ? 'text-[#2d6a5e]'
      : trend === '↓'
        ? 'text-[#c0826a]'
        : 'text-[#6b8c88]'

  return (
    <div className="rounded-xl border border-[#e0ebe9] bg-white p-5 flex flex-col gap-3 hover:border-[#2d6a5e]/30 transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#1a2e2b] truncate">{testName}</h3>
        </div>
        <span className="text-lg shrink-0" title={status.title}>{status.color}</span>
      </div>

      {/* Latest value */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#1a2e2b]">{latest.value}</span>
        {latest.unit && (
          <span className="text-sm text-[#6b8c88]">{latest.unit}</span>
        )}
        <span className={`ml-auto text-xl font-bold ${trendColor}`}>{trend}</span>
      </div>

      {/* Date */}
      <p className="text-xs text-[#6b8c88] -mt-2">
        {formatDate(latest.drawn_at)}
        {latest.lab_name ? ` · ${latest.lab_name}` : ''}
      </p>

      {/* Goal progress bar */}
      {goal && progressPct !== null && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6b8c88]">Goal progress</span>
            <span className="text-xs font-medium text-[#2d6a5e]">{progressPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#e0ebe9] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2d6a5e] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Action links */}
      <div className="flex items-center justify-between pt-1 border-t border-[#e0ebe9]">
        <Link
          href={`/dashboard/tracker/${testId}`}
          className="text-xs font-medium text-[#2d6a5e] hover:text-[#1a2e2b] transition-colors"
        >
          View chart →
        </Link>
        <button
          onClick={() => onLogResult(testId, testName, latest.unit)}
          className="text-xs font-medium text-[#4a6b67] hover:text-[#1a2e2b] transition-colors bg-[#faf8f5] border border-[#e0ebe9] rounded-lg px-2.5 py-1 hover:border-[#2d6a5e]/30"
        >
          Log result +
        </button>
      </div>
    </div>
  )
}
