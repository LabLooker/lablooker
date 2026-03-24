import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Lab Test Prices — Find the Cheapest Blood Test',
  description: 'Compare self-pay lab test prices across Ulta Lab Tests, Walk-In Lab, HealthLabs, Request A Test, and more. Find the cheapest blood test without insurance.',
  openGraph: {
    title: 'Compare Lab Test Prices | LabLooker',
    description: 'Compare self-pay lab test prices across Ulta Lab Tests, Walk-In Lab, HealthLabs, and more. Find the cheapest blood test without insurance.',
  },
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children
}
