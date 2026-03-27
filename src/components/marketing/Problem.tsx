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
      solution: "LabLooker lets you search by symptom — fatigue, hair loss, brain fog — and see which tests to ask for.",
      href: '/bundles',
      cta: 'Browse test panels →',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
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
            Here&apos;s what patients face every day — and what LabLooker does about it.
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
              <div className="mb-4 inline-flex rounded-lg bg-[#b85c5c]/10 p-3 text-[#b85c5c]">
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
