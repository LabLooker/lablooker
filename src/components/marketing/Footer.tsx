import Link from 'next/link'
import { APP_CONFIG } from '@/config/app'
import FeedbackForm from './FeedbackForm'

export default function Footer() {
  const columns = [
    {
      title: 'Tools',
      links: [
        { label: 'Search Tests', href: '/search' },
        { label: 'Translate Codes', href: '/translate' },
        { label: 'Compare Prices', href: '/compare' },
        { label: 'Test Panels', href: '/bundles' },
        { label: 'Generate Request', href: '/advocate' },
        { label: 'Plans', href: '/pricing' },
      ],
    },
    {
      title: 'Topics',
      links: [
        { label: 'Thyroid Labs', href: '/topics/thyroid-labs' },
        { label: 'TRT Monitoring', href: '/topics/trt-labs' },
        { label: 'PCOS Bloodwork', href: '/topics/pcos-labs' },
        { label: 'Ferritin Testing', href: '/topics/ferritin' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ]

  return (
    <footer className="border-t border-[#e0ebe9] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold text-[#1a2e2b]">
              {APP_CONFIG.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[#577572]">
              {APP_CONFIG.description}
            </p>
            <div className="mt-4">
              <FeedbackForm />
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-[#1a2e2b]">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#577572] transition-colors hover:text-[#1a2e2b]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Affiliate disclosure */}
        <p className="mt-12 text-[11px] leading-relaxed text-[#7a9e99]">
          <strong className="text-[#6b9490]">Affiliate Disclosure:</strong> LabLooker may earn a commission when you
          purchase through lab links on our site. This does not affect our rankings or the prices you pay.
          We independently research all labs and pricing.
        </p>

        {/* Bottom */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-[#e0ebe9] pt-8 sm:flex-row">
          <p className="text-xs text-[#6b9490]">
            &copy; {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          {/* Social links — add when accounts are active */}
        </div>
      </div>
    </footer>
  )
}
