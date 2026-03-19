import { APP_CONFIG } from '@/config/app'

export const metadata = {
  title: `Privacy Policy — ${APP_CONFIG.name}`,
}

export default function PrivacyPage() {
  return (
    <section className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[#577572]">Last updated: March 19, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#3d5a56]">
          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">1. Introduction</h2>
            <p className="mt-2">
              {APP_CONFIG.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the {APP_CONFIG.name} website and services.
              This Privacy Policy explains what information we collect, how we use it, and your rights
              regarding your data. We built {APP_CONFIG.name} for people managing their own health — we take
              your privacy seriously.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">2. Information We Collect</h2>
            <p className="mt-2">The information we collect depends on how you use {APP_CONFIG.name}:</p>

            <h3 className="mt-4 font-semibold text-[#1a2e2b]">Free users (no account required)</h3>
            <p className="mt-1">
              You can search tests, compare prices, translate lab codes, and use calculators without
              creating an account. We do not collect personally identifiable information for these
              activities. We collect standard anonymous usage data (pages viewed, general interaction
              patterns) to improve the service.
            </p>

            <h3 className="mt-4 font-semibold text-[#1a2e2b]">Registered users</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Account information:</strong> Email address, name, and password.</li>
              <li><strong>Payment information:</strong> Billing details processed securely through Stripe. We never see or store your full card number.</li>
              <li><strong>Device and usage data:</strong> Browser type, operating system, IP address, and interaction patterns for security and service improvement.</li>
            </ul>

            <h3 className="mt-4 font-semibold text-[#1a2e2b]">Premium members using Track Results</h3>
            <p className="mt-1">
              Premium members may voluntarily import and save personal lab results to their account.
              This includes test names, numeric values, units, reference ranges, draw dates, and lab
              names — exactly what you choose to enter. This data is:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Self-reported by you — we receive it only because you submit it</li>
              <li>Stored in your private account and visible only to you</li>
              <li>Never sold, shared with third parties, or used for advertising</li>
              <li>Exportable and fully deletable at any time from your account settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">3. HIPAA and Health Data</h2>
            <p className="mt-2">
              {APP_CONFIG.name} is not a HIPAA-covered entity (we are not a healthcare provider, health
              plan, or healthcare clearinghouse). Lab result data that Premium members voluntarily
              store in their account is self-reported personal data — not records transferred from
              a covered entity. We handle this data with care and do not use it for any purpose
              beyond providing the tracking features you signed up for.
            </p>
            <p className="mt-2">
              Free users who use only search, compare, translate, and calculator features do not
              submit any health data to us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">4. How We Use Your Information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>To provide, maintain, and improve our services.</li>
              <li>To process payments and manage your subscription.</li>
              <li>To power the Track Results dashboard and related features for Premium members.</li>
              <li>To send service-related communications (account updates, security alerts).</li>
              <li>To understand how our service is used and make it better.</li>
            </ul>
            <p className="mt-2">We do not sell your data. We do not use your data for advertising.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">5. Third-Party Services</h2>
            <p className="mt-2">We use the following third-party services:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Supabase:</strong> Authentication and database hosting (your account and result data lives here).</li>
              <li><strong>Stripe:</strong> Payment processing. Stripe&apos;s privacy policy governs payment data.</li>
              <li><strong>Vercel Analytics:</strong> Anonymous page view and usage analytics. No personal data is collected.</li>
              <li><strong>Affiliate lab partners:</strong> When you click a lab&apos;s Order link, you are directed to a third-party website. Those sites have their own privacy policies. We may receive a referral commission when you make a purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">6. Cookies</h2>
            <p className="mt-2">
              We use essential cookies for authentication and session management. Vercel Analytics
              uses privacy-respecting, cookieless measurement. You can disable cookies in your browser
              settings, though this may affect login functionality.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">7. Data Security</h2>
            <p className="mt-2">
              We implement industry-standard security measures including encryption in transit (TLS)
              and at rest. Your account is protected by your password and Supabase&apos;s authentication
              infrastructure. No method of electronic transmission is 100% secure — please use a
              strong, unique password for your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">8. Your Rights and Data Control</h2>
            <p className="mt-2">You have full control over your data:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Update your account information anytime from your settings page.</li>
              <li>Export your saved lab results as a CSV from your dashboard.</li>
              <li>Delete individual results, import batches, or your entire account at any time.</li>
              <li>Request a complete copy of your data by contacting us at hello@lablooker.com.</li>
              <li>Opt out of non-essential communications at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">9. Children&apos;s Privacy</h2>
            <p className="mt-2">
              Our service is not directed to individuals under 18. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">10. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy as the product evolves. We will notify registered
              users of material changes by email and will always update the &quot;Last updated&quot; date at
              the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">11. Contact Us</h2>
            <p className="mt-2">
              Questions about this Privacy Policy? Contact us at{' '}
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
