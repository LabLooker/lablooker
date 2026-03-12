import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lab Test Request Generator',
  description: 'Generate a coded request letter for specific lab tests to give your doctor. Includes test names, CPT codes, and optional ICD-10 and lab-specific codes.',
  openGraph: {
    title: 'Lab Test Request Generator | LabLooker',
    description: 'Generate a coded request letter for specific lab tests to give your doctor.',
  },
}

export default function AdvocateLayout({ children }: { children: React.ReactNode }) {
  return children
}
