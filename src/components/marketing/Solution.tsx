export default function Solution() {
  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      ),
      title: 'Search by symptom or test name',
      description:
        "Find what you need whether you know the test name or just your symptoms. LabLooker maps both to the right lab tests.",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      title: 'Compare real self-pay prices',
      description:
        'See prices from Quest, LabCorp, Ulta Lab Tests, Walk-In Lab, and 10+ more, side by side.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      ),
      title: 'Understand the codes',
      description:
        'Every test includes its CPT code, common ICD-10 diagnosis codes, and a plain-English explanation of what it measures and why.',
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
            One place to research, compare, and understand your lab work.
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-xl border border-[#e0ebe9] bg-white p-8 transition-all duration-300 hover:border-primary-500/30 hover:bg-primary-500/5"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
