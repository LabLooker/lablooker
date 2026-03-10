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
    a: 'A lab may mark ferritin as normal at 12+ ng/mL for women, but symptom relief often happens at higher levels. Ferritin under 30 is commonly associated with symptoms. Between 30 and 50 can still be low enough to matter, especially in people with fatigue, hair loss, or restless legs. Many clinicians focused on symptom improvement aim for roughly 50 to 150 ng/mL.',
  },
  {
    q: 'Why is my ferritin low even though I take iron supplements?',
    a: 'A few common reasons: poor absorption, ongoing blood loss, gut issues that interfere with absorption, or a form of iron that is hard to tolerate or absorb well. Iron is usually absorbed better away from coffee, tea, and calcium. Some people also do better with ferrous bisglycinate than ferrous sulfate.',
  },
  {
    q: 'Can ferritin be too high?',
    a: 'Yes. Elevated ferritin can point to iron overload, but it can also rise with inflammation, liver disease, or infection. Ferritin is an acute-phase reactant, so a high result does not automatically mean excess iron. When ferritin is elevated, transferrin saturation and an inflammatory marker such as hs-CRP help put it in context.',
  },
  {
    q: 'What tests should I order alongside ferritin?',
    a: 'Ferritin is useful, but it is only one part of the picture. A fuller iron workup often includes serum iron, TIBC, transferrin saturation, CBC with differential, reticulocyte count, vitamin B12, and folate. That makes it easier to tell iron deficiency apart from other causes of anemia and to see whether the problem is storage, absorption, or utilization.',
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
          Ferritin is one of the most useful lab tests for fatigue, and one of the easiest to misread. A result can fall inside the lab&apos;s reference range and still be low enough to cause symptoms.
        </p>

        {/* Content */}
        <div className="mt-10 space-y-6 text-[#4a6b67] leading-relaxed">
          <p>
            Ferritin measures iron stores — the iron your body has in reserve. It is often the first marker to drop when iron is running low, well before hemoglobin changes. That means someone can have iron deficiency symptoms without meeting the usual definition of anemia.
          </p>
          <p>
            The problem is the reference range. Many labs list ferritin as &ldquo;normal&rdquo; from about 12 to 150 ng/mL for women. In practice, that range is broad enough to include levels that are technically in range but still associated with symptoms. Ferritin under 30 is commonly linked to fatigue, hair shedding, brain fog, and exercise intolerance. Many clinicians aiming for symptom improvement look for ferritin in a higher range, often around 50 to 150, with some hair-loss discussions using 70+ as a practical target. If a ferritin of 15 gets dismissed as &ldquo;fine,&rdquo; that usually reflects the lab range, not symptom-based interpretation.
          </p>
          <p>
            Women of reproductive age are especially likely to deal with low ferritin because of menstrual blood loss and, in many cases, lower iron intake. It also gets missed often. A CBC may stay normal until iron depletion is more advanced, so ferritin never gets checked. In someone with unexplained fatigue, hair loss, restless legs, dizziness, poor focus, or reduced exercise tolerance, ferritin is often one of the first labs worth checking.
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
