import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Translate Lab Codes',
  description: 'Translate lab test codes between Quest, LabCorp, ARUP, and 11 other reference labs. Paste your test names or codes and get instant translations with CPT codes.',
  openGraph: {
    title: 'Translate Lab Codes | LabLooker',
    description: 'Translate lab test codes between Quest, LabCorp, ARUP, and 11 other reference labs.',
  },
}

export default function TranslateLayout({ children }: { children: React.ReactNode }) {
  return children
}
