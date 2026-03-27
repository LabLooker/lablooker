'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import { APP_CONFIG } from '@/config/app'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ) : (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, ...(dateOfBirth ? { date_of_birth: dateOfBirth } : {}) },
        emailRedirectTo: `${APP_CONFIG.url}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2d6a5e]/10">
            <svg className="h-8 w-8 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#1a2e2b]">Check your email</h1>
        <p className="mt-3 text-sm text-[#577572]">
          We sent a confirmation link to <span className="font-semibold text-[#1a2e2b]">{email}</span>.
          Click the link to activate your account.
        </p>
        <p className="mt-3 text-xs text-[#577572]">
          Don&apos;t see it? Check your spam folder.
        </p>
        <div className="mt-6">
          <Link href="/login" className="text-sm text-[#2d6a5e] hover:text-[#245a50]">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-[#1a2e2b] text-center">Create your free account</h1>
      <p className="mt-2 text-sm text-[#577572] text-center">
        Track your results, set goals, and spot trends over time — free to start
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#4a6b67]">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-[#e0ebe9] bg-white px-4 py-2.5 text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-[#4a6b67]">
            Date of birth <span className="text-xs font-normal text-[#577572]">(optional — used to pre-fill lab request letters)</span>
          </label>
          <input
            id="dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="mt-1 block w-full rounded-md border border-[#e0ebe9] bg-white px-4 py-2.5 text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#4a6b67]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-[#e0ebe9] bg-white px-4 py-2.5 text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#4a6b67]">
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="block w-full rounded-md border border-[#e0ebe9] bg-white px-4 py-2.5 pr-11 text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#577572] hover:text-[#1a2e2b] transition-colors"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4a6b67]">
            Confirm password
          </label>
          <div className="relative mt-1">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="block w-full rounded-md border border-[#e0ebe9] bg-white px-4 py-2.5 pr-11 text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#577572] hover:text-[#1a2e2b] transition-colors"
              tabIndex={-1}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#577572]">
        Already have an account?{' '}
        <Link href="/login" className="text-[#2d6a5e] hover:text-[#245a50]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
