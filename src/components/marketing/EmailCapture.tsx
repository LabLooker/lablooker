'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('email_subscribers')
        .insert({ email, source: 'homepage' })

      if (error) {
        if (error.code === '23505') {
          setStatus('success')
          setMessage("You're already on the list!")
        } else {
          setStatus('error')
          setMessage('Something went wrong. Please try again.')
        }
      } else {
        setStatus('success')
        setMessage("You're in! We'll keep you posted.")
        setEmail('')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="bg-[#f0f7f6] py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#1a2e2b] sm:text-3xl">
          Stay in the loop
        </h2>
        <p className="mt-3 text-[#4a6b67]">
          Get notified about new features and tools. No spam, unsubscribe anytime.
        </p>

        {status === 'success' ? (
          <div className="mt-6 rounded-xl border border-[#2d6a5e]/20 bg-white px-6 py-4">
            <p className="text-[#2d6a5e] font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-2 sm:justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
              placeholder="you@example.com"
              className="h-12 flex-1 rounded-xl border border-[#e0ebe9] bg-white px-5 py-3 text-[#1a2e2b] placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e] sm:max-w-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="h-12 rounded-xl bg-[#b85c5c] px-6 font-medium text-white transition-colors hover:bg-[#a04f4f] disabled:opacity-60"
            >
              {status === 'loading' ? 'Joining...' : 'Notify me'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-600">{message}</p>
        )}
      </div>
    </section>
  )
}
