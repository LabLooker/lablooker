# forge-starter — App Factory Template

A production-ready Next.js starter that turns any validated pain point into a
shippable SaaS in 48 hours. Used for every app The Forge builds.

---

## Tech Stack
- **Next.js 15** (App Router, TypeScript)
- **Supabase** (Postgres + Auth + Realtime)
- **Stripe** (subscriptions + one-time payments)
- **Tailwind CSS v4**
- **Resend** (transactional email — optional, stub it)

---

## What to Build

### 1. Landing Page `app/(marketing)/page.tsx`
A high-converting landing page with these sections:
- **Nav** — logo, nav links, CTA button ("Start Free Trial" or "Join Waitlist")
- **Hero** — bold headline, subheadline, primary CTA + secondary CTA
- **Problem** — "Here's what's broken" section (3 pain points with icons)
- **Solution** — "Here's how we fix it" (3 features with icons)
- **Social Proof** — placeholder testimonial cards (3)
- **Pricing** — monthly/annual toggle, 3 tiers (Free, Pro, Business)
- **FAQ** — 5 expandable FAQ items
- **Footer** — links, copyright

Design: dark theme, professional SaaS look. Primary color: indigo (#6366f1).
Clean, minimal, conversion-focused. Not LOTR — this is a blank canvas for any app.

### 2. Auth Pages
- `app/(auth)/login/page.tsx` — email + password login
- `app/(auth)/signup/page.tsx` — email + password signup
- `app/auth/callback/route.ts` — Supabase OAuth callback

### 3. Protected Dashboard `app/(app)/dashboard/page.tsx`
- Greeting + current plan badge
- Usage stats (stubbed with placeholder data)
- Quick action cards
- Recent activity list (stubbed)

### 4. Settings Page `app/(app)/settings/page.tsx`
- Profile section (name, email)
- **Billing section:**
  - Current plan display
  - "Upgrade Plan" button → Stripe Checkout
  - "Manage Billing" button → Stripe Customer Portal
  - Cancel subscription option

### 5. Pricing Page `app/(marketing)/pricing/page.tsx`
- Standalone pricing page (same component as landing page section)
- Monthly / Annual toggle (annual = 2 months free)

### 6. API Routes
- `app/api/checkout/route.ts` — create Stripe Checkout Session
- `app/api/portal/route.ts` — create Stripe Customer Portal session
- `app/api/webhooks/stripe/route.ts` — handle Stripe webhooks:
  - `checkout.session.completed` → activate subscription in DB
  - `customer.subscription.updated` → update plan
  - `customer.subscription.deleted` → downgrade to free

### 7. Supabase Schema `supabase/schema.sql`
```sql
-- profiles (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  stripe_customer_id text,
  plan text default 'free', -- free | pro | business
  plan_status text default 'active', -- active | canceled | past_due
  trial_ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
```

### 8. Middleware `middleware.ts`
- Protect all `/app/*` routes — redirect to /login if not authenticated
- Redirect logged-in users away from /login and /signup

### 9. Config & Customization
Everything app-specific lives in `src/config/app.ts`:
```ts
export const APP_CONFIG = {
  name: 'YourApp',
  tagline: 'Your bold one-liner here',
  description: 'Meta description for SEO',
  primaryColor: '#6366f1',
  plans: {
    free: { name: 'Free', price: 0, features: [...] },
    pro: { name: 'Pro', monthlyPrice: 29, annualPrice: 19, features: [...] },
    business: { name: 'Business', monthlyPrice: 79, annualPrice: 59, features: [...] },
  },
  stripeIds: {
    proMonthly: process.env.STRIPE_PRO_MONTHLY_ID,
    proAnnual: process.env.STRIPE_PRO_ANNUAL_ID,
    businessMonthly: process.env.STRIPE_BUSINESS_MONTHLY_ID,
    businessAnnual: process.env.STRIPE_BUSINESS_ANNUAL_ID,
  },
  nav: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  faqs: [
    { q: 'Is there a free trial?', a: '...' },
    // ...
  ],
}
```

### 10. Environment Template `.env.example`
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 11. README.md
Step-by-step guide:
1. Clone repo
2. Copy .env.example to .env.local, fill in keys
3. Run supabase/schema.sql in your Supabase project
4. Create Stripe products + webhook
5. Edit src/config/app.ts with your app name, copy, pricing
6. npm run dev
7. Deploy to Vercel

---

## Design System
- **Font:** Inter (Google Fonts)
- **Primary:** Indigo #6366f1
- **Background:** Zinc-950 (#09090b) dark
- **Cards:** Zinc-900 (#18181b)
- **Border:** Zinc-800
- **Text:** White / Zinc-400 (muted)
- **Radius:** 8px cards, 6px buttons

## File Structure
```
forge-starter/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── pricing/page.tsx   # Pricing page
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (app)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── checkout/route.ts
│   │   │   ├── portal/route.ts
│   │   │   └── webhooks/stripe/route.ts
│   │   ├── auth/callback/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── marketing/
│   │   │   ├── Nav.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Problem.tsx
│   │   │   ├── Solution.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   ├── config/
│   │   └── app.ts                 # ALL customization lives here
│   └── lib/
│       ├── supabase.ts
│       └── stripe.ts
├── supabase/
│   └── schema.sql
├── middleware.ts
├── .env.example
├── README.md
└── package.json
```

---

## Success Criteria
- `npm run dev` works immediately after filling .env.local
- Landing page looks professional and conversion-ready
- Auth flow works end-to-end (signup → dashboard)
- Stripe checkout flow works (test mode)
- Webhook updates the database correctly
- New app can be customized purely by editing `src/config/app.ts`
- Mobile responsive throughout
- Deployed to Vercel in < 5 minutes
