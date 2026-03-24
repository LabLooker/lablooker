import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HOMA-IR Calculator — Estimate Insulin Resistance',
  description: 'HOMA-IR Calculator — Estimate insulin resistance from fasting glucose and insulin. Free tool for metabolic health assessment.',
  openGraph: {
    title: 'HOMA-IR Calculator | LabLooker',
    description: 'Free HOMA-IR calculator. Estimate insulin resistance from fasting glucose and insulin for metabolic health assessment.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
