import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lab Test Topics — LabLooker',
  description: 'In-depth guides on common lab tests and conditions. Learn what to order, why it matters, and how to compare prices across labs.',
  alternates: { canonical: 'https://www.lablooker.com/topics' },
}

const TOPICS = [
  {
    href: '/topics/thyroid-labs',
    title: 'Thyroid Labs',
    description: 'Go beyond TSH. Learn which thyroid tests to order — Free T3, Free T4, Reverse T3, antibodies — and why they matter.',
    tags: ['Hypothyroid', 'Hashimoto\'s', 'Graves\''],
  },
  {
    href: '/topics/trt-labs',
    title: 'TRT Monitoring',
    description: 'Essential labs for men on testosterone replacement therapy. What to track, when to test, and what the numbers mean.',
    tags: ['Testosterone', 'Men\'s Health', 'Hormones'],
  },
  {
    href: '/topics/pcos-labs',
    title: 'PCOS Bloodwork',
    description: 'The full picture for PCOS diagnosis and monitoring — hormones, insulin resistance, and markers your doctor may skip.',
    tags: ['PCOS', 'Hormones', 'Fertility'],
  },
  {
    href: '/topics/ferritin',
    title: 'Ferritin Testing',
    description: 'Why ferritin matters more than basic iron, what "normal" misses, and how to interpret your results.',
    tags: ['Iron', 'Fatigue', 'Anemia'],
  },
  {
    href: '/topics/order-your-own-labs',
    title: 'Ordering Your Own Labs',
    description: 'How direct-to-consumer lab testing works, which states allow it, what it costs, and which tests make sense to self-order.',
    tags: ['DTC Testing', 'No Doctor Order', 'Getting Started'],
  },
  {
    href: '/topics/hashimotos-labs',
    title: "Hashimoto's Thyroiditis Labs",
    description: "Go beyond TSH — the full panel for Hashimoto's diagnosis and monitoring: TPO antibodies, Free T3, Free T4, Reverse T3, and more.",
    tags: ["Hashimoto's", 'Autoimmune', 'Thyroid'],
  },
]

export default function TopicsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#2d6a5e' }}>Topics</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1a2e2b' }}>
            Lab test guides for informed patients
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#4a6b67' }}>
            In-depth guides on common tests and conditions — what to order, why it matters, and how to compare prices.
          </p>
        </div>

        <div className="space-y-4">
          {TOPICS.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="block bg-white rounded-xl border p-6 hover:shadow-md transition-shadow group"
              style={{ borderColor: '#e0ebe9' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-[#2d6a5e] transition-colors" style={{ color: '#1a2e2b' }}>
                    {topic.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: '#4a6b67' }}>
                    {topic.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: '#f0f7f6', color: '#2d6a5e' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xl mt-1 shrink-0 text-[#2d6a5e] opacity-50 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm mt-10" style={{ color: '#577572' }}>
          More topics coming soon. Have a suggestion?{' '}
          <a href="mailto:hello@lablooker.com" className="underline hover:text-[#2d6a5e]">Let us know.</a>
        </p>
      </div>
    </div>
  )
}
