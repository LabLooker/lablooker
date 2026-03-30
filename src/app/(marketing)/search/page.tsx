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

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchShell />}>
      <SearchPageClient />
    </Suspense>
  )
}
