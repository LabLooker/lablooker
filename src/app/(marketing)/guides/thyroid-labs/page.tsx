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
    a: 'No. TSH alone misses many thyroid problems. You can have a "normal" TSH while your Free T3 is low, which directly causes fatigue, brain fog, and weight gain. A complete thyroid panel includes TSH, Free T3, Free T4, Reverse T3, and thyroid antibodies (Anti-TPO and Anti-Thyroglobulin).',
  },
  {
    q: 'What is Reverse T3 and why does it matter?',
    a: 'Reverse T3 (rT3) is an inactive form of T3. When your body is under stress, illness, or caloric restriction, it converts T4 into Reverse T3 instead of active Free T3. High rT3 with low Free T3 can explain persistent thyroid symptoms even when TSH looks normal.',
  },
  {
    q: 'Can I order thyroid labs without a doctor?',
    a: 'In most US states, yes. Direct-to-consumer lab companies like Quest, LabCorp (via third-party ordering), and others let you order and pay for thyroid panels yourself. LabLooker helps you compare prices across providers.',
  },
  {
    q: 'How often should I retest thyroid levels?',
    a: 'If you\'re on thyroid medication or just starting treatment, retest every 6-8 weeks until stable. Once stable, every 3-6 months. If you\'re checking for the first time, a single comprehensive panel establishes your baseline.',
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
          If your doctor only checks TSH, you&apos;re getting an incomplete picture. Here&apos;s what a complete thyroid panel looks like — and why each test matters.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">
          <p>
            TSH (thyroid stimulating hormone) is the standard screening test, but it&apos;s a pituitary hormone, not a thyroid hormone. It tells you what your brain <em>thinks</em> about your thyroid — not what your thyroid is actually producing. That&apos;s why many patients with classic thyroid symptoms (fatigue, weight gain, hair loss, brain fog, cold intolerance) are told their labs are &ldquo;normal&rdquo; based on TSH alone.
          </p>
          <p>
            A complete thyroid evaluation adds <strong>Free T3</strong> (the active hormone your cells use), <strong>Free T4</strong> (the storage hormone), <strong>Reverse T3</strong> (an inactive form that blocks Free T3), and <strong>thyroid antibodies</strong> (Anti-TPO and Anti-Thyroglobulin) which detect Hashimoto&apos;s — the most common cause of hypothyroidism, often missed for years.
          </p>
          <p>
            Functional medicine practitioners consider optimal ranges narrower than standard lab reference ranges. For example, many labs flag TSH as &ldquo;normal&rdquo; up to 4.5-5.0, while optimal is typically 1.0-2.0. Free T3 in the upper quarter of the reference range is associated with better energy and metabolism.
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
            Prices for the same thyroid tests vary 2-5x between labs. See who offers the best deal.
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
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-[#e0ebe9] px-5 py-3 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#f0f7f6]"
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
