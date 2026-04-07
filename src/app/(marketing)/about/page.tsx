import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About LabLooker | Built for Patients, Not Providers',
  description: 'LabLooker helps patients research lab tests, compare prices, and track results over time. Built by a patient, for patients.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: '#f0f7f6' }}>
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1a2e2b' }}>
            Built for patients, not providers.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: '#4a6b67' }}>
            LabLooker exists because navigating your own health data shouldn't require a medical degree, a referral, or a $400 appointment.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 md:p-10 space-y-5 text-base leading-relaxed" style={{ borderColor: '#e0ebe9', color: '#4a6b67' }}>
            <p>
              If you live with a chronic illness, you know the feeling: a lab report lands in your portal, full of numbers and codes you don't recognize, with no explanation of what any of it means or what to do next.
            </p>
            <p>
              You might spend hours Googling. You might wait weeks for a follow-up appointment just to ask basic questions. You might order the same test from different labs and pay wildly different prices — without knowing it.
            </p>
            <p style={{ color: '#1a2e2b', fontWeight: 600 }}>
              LabLooker was built to fix that.
            </p>
            <p>
              We help you search and understand lab tests, compare real self-pay prices across multiple lab providers, translate confusing lab codes into plain English, generate a lab request letter to bring to your doctor, and track your results over time so you can actually see what's changing.
            </p>
            <p>
              We don't sell your data. We don't work for the labs. We don't have a financial interest in which lab you choose. Our goal is simple: give you the same information your doctor has, in a format you can actually use.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: '#1a2e2b' }}>What we stand for</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: '🔍',
                title: 'Transparency',
                body: 'Real prices. Real ranges. No hidden upsells, no sponsored results, no lab partnerships that influence what we show you.',
              },
              {
                icon: '🤝',
                title: 'Patient advocacy',
                body: 'You have the right to understand your own labs. We make that easier — whether you\'re managing a condition or just staying proactive.',
              },
              {
                icon: '🔒',
                title: 'Privacy',
                body: 'Your health data is yours. We never sell it, share it, or use it for advertising. Premium accounts are protected by Supabase row-level security.',
              },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-xl border p-6 text-center" style={{ borderColor: '#e0ebe9' }}>
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#1a2e2b' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4a6b67' }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border p-6" style={{ borderColor: '#e0ebe9', background: '#faf8f5' }}>
            <p className="text-sm leading-relaxed text-center" style={{ color: '#577572' }}>
              <strong style={{ color: '#1a2e2b' }}>Medical disclaimer:</strong> LabLooker is an informational resource only. Nothing on this site constitutes medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider about your results and health decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-3" style={{ color: '#1a2e2b' }}>Ready to take control of your labs?</h2>
          <p className="mb-6 text-sm" style={{ color: '#4a6b67' }}>Free to start. No account required for search, compare, translate, and request.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white text-sm"
              style={{ background: '#2d6a5e' }}
            >
              Search Tests
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm border-2"
              style={{ borderColor: '#2d6a5e', color: '#2d6a5e' }}
            >
              Compare Prices
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
