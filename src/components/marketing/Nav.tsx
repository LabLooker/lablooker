'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { APP_CONFIG } from '@/config/app'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setAccountOpen(false)
    setMobileOpen(false)
    router.push('/')
  }

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
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="text-sm text-[#6b8c88] transition-colors hover:text-[#1a2e2b]"
            >
              Track
            </Link>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#e0ebe9] bg-white px-4 py-2 text-sm font-medium text-[#1a2e2b] transition-colors hover:bg-[#faf8f5]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2d6a5e]/10 text-xs font-semibold text-[#2d6a5e]">
                  {(user.email ?? 'U')[0].toUpperCase()}
                </span>
                Account
                <svg className="h-4 w-4 text-[#6b8c88]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#e0ebe9] bg-white py-1 shadow-lg">
                  <Link
                    href="/dashboard"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a2e2b] hover:bg-[#faf8f5]"
                  >
                    <svg className="h-4 w-4 text-[#6b8c88]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a2e2b] hover:bg-[#faf8f5]"
                  >
                    <svg className="h-4 w-4 text-[#6b8c88]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Settings
                  </Link>
                  <div className="my-1 border-t border-[#e0ebe9]" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#6b8c88] hover:bg-[#faf8f5] hover:text-[#1a2e2b]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" href="/login">
                Log in
              </Button>
              <Button size="sm" href="/signup">
                Sign Up Free
              </Button>
            </>
          )}
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
                className="text-sm text-[#6b8c88] transition-colors hover:text-[#1a2e2b]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className="text-sm text-[#6b8c88] transition-colors hover:text-[#1a2e2b]"
                onClick={() => setMobileOpen(false)}
              >
                Track
              </Link>
            )}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#e0ebe9]">
              {user ? (
                <>
                  <Button variant="secondary" href="/settings" onClick={() => setMobileOpen(false)}>Settings</Button>
                  <Button variant="secondary" onClick={handleSignOut}>Sign out</Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" href="/login">Log in</Button>
                  <Button href="/signup">Sign Up Free</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
