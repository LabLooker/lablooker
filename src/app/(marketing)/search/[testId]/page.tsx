import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import TestDetailClient from './TestDetailClient'

const siteUrl = 'https://lablooker.com'

export async function generateMetadata(
  { params }: { params: Promise<{ testId: string }> }
): Promise<Metadata> {
  const { testId } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  )

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

export default function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  return <TestDetailClient params={params} />
}
