import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideBundleCard } from '../GuideBundleCard'

export const metadata: Metadata = {
  title: 'PCOS Bloodwork: Which Tests to Order — Complete Guide',
  description:
    'The complete PCOS lab panel — testosterone, DHEA-S, insulin, AMH, and more. Learn which tests diagnose and monitor polycystic ovary syndrome and how to compare prices.',
  alternates: { canonical: 'https://lablooker.com/topics/pcos-labs' },
  openGraph: {
    title: 'PCOS Bloodwork: Which Tests to Order',
    description:
      'The complete PCOS lab panel — testosterone, DHEA-S, insulin, AMH, and more. Learn which tests to order and compare prices.',
    url: 'https://lablooker.com/topics/pcos-labs',
  },
}

const FAQ = [
  {
    q: 'What blood tests diagnose PCOS?',
    a: 'PCOS is usually diagnosed using the Rotterdam criteria: two of the following three findings are present — irregular periods, elevated androgens, or polycystic ovaries on ultrasound. Common blood tests include total testosterone, free testosterone, DHEA-S, LH, FSH, and 17-OH progesterone. Many clinicians also look at AMH, fasting insulin, and HbA1c because insulin resistance is so common in PCOS.',
  },
  {
    q: 'Why is the LH:FSH ratio important in PCOS?',
    a: 'In classic PCOS, LH is often elevated while FSH stays normal or low, which can create an LH:FSH ratio above 2:1. That pattern can interfere with ovulation. A normal ratio does not rule out PCOS, though. The diagnosis depends on the full clinical picture, not one lab value.',
  },
  {
    q: 'Should I test insulin levels for PCOS?',
    a: 'Yes. Fasting insulin is often one of the most useful tests in a PCOS workup, especially when glucose and HbA1c still look normal. Many women with PCOS have insulin resistance, including some who are not overweight. An elevated fasting insulin can show up long before glucose markers become abnormal.',
  },
  {
    q: 'When in my cycle should I get PCOS labs drawn?',
    a: 'If your cycles are regular, LH, FSH, and estradiol are usually drawn on cycle days 2 through 4. Testosterone, DHEA-S, and insulin can usually be drawn at any time, though insulin should be fasting. If your cycles are irregular, timing is less predictable, so testing may be done whenever it is practical. AMH can be drawn at any point in the cycle.',
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
          <Link href="/topics/pcos-labs" className="text-[#1a2e2b] font-medium">PCOS Labs Topic</Link>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2e2b] tracking-tight">
          PCOS bloodwork: which tests to order
        </h1>
        <p className="mt-4 text-lg text-[#4a6b67] leading-relaxed">
          Polycystic ovary syndrome affects about 1 in 10 women, and a lot of people still do not get a complete workup. A useful PCOS lab panel should help with both diagnosis and ongoing management.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">
          <p>
            PCOS affects both hormones and metabolism, so the lab work needs to cover both. On the hormone side, that usually includes androgens such as testosterone and DHEA-S, along with reproductive hormones like LH, FSH, estradiol, progesterone, AMH, and prolactin. On the metabolic side, it should include fasting insulin, glucose, HbA1c, and a lipid panel, since insulin resistance plays a major role in many PCOS cases.
          </p>
          <p>
            A lot of people get told their labs look normal after only a basic metabolic panel and TSH. That leaves out many of the markers most relevant to PCOS. Free testosterone, DHEA-S, and fasting insulin are often missing from routine bloodwork even though they are some of the most useful pieces of the picture. The panel below includes the markers commonly used to evaluate PCOS more thoroughly.
          </p>
          <p>
            Other conditions can look a lot like PCOS, so ruling those out matters too. 17-OH progesterone helps screen for non-classic congenital adrenal hyperplasia. TSH and Free T3 help evaluate thyroid function. Prolactin helps rule out pituitary-related causes of irregular cycles.
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
            Getting PCOS labs through a doctor and insurance can be expensive, and sometimes the workup is still incomplete. Direct-order labs can make it easier to get a broader panel with transparent pricing.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-[#b85c5c] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a04f4f]"
            >
              Compare prices
            </Link>
            <Link
              href="/search?topic=bhrt"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f0f7f6] border border-[#cfe0dc] px-5 py-3 text-sm font-semibold text-[#2d6a5e] transition-colors hover:bg-[#e0ebe9]"
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
