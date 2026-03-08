import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Lab Test Prices',
  description: 'Compare self-pay lab test prices across Ulta Lab Tests, Walk-In Lab, HealthLabs, Request A Test, and more. Find the cheapest price for any blood test.',
  openGraph: {
    title: 'Compare Lab Test Prices | LabLooker',
    description: 'Compare self-pay lab test prices across major DTC lab providers. Find the cheapest blood test near you.',
  },
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children
}
