'use client'

import { useState } from 'react'

type TestOption = {
  testId: string
  testName: string
}

type ShareModalProps = {
  isOpen: boolean
  onClose: () => void
  tests: TestOption[]
}

export default function ShareModal({ isOpen, onClose, tests }: ShareModalProps) {
  const [step, setStep] = useState<'configure' | 'done'>('configure')
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set())
  const [generating, setGenerating] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  function reset() {
    setStep('configure')
    setTitle('')
    setNote('')
    setSelectedTests(new Set())
    setGenerating(false)
    setShareUrl('')
    setCopied(false)
    setError('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function toggleTest(testId: string) {
    setSelectedTests(prev => {
      const next = new Set(prev)
      if (next.has(testId)) next.delete(testId)
      else next.add(testId)
      return next
    })
  }

  function toggleAll() {
    if (selectedTests.size === tests.length) {
      setSelectedTests(new Set())
    } else {
      setSelectedTests(new Set(tests.map(t => t.testId)))
    }
  }

  async function handleGenerate() {
    if (selectedTests.size === 0) return
    setGenerating(true)
    setError('')

    try {
      const res = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || undefined,
          note: note.trim() || undefined,
          testIds: [...selectedTests],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate share link')
        setGenerating(false)
        return
      }

      setShareUrl(data.url)
      setStep('done')
    } catch {
      setError('Failed to generate share link')
    } finally {
      setGenerating(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select text in input
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#e0ebe9] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0ebe9] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1a2e2b]">
            {step === 'configure' ? 'Share Results' : 'Link Ready'}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#577572] transition-colors hover:bg-[#f0f7f6] hover:text-[#1a2e2b]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {step === 'configure' && (
            <>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#1a2e2b] mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Thyroid Results"
                  className="w-full rounded-xl border border-[#e0ebe9] px-4 py-2.5 text-sm placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-[#1a2e2b] mb-1">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Here are my recent labs for your review"
                  rows={2}
                  className="w-full rounded-xl border border-[#e0ebe9] px-4 py-2.5 text-sm placeholder-[#577572] focus:border-[#2d6a5e] focus:outline-none resize-none"
                />
              </div>

              {/* Test selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[#1a2e2b]">
                    Select tests to share
                  </label>
                  <button
                    onClick={toggleAll}
                    className="text-xs font-medium text-[#2d6a5e] hover:underline"
                  >
                    {selectedTests.size === tests.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                <div className="rounded-xl border border-[#e0ebe9] divide-y divide-[#e0ebe9] max-h-52 overflow-y-auto">
                  {tests.map((test) => (
                    <label
                      key={test.testId}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f0f7f6] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTests.has(test.testId)}
                        onChange={() => toggleTest(test.testId)}
                        className="h-4 w-4 rounded border-[#e0ebe9] text-[#2d6a5e] focus:ring-[#2d6a5e]"
                      />
                      <span className="text-sm text-[#1a2e2b]">{test.testName}</span>
                    </label>
                  ))}
                </div>
                {selectedTests.size > 0 && (
                  <p className="text-xs text-[#577572] mt-1.5">
                    {selectedTests.size} test{selectedTests.size !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-[#b85c5c]">{error}</p>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={selectedTests.size === 0 || generating}
                className="w-full rounded-xl bg-[#2d6a5e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate Link'}
              </button>
            </>
          )}

          {step === 'done' && (
            <>
              <div className="text-center mb-2">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2d6a5e]/10">
                  <svg className="h-6 w-6 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.193-5.121a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.34 8.374" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1a2e2b]">Your share link is ready</p>
              </div>

              {/* URL display */}
              <div className="rounded-xl border border-[#e0ebe9] bg-[#faf8f5] px-4 py-3">
                <p className="text-sm text-[#1a2e2b] break-all font-mono">{shareUrl}</p>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  copied
                    ? 'bg-[#2d6a5e]/10 text-[#2d6a5e]'
                    : 'bg-[#2d6a5e] text-white hover:bg-[#245549]'
                }`}
              >
                {copied ? 'Copied \u2713' : 'Copy Link'}
              </button>

              <p className="text-xs text-[#577572] text-center">
                Anyone with this link can view these results. No account required.
              </p>

              {/* Done button */}
              <button
                onClick={handleClose}
                className="w-full rounded-xl border border-[#e0ebe9] px-4 py-2.5 text-sm font-medium text-[#577572] transition-colors hover:bg-[#faf8f5]"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
