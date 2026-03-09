'use client'

import { useState } from 'react'

export default function FeedbackForm() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Open mailto link with pre-filled content
    const subject = encodeURIComponent('LabLooker Feedback')
    const body = encodeURIComponent(`${message}\n\n---\nFrom: ${email || 'Anonymous'}`)
    window.location.href = `mailto:hello@lablooker.com?subject=${subject}&body=${body}`
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
      setEmail('')
      setMessage('')
    }, 3000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-[#d4e5e1] bg-[#f0f7f5] px-4 py-2 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#e4efec] hover:text-[#1a2e2b]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
        Send Feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-[#e0ebe9] bg-white p-8 shadow-xl">
            {submitted ? (
              <div className="text-center py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2d6a5e]/10">
                  <svg className="h-6 w-6 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#1a2e2b]">Thank you!</h3>
                <p className="mt-1 text-sm text-[#577572]">Your email client should open with your feedback.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#1a2e2b]">Send Feedback</h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-[#577572] hover:text-[#1a2e2b] transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-sm text-[#577572]">
                  We&apos;d love to hear from you. Bug reports, feature requests, or just a hello.
                </p>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="feedback-email" className="block text-sm font-medium text-[#3d5a56]">
                      Email <span className="text-[#577572]">(optional)</span>
                    </label>
                    <input
                      id="feedback-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-lg border border-[#d4e5e1] bg-white px-4 py-2.5 text-sm text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedback-message" className="block text-sm font-medium text-[#3d5a56]">
                      Message
                    </label>
                    <textarea
                      id="feedback-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What's on your mind?"
                      className="mt-1 w-full resize-none rounded-lg border border-[#d4e5e1] bg-white px-4 py-2.5 text-sm text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#2d6a5e] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245a50]"
                  >
                    Send Feedback
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
