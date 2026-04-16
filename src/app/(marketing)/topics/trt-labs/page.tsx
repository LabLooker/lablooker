import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideBundleCard } from '../GuideBundleCard'
import ReviewedByBadge from '@/components/ReviewedByBadge'
import TopicCTAs from '@/components/TopicCTAs'

export const metadata: Metadata = {
  title: 'TRT Monitoring Labs Explained — What to Test and When',
  description:
    'Essential lab tests for testosterone replacement therapy. Learn what to monitor (total T, free T, estradiol, hematocrit, PSA), when to test, and how to compare lab prices.',
  alternates: { canonical: 'https://www.lablooker.com/topics/trt-labs' },
  openGraph: {
    title: 'TRT Monitoring Labs Explained',
    description:
      'Essential lab tests for testosterone replacement therapy. Learn what to monitor, when to test, and how to compare prices.',
    url: 'https://www.lablooker.com/topics/trt-labs',
  },
}

const FAQ = [
  {
    q: 'What labs should I get before starting TRT?',
    a: 'Before starting testosterone replacement therapy, it helps to get a baseline panel that includes Total Testosterone, Free Testosterone, Estradiol (E2), SHBG, LH, FSH, Prolactin, PSA, CBC with Differential, CMP, Lipid Panel, and HbA1c. That gives you a pre-treatment baseline for comparison later.',
  },
  {
    q: 'How often should I test on TRT?',
    a: 'A common schedule is 6 to 8 weeks after starting treatment or changing the dose, with labs drawn at trough before the next injection. Once things are stable, testing is often repeated every 3 to 6 months. CBC is especially important because hematocrit can rise on TRT and may need attention if it gets too high.',
  },
  {
    q: 'Why do I need to check estradiol on TRT?',
    a: 'Some testosterone converts to estradiol through aromatase. Higher estradiol can contribute to water retention, mood changes, or gynecomastia. Estradiol that is too low can also cause problems, including joint pain, fatigue, and low libido. Checking it helps put symptoms in context.',
  },
  {
    q: 'Can I order TRT monitoring labs myself?',
    a: 'In most US states, yes. Direct-order lab services often let you buy the same kinds of tests used for TRT monitoring without going through a clinic first. LabLooker helps compare pricing across providers.',
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
          <Link href="/topics/trt-labs" className="text-[#1a2e2b] font-medium">TRT Labs Topic</Link>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2e2b] tracking-tight">
          TRT monitoring labs explained
        </h1>
        <div className="mt-4">
          <ReviewedByBadge />
        </div>
        <p className="mt-4 text-base text-[#4a6b67] leading-relaxed">
          Testosterone replacement therapy requires regular bloodwork to track both safety and effectiveness. The goal is to see both whether TRT is helping and whether it’s creating issues you’d want to catch early.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">
          <p>
            Testosterone is only part of the monitoring picture. A useful panel looks at how your body is responding overall, including red blood cell production, estrogen conversion, liver and kidney function, cardiovascular markers, and prostate-related screening.
          </p>
          <p>
            One of the most common mistakes is checking only Total Testosterone. Free Testosterone is the biologically active portion, and it can be low even when Total Testosterone looks adequate, especially if SHBG is elevated. Estradiol matters too. Water retention, mood changes, low libido, and other symptoms can show up when estradiol is either too high or too low.
          </p>
          <p>
            Timing matters. For injectable TRT, labs are usually drawn at trough — the morning of your next injection, before you inject. That gives the lowest point in the dosing cycle and makes results easier to interpret. Testing one to two days after an injection can make levels look higher than they usually are.
          </p>
        </div>

        {/* Bundle */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#1a2e2b] mb-4">The TRT monitoring panel</h2>
          <GuideBundleCard bundleSlug="trt-monitoring" />
        </div>

        {/* CTAs */}
        <TopicCTAs topic="TRT" />

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
