import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideBundleCard } from '../GuideBundleCard'

export const metadata: Metadata = {
  title: 'PCOS Bloodwork: Which Tests to Order — Complete Guide',
  description:
    'The complete PCOS lab panel — testosterone, DHEA-S, insulin, AMH, and more. Learn which tests diagnose and monitor polycystic ovary syndrome and how to compare prices.',
  alternates: { canonical: 'https://lablooker.com/guides/pcos-labs' },
  openGraph: {
    title: 'PCOS Bloodwork: Which Tests to Order',
    description:
      'The complete PCOS lab panel — testosterone, DHEA-S, insulin, AMH, and more. Learn which tests to order and compare prices.',
    url: 'https://lablooker.com/guides/pcos-labs',
  },
}

const FAQ = [
  {
    q: 'What blood tests diagnose PCOS?',
    a: 'PCOS is diagnosed using the Rotterdam criteria (2 of 3: irregular periods, elevated androgens, polycystic ovaries on ultrasound). Key blood tests include Total Testosterone, Free Testosterone, DHEA-S, LH, FSH, and 17-OH Progesterone. Many providers also check AMH, insulin, and HbA1c since insulin resistance drives most PCOS symptoms.',
  },
  {
    q: 'Why is the LH:FSH ratio important in PCOS?',
    a: 'In classic PCOS, LH is often elevated while FSH is normal or low, creating an LH:FSH ratio above 2:1. This imbalance disrupts ovulation. However, a normal ratio does not rule out PCOS — the diagnosis is based on the full clinical picture, not a single lab value.',
  },
  {
    q: 'Should I test insulin levels for PCOS?',
    a: 'Absolutely. Fasting insulin is the single most underordered PCOS test. About 70% of women with PCOS have insulin resistance — even at a normal weight. Your glucose and HbA1c can look completely normal for years while fasting insulin is already elevated. A fasting insulin above 8-10 µIU/mL suggests insulin resistance.',
  },
  {
    q: 'When in my cycle should I get PCOS labs drawn?',
    a: 'If you have regular cycles, draw LH, FSH, and estradiol on cycle day 2-4. Testosterone, DHEA-S, and insulin can be drawn anytime but should be fasting. If your cycles are irregular (common in PCOS), your provider may test at any point since timing is less predictable. AMH can be drawn at any time.',
  },
]

export default function PcosLabsGuide() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#577572] mb-8">
          <Link href="/search" className="hover:text-[#2d6a5e] transition-colors">Tests</Link>
          <span>/</span>
          <Link href="/guides/pcos-labs" className="text-[#1a2e2b] font-medium">PCOS Labs Guide</Link>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2e2b] tracking-tight">
          PCOS bloodwork: which tests to order
        </h1>
        <p className="mt-4 text-lg text-[#4a6b67] leading-relaxed">
          Polycystic ovary syndrome affects 1 in 10 women, yet many are under-tested. Here&apos;s the comprehensive lab panel for diagnosing and managing PCOS — and what your results actually mean.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">
          <p>
            PCOS is a hormonal and metabolic condition, so the lab panel needs to cover both. The hormonal side includes androgens (testosterone, DHEA-S), reproductive hormones (LH, FSH, estradiol, progesterone, AMH), and prolactin. The metabolic side — which many providers skip — includes fasting insulin, glucose, HbA1c, and a lipid panel, because <strong>insulin resistance is the driving force behind most PCOS symptoms</strong>.
          </p>
          <p>
            A common frustration: many women are told &ldquo;your labs look fine&rdquo; when their provider only checked a basic metabolic panel and TSH. PCOS-specific labs — particularly <strong>Free Testosterone</strong>, <strong>DHEA-S</strong>, and <strong>Fasting Insulin</strong> — are rarely included in routine bloodwork but are essential for diagnosis. The PCOS panel below covers all the markers recommended by endocrine and reproductive medicine guidelines.
          </p>
          <p>
            It&apos;s also critical to rule out other conditions that mimic PCOS. <strong>17-OH Progesterone</strong> screens for non-classic congenital adrenal hyperplasia (NCAH), which presents identically to PCOS but requires different treatment. <strong>TSH and Free T3</strong> rule out thyroid dysfunction, and <strong>Prolactin</strong> rules out pituitary causes of irregular periods.
          </p>
        </div>

        {/* Bundle */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#1a2e2b] mb-4">The complete PCOS panel</h2>
          <GuideBundleCard bundleSlug="pcos-panel" />
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#e0ebe9] bg-[#faf8f5] p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-[#1a2e2b]">Compare PCOS lab prices</h2>
          <p className="mt-2 text-sm text-[#4a6b67]">
            Ordering PCOS labs through your doctor and insurance can be expensive and incomplete. Direct-order labs let you get the full panel at transparent prices.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c0826a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ab6f59]"
            >
              Compare prices
            </Link>
            <Link
              href="/search?topic=bhrt"
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-[#e0ebe9] px-5 py-3 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#f0f7f6]"
            >
              Browse hormone tests
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[#1a2e2b] mb-6">Frequently asked questions</h2>
          <div className="space-y-6">
            {FAQ.map((item, i) => (
              <div key={i} className="border-b border-[#e0ebe9] pb-6 last:border-0">
                <h3 className="text-base font-semibold text-[#1a2e2b]">{item.q}</h3>
                <p className="mt-2 text-sm text-[#4a6b67] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map(item => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
              },
            })),
          }),
        }}
      />
    </div>
  )
}
