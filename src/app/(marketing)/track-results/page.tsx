import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Track Your Lab Results Over Time — LabLooker Premium',
  description: 'Save your lab results, track trends, spot what\'s changing, and get reminders when tests are due. Premium tracking for patients who take their health seriously.',
  alternates: { canonical: 'https://lablooker.com/track-results' },
}

const FEATURES = [
  {
    icon: '📥',
    title: 'Import from any lab',
    description: 'Upload PDFs from Quest, LabCorp, CPL, and more. We parse the results automatically.',
  },
  {
    icon: '📈',
    title: 'Track trends over time',
    description: 'See how each marker moves across visits. Spot patterns your doctor might miss.',
  },
  {
    icon: '🎯',
    title: 'Functional reference ranges',
    description: 'Compare your results against both standard and integrative medicine ranges — side by side.',
  },
  {
    icon: '🔔',
    title: 'Set goals and reminders',
    description: 'Track targets for key markers and get reminders when tests are coming due.',
  },
  {
    icon: '🔗',
    title: 'Share with your care team',
    description: 'Generate a shareable link to your results — no login required for your doctor.',
  },
  {
    icon: '📤',
    title: 'Export your data',
    description: 'Download your results as CSV or PDF anytime. Your data, your control.',
  },
]

export default function TrackResultsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-20">

        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#2d6a5e' }}>Premium Feature</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1a2e2b' }}>
            Track your lab results over time
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-2" style={{ color: '#4a6b67' }}>
            Upload your results, watch trends, and actually understand what's changing — visit by visit.
          </p>
          <p className="text-sm mb-8" style={{ color: '#577572' }}>
            Premium — $8/month or $59/year. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#2d6a5e' }}
            >
              Start free trial
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl px-6 py-3 text-sm font-semibold border transition-colors hover:border-[#2d6a5e] hover:text-[#2d6a5e]"
              style={{ borderColor: '#e0ebe9', color: '#577572' }}
            >
              Go to my dashboard →
            </Link>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl border p-5"
              style={{ borderColor: '#e0ebe9' }}
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold mb-1" style={{ color: '#1a2e2b' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: '#4a6b67' }}>{f.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing callout */}
        <div
          className="rounded-xl border p-6 text-center"
          style={{ borderColor: '#2d6a5e', backgroundColor: '#f0f7f6' }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#2d6a5e' }}>Simple pricing</p>
          <p className="text-2xl font-bold mb-1" style={{ color: '#1a2e2b' }}>$8/month or $59/year</p>
          <p className="text-sm mb-4" style={{ color: '#577572' }}>Cancel anytime. All tracking features included.</p>
          <Link
            href="/plans"
            className="text-sm font-medium underline"
            style={{ color: '#2d6a5e' }}
          >
            See full plan comparison →
          </Link>
        </div>

      </div>
    </div>
  )
}
