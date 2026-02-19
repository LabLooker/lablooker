export default function Problem() {
  const painPoints = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      title: 'Wasting hours on boilerplate',
      description:
        'Setting up auth, payments, and infrastructure from scratch every single time. Days lost before writing a single line of business logic.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      ),
      title: 'Fragile integrations that break',
      description:
        'Stitching together auth providers, payment APIs, and databases with duct tape. One update and the whole thing crumbles.',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
      title: 'Losing money to slow launches',
      description:
        "Every week you spend building infrastructure is a week you're not shipping features. Your competitors are already live.",
    },
  ]

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-400">
            The problem
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Building SaaS from scratch is broken
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            You have a great idea. But before you can build it, you need to solve the same problems everyone else does.
          </p>
        </div>

        {/* Pain points */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/5"
            >
              <div className="mb-4 inline-flex rounded-lg bg-red-500/10 p-3 text-red-400">
                {point.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
