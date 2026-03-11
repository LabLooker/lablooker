import { createClient } from '@/lib/supabase'

export async function trackAffiliateClick(provider: string, testName?: string, pageType?: string) {
  const supabase = createClient()
  await supabase.from('affiliate_clicks').insert({
    provider,
    test_name: testName,
    page_path: window.location.pathname,
    page_type: pageType
  })
}