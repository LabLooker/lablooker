import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideBundleCard } from '../GuideBundleCard'

export const metadata: Metadata = {
  title: 'What Thyroid Labs Should I Ask For? — Complete Guide',
  description:
    'Go beyond TSH. Learn which thyroid tests to order (Free T3, Free T4, Reverse T3, antibodies), why they matter, and how to compare prices across labs.',
  alternates: { canonical: 'https://lablooker.com/guides/thyroid-labs' },
  openGraph: {
    title: 'What Thyroid Labs Should I Ask For?',
    description:
      'Go beyond TSH. Learn which thyroid tests to order, why they matter, and how to compare prices across labs.',
    url: 'https://lablooker.com/guides/thyroid-labs',
  },
}

const FAQ = [
  {
    q: 'Is TSH enough to check my thyroid?',
    a: 'No. TSH is useful, but it does not tell the whole story. A more complete thyroid panel usually includes TSH, Free T3, Free T4, Reverse T3, and thyroid antibodies such as Anti-TPO and Anti-Thyroglobulin.',
  },
  {
    q: 'What is Reverse T3 and why does it matter?',
    a: 'Reverse T3 is an inactive form of T3. During stress, illness, or caloric restriction, the body may convert more T4 into Reverse T3 instead of active T3. In the right context, that can help explain ongoing symptoms even when TSH does not look alarming.',
  },
  {
    q: 'Can I order thyroid labs without a doctor?',
    a: 'In most US states, yes. Direct-to-consumer lab companies and third-party ordering services often let you order thyroid panels yourself. LabLooker helps compare prices across providers.',
  },
  {
    q: 'How often should I retest thyroid levels?',
    a: 'If you are starting thyroid medication or adjusting a dose, retesting every 6 to 8 weeks is common until levels are stable. After that, many people recheck every 3 to 6 months. If this is your first thyroid workup, a comprehensive panel can serve as a baseline.',
  },
]

export default function ThyroidLabsGuide() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#577572] mb-8">
          <Link href="/search" className="hover:text-[#2d6a5e] transition-colors">Tests</Link>
          <span>/</span>
          <Link href="/guides/thyroid-labs" className="text-[#1a2e2b] font-medium">Thyroid Labs Guide</Link>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2e2b] tracking-tight">
          What thyroid labs should I ask for?
        </h1>
        <p className="mt-4 text-lg text-[#4a6b67] leading-relaxed">
          If your doctor only checks TSH, the picture is incomplete. A fuller thyroid panel can show issues that TSH alone may miss.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">
          <p>
            TSH (thyroid stimulating hormone) is the standard screening test, but it is a pituitary signal, not a thyroid hormone. It reflects how the brain is signaling the thyroid rather than showing the full hormone picture directly. That is one reason some patients with fatigue, weight gain, hair loss, brain fog, or cold intolerance are told their labs are normal based on TSH alone.
          </p>
          <p>
            A more complete thyroid evaluation adds Free T3, Free T4, Reverse T3, and thyroid antibodies such as Anti-TPO and Anti-Thyroglobulin. Together, those markers give a broader view of thyroid hormone production, conversion, and autoimmune thyroid activity.
          </p>
          <p>
            Some clinicians use narrower target ranges than the standard lab reference range. For example, many labs still mark TSH as normal up to about 4.5 to 5.0, while some practitioners prefer to see it lower. Free T3 is also often interpreted in context rather than by range alone. The point is that a result can be technically in range without fully matching the symptom picture.
          </p>
        </div>

        {/* Bundle */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#1a2e2b] mb-4">The complete thyroid panel</h2>
          <GuideBundleCard bundleSlug="thyroid-complete" />
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#e0ebe9] bg-[#faf8f5] p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-[#1a2e2b]">Compare thyroid panel prices</h2>
          <p className="mt-2 text-sm text-[#4a6b67]">
            Prices for the same thyroid tests can vary a lot between providers. Compare options side by side.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c0826a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ab6f59]"
            >
              Compare prices
            </Link>
            <Link
              href="/search?topic=thyroid"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f0f7f6] border border-[#cfe0dc] px-5 py-3 text-sm font-semibold text-[#2d6a5e] transition-colors hover:bg-[#e0ebe9]"
            >
              Browse all thyroid tests
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

      {/* FAQ Schema */}
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
