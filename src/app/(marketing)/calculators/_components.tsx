'use client'

import Link from 'next/link'

export function CalcInput({
  label,
  unit,
  value,
  onChange,
}: {
  label: string
  unit: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a2e2b] mb-1.5">
        {label} <span className="text-xs text-[#577572] font-normal">({unit})</span>
      </label>
      <input
        type="number"
        step="any"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#e0ebe9] px-4 py-3 text-base focus:border-[#2d6a5e] focus:outline-none"
        placeholder="0"
      />
    </div>
  )
}

export function ResultDisplay({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#f0f7f6] border border-[#e0ebe9] px-5 py-4">
      <p className="text-2xl font-bold text-[#1a2e2b]">{value}</p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  )
}

export function CalculatorShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-xl px-6">
        {/* Back link */}
        <Link
          href="/calculators"
          className="inline-flex items-center gap-1.5 text-sm text-[#577572] hover:text-[#2d6a5e] mb-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          All Calculators
        </Link>

        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight text-[#1a2e2b] sm:text-3xl">{title}</h1>
        <p className="mt-3 text-[#577572] leading-relaxed">{description}</p>

        {/* Calculator content */}
        <div className="mt-8 space-y-6">
          {children}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs text-amber-800">
          For informational purposes only. Not medical advice. Always confirm results with your healthcare provider before making medical decisions.
        </div>
      </div>
    </div>
  )
}
