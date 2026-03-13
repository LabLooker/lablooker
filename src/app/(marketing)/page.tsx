import Hero from '@/components/marketing/Hero'
import Problem from '@/components/marketing/Problem'
import Solution from '@/components/marketing/Solution'
import FounderStory from '@/components/marketing/FounderStory'
import EmailCapture from '@/components/marketing/EmailCapture'
import Pricing from '@/components/marketing/Pricing'
import FAQ from '@/components/marketing/FAQ'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <Pricing />
      <FAQ />
      <FounderStory />
      <EmailCapture />
    </>
  )
}
