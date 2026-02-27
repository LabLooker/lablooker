'use client'

import { useState } from 'react'
import Link from 'next/link'
import { APP_CONFIG } from '@/config/app'
import Button from '@/components/ui/Button'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#e0ebe9] bg-[#faf8f5]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#1a2e2b]">
          {APP_CONFIG.name}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {APP_CONFIG.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#6b8c88] transition-colors hover:text-[#1a2e2b] flex items-center gap-1.5"
            >
              {link.label}
              {'badge' in link && link.badge && (
                <span className="rounded-full bg-primary-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary-400">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" href="/login">
            Log in
          </Button>
          <Button size="sm" href="/signup">
            Start Free Trial
          </Button>
        </div>

        {/* Mobile search + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6b8c88] hover:text-[#2d6a5e] hover:bg-[#2d6a5e]/5 transition-colors"
            aria-label="Search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <button
            className="text-[#6b8c88] hover:text-[#1a2e2b]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[#e0ebe9] bg-[#faf8f5] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {APP_CONFIG.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#6b8c88] transition-colors hover:text-[#1a2e2b] flex items-center gap-1.5"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
                {'badge' in link && link.badge && (
                  <span className="rounded-full bg-primary-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary-400">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#e0ebe9]">
              <Button variant="secondary" href="/login">Log in</Button>
              <Button href="/signup">Start Free Trial</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
