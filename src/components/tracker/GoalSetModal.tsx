'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type GoalType = 'target' | 'range'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  testId: string
  testName: string
  existingGoal?: {
    target_value: number | null
    target_direction: string
    target_low: number | null
    target_high: number | null
    notes: string | null
  } | null
}

export default function GoalSetModal({
  isOpen,
  onClose,
  onSuccess,
  testId,
  testName,
  existingGoal,
}: Props) {
  const supabase = createClient()

  const [goalType, setGoalType] = useState<GoalType>(
    existingGoal?.target_direction === 'range' ? 'range' : 'target'
  )
  const [targetValue, setTargetValue] = useState(existingGoal?.target_value?.toString() ?? '')
  const [targetLow, setTargetLow] = useState(existingGoal?.target_low?.toString() ?? '')
  const [targetHigh, setTargetHigh] = useState(existingGoal?.target_high?.toString() ?? '')
  const [notes, setNotes] = useState(existingGoal?.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setGoalType(existingGoal?.target_direction === 'range' ? 'range' : 'target')
      setTargetValue(existingGoal?.target_value?.toString() ?? '')
      setTargetLow(existingGoal?.target_low?.toString() ?? '')
      setTargetHigh(existingGoal?.target_high?.toString() ?? '')
      setNotes(existingGoal?.notes ?? '')
      setError('')
    }
  }, [isOpen, existingGoal])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (goalType === 'target' && !targetValue) {
      setError('Please enter a target value.')
      return
    }
    if (goalType === 'range' && (!targetLow || !targetHigh)) {
      setError('Please enter both low and high values for your range.')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not signed in.'); setLoading(false); return }

    const payload = {
      user_id: user.id,
      test_id: testId,
      target_direction: goalType === 'range' ? 'range' : 'target',
      target_value: goalType === 'target' && targetValue ? Number(targetValue) : null,
      target_low: goalType === 'range' && targetLow ? Number(targetLow) : null,
      target_high: goalType === 'range' && targetHigh ? Number(targetHigh) : null,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    }

    const { error: upsertError } = await supabase
      .from('lab_goals')
      .upsert(payload, { onConflict: 'user_id,test_id' })

    setLoading(false)
    if (upsertError) {
      setError(upsertError.message)
    } else {
      onSuccess()
      onClose()
    }
  }

  if (!isOpen) return null

  const pillClass = (t: GoalType) =>
    `flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
      goalType === t
        ? 'bg-[#2d6a5e] text-white'
        : 'bg-[#faf8f5] border border-[#e0ebe9] text-[#4a6b67] hover:border-[#2d6a5e]/40'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-sm rounded-2xl border border-[#e0ebe9] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0ebe9] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1a2e2b]">Set Your Goal</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#577572] hover:bg-[#faf8f5] hover:text-[#1a2e2b] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Test name (read-only) */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#4a6b67]">Test</label>
            <p className="text-sm font-semibold text-[#1a2e2b]">{testName}</p>
          </div>

          {/* Goal type toggle */}
          <div>
            <label className="mb-2 block text-xs font-medium text-[#4a6b67]">Goal Type</label>
            <div className="flex gap-2">
              <button type="button" className={pillClass('target')} onClick={() => setGoalType('target')}>
                Target
              </button>
              <button type="button" className={pillClass('range')} onClick={() => setGoalType('range')}>
                Range
              </button>
            </div>
            <p className="mt-1.5 text-xs text-[#577572]">
              {goalType === 'target'
                ? "A single number you're aiming for (e.g. Ferritin → 50)"
                : "A window you want to stay within (e.g. Calcium → 8.5–10.0)"}
            </p>
          </div>

          {/* Value inputs */}
          {goalType === 'target' ? (
            <div>
              <label className="mb-1 block text-xs font-medium text-[#4a6b67]">
                Target Value *
              </label>
              <input
                type="number"
                step="any"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="e.g. 50"
                className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
                required
              />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-medium text-[#4a6b67]">Range *</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  value={targetLow}
                  onChange={(e) => setTargetLow(e.target.value)}
                  placeholder="Low (e.g. 8.5)"
                  className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
                  required
                />
                <input
                  type="number"
                  step="any"
                  value={targetHigh}
                  onChange={(e) => setTargetHigh(e.target.value)}
                  placeholder="High (e.g. 10.0)"
                  className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#4a6b67]">
              Note <span className="text-[#577572] font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Functional medicine target based on Dr. Smith's recommendation"
              rows={2}
              className="w-full rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-3 py-2 text-sm text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none resize-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2d6a5e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549] disabled:opacity-60"
          >
            {loading ? 'Saving...' : existingGoal ? 'Update Goal' : 'Set Goal'}
          </button>
        </form>
      </div>
    </div>
  )
}
