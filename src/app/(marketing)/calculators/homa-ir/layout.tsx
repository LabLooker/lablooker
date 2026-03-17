import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HOMA-IR Calculator — Insulin Resistance Score',
  description: 'Calculate your HOMA-IR score from fasting glucose and insulin. Estimate insulin resistance for metabolic health, diabetes prevention, and weight management.',
  openGraph: {
    title: 'HOMA-IR Calculator | LabLooker',
    description: 'Free HOMA-IR calculator. Estimate insulin resistance from fasting glucose and fasting insulin levels.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
