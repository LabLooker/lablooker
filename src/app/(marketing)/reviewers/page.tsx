import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Medical Review | LabLooker',
  description:
    'LabLooker content is reviewed by a board-certified nurse practitioner to help ensure clinical accuracy.',
  robots: { index: true, follow: true },
}

export default function ReviewersPage() {
  return (
    <main className="min-h-screen" style={{ background: '#f0f7f6' }}>
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#1a2e2b' }}
          >
            Medical Review
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: '#4a6b67' }}
          >
            Accuracy matters. Our clinical content is reviewed by a licensed
            healthcare professional.
          </p>
        </div>
      </section>

      {/* Reviewer card */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div
            className="bg-white rounded-2xl border p-8 md:p-10 space-y-6"
            style={{ borderColor: '#e0ebe9' }}
          >
            {/* Credentials */}
            <div>
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: '#1a2e2b' }}
              >
                Ariana Dietrich, DNP, APRN, CPNP-AC
              </h2>
              <p
                className="text-sm font-medium"
                style={{ color: '#2d6a5e' }}
              >
                Board-Certified Pediatric Nurse Practitioner — Acute Care
              </p>
            </div>

            {/* Bio */}
            <div
              className="space-y-4 text-base leading-relaxed"
              style={{ color: '#4a6b67' }}
            >
              <p>
                Ariana is a Doctor of Nursing Practice (DNP) and board-certified
                acute care pediatric nurse practitioner (CPNP-AC). She brings
                clinical expertise in diagnostics, lab interpretation, and
                evidence-based patient care.
              </p>
              <p>
                As LabLooker&apos;s medical reviewer, Ariana evaluates educational
                content for clinical accuracy — including reference ranges,
                test descriptions, preparation instructions, and condition-specific
                lab guides. Her review helps ensure the information on this site
                reflects current clinical standards.
              </p>
            </div>

            {/* Review process */}
            <div
              className="rounded-xl p-6"
              style={{ background: '#f0f7f6', borderLeft: '4px solid #2d6a5e' }}
            >
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: '#2d6a5e' }}
              >
                Our Review Process
              </h3>
              <ul
                className="space-y-2 text-sm leading-relaxed"
                style={{ color: '#4a6b67' }}
              >
                <li className="flex items-start gap-2">
                  <span style={{ color: '#2d6a5e' }}>✓</span>
                  <span>Content is drafted using peer-reviewed medical sources (NIH, Mayo Clinic, UpToDate)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#2d6a5e' }}>✓</span>
                  <span>A licensed clinician reviews for clinical accuracy and completeness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#2d6a5e' }}>✓</span>
                  <span>Reviewed pages display a &quot;Medically reviewed&quot; badge with the review date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#2d6a5e' }}>✓</span>
                  <span>Content is periodically re-reviewed as guidelines evolve</span>
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <p
              className="text-xs leading-relaxed"
              style={{ color: '#8ba5a1' }}
            >
              LabLooker provides educational information only and is not a
              substitute for professional medical advice, diagnosis, or
              treatment. Always consult a qualified healthcare provider with
              questions about your health.
            </p>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:underline"
              style={{ color: '#2d6a5e' }}
            >
              ← Back to About
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
