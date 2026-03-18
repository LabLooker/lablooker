'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type ResultRow = {
  drawn_at: string
  value: number
  unit: string | null
  ref_range_low: number | null
  ref_range_high: number | null
  lab_name: string | null
  test_id: string
}

type TestMeta = {
  test_name: string
  cpt_codes: string[] | null
}

type PrintMarker = {
  testName: string
  value: number
  unit: string | null
  refRange: string
  status: 'normal' | 'out_of_range'
}

type PrintVisit = {
  date: string
  dateFormatted: string
  labName: string | null
  markers: PrintMarker[]
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

function formatExportDate(): string {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function PrintExportPage() {
  const supabase = createClient()
  const router = useRouter()

  const [visits, setVisits] = useState<PrintVisit[]>([])
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Check premium
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, is_premium')
        .eq('id', user.id)
        .single()

      if (!profile?.is_premium) {
        router.push('/dashboard')
        return
      }

      setUserName(profile.full_name ?? user.email ?? '')

      // Fetch results
      const { data: results } = await supabase
        .from('lab_results')
        .select('drawn_at, value, unit, ref_range_low, ref_range_high, lab_name, test_id')
        .eq('user_id', user.id)
        .order('drawn_at', { ascending: false })

      if (!results || results.length === 0) {
        setVisits([])
        setLoading(false)
        return
      }

      // Fetch test metadata
      const testIds = [...new Set(results.map(r => r.test_id))]
      const { data: tests } = await supabase
        .from('tests')
        .select('id, test_name, cpt_codes')
        .in('id', testIds)

      const testsById: Record<string, TestMeta> = {}
      for (const t of tests ?? []) {
        testsById[t.id] = { test_name: t.test_name, cpt_codes: t.cpt_codes }
      }

      // Group by drawn_at date
      const byDate: Record<string, { results: ResultRow[]; labNames: Set<string> }> = {}
      for (const r of results) {
        if (!byDate[r.drawn_at]) byDate[r.drawn_at] = { results: [], labNames: new Set() }
        byDate[r.drawn_at].results.push(r)
        if (r.lab_name) byDate[r.drawn_at].labNames.add(r.lab_name)
      }

      const visitData: PrintVisit[] = Object.entries(byDate)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([date, { results: dateResults, labNames }]) => {
          const markers: PrintMarker[] = dateResults
            .map(r => {
              const test = testsById[r.test_id]
              const hasRange = r.ref_range_low != null && r.ref_range_high != null
              const outOfRange = hasRange && (r.value < r.ref_range_low! || r.value > r.ref_range_high!)

              return {
                testName: test?.test_name ?? 'Unknown Test',
                value: r.value,
                unit: r.unit,
                refRange: hasRange ? `${r.ref_range_low}–${r.ref_range_high}` : '—',
                status: (outOfRange ? 'out_of_range' : 'normal') as 'normal' | 'out_of_range',
              }
            })
            .sort((a, b) => a.testName.localeCompare(b.testName))

          return {
            date,
            dateFormatted: formatDateLong(date),
            labName: labNames.size > 0 ? [...labNames].join(', ') : null,
            markers,
          }
        })

      setVisits(visitData)
      setLoading(false)
    }

    load()
  }, [supabase, router])

  // Auto-trigger print after content renders
  useEffect(() => {
    if (!loading && visits.length > 0) {
      const timer = setTimeout(() => window.print(), 600)
      return () => clearTimeout(timer)
    }
  }, [loading, visits])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          /* Hide non-print elements */
          .no-print,
          nav,
          header,
          footer {
            display: none !important;
          }
          /* Clean print layout */
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-page {
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="print-page mx-auto max-w-3xl px-6 py-8 bg-white text-black">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2e2b]">LabLooker</h1>
            <p className="text-sm text-[#577572] mt-0.5">Lab Results Export</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[#1a2e2b]">{userName}</p>
            <p className="text-sm text-[#577572] mt-0.5">Exported: {formatExportDate()}</p>
          </div>
        </div>

        {/* Print button (hidden in print) */}
        <div className="no-print mb-6 flex gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-[#2d6a5e] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={() => window.close()}
            className="rounded-xl border border-[#e0ebe9] px-5 py-2.5 text-sm font-medium text-[#577572] transition-colors hover:bg-[#faf8f5]"
          >
            Close
          </button>
        </div>

        {visits.length === 0 ? (
          <p className="text-center text-[#577572] py-12">No results to export.</p>
        ) : (
          <div className="space-y-6">
            {visits.map((visit) => (
              <div key={visit.date}>
                {/* Visit section header */}
                <div className="border-t-2 border-[#1a2e2b] pt-3 mb-3">
                  <p className="text-base font-bold text-[#1a2e2b]">
                    {visit.dateFormatted}
                    {visit.labName && (
                      <span className="font-normal text-[#577572]">{'  \u2022  '}{visit.labName}</span>
                    )}
                  </p>
                </div>

                {/* Results table */}
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-xs text-[#577572] border-b border-[#e0ebe9]">
                      <th className="text-left py-1.5 pr-3 font-medium">Test Name</th>
                      <th className="text-left py-1.5 pr-3 font-medium w-20">Value</th>
                      <th className="text-left py-1.5 pr-3 font-medium w-16">Unit</th>
                      <th className="text-left py-1.5 pr-3 font-medium w-32">Reference Range</th>
                      <th className="text-left py-1.5 font-medium w-20">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visit.markers.map((m, i) => (
                      <tr key={i} className="border-b border-[#e0ebe9]/60">
                        <td className={`py-1.5 pr-3 text-[#1a2e2b] ${m.status === 'out_of_range' ? 'font-bold' : ''}`}>
                          {m.testName}
                        </td>
                        <td className={`py-1.5 pr-3 text-[#1a2e2b] ${m.status === 'out_of_range' ? 'font-bold' : ''}`}>
                          {m.value}
                        </td>
                        <td className="py-1.5 pr-3 text-[#577572]">{m.unit || '—'}</td>
                        <td className="py-1.5 pr-3 text-[#577572]">{m.refRange}</td>
                        <td className="py-1.5">
                          {m.refRange === '—' ? (
                            <span className="text-[#577572]">—</span>
                          ) : m.status === 'normal' ? (
                            <span className="text-[#2d6a5e]">{'\u2713'} Normal</span>
                          ) : (
                            <span className="font-bold text-[#1a2e2b]">! Out of Range</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-[#e0ebe9] text-center">
          <p className="text-xs text-[#577572]">Generated by LabLooker — lablooker.com</p>
        </div>
      </div>
    </>
  )
}
