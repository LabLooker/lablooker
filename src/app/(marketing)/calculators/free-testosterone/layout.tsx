import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Testosterone Calculator — Vermeulen Method',
  description: 'Calculate free testosterone from total testosterone, SHBG, and albumin using the Vermeulen method. Important for BHRT/TRT patients and hormone therapy monitoring.',
  openGraph: {
    title: 'Free Testosterone Calculator | LabLooker',
    description: 'Free testosterone calculator using the Vermeulen method. Estimate bioavailable testosterone from total T, SHBG, and albumin.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
