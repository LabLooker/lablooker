import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Lab Tests — Find Any Blood Test by Name, CPT Code, or Symptom',
  description: 'Search 370+ lab tests by name, CPT code, symptom, or lab code. View self-pay pricing, ICD-10 codes, prep instructions, and turnaround times. Free, no account required.',
  openGraph: {
    title: 'Search Lab Tests | LabLooker',
    description: 'Search 370+ lab tests by name, CPT code, symptom, or lab code. Compare self-pay pricing across labs. Free, no account required.',
  },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
