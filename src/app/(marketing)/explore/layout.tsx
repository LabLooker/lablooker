import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Lab Tests by Symptom or Condition | LabLooker',
  description: 'Not sure which lab tests to order? Browse by symptom, condition, or health goal. Discover which blood tests are relevant to fatigue, thyroid issues, hormones, and more.',
  openGraph: {
    title: 'Explore Lab Tests by Symptom or Condition | LabLooker',
    description: 'Not sure which lab tests to order? Browse by symptom, condition, or health goal.',
  },
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children
}
