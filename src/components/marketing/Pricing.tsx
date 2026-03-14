'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { APP_CONFIG } from '@/config/app'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const FEATURE_MATRIX = [
  { feature: 'Search tests', free: true, premium: true },
  { feature: 'Translate codes', free: true, premium: true },
  { feature: 'Compare prices', free: true, premium: true },
  { feature: 'Panels and topics', free: true, premium: true },
  { feature: 'PDF import parsing', free: 'Preview only', premium: 'Save to tracker' },
  { feature: 'Share results', free: 'One-time links', premium: 'Ongoing data + exports' },
  { feature: 'Lab test request letters', free: 'Names + CPT codes', premium: 'Full coded (ICD-10 + lab codes)' },
  { feature: 'Save results', free: false, premium: true },
  { feature: 'Track over time', free: false, premium: true },
  { feature: 'Trend charts', free: false, premium: true },
  { feature: 'Custom goals and ranges', free: false, premium: true },
  { feature: 'Functional/optimal ranges', free: false, premium: true },
  { feature: 'Retest reminders', free: false, premium: true },
  { feature: 'Export/download data', free: false, premium: true },
]

const WHY_UPGRADE = [
  'Save results instead of just previewing them',
  'Watch biomarkers change across multiple tests',
  'Set personal goals and reference ranges',
  'Keep everything in one place for follow-up, retesting, and doctor visits',
]

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 shrink-0 ${className ?? ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#c5d8d5]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <CheckIcon className="text-[#2d6a5e]" />
  if (value === false) return <XIcon />
  return <span className="text-xs text-[#577572]">{value}</span>
}

function BillingToggle({ isAnnual, onToggle }: { isAnnual: boolean; onToggle: () => void }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <span className={`text-sm font-medium ${!isAnnual ? 'text-[#1a2e2b]' : 'text-[#577572]'}`}>Monthly</span>
      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
          isAnnual ? 'bg-[#2d6a5e]' : 'bg-[#c5d8d5]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            isAnnual ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${isAnnual ? 'text-[#1a2e2b]' : 'text-[#577572]'}`}>Annual</span>
    </div>
  )
}

export default function Pricing() {
  const { plans } = APP_CONFIG
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAnnual, setIsAnnual] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handlePremiumCheckout() {
    if (!user) {
      router.push('/signup?redirect=/pricing')
      return
    }

    setCheckoutLoading(true)
    try {
      const priceId = isAnnual
        ? process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout failed:', res.status, data)
        alert(`Checkout error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(`Checkout error: ${error}`)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const tiers = [
    {
      key: 'free' as const,
      plan: plans.free,
      price: '$0',
      period: 'Free forever',
      cta: 'Start Free — No Credit Card',
      href: '/search',
      featured: false,
      comingSoon: false,
    },
    {
      key: 'pro' as const,
      plan: plans.pro,
      price: isAnnual ? '$59' : '$8',
      period: isAnnual ? '/year' : '/month',
      annualNote: isAnnual ? 'Save 39% vs monthly' : '$59/year (save 39%)',
      cta: checkoutLoading ? 'Loading...' : 'Start Premium',
      featured: true,
      comingSoon: false,
    },
    {
      key: 'business' as const,
      plan: plans.business,
      price: `$${plans.business.monthlyPrice}`,
      period: '/month',
      cta: 'Join Waitlist',
      href: 'mailto:hello@lablooker.com?subject=Practice%20Tier%20Waitlist',
      featured: false,
      comingSoon: true,
    },
  ]

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e0ebe9] to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2d6a5e]">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
            Research your labs for free.<br className="hidden sm:block" />
            Track your labs over time with Premium.
          </h2>
          <p className="mt-4 text-lg text-[#577572]">
            Search tests, compare prices, translate codes, and preview imported results — all free.
            Upgrade when you want a personal dashboard to save results and monitor your health over time.
          </p>
          <p className="mt-3 text-sm font-medium italic text-[#2d6a5e]">
            Built for repeat testing, chronic condition monitoring, hormone therapy, and optimization.
          </p>
        </div>

        {/* Plan cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative rounded-2xl border p-8 ${
                tier.featured
                  ? 'border-[#2d6a5e]/50 bg-[#2d6a5e]/5 shadow-lg shadow-[#2d6a5e]/10'
                  : 'border-[#e0ebe9] bg-white'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2d6a5e] px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              {tier.comingSoon && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#c5d8d5] px-4 py-1 text-xs font-semibold text-[#1a2e2b]">
                  Coming Soon
                </div>
              )}

              <h3 className="text-lg font-semibold text-[#1a2e2b]">{tier.plan.name}</h3>

              {/* Best for */}
              {'bestFor' in tier.plan && (
                <p className="mt-2 text-xs text-[#577572] leading-relaxed">
                  {(tier.plan as any).bestFor}
                </p>
              )}

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#1a2e2b]">{tier.price}</span>
                {tier.period && (
                  <span className="text-sm text-[#577572]">{tier.period}</span>
                )}
              </div>
              {'annualNote' in tier && (
                <p className="mt-1.5 text-sm font-medium text-[#2d6a5e]">{(tier as any).annualNote}</p>
              )}

              {/* Billing toggle on Premium card */}
              {tier.key === 'pro' && (
                <BillingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />
              )}

              {/* CTA */}
              {tier.key === 'pro' ? (
                <Button
                  variant="primary"
                  className="mt-6 w-full"
                  onClick={handlePremiumCheckout}
                  disabled={checkoutLoading}
                >
                  {tier.cta}
                </Button>
              ) : (
                <Button
                  variant={tier.featured ? 'primary' : 'secondary'}
                  className="mt-6 w-full"
                  href={(tier as any).href}
                >
                  {tier.cta}
                </Button>
              )}

              {/* Features */}
              <ul className="mt-8 space-y-3">
                {tier.plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#4a6b67]">
                    <CheckIcon className={tier.featured ? 'text-[#2d6a5e]' : 'text-[#c5d8d5]'} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Why upgrade */}
        <div className="mx-auto mt-20 max-w-2xl">
          <div className="rounded-2xl border border-[#e0ebe9] bg-[#f0f7f6] p-8 sm:p-10">
            <h3 className="text-xl font-bold text-[#1a2e2b]">Why upgrade?</h3>
            <p className="mt-3 text-[#577572]">
              Free helps you research labs. Premium helps you monitor your own labs over time.
            </p>
            <p className="mt-4 text-sm font-medium text-[#1a2e2b]">
              Upgrade when you want more than a one-time lookup:
            </p>
            <ul className="mt-3 space-y-2">
              {WHY_UPGRADE.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#4a6b67]">
                  <CheckIcon className="text-[#2d6a5e] mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature comparison matrix */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h3 className="text-center text-xl font-bold text-[#1a2e2b]">Feature comparison</h3>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e0ebe9]">
                  <th className="py-3 pr-4 text-left font-semibold text-[#1a2e2b]">Feature</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#577572]">Free</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#2d6a5e]">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0ebe9]">
                {FEATURE_MATRIX.map((row, i) => (
                  <tr key={i} className="hover:bg-[#f0f7f6]/50">
                    <td className="py-3 pr-4 text-[#4a6b67]">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <CellValue value={row.free} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <CellValue value={row.premium} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
