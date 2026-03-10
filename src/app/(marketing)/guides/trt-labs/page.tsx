import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideBundleCard } from '../GuideBundleCard'

export const metadata: Metadata = {
  title: 'TRT Monitoring Labs Explained — What to Test and When',
  description:
    'Essential lab tests for testosterone replacement therapy. Learn what to monitor (total T, free T, estradiol, hematocrit, PSA), when to test, and how to compare lab prices.',
  alternates: { canonical: 'https://lablooker.com/guides/trt-labs' },
  openGraph: {
    title: 'TRT Monitoring Labs Explained',
    description:
      'Essential lab tests for testosterone replacement therapy. Learn what to monitor, when to test, and how to compare prices.',
    url: 'https://lablooker.com/guides/trt-labs',
  },
}

const FAQ = [
  {
    q: 'What labs should I get before starting TRT?',
    a: 'Before starting testosterone replacement therapy, get a baseline panel including: Total Testosterone, Free Testosterone, Estradiol (E2), SHBG, LH, FSH, Prolactin, PSA, CBC with Differential, CMP, Lipid Panel, and HbA1c. This establishes your pre-treatment baseline for comparison.',
  },
  {
    q: 'How often should I test on TRT?',
    a: 'Test at 6-8 weeks after starting or adjusting dose (at trough, right before your next injection). Once stable, every 3-6 months. Always check CBC — hematocrit rising above 54% is a common TRT side effect that requires intervention.',
  },
  {
    q: 'Why do I need to check estradiol on TRT?',
    a: 'Testosterone converts to estradiol via the aromatase enzyme. Too-high estradiol causes water retention, mood changes, and gynecomastia. Too-low estradiol (from over-use of aromatase inhibitors) causes joint pain, fatigue, and low libido. Monitoring lets you manage this balance.',
  },
  {
    q: 'Can I order TRT monitoring labs myself?',
    a: 'Yes, in most US states. Direct-to-consumer lab ordering lets you get the same tests your TRT clinic orders, often at a lower price. LabLooker helps you compare prices for the exact tests you need across multiple lab providers.',
  },
]

export default function TrtLabsGuide() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#577572] mb-8">
          <Link href="/search" className="hover:text-[#2d6a5e] transition-colors">Tests</Link>
          <span>/</span>
          <Link href="/guides/trt-labs" className="text-[#1a2e2b] font-medium">TRT Labs Guide</Link>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2e2b] tracking-tight">
          TRT monitoring labs explained
        </h1>
        <p className="mt-4 text-lg text-[#4a6b67] leading-relaxed">
          Testosterone replacement therapy requires regular bloodwork to ensure safety and effectiveness. Here&apos;s exactly what to test, when to test, and what the results mean.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">
          <p>
            TRT monitoring goes beyond just checking your testosterone level. A comprehensive panel tracks how your body responds to treatment — including red blood cell production (which can become dangerously elevated), estrogen conversion (which affects how you feel on TRT), liver and kidney function, cardiovascular markers, and prostate health.
          </p>
          <p>
            The most common monitoring mistake is only checking Total Testosterone. <strong>Free Testosterone</strong> is what your body actually uses, and it can be low even when Total T looks adequate — especially if SHBG (sex hormone binding globulin) is high. Estradiol (E2) management is equally critical: symptoms like water retention, mood swings, and low libido often trace back to estradiol being too high or too low.
          </p>
          <p>
            <strong>Timing matters.</strong> For injectable TRT, always test at trough — the morning of your next injection, before injecting. This gives your lowest point and helps your provider dose accurately. Testing at peak (1-2 days after injection) will show artificially high numbers that don&apos;t reflect your average level.
          </p>
        </div>

        {/* Bundle */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#1a2e2b] mb-4">The TRT monitoring panel</h2>
          <GuideBundleCard bundleSlug="trt-monitoring" />
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#e0ebe9] bg-[#faf8f5] p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-[#1a2e2b]">Compare TRT lab prices</h2>
          <p className="mt-2 text-sm text-[#4a6b67]">
            TRT clinics often charge $200-400+ for monitoring labs. Direct-order labs can be significantly cheaper for the exact same tests.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c0826a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ab6f59]"
            >
              Compare prices
            </Link>
            <Link
              href="/search?topic=testosterone"
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-[#e0ebe9] px-5 py-3 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#f0f7f6]"
            >
              Browse testosterone tests
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
