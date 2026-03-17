import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iron Saturation Calculator — Transferrin Saturation %',
  description: 'Calculate transferrin saturation percentage from serum iron and TIBC. Screen for iron deficiency anemia and hemochromatosis iron overload.',
  openGraph: {
    title: 'Iron Saturation Calculator | LabLooker',
    description: 'Free iron saturation calculator. Calculate transferrin saturation percentage from serum iron and TIBC levels.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
