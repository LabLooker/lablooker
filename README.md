# forge-starter

A production-ready Next.js 15 + Supabase + Stripe SaaS template. Ship your app in days, not months.

## Tech Stack

- **Next.js 15** — App Router, TypeScript, Server Components
- **Supabase** — Postgres, Auth, Row Level Security
- **Stripe** — Subscriptions, Checkout, Customer Portal
- **Tailwind CSS v4** — Utility-first styling, dark theme

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd forge-starter
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your keys:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |

### 3. Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor. This creates:
- `profiles` table with RLS policies
- Auto-profile creation trigger on signup

### 4. Stripe Setup

1. Create two Products in Stripe (Pro and Business)
2. For each product, create a Monthly and Annual price
3. Add the 4 Price IDs to your `.env.local`:
   - `STRIPE_PRO_MONTHLY_ID`
   - `STRIPE_PRO_ANNUAL_ID`
   - `STRIPE_BUSINESS_MONTHLY_ID`
   - `STRIPE_BUSINESS_ANNUAL_ID`
4. Create a Webhook endpoint pointing to `https://yourdomain.com/api/webhooks/stripe`
5. Subscribe to these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 5. Customize Your App

Edit `src/config/app.ts` to change:
- App name and tagline
- Pricing tiers and features
- Navigation links
- FAQ content

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Deploy to Vercel

```bash
npx vercel
```

Add your environment variables in the Vercel dashboard.

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Landing page, pricing
│   ├── (auth)/          # Login, signup
│   ├── (app)/           # Dashboard, settings (protected)
│   ├── api/             # Checkout, portal, webhooks
│   └── auth/callback/   # Supabase OAuth callback
├── components/
│   ├── marketing/       # Nav, Hero, Pricing, etc.
│   └── ui/              # Button, Card
├── config/app.ts        # All customization lives here
└── lib/                 # Supabase & Stripe clients
```

## License

MIT
