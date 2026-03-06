'use client'

import { useState } from 'react'
import { APP_CONFIG } from '@/config/app'
import Button from '@/components/ui/Button'

export default function Pricing() {
  const [annual, setAnnual] = useState(true)
  const { plans } = APP_CONFIG

  const tiers = [
    {
      key: 'free' as const,
      plan: plans.free,
      price: 0,
      cta: 'Start Free — No Credit Card',
      href: '/search',
      featured: false,
      comingSoon: false,
    },
    {
      key: 'pro' as const,
      plan: plans.pro,
      price: annual ? plans.pro.annualPrice : plans.pro.monthlyPrice,
      cta: 'Get Started',
      href: '/signup',
      featured: true,
      comingSoon: false,
    },
    {
      key: 'business' as const,
      plan: plans.business,
      price: plans.business.monthlyPrice,
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
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
            Research your labs for free. Upgrade when you need more.
          </h2>
          <p className="mt-4 text-lg text-[#6b8c88]">
            No account required to search. Premium unlocks full price comparison and doctor tools.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className={`text-sm ${!annual ? 'text-[#1a2e2b]' : 'text-[#6b8c88]'}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              annual ? 'bg-primary-500' : 'bg-[#c5d8d5]'
            }`}
            role="switch"
            aria-checked={annual}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${
                annual ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? 'text-[#1a2e2b]' : 'text-[#6b8c88]'}`}>
            Annual
          </span>
          {annual && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
              Save 30%
            </span>
          )}
        </div>

        {/* Pricing cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative rounded-2xl border p-8 ${
                tier.featured
                  ? 'border-primary-500/50 bg-primary-500/5 shadow-lg shadow-primary-500/10'
                  : 'border-[#e0ebe9] bg-white'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              {tier.comingSoon && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#c5d8d5] px-4 py-1 text-xs font-semibold text-[#1a2e2b]">
                  Coming Soon
                </div>
              )}
              <h3 className="text-lg font-semibold text-[#1a2e2b]">{tier.plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                {tier.comingSoon ? (
                  <span className="text-4xl font-bold text-[#1a2e2b]">
                    ${tier.price}
                  </span>
                ) : (
                  <span className="text-4xl font-bold text-[#1a2e2b]">
                    {tier.price === 0 ? '$0' : `$${tier.price}`}
                  </span>
                )}
                {tier.price > 0 && (
                  <span className="text-sm text-[#6b8c88]">{tier.key === 'pro' && annual ? '/year' : '/month'}</span>
                )}
              </div>
              {tier.key === 'pro' && annual && (
                <p className="mt-1 text-xs text-[#6b8c88]">
                  ~$4/mo · save $22 vs monthly
                </p>
              )}
              {tier.key === 'pro' && !annual && (
                <p className="mt-1 text-xs text-[#6b8c88]">
                  Cancel anytime
                </p>
              )}
              {tier.key === 'free' && (
                <p className="mt-1 text-xs text-[#6b8c88]">
                  Forever free
                </p>
              )}

              <Button
                variant={tier.featured ? 'primary' : 'secondary'}
                className="mt-6 w-full"
                href={tier.href}
              >
                {tier.cta}
              </Button>

              <ul className="mt-8 space-y-3">
                {tier.plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#4a6b67]">
                    <svg
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        tier.featured ? 'text-primary-400' : 'text-[#c5d8d5]'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
