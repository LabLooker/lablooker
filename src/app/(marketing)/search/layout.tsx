import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Lab Tests',
  description: 'Search 370+ lab tests by name, CPT code, or symptom. View detailed test info, pricing across labs, ICD-10 codes, and prep instructions.',
  openGraph: {
    title: 'Search Lab Tests | LabLooker',
    description: 'Search 370+ lab tests by name, CPT code, or symptom. Compare self-pay pricing across labs.',
  },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
