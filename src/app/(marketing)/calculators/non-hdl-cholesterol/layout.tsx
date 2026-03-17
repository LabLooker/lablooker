import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Non-HDL Cholesterol Calculator',
  description: 'Calculate non-HDL cholesterol from total cholesterol and HDL. A better predictor of cardiovascular risk than LDL alone, especially when triglycerides are elevated.',
  openGraph: {
    title: 'Non-HDL Cholesterol Calculator | LabLooker',
    description: 'Free non-HDL cholesterol calculator. Estimate atherogenic cholesterol for cardiovascular risk assessment.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
