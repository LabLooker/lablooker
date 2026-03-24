import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iron Saturation % Calculator — Transferrin Saturation',
  description: 'Iron Saturation % Calculator — Calculate transferrin saturation from serum iron and TIBC. Free tool for iron deficiency and overload assessment.',
  openGraph: {
    title: 'Iron Saturation % Calculator | LabLooker',
    description: 'Free iron saturation calculator. Calculate transferrin saturation from serum iron and TIBC for iron deficiency and overload assessment.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
