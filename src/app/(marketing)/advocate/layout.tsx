import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Doctor Request Letter Generator',
  description: 'Generate a professional letter to request specific lab tests from your doctor. Includes test names, CPT codes, ICD-10 codes, and clinical rationale.',
  openGraph: {
    title: 'Doctor Request Letter Generator | LabLooker',
    description: 'Generate a professional letter to request specific lab tests from your doctor.',
  },
}

export default function AdvocateLayout({ children }: { children: React.ReactNode }) {
  return children
}
