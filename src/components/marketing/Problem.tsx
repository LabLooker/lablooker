import Link from 'next/link'

export default function Problem() {
  const painPoints = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      ),
      title: "You don't know what to order",
      description: "Doctors use codes you've never heard of. Insurance denies tests without explanation. You're left Googling at midnight.",
      solution: "LabLooker lets you search by symptom — fatigue, hair loss, brain fog — and shows exactly which tests are commonly ordered and why.",
      href: '/bundles',
      cta: 'Browse test panels →',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
      title: 'Lab prices are a black box',
      description: 'The same ferritin test costs $28 at one lab and $400 at another. Self-pay options exist — but nobody tells you where to find them.',
      solution: "LabLooker compares real self-pay prices across 15+ labs side by side, so you can find the lowest price before you order.",
      href: '/compare',
      cta: 'Compare prices →',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
      title: "Talking to your doctor is hard",
      description: "You know something's wrong. But walking in without the right test names, CPT codes, or ICD-10 diagnoses means getting dismissed.",
      solution: "LabLooker generates a ready-to-send doctor request with the exact tests, codes, and clinical reasons — so you walk in prepared.",
      href: '/advocate',
      cta: 'Generate a request →',
    },
  ]

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            The problem
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
            The system isn&apos;t built for patients. LabLooker is.
          </h2>
          <p className="mt-4 text-lg text-[#577572]">
            Here&apos;s what patients face every day — and exactly how LabLooker fixes it.
          </p>
        </div>

        {/* Pain points */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {painPoints.map((point, i) => (
            <Link
              key={i}
              href={point.href}
              className="group relative rounded-xl border border-[#e0ebe9] bg-white p-8 transition-all duration-300 hover:border-[#2d6a5e]/30 hover:shadow-lg hover:shadow-[#2d6a5e]/5"
            >
              <div className="mb-4 inline-flex rounded-lg bg-red-500/10 p-3 text-red-400">
                {point.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#1a2e2b]">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#577572]">
                {point.description}
              </p>
              <div className="mt-4 border-t border-[#e0ebe9] pt-4">
                <p className="text-sm leading-relaxed text-primary-500">
                  ✓ {point.solution}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-[#2d6a5e] group-hover:underline">
                  {point.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
