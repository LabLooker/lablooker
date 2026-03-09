'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { createClient } from '@/lib/supabase'

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

type ShareData = {
  title: string | null
  note: string | null
  tests: {
    testId: string
    testName: string
    results: LabResult[]
  }[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

function MiniChart({ results, testName }: { results: LabResult[]; testName: string }) {
  const data = [...results]
    .sort((a, b) => new Date(a.drawn_at).getTime() - new Date(b.drawn_at).getTime())
    .map((r) => ({ date: r.drawn_at, value: r.value, unit: r.unit }))

  const unit = results[0]?.unit ?? ''

  return (
    <div className="rounded-xl border border-[#e0ebe9] bg-white p-5">
      <h3 className="text-sm font-semibold text-[#1a2e2b] mb-4">{testName}</h3>
      {data.length === 0 ? (
        <p className="text-xs text-[#577572] text-center py-6">No results available</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#e0ebe9" strokeDasharray="4 4" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#577572' }}
              tickFormatter={formatDate}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#577572' }}
              tickLine={false}
              axisLine={false}
              unit={unit ? ` ${unit}` : undefined}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="rounded-lg border border-[#e0ebe9] bg-white p-2 shadow text-xs">
                    <p className="font-semibold text-[#1a2e2b]">{d.value}{d.unit ? ` ${d.unit}` : ''}</p>
                    <p className="text-[#577572]">{formatDate(d.date)}</p>
                  </div>
                )
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2d6a5e"
              strokeWidth={2}
              dot={{ r: 4, fill: '#2d6a5e', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Results list */}
      <div className="mt-3 space-y-1">
        {[...results]
          .sort((a, b) => new Date(b.drawn_at).getTime() - new Date(a.drawn_at).getTime())
          .map((r) => (
            <div key={r.id} className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1a2e2b]">
                {r.value}{r.unit ? ` ${r.unit}` : ''}
              </span>
              <span className="text-[#577572]">{formatDate(r.drawn_at)}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

export default function SharedResultsPage() {
  const params = useParams()
  const token = params.token as string
  const supabase = createClient()

  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: share, error: shareErr } = await supabase
        .from('lab_shares')
        .select('title, note, test_ids, user_id, is_active')
        .eq('share_token', token)
        .single()

      if (shareErr || !share || !share.is_active) {
        setError('This share link is invalid or has been deactivated.')
        setLoading(false)
        return
      }

      const testIds: string[] = share.test_ids ?? []

      // Fetch test names
      const { data: testsData } = await supabase
        .from('tests')
        .select('id, test_name')
        .in('id', testIds)

      const testsById: Record<string, string> = {}
      for (const t of testsData ?? []) {
        testsById[t.id] = t.test_name
      }

      // Fetch results for each test for this user
      const { data: resultsData } = await supabase
        .from('lab_results')
        .select('id, test_id, value, unit, drawn_at, lab_name, ref_range_low, ref_range_high, notes')
        .eq('user_id', share.user_id)
        .in('test_id', testIds)
        .order('drawn_at', { ascending: true })

      const byTestId: Record<string, LabResult[]> = {}
      for (const r of resultsData ?? []) {
        if (!byTestId[r.test_id]) byTestId[r.test_id] = []
        byTestId[r.test_id].push(r)
      }

      setShareData({
        title: share.title,
        note: share.note,
        tests: testIds.map((tid) => ({
          testId: tid,
          testName: testsById[tid] ?? 'Unknown Test',
          results: byTestId[tid] ?? [],
        })),
      })
      setLoading(false)
    }

    load()
  }, [token, supabase])

  if (loading) {
    return (
      <section className="pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
          <p className="mt-4 text-sm text-[#577572]">Loading shared results...</p>
        </div>
      </section>
    )
  }

  if (error || !shareData) {
    return (
      <section className="pt-28 pb-20 sm:pt-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-2xl font-bold text-[#1a2e2b]">Link not found</h1>
          <p className="mt-2 text-[#577572]">{error || 'This share link could not be loaded.'}</p>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-[#2d6a5e] underline hover:no-underline">
            Go to LabLooker
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-28 pb-20 sm:pt-36 bg-[#faf8f5] min-h-screen">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-sm font-bold text-[#2d6a5e]">LabLooker</Link>
            <span className="text-[#577572] text-sm">/</span>
            <span className="text-sm text-[#577572]">Shared Results</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a2e2b]">
            {shareData.title || 'Shared Lab Results'}
          </h1>
          {shareData.note && (
            <p className="mt-2 text-[#4a6b67] text-sm">{shareData.note}</p>
          )}
          <p className="mt-2 text-xs text-[#577572]">
            Read-only · Shared via LabLooker
          </p>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {shareData.tests.map((t) => (
            <MiniChart key={t.testId} testName={t.testName} results={t.results} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-[#2d6a5e]/20 bg-[#2d6a5e]/5 p-8 text-center">
          <h2 className="text-lg font-bold text-[#1a2e2b]">Track your own labs at LabLooker</h2>
          <p className="mt-2 text-sm text-[#4a6b67]">
            Log your results, set goals, and visualize your trends over time — free to start.
          </p>
          <Link
            href="/signup"
            className="mt-5 inline-block rounded-xl bg-[#2d6a5e] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
          >
            Sign up free →
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-[#577572]">
          For informational purposes only. Not medical advice.
        </p>
      </div>
    </section>
  )
}
