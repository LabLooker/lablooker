import type { Metadata } from 'next'
import Link from 'next/link'
import { GuideBundleCard } from '../GuideBundleCard'

export const metadata: Metadata = {
  title: 'Ferritin Test: What Your Doctor Isn\'t Telling You',
  description:
    'Why ferritin is the most important iron marker, what "normal" really means (hint: lab ranges are too wide), and the full iron panel you actually need.',
  alternates: { canonical: 'https://lablooker.com/guides/ferritin' },
  openGraph: {
    title: 'Ferritin Test: What Your Doctor Isn\'t Telling You',
    description:
      'Why ferritin is the most important iron marker, what "normal" really means, and the full iron panel you actually need.',
    url: 'https://lablooker.com/guides/ferritin',
  },
}

const FAQ = [
  {
    q: 'What is a good ferritin level?',
    a: 'Standard lab ranges flag ferritin as "normal" at 12+ ng/mL for women, but functional and integrative medicine practitioners consider optimal ferritin to be 50-150 ng/mL. Below 30, most people experience symptoms like fatigue, hair loss, and brain fog. Below 50, symptoms are common but often attributed to other causes.',
  },
  {
    q: 'Why is my ferritin low even though I take iron supplements?',
    a: 'Common reasons include: poor absorption (take iron on an empty stomach with vitamin C, never with coffee, tea, or calcium), celiac disease or gut inflammation blocking absorption, ongoing blood loss (heavy periods, GI bleeding), or taking the wrong form of iron. Ferrous bisglycinate is typically better absorbed and tolerated than ferrous sulfate.',
  },
  {
    q: 'Can ferritin be too high?',
    a: 'Yes. Ferritin above 200 ng/mL in women or 300 ng/mL in men warrants investigation. High ferritin can indicate hemochromatosis (iron overload), inflammation, liver disease, or infection. Notably, ferritin is also an acute-phase reactant — it rises with inflammation regardless of iron status. If ferritin is high, check hs-CRP and transferrin saturation to distinguish iron overload from inflammation.',
  },
  {
    q: 'What tests should I order alongside ferritin?',
    a: 'Ferritin alone doesn\'t tell the whole iron story. A complete iron panel includes Serum Iron, TIBC (Total Iron Binding Capacity), Transferrin Saturation, CBC with Differential, Reticulocyte Count, Vitamin B12, and Folate. This distinguishes iron deficiency from other causes of anemia and identifies whether iron stores, absorption, or utilization is the issue.',
  },
]

export default function FerritinGuide() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#577572] mb-8">
          <Link href="/search" className="hover:text-[#2d6a5e] transition-colors">Tests</Link>
          <span>/</span>
          <Link href="/guides/ferritin" className="text-[#1a2e2b] font-medium">Ferritin Guide</Link>
        </nav>

        {/* Hero */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2e2b] tracking-tight">
          Ferritin test: what your doctor isn&apos;t telling you
        </h1>
        <p className="mt-4 text-lg text-[#4a6b67] leading-relaxed">
          Ferritin is the single most important — and most misinterpreted — lab test for fatigue. Here&apos;s why &ldquo;normal&rdquo; doesn&apos;t mean optimal, and what to do about it.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">
          <p>
            Ferritin measures your body&apos;s iron <em>stores</em> — how much iron you have in reserve. It&apos;s the earliest marker to drop when iron is becoming depleted, and it falls long before your hemoglobin does. This means you can have significant iron deficiency <strong>without being &ldquo;anemic&rdquo; by standard lab criteria</strong>.
          </p>
          <p>
            The problem is reference ranges. Most labs consider ferritin &ldquo;normal&rdquo; anywhere from 12 to 150 ng/mL for women. But the medical literature and functional medicine consensus is clear: <strong>ferritin below 30 causes symptoms in most people, and optimal function requires 50-150</strong>. Hair loss studies show significant improvement only when ferritin reaches 70+. If your ferritin is 15 and your doctor says it&apos;s fine, they&apos;re reading the lab range, not the research.
          </p>
          <p>
            Women of reproductive age are especially affected — between menstrual blood loss and often inadequate dietary iron, low ferritin is extremely common. Yet it&apos;s frequently missed because providers check CBC (which shows anemia only at the late stage) and skip ferritin entirely. If you have unexplained fatigue, hair loss, restless legs, poor concentration, dizziness, or exercise intolerance, <strong>ferritin should be the first test you order</strong>.
          </p>
        </div>

        {/* Bundle */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#1a2e2b] mb-4">The complete iron panel</h2>
          <GuideBundleCard bundleSlug="iron-deep-dive" />
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#e0ebe9] bg-[#faf8f5] p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-[#1a2e2b]">Compare ferritin test prices</h2>
          <p className="mt-2 text-sm text-[#4a6b67]">
            A ferritin test costs anywhere from $7 to $60+ depending on where you order. See all your options.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c0826a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ab6f59]"
            >
              Compare prices
            </Link>
            <Link
              href="/search?topic=iron"
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-[#e0ebe9] px-5 py-3 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#f0f7f6]"
            >
              Browse iron & anemia tests
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
