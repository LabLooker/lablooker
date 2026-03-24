import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corrected Calcium Calculator — Adjust Calcium for Albumin Levels',
  description: 'Corrected Calcium Calculator — Adjust calcium for albumin levels. Free online calculator for hypoparathyroidism, hypoalbuminemia, and CKD patients.',
  openGraph: {
    title: 'Corrected Calcium Calculator | LabLooker',
    description: 'Free corrected calcium calculator. Adjust calcium for albumin levels — for hypoparathyroidism, hypoalbuminemia, and CKD patients.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
