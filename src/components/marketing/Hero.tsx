'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Hero() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-20">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-primary-400/5 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
          </span>
          Free to use — no account required
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-[#1a2e2b] sm:text-6xl lg:text-7xl">
          Know your labs.{' '}
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Know your options.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#6b8c88] sm:text-xl">
          The only tool that translates lab orders between providers, compares self-pay prices, and helps you advocate for the tests you need.
        </p>

        {/* Four action cards */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 grid-cols-2 sm:grid-cols-4">
          {/* Translate */}
          <Link
            href="/translate"
            className="group rounded-xl border border-[#e0ebe9] bg-white p-5 transition-all hover:border-[#2d6a5e]/30 hover:shadow-lg hover:shadow-[#2d6a5e]/5"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#2d6a5e]/10 transition-colors group-hover:bg-[#2d6a5e]/20">
              <svg className="h-5 w-5 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <h3 className="mt-3 text-base font-bold text-[#1a2e2b] group-hover:text-[#2d6a5e]">Translate</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#6b8c88]">
              Convert lab orders between providers instantly.
            </p>
          </Link>

          {/* Discover */}
          <Link
            href="/search"
            className="group rounded-xl border border-[#e0ebe9] bg-white p-5 transition-all hover:border-[#2d6a5e]/30 hover:shadow-lg hover:shadow-[#2d6a5e]/5"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#2d6a5e]/10 transition-colors group-hover:bg-[#2d6a5e]/20">
              <svg className="h-5 w-5 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h3 className="mt-3 text-base font-bold text-[#1a2e2b] group-hover:text-[#2d6a5e]">Discover</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#6b8c88]">
              Not sure what to test? Search by symptom.
            </p>
          </Link>

          {/* Advocate */}
          <Link
            href="/advocate"
            className="group rounded-xl border border-[#e0ebe9] bg-white p-5 transition-all hover:border-[#2d6a5e]/30 hover:shadow-lg hover:shadow-[#2d6a5e]/5"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#2d6a5e]/10 transition-colors group-hover:bg-[#2d6a5e]/20">
              <svg className="h-5 w-5 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="mt-3 text-base font-bold text-[#1a2e2b] group-hover:text-[#2d6a5e]">Advocate</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#6b8c88]">
              Get CPT codes and a doctor-ready request letter.
            </p>
          </Link>

          {/* Compare */}
          <Link
            href="/search"
            className="group rounded-xl border border-[#e0ebe9] bg-white p-5 transition-all hover:border-[#2d6a5e]/30 hover:shadow-lg hover:shadow-[#2d6a5e]/5"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#2d6a5e]/10 transition-colors group-hover:bg-[#2d6a5e]/20">
              <svg className="h-5 w-5 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="mt-3 text-base font-bold text-[#1a2e2b] group-hover:text-[#2d6a5e]">Compare</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#6b8c88]">
              Find the cheapest price across 35+ labs.
            </p>
          </Link>
        </div>

        {/* Search bar */}
        <div className="mx-auto mt-10 max-w-xl">
          <p className="mb-3 text-sm text-[#6b8c88]">Or search directly:</p>
          <form onSubmit={handleSearch} className="flex items-center gap-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tests, CPT codes, or symptoms..."
              className="h-12 flex-1 rounded-l-lg border-[2.5px] border-[#2d6a5e] border-r-0 bg-white px-4 text-[#1a2e2b] placeholder-[#a3bfbb] outline-none focus:ring-2 focus:ring-[#2d6a5e]/20 transition-colors"
            />
            <button
              type="submit"
              className="h-12 rounded-r-lg bg-[#2d6a5e] px-5 font-medium text-white transition-colors hover:bg-[#245649] cursor-pointer flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Search
            </button>
          </form>
        </div>

        {/* Health topic pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 mx-auto max-w-2xl">
          {[
            { label: 'Thyroid & Endocrine', q: 'thyroid' },
            { label: 'Heart & Cholesterol', q: 'cholesterol' },
            { label: 'Testosterone & TRT', q: 'testosterone' },
            { label: 'Menopause & BHRT', q: 'estradiol progesterone FSH LH DHEA' },
            { label: 'Inflammation & Autoimmune', q: 'inflammation' },
            { label: 'Weight & Metabolism', q: 'metabolic' },
            { label: 'Iron & Anemia', q: 'iron ferritin' },
            { label: 'Vitamins & Minerals', q: 'vitamin' },
            { label: 'Mood & Mental Health', q: 'cortisol DHEA serotonin' },
            { label: 'Diabetes & Blood Sugar', q: 'glucose A1c insulin' },
            { label: 'Kidney & Liver', q: 'kidney liver' },
            { label: 'Immune & Infections', q: 'immune hepatitis HIV' },
          ].map((topic) => (
            <a
              key={topic.label}
              href={`/search?q=${encodeURIComponent(topic.q)}`}
              className="rounded-full border border-[#e0ebe9] bg-white px-3 py-1.5 text-xs font-medium text-[#4a6b67] transition-all hover:border-[#2d6a5e] hover:text-[#2d6a5e] hover:bg-[#2d6a5e]/5"
            >
              {topic.label}
            </a>
          ))}
        </div>

        {/* Value prop mini */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-[#6b8c88]">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              357 lab tests
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              35+ labs compared
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              All 50 states
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
