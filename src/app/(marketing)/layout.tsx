import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import { StateRestrictionProvider, StatePickerModal } from '@/components/StateRestrictionProvider'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StateRestrictionProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
      <StatePickerModal />
    </StateRestrictionProvider>
  )
}
