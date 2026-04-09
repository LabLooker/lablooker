import Link from 'next/link'

interface TopicCTAsProps {
  /** Topic name for contextual copy, e.g. "thyroid" or "PCOS" */
  topic: string
  /** Show compare prices CTA (default: true) */
  showCompare?: boolean
  /** Show track results CTA (default: true) */
  showTrack?: boolean
  /** Show advocate/request letter CTA (default: true) */
  showAdvocate?: boolean
  /** Show translate results CTA (default: true) */
  showTranslate?: boolean
}

/**
 * Conversion-focused CTA block for topic guide pages.
 * Drives users toward Compare (affiliate revenue), Track (signup/premium),
 * Advocate (signup), and Translate (engagement).
 */
export default function TopicCTAs({
  topic,
  showCompare = true,
  showTrack = true,
  showAdvocate = true,
  showTranslate = true,
}: TopicCTAsProps) {
  return (
    <div className="mt-12 space-y-4">
      <h2 className="text-lg font-bold text-[#1a2e2b]">Next steps</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {showCompare && (
          <Link
            href="/compare"
            className="group flex items-start gap-3 rounded-xl border border-[#e0ebe9] bg-white p-4 transition-all hover:border-[#b85c5c]/30 hover:bg-[#b85c5c]/5"
          >
            <span className="mt-0.5 text-lg">💰</span>
            <div>
              <p className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#b85c5c]">
                Compare {topic} test prices
              </p>
              <p className="mt-1 text-xs text-[#577572]">
                The same test can cost 2–10× more depending on where you order. See prices side by side.
              </p>
            </div>
          </Link>
        )}

        {showTrack && (
          <Link
            href="/track-results"
            className="group flex items-start gap-3 rounded-xl border border-[#e0ebe9] bg-white p-4 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
          >
            <span className="mt-0.5 text-lg">📊</span>
            <div>
              <p className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#2d6a5e]">
                Track your results over time
              </p>
              <p className="mt-1 text-xs text-[#577572]">
                Log your labs, spot trends, and see what&apos;s changing. Free account required.
              </p>
            </div>
          </Link>
        )}

        {showAdvocate && (
          <Link
            href="/advocate"
            className="group flex items-start gap-3 rounded-xl border border-[#e0ebe9] bg-white p-4 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
          >
            <span className="mt-0.5 text-lg">📋</span>
            <div>
              <p className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#2d6a5e]">
                Generate a test request letter
              </p>
              <p className="mt-1 text-xs text-[#577572]">
                Need your doctor to order these labs? Create a letter with the tests and CPT codes.
              </p>
            </div>
          </Link>
        )}

        {showTranslate && (
          <Link
            href="/translate"
            className="group flex items-start gap-3 rounded-xl border border-[#e0ebe9] bg-white p-4 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
          >
            <span className="mt-0.5 text-lg">🔍</span>
            <div>
              <p className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#2d6a5e]">
                Translate your lab results
              </p>
              <p className="mt-1 text-xs text-[#577572]">
                Already have results? Get plain-English explanations of what your numbers mean.
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
