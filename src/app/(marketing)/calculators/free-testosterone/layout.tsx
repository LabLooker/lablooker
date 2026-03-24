import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Testosterone Calculator — Vermeulen Method',
  description: 'Free Testosterone Calculator — Calculate bioavailable testosterone from total T, SHBG, and albumin. Free online calculator for TRT and BHRT monitoring.',
  openGraph: {
    title: 'Free Testosterone Calculator | LabLooker',
    description: 'Free testosterone calculator using the Vermeulen method. Calculate bioavailable testosterone from total T, SHBG, and albumin.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
