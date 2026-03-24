import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Non-HDL Cholesterol Calculator — Cardiovascular Risk',
  description: 'Non-HDL Cholesterol Calculator — Calculate non-HDL from total cholesterol and HDL. Free cardiovascular risk assessment tool.',
  openGraph: {
    title: 'Non-HDL Cholesterol Calculator | LabLooker',
    description: 'Free non-HDL cholesterol calculator. Calculate non-HDL from total cholesterol and HDL for cardiovascular risk assessment.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
