import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Build Your Lab Request',
  description: 'Build a list of lab tests to request from your doctor or order yourself. Search by test name, symptom, or panel — copy or print your list.',
  openGraph: {
    title: 'Build Your Lab Request | LabLooker',
    description: 'Build a list of lab tests to request from your doctor or order yourself.',
  },
}

export default function AdvocateLayout({ children }: { children: React.ReactNode }) {
  return children
}
