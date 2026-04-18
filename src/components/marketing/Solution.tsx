import Link from 'next/link'

export default function Solution() {
  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      ),
      title: 'Search & compare tests',
      description:
        "Know what you need? Search by test name, CPT code, or lab code and compare real self-pay prices across 7+ providers instantly.",
      href: '/search',
      cta: 'Search tests →',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      title: 'Compare real self-pay prices',
      description:
        'See prices from Quest, LabCorp, Ulta Lab Tests, Walk-In Lab, and 10+ more, side by side.',
      href: '/compare',
      cta: 'Compare prices →',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
      title: 'Understand the codes',
      description:
        'Every test includes its CPT code, common ICD-10 diagnosis codes, and a plain-English explanation of what it measures and why.',
      href: '/translate',
      cta: 'Translate codes →',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      ),
      title: 'Explore by symptom or condition',
      description:
        "Not sure what to order? Browse by symptom, condition, or health goal — and see which tests are commonly discussed for each.",
      href: '/explore',
      cta: 'Start exploring →',
    },
  ]

  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Subtle divider gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            The solution
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
            Finally, a tool built for patients
          </h2>
          <p className="mt-4 text-lg text-[#577572]">
            One place to research your labs for free — and track your own results when you&apos;re ready to go deeper.
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Link
              key={i}
              href={feature.href}
              className="group relative rounded-xl border border-[#e0ebe9] bg-white p-8 transition-all duration-300 hover:border-[#2d6a5e]/30 hover:shadow-lg hover:shadow-[#2d6a5e]/5"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary-500/10 p-3 text-primary-400">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1a2e2b]">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#577572]">
                {feature.description}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-[#2d6a5e] group-hover:underline">
                {feature.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
