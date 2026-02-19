export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "We went from idea to paying customers in 3 days. The auth and Stripe integration alone saved us 2 weeks of work.",
      name: 'Sarah Chen',
      role: 'Founder, DataFlow',
      initials: 'SC',
    },
    {
      quote:
        "I've used dozens of starter templates. This is the only one that actually felt production-ready out of the box. No surprises.",
      name: 'Marcus Rodriguez',
      role: 'CTO, ShipStack',
      initials: 'MR',
    },
    {
      quote:
        "Our team shipped 4 different SaaS products this quarter using the same template. It just works, every time.",
      name: 'Emily Park',
      role: 'Lead Engineer, Launchpad',
      initials: 'EP',
    },
  ]

  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loved by builders everywhere
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-8"
            >
              {/* Quote mark */}
              <svg
                className="absolute right-6 top-6 h-8 w-8 text-zinc-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
              </svg>
              <p className="mb-6 text-sm leading-relaxed text-zinc-300">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
