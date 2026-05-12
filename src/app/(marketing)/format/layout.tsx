import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Format Lab Results for Sharing — LabLooker',
  description: 'Paste messy lab results and get a clean, easy-to-read format perfect for sharing in patient community groups. Free tool — no account required.',
  openGraph: {
    title: 'Format Lab Results for Sharing | LabLooker',
    description: 'Paste messy lab results and get a clean, easy-to-read format perfect for sharing in patient community groups.',
  },
}

export default function FormatLayout({ children }: { children: React.ReactNode }) {
  return children
}
