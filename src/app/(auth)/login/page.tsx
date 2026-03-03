'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-[#1a2e2b] text-center">Welcome back</h1>
      <p className="mt-2 text-sm text-[#6b8c88] text-center">
        Sign in to access your lab tracker and saved results
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

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
            className="mt-1 block w-full rounded-md border border-[#e0ebe9] bg-white px-4 py-2.5 text-sm text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#4a6b67]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-[#e0ebe9] bg-white px-4 py-2.5 text-sm text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6b8c88]">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#2d6a5e] hover:text-[#245a50]">
          Sign up
        </Link>
      </p>
    </div>
  )
}
