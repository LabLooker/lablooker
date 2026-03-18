export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check premium status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single()

    if (!profile?.is_premium) {
      return NextResponse.json({ error: 'Premium required' }, { status: 403 })
    }

    // Query lab results joined with tests
    const { data: results, error } = await supabase
      .from('lab_results')
      .select('drawn_at, value, unit, ref_range_low, ref_range_high, lab_name, notes, test_id')
      .eq('user_id', user.id)
      .order('drawn_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
    }

    if (!results || results.length === 0) {
      const headers = 'Date,Test Name,Value,Unit,Reference Range,Lab,CPT Code,Notes'
      return new Response(headers + '\n', {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="lablooker-results-${todayISO()}.csv"`,
        },
      })
    }

    // Fetch test metadata for all test_ids
    const testIds = [...new Set(results.map(r => r.test_id))]
    const { data: tests } = await supabase
      .from('tests')
      .select('id, test_name, cpt_codes')
      .in('id', testIds)

    const testsById: Record<string, { test_name: string; cpt_codes: string[] | null }> = {}
    for (const t of tests ?? []) {
      testsById[t.id] = { test_name: t.test_name, cpt_codes: t.cpt_codes }
    }

    // Sort: drawn_at DESC, then test_name ASC
    const sorted = [...results].sort((a, b) => {
      const dateCompare = new Date(b.drawn_at).getTime() - new Date(a.drawn_at).getTime()
      if (dateCompare !== 0) return dateCompare
      const nameA = testsById[a.test_id]?.test_name ?? ''
      const nameB = testsById[b.test_id]?.test_name ?? ''
      return nameA.localeCompare(nameB)
    })

    // Build CSV
    const rows: string[] = ['Date,Test Name,Value,Unit,Reference Range,Lab,CPT Code,Notes']

    for (const r of sorted) {
      const test = testsById[r.test_id]
      const date = r.drawn_at // already YYYY-MM-DD
      const testName = csvEscape(test?.test_name ?? 'Unknown')
      const value = r.value
      const unit = csvEscape(r.unit ?? '')
      const refRange = r.ref_range_low != null && r.ref_range_high != null
        ? `${r.ref_range_low}–${r.ref_range_high}`
        : ''
      const lab = csvEscape(r.lab_name ?? '')
      const cpt = test?.cpt_codes?.join(', ') ?? ''
      const notes = csvEscape(r.notes ?? '')

      rows.push(`${date},${testName},${value},${unit},${csvEscape(refRange)},${lab},${csvEscape(cpt)},${notes}`)
    }

    const csv = rows.join('\n') + '\n'

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="lablooker-results-${todayISO()}.csv"`,
      },
    })
  } catch (error: unknown) {
    console.error('[export/csv] Error:', error)
    return NextResponse.json(
      { error: 'Failed to export' },
      { status: 500 },
    )
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function csvEscape(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}
