import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recommended Lab Panels & Test Bundles',
  description: 'Curated lab test panels for thyroid, PCOS, TRT, BHRT, iron, weight loss, and longevity. Know exactly which tests to order — built by patients, for patients.',
  openGraph: {
    title: 'Recommended Lab Panels & Test Bundles',
    description: 'Curated lab test panels for thyroid, PCOS, TRT, BHRT, iron, weight loss, and longevity. Know exactly which tests to order.',
    url: 'https://www.lablooker.com/bundles',
  },
}

export default function BundlesLayout({ children }: { children: React.ReactNode }) {
  return children
}
