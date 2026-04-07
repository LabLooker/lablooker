import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import TestDetailClient from './TestDetailClient'

const siteUrl = 'https://lablooker.com'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  )
}

export async function generateMetadata(
  { params }: { params: Promise<{ testId: string }> }
): Promise<Metadata> {
  const { testId } = await params
  const supabase = getSupabase()

  const { data: test } = await supabase
    .from('tests')
    .select('test_name, description, category')
    .eq('id', testId)
    .single()

  if (!test) {
    return { title: 'Lab Test | LabLooker' }
  }

  const title = `${test.test_name} Test: What It Measures & Where to Order | LabLooker`
  const description = test.description
    ? `${test.description.slice(0, 145).trimEnd()}. Compare prices and track results on LabLooker.`
    : `Compare ${test.test_name} test prices across Quest, LabCorp, and more. Order without a doctor in most states. Track your results over time.`

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/search/${testId}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/search/${testId}`,
    },
  }
}

export default async function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params
  const supabase = getSupabase()

  // Fetch test details
  const { data: test } = await supabase
    .from('tests')
    .select('*')
    .eq('id', testId)
    .single()

  if (!test) {
    notFound()
  }

  // Fetch pricing, ICD10 codes, lab codes, and related tests in parallel
  const [pricingRes, junctionsRes, labCodesRes, relatedRes] = await Promise.all([
    supabase
      .from('pricing')
      .select('price, requires_rx, labs(lab_name, website, notes)')
      .eq('test_id', testId)
      .order('price', { ascending: true }),

    supabase
      .from('test_icd10_codes')
      .select('icd10_code_id')
      .eq('test_id', testId),

    supabase
      .from('lab_codes')
      .select('lab_name, proprietary_code, code_type')
      .eq('test_id', testId)
      .order('lab_name'),

    test.related_tests && test.related_tests.length > 0
      ? supabase
          .from('tests')
          .select('*')
          .in('id', test.related_tests)
      : Promise.resolve({ data: [] }),
  ])

  // Resolve ICD10 codes from junction table
  let icd10Codes: { id: string; code: string; description: string; created_at: string }[] = []
  if (junctionsRes.data && junctionsRes.data.length > 0) {
    const codeIds = junctionsRes.data.map((j: { icd10_code_id: string }) => j.icd10_code_id)
    const { data: codes } = await supabase
      .from('icd10_codes')
      .select('*')
      .in('id', codeIds)
      .order('code')
    if (codes) icd10Codes = codes
  }

  // Transform pricing data
  const pricing = (pricingRes.data ?? []).map((row: any) => ({
    price: row.price,
    requires_rx: row.requires_rx,
    lab_name: row.labs.lab_name,
    website: row.labs.website,
    notes: row.labs.notes,
  }))

  return (
    <TestDetailClient
      testId={testId}
      test={test}
      pricing={pricing}
      icd10Codes={icd10Codes}
      labCodes={labCodesRes.data ?? []}
      relatedTests={relatedRes.data ?? []}
    />
  )
}
