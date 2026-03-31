import { Suspense } from 'react'
import Link from 'next/link'
import SearchPageClient from './SearchPageClient'

const HEALTH_TOPIC_LABELS = [
  { slug: 'thyroid', label: 'Thyroid & Endocrine' },
  { slug: 'heart', label: 'Heart & Cholesterol' },
  { slug: 'testosterone', label: 'Testosterone & TRT' },
  { slug: 'bhrt', label: 'Menopause & BHRT' },
  { slug: 'inflammation', label: 'Inflammation & Autoimmune' },
  { slug: 'metabolism', label: 'Weight & Metabolism' },
  { slug: 'iron', label: 'Iron & Anemia' },
  { slug: 'vitamins', label: 'Vitamins & Minerals' },
  { slug: 'mental-health', label: 'Mood & Mental Health' },
  { slug: 'diabetes', label: 'Diabetes & Blood Sugar' },
  { slug: 'kidney-liver', label: 'Kidney & Liver' },
  { slug: 'immune', label: 'Immune & Infections' },
  { slug: 'sexual-health', label: 'Sexual Health & STD' },
  { slug: 'compliance', label: 'Immunity Tests' },
]

function SearchShell() {
  return (
    <section className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e2b] mb-3">
            Search lab tests
          </h1>
          <p className="text-lg text-[#4a6b67]">
            Search by test name, CPT code, symptom, or lab code. Free, no account required.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <div className="flex items-center rounded-xl border-2 border-[#2d6a5e] bg-white px-4 py-3 shadow-sm">
              <svg className="h-5 w-5 shrink-0 text-[#577572]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search tests, CPT codes, or symptoms..."
                className="ml-3 flex-1 bg-transparent text-[#1a2e2b] placeholder-[#577572] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 mx-auto max-w-4xl">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-[#577572] mb-4">Lab Tests by Health Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {HEALTH_TOPIC_LABELS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/search?topic=${topic.slug}`}
                className="group flex flex-col items-start gap-2 rounded-xl border border-[#e0ebe9] bg-white p-4 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
              >
                <span className="text-sm font-medium text-[#1a2e2b] group-hover:text-[#2d6a5e] text-left leading-tight">{topic.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 border-t border-[#e0ebe9]" />
            <span className="text-xs text-[#577572]">or browse all 370+ tests below</span>
            <div className="flex-1 border-t border-[#e0ebe9]" />
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-[#577572]">Browse 408+ lab tests — free, no account required.</p>
        </div>
      </div>
    </section>
  )
}

const POPULAR_TESTS = [
  { name: 'TSH (Thyroid)', query: 'TSH' },
  { name: 'Free T3', query: 'Free T3' },
  { name: 'Free T4', query: 'Free T4' },
  { name: 'Ferritin', query: 'Ferritin' },
  { name: 'Vitamin D', query: 'Vitamin D' },
  { name: 'B12', query: 'B12' },
  { name: 'CBC', query: 'CBC' },
  { name: 'CMP', query: 'CMP' },
  { name: 'Cortisol', query: 'Cortisol' },
  { name: 'DHEA-S', query: 'DHEA-S' },
  { name: 'Testosterone (Total)', query: 'Testosterone' },
  { name: 'hs-CRP', query: 'hs-CRP' },
]

const HEALTH_FOCUS_CARDS = [
  {
    icon: '🦋',
    label: 'Thyroid',
    description: 'TSH, Free T3, Free T4, Anti-TPO, TRAb',
    query: 'thyroid',
  },
  {
    icon: '⚡',
    label: 'Energy & Iron',
    description: 'Ferritin, CBC, B12, Folate, Iron Panel',
    query: 'iron',
  },
  {
    icon: '⚖️',
    label: 'Hormones',
    description: 'Estradiol, Testosterone, Progesterone, DHEA-S, Cortisol',
    query: 'hormones',
  },
  {
    icon: '🧠',
    label: 'Mood & Brain',
    description: 'Vitamin D, B12, Homocysteine, hs-CRP, Magnesium',
    query: 'mental-health',
  },
  {
    icon: '💪',
    label: 'Metabolic',
    description: 'HbA1c, Fasting Glucose, Insulin, Lipid Panel, ApoB',
    query: 'metabolism',
  },
  {
    icon: '🛡️',
    label: 'Immune & Inflammation',
    description: 'hs-CRP, ESR, ANA, Anti-TPO, Ferritin',
    query: 'inflammation',
  },
]

export default function SearchPage() {
  return (
    <>
      <Suspense fallback={<SearchShell />}>
        <SearchPageClient />
      </Suspense>

      {/* ── Static SEO Content ── */}
      <div className="mx-auto max-w-4xl px-6 pb-20">

        {/* Section 1: What you can search for */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[#1a2e2b] text-center mb-6">
            What you can search for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#e0ebe9] p-5">
              <div className="text-2xl mb-2">🩸</div>
              <h3 className="text-sm font-semibold text-[#1a2e2b] mb-1">Lab test names</h3>
              <p className="text-[13px] text-[#577572] leading-relaxed">
                Search &ldquo;ferritin&rdquo;, &ldquo;TSH&rdquo;, &ldquo;HbA1c&rdquo;, &ldquo;CBC&rdquo; and hundreds more.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e0ebe9] p-5">
              <div className="text-2xl mb-2">🔤</div>
              <h3 className="text-sm font-semibold text-[#1a2e2b] mb-1">Lab codes</h3>
              <p className="text-[13px] text-[#577572] leading-relaxed">
                Paste codes from your lab report like &ldquo;004267&rdquo; or &ldquo;006627&rdquo; to find exact matches.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#e0ebe9] p-5">
              <div className="text-2xl mb-2">🧬</div>
              <h3 className="text-sm font-semibold text-[#1a2e2b] mb-1">Symptoms or conditions</h3>
              <p className="text-[13px] text-[#577572] leading-relaxed">
                Search &ldquo;fatigue&rdquo;, &ldquo;thyroid&rdquo;, or &ldquo;iron deficiency&rdquo; to find relevant tests.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Popular tests right now */}
        <section className="mb-12 bg-[#f0f7f6] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#1a2e2b] text-center mb-5">
            Popular tests right now
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_TESTS.map((test) => (
              <Link
                key={test.query}
                href={`/search?q=${encodeURIComponent(test.query)}`}
                className="bg-white rounded-full border border-[#e0ebe9] px-4 py-2 text-sm font-medium text-[#1a2e2b] hover:border-[#2d6a5e] hover:text-[#2d6a5e] transition-colors"
              >
                {test.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Browse by health focus */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#1a2e2b] text-center mb-6">
            Browse by health focus
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {HEALTH_FOCUS_CARDS.map((card) => (
              <Link
                key={card.query}
                href={`/search?topic=${card.query}`}
                className="bg-white rounded-xl border border-[#e0ebe9] p-5 hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5 transition-all"
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <h3 className="text-sm font-semibold text-[#1a2e2b] mb-1">{card.label}</h3>
                <p className="text-[12px] text-[#577572] leading-relaxed">{card.description}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
