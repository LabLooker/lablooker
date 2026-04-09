import Link from 'next/link'

interface ReviewedByBadgeProps {
  /** ISO date string, e.g. "2026-04-09" */
  reviewedDate?: string
  /** Compact mode for inline use in articles */
  compact?: boolean
}

/**
 * "Medically reviewed" badge linking to /reviewers.
 * Shows reviewer credentials + optional review date.
 * 
 * Usage:
 *   <ReviewedByBadge reviewedDate="2026-04-09" />
 *   <ReviewedByBadge compact />
 */
export default function ReviewedByBadge({ reviewedDate, compact }: ReviewedByBadgeProps) {
  const formattedDate = reviewedDate
    ? new Date(reviewedDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  if (compact) {
    return (
      <Link
        href="/reviewers"
        className="inline-flex items-center gap-1.5 text-xs transition-colors hover:underline"
        style={{ color: '#2d6a5e' }}
      >
        <svg
          className="h-3.5 w-3.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
        <span>
          Medically reviewed{formattedDate ? ` ${formattedDate}` : ''}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href="/reviewers"
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors hover:border-[#2d6a5e]/40 hover:bg-[#2d6a5e]/5"
      style={{ borderColor: '#e0ebe9', color: '#4a6b67' }}
    >
      <svg
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#2d6a5e"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
      <span>
        <span className="font-medium" style={{ color: '#1a2e2b' }}>
          Medically reviewed
        </span>
        {' by '}
        <span className="font-medium" style={{ color: '#2d6a5e' }}>
          Ariana Dietrich, DNP, APRN
        </span>
        {formattedDate && (
          <span style={{ color: '#8ba5a1' }}>{' · '}{formattedDate}</span>
        )}
      </span>
    </Link>
  )
}
