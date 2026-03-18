export const APP_CONFIG = {
  name: 'LabLooker',
  tagline: 'Know your labs before you walk in the door',
  description: 'Search any lab test, compare self-pay pricing across labs, find CPT and ICD-10 codes, and generate doctor request templates — all in one place.',
  primaryColor: '#6366f1',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  plans: {
    free: {
      name: 'Research Your Labs',
      price: 0,
      bestFor: 'People comparing options, learning what tests mean, and previewing results before deciding what to save.',
      features: [
        'Search the full lab database',
        'Translate test names and lab-specific codes',
        'Compare self-pay prices across labs',
        'Explore panels and topics',
        'Import lab PDFs for parsed preview',
        'Share one-time result summaries',
        'Basic doctor request letter template',
      ],
    },
    pro: {
      name: 'Track Your Labs Over Time',
      monthlyPrice: 6,
      annualPrice: 50,
      bestFor: 'People who test regularly and want one place to save, monitor, and act on their lab results.',
      features: [
        'Save imported results to your tracker',
        'Track markers over time',
        'View trend charts',
        'Set custom target and reference ranges',
        'Functional and optimal ranges',
        'Personalized doctor request letters',
        'Retest reminders',
        'Export your data',
      ],
    },
    business: {
      name: 'Practice',
      monthlyPrice: 149,
      annualPrice: 149,
      comingSoon: true,
      bestFor: 'Clinics and practitioners managing lab workflows for multiple patients.',
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
    { label: 'Compare Prices', href: '/compare' },
    { label: 'Search Tests', href: '/search' },
    { label: 'Translate Codes', href: '/translate' },
    // 'More' dropdown is handled in Nav.tsx directly
    { label: 'Track Results', href: '/dashboard' },
  ],

  moreNav: [
    { label: 'Generate Request', href: '/advocate' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Panels', href: '/bundles' },
    { label: 'Topics', href: '/topics' },
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
