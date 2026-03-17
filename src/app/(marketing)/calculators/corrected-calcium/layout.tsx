import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corrected Calcium Calculator — Albumin-Adjusted',
  description: 'Calculate albumin-adjusted corrected calcium. Adjusts serum calcium for low albumin levels — important for hypoparathyroid patients, kidney disease, and calcium monitoring.',
  openGraph: {
    title: 'Corrected Calcium Calculator | LabLooker',
    description: 'Free corrected calcium calculator. Adjusts serum calcium for low albumin levels using the standard clinical formula.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
