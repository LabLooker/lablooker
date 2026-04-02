import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const siteUrl = 'https://lablooker.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/search`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/compare`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/translate`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/bundles`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/calculators`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/calculators/corrected-calcium`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/calculators/homa-ir`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/calculators/free-testosterone`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/calculators/iron-saturation`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/calculators/non-hdl-cholesterol`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/advocate`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/panel-builder`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/track-results`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/plans`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/topics`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/topics/thyroid-labs`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/topics/trt-labs`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/topics/pcos-labs`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/topics/ferritin`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/topics/order-your-own-labs`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/topics/hashimotos-labs`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Fetch all test IDs for dynamic /search/[testId] pages
  let testPages: MetadataRoute.Sitemap = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    )
    const { data: tests } = await supabase
      .from('tests')
      .select('id, updated_at')
      .order('test_name')

    if (tests) {
      testPages = tests.map((test) => ({
        url: `${siteUrl}/search/${test.id}`,
        lastModified: test.updated_at ? new Date(test.updated_at) : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // If Supabase is unavailable, return static pages only
  }

  return [...staticPages, ...testPages]
}
