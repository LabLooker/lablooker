'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        <p className="text-7xl font-bold text-[#2d6a5e]">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1a2e2b] sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#6b8c88]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Try searching for a lab test instead.
        </p>

        <form onSubmit={handleSearch} className="mt-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a3bfbb]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lab tests, CPT codes..."
              className="w-full rounded-xl border border-[#d4e5e1] bg-white py-3 pl-12 pr-4 text-[#1a2e2b] placeholder-[#a3bfbb] transition-colors focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
            />
          </div>
          <button
            type="submit"
            className="mt-3 w-full rounded-xl bg-[#2d6a5e] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#245a50]"
          >
            Search Lab Tests
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#2d6a5e] transition-colors hover:text-[#1a2e2b]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  )
}
