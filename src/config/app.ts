export const APP_CONFIG = {
  name: 'LabLooker',
  tagline: 'Know your labs before you walk in the door',
  description: 'Search any lab test, compare self-pay pricing across labs, find CPT and ICD-10 codes, and generate doctor request templates — all in one place.',
  primaryColor: '#6366f1',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  plans: {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Search 370+ lab tests by name, code, or symptom',
        'View CPT and ICD-10 codes for every test',
        'Compare self-pay pricing across labs',
        'Translate lab codes between 14 reference labs',
        'Generate doctor request letters',
        'Track your results over time',
        'Share results with providers via secure link',
      ],
    },
    pro: {
      name: 'Premium',
      monthlyPrice: 6,
      annualPrice: 50,
      features: [
        'Everything in Free',
        'Reference ranges with optimal targets',
        'Price drop alerts for saved tests',
        'Result reminders after ordering',
        'Trend charts with range overlays',
        'Priority support',
      ],
    },
    business: {
      name: 'Practice',
      monthlyPrice: 149,
      annualPrice: 149,
      comingSoon: true,
      features: [
        'Everything in Premium',
        'Bulk patient test lookups',
        'Staff accounts',
        'EMR-ready export formats',
        'Branded patient handouts',
        'Dedicated support',
      ],
    },
  },

  stripeIds: {
    premiumMonthly: process.env.STRIPE_PREMIUM_MONTHLY_ID || '',
    premiumAnnual: process.env.STRIPE_PREMIUM_ANNUAL_ID || '',
  },

  nav: [
    { label: 'Translate', href: '/translate' },
    { label: 'Advocate', href: '/advocate' },
    { label: 'My Labs', href: '/dashboard' },
    { label: 'Compare', href: '/compare' },
    { label: 'Pricing', href: '/pricing' },
  ],

  faqs: [
    {
      q: 'Is LabLooker a lab?',
      a: "No — we're a research tool. We help you find and compare labs, but you order directly from them.",
    },
    {
      q: 'Are the prices accurate?',
      a: 'We update prices regularly, but always confirm with the lab before ordering. Prices can change with promotions or updated fee schedules.',
    },
    {
      q: 'Can I order tests through LabLooker?',
      a: 'Not directly — we link you to the lab or direct-to-consumer platform where you can complete your order.',
    },
    {
      q: 'Is my data private?',
      a: "We don't store your search history or health data. No account is required to search.",
    },
    {
      q: 'What states is LabLooker available in?',
      a: "LabLooker's research tools work in all 50 states. Self-pay ordering links are unavailable in NY, NJ, and RI where direct-to-consumer testing is restricted by law.",
    },
  ],
}
