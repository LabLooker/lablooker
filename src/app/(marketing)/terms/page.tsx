import { APP_CONFIG } from '@/config/app'

export const metadata = {
  title: `Terms of Service — ${APP_CONFIG.name}`,
}

export default function TermsPage() {
  return (
    <section className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[#577572]">Last updated: February 25, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#3d5a56]">
          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing or using {APP_CONFIG.name} (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">2. Description of Service</h2>
            <p className="mt-2">
              {APP_CONFIG.name} is an educational research and comparison tool that helps users look up
              lab test information, CPT codes, ICD-10 codes, and compare self-pay pricing across
              laboratory providers. We are <strong>not</strong> a medical provider, laboratory, or
              healthcare facility.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">3. Not Medical Advice</h2>
            <div className="mt-2 rounded-lg border border-amber-600/20 bg-amber-50 px-4 py-3">
              <p className="font-medium text-amber-900">
                The information provided by {APP_CONFIG.name} is for educational and research purposes only.
                It is not intended to be, and should not be used as, a substitute for professional medical
                advice, diagnosis, or treatment.
              </p>
            </div>
            <p className="mt-3">
              Always seek the advice of a qualified healthcare provider with any questions you may have
              regarding a medical condition or lab test. Never disregard professional medical advice or
              delay seeking it because of something you read on {APP_CONFIG.name}.
            </p>
            <p className="mt-2">
              Symptom-to-test mappings shown on our platform reflect tests commonly ordered by healthcare
              providers and are not recommendations. Lab test selection, ordering, and interpretation
              should be done by or in consultation with a licensed healthcare provider.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">4. User Accounts</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>You must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 18 years old to use the Service.</li>
              <li>One person or entity per account. Accounts are non-transferable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">5. Subscriptions and Payments</h2>
            <p className="mt-2">
              Some features require a paid subscription. By subscribing, you agree to pay the applicable
              fees. Subscriptions automatically renew unless canceled before the renewal date.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Prices are listed in USD and may change with notice.</li>
              <li>Refunds are handled on a case-by-case basis. Contact us within 7 days of a charge for refund requests.</li>
              <li>You can cancel your subscription at any time from your account settings or by contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">6. Pricing Accuracy</h2>
            <p className="mt-2">
              Lab test prices displayed on {APP_CONFIG.name} are collected from publicly available sources
              and updated regularly, but we cannot guarantee they are current or error-free. Always
              confirm pricing directly with the laboratory before ordering. We are not responsible for
              pricing discrepancies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">7. Affiliate Relationships</h2>
            <p className="mt-2">
              {APP_CONFIG.name} may earn commissions when you click links to laboratory providers and
              make a purchase. These affiliate relationships do not influence our rankings, test
              information, or pricing data. See our affiliate disclosure in the footer for more details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">8. State Restrictions</h2>
            <p className="mt-2">
              Direct-to-consumer (DTC) lab testing is not available in all states. Some states, including
              New York, New Jersey, and Rhode Island, restrict or prohibit patients from ordering lab
              tests without a physician&apos;s order. It is your responsibility to understand and comply with
              the laws in your state.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">9. Acceptable Use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Use the Service for any unlawful purpose.</li>
              <li>Scrape, crawl, or otherwise extract data from the Service without permission.</li>
              <li>Attempt to gain unauthorized access to any part of the Service.</li>
              <li>Interfere with or disrupt the Service or its infrastructure.</li>
              <li>Resell or redistribute Service content without authorization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">10. Intellectual Property</h2>
            <p className="mt-2">
              All content, design, and code of the Service are owned by {APP_CONFIG.name} or its licensors.
              CPT codes are copyrighted by the American Medical Association. ICD-10 codes are maintained
              by the World Health Organization and CMS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">11. Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, {APP_CONFIG.name} shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits
              or revenue, arising from your use of the Service. Our total liability shall not exceed the
              amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">12. Disclaimer of Warranties</h2>
            <p className="mt-2">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              either express or implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">13. Changes to Terms</h2>
            <p className="mt-2">
              We reserve the right to modify these Terms at any time. Material changes will be communicated
              via the Service or email. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">14. Contact Us</h2>
            <p className="mt-2">
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:hello@lablooker.com" className="text-[#2d6a5e] underline hover:text-[#1a2e2b]">
                hello@lablooker.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
