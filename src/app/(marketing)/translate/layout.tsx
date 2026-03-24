import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Translate Lab Codes — Quest, LabCorp, ARUP & More',
  description: 'Translate lab test codes between Quest Diagnostics, LabCorp, ARUP, and 11 other reference labs. Paste test names or proprietary codes and get instant translations with CPT codes.',
  openGraph: {
    title: 'Translate Lab Codes | LabLooker',
    description: 'Translate lab test codes between Quest Diagnostics, LabCorp, ARUP, and 11 other reference labs. Free instant translations with CPT codes.',
  },
}

export default function TranslateLayout({ children }: { children: React.ReactNode }) {
  return children
}
