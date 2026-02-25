export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "I spent two years asking my doctor for the right thyroid tests and getting pushback. LabLooker showed me the exact CPT codes and ICD-10 codes to ask for. I walked in prepared and got every test I needed on the first try.",
      name: 'Michelle T.',
      role: "Hashimoto's patient, Texas",
      initials: 'MT',
    },
    {
      quote:
        "After losing my job I had no insurance. LabLooker saved me hundreds — I found the same CBC and metabolic panel for $29 at Ulta Lab Tests instead of $340 at the hospital. Same exact test, same Quest lab.",
      name: 'David R.',
      role: 'Self-pay after job loss, Ohio',
      initials: 'DR',
    },
    {
      quote:
        "I manage five chronic conditions and get labs drawn every 8 weeks. Before LabLooker I had no way to compare prices or know which ICD-10 codes would get approved. Now I save time at every appointment.",
      name: 'Angela M.',
      role: 'Chronic illness advocate, Florida',
      initials: 'AM',
    },
  ]

  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e0ebe9] to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            From real patients
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
            Built by a patient, for patients.
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-[#e0ebe9] bg-white p-8"
            >
              {/* Quote mark */}
              <svg
                className="absolute right-6 top-6 h-8 w-8 text-[#e0ebe9]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
              </svg>
              <p className="mb-6 text-sm leading-relaxed text-[#4a6b67]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a2e2b]">{t.name}</p>
                  <p className="text-xs text-[#6b8c88]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
