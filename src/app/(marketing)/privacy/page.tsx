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
        <p className="mt-2 text-sm text-[#577572]">Last updated: February 25, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#3d5a56]">
          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">1. Introduction</h2>
            <p className="mt-2">
              {APP_CONFIG.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the {APP_CONFIG.name} website and services.
              This Privacy Policy explains how we collect, use, and protect your information when
              you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">2. Information We Collect</h2>
            <p className="mt-2">We may collect the following types of information:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Account information:</strong> Email address, name, and password when you create an account.</li>
              <li><strong>Payment information:</strong> Billing details processed securely through Stripe. We do not store your full credit card number.</li>
              <li><strong>Usage data:</strong> Pages viewed, features used, and general interaction patterns to improve our service.</li>
              <li><strong>Device information:</strong> Browser type, operating system, and IP address for security and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">3. What We Do Not Collect</h2>
            <p className="mt-2">
              We do <strong>not</strong> collect, store, or have access to your medical records, lab results,
              diagnoses, or health conditions. {APP_CONFIG.name} is a research and comparison tool — we do not
              process protected health information (PHI). We are not a HIPAA-covered entity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">4. How We Use Your Information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>To provide, maintain, and improve our services.</li>
              <li>To process payments and manage your subscription.</li>
              <li>To send service-related communications (account updates, security alerts).</li>
              <li>To analyze usage patterns and improve the user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">5. Third-Party Services</h2>
            <p className="mt-2">We use the following third-party services:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Supabase:</strong> Authentication and database hosting.</li>
              <li><strong>Stripe:</strong> Payment processing.</li>
              <li><strong>Affiliate lab partners:</strong> When you click a lab link, you may be directed to a third-party lab website. Those sites have their own privacy policies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">6. Cookies</h2>
            <p className="mt-2">
              We use essential cookies for authentication and session management. We may use analytics
              cookies to understand how our service is used. You can disable cookies in your browser
              settings, though this may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">7. Data Security</h2>
            <p className="mt-2">
              We implement industry-standard security measures to protect your information, including
              encryption in transit (TLS) and at rest. However, no method of electronic transmission
              or storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">8. Your Rights</h2>
            <p className="mt-2">You may:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access, update, or delete your account information at any time from your settings page.</li>
              <li>Request a copy of your data by contacting us.</li>
              <li>Opt out of non-essential communications.</li>
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
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a2e2b]">11. Contact Us</h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy, contact us at{' '}
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
