'use client'

export const dynamic = 'force-dynamic'

import Nav from '@/components/marketing/Nav'
import { StateRestrictionProvider, StatePickerModal } from '@/components/StateRestrictionProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StateRestrictionProvider>
      <Nav />
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-12 md:px-6">
        {children}
      </main>
      <StatePickerModal />
    </StateRestrictionProvider>
  )
}
