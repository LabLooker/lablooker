export const APP_CONFIG = {
  name: 'YourApp',
  tagline: 'Ship your SaaS in days, not months',
  description: 'The fastest way to launch a production-ready SaaS. Auth, payments, and a beautiful UI — all wired up.',
  primaryColor: '#6366f1',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  plans: {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Up to 100 records',
        'Basic analytics',
        'Community support',
        'Single user',
      ],
    },
    pro: {
      name: 'Pro',
      monthlyPrice: 29,
      annualPrice: 19,
      features: [
        'Unlimited records',
        'Advanced analytics',
        'Priority support',
        'Up to 5 team members',
        'API access',
        'Custom integrations',
      ],
    },
    business: {
      name: 'Business',
      monthlyPrice: 79,
      annualPrice: 59,
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'SSO & SAML',
        'Dedicated account manager',
        'Custom contracts',
        'SLA guarantee',
        'Audit logs',
      ],
    },
  },

  stripeIds: {
    proMonthly: process.env.STRIPE_PRO_MONTHLY_ID || '',
    proAnnual: process.env.STRIPE_PRO_ANNUAL_ID || '',
    businessMonthly: process.env.STRIPE_BUSINESS_MONTHLY_ID || '',
    businessAnnual: process.env.STRIPE_BUSINESS_ANNUAL_ID || '',
  },

  nav: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],

  faqs: [
    {
      q: 'Is there a free trial?',
      a: 'Yes! Every account starts with a 14-day free trial of our Pro plan. No credit card required to get started.',
    },
    {
      q: 'Can I change plans later?',
      a: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your account settings. Changes take effect immediately.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, Mastercard, Amex) through our secure payment processor, Stripe. Enterprise customers can also pay via invoice.',
    },
    {
      q: 'Is my data secure?',
      a: 'Security is our top priority. All data is encrypted at rest and in transit. We use Supabase with Row Level Security, ensuring your data is always protected.',
    },
    {
      q: 'Do you offer refunds?',
      a: "If you're not satisfied within the first 30 days, we'll give you a full refund — no questions asked. After 30 days, you can cancel anytime and keep access until the end of your billing period.",
    },
  ],
}
