# TASK: Wire Stripe Subscriptions

## Context
LabLooker is a Next.js 15 (App Router) + Supabase + Tailwind app. We need to add Stripe subscription billing for Premium tier.

**Pricing:** $8/month or $59/year
**Stripe keys are in `.env.local`** — read them from there. Do NOT hardcode keys.

## Environment Variables (already in .env.local)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — publishable key
- `STRIPE_SECRET_KEY` — secret key  
- `STRIPE_MONTHLY_PRICE_ID` / `NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID`
- `STRIPE_ANNUAL_PRICE_ID` / `NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID`

## What to Build

### 1. Checkout API Route (`src/app/api/stripe/checkout/route.ts`)
- POST endpoint that creates a Stripe Checkout Session
- Accepts `{ priceId: string }` in body
- Requires authenticated Supabase user (check auth, return 401 if not logged in)
- Pass `customer_email` from Supabase user
- `success_url`: `/dashboard?upgraded=true`
- `cancel_url`: `/pricing`
- `mode: 'subscription'`
- Store Stripe `customer_id` on the Supabase `profiles` table (add column if needed via migration SQL comment)

### 2. Webhook Handler (`src/app/api/stripe/webhook/route.ts`)
- Handle these events:
  - `checkout.session.completed` → set `profiles.is_premium = true` and `profiles.stripe_customer_id`
  - `customer.subscription.deleted` → set `profiles.is_premium = false`
  - `customer.subscription.updated` → update status if cancelled
- Use `STRIPE_WEBHOOK_SECRET` env var (we'll set this up later, just read from env)
- Verify webhook signature

### 3. Billing Portal API Route (`src/app/api/stripe/portal/route.ts`)
- POST endpoint that creates a Stripe Billing Portal session
- Returns portal URL for managing subscription
- Requires authenticated user with `stripe_customer_id`

### 4. Update Pricing Component (`src/components/marketing/Pricing.tsx`)
- The Premium card's "Start Premium" button should:
  - If not logged in → redirect to `/signup?redirect=/pricing`
  - If logged in → show monthly/annual toggle, then call checkout API
- Add a monthly/annual toggle switch on the Premium card
- Show "$8/month" or "$59/year (save 39%)" based on toggle

### 5. Premium Gate Hook (`src/lib/use-premium.ts`)
- Simple hook: `usePremium()` → returns `{ isPremium: boolean, loading: boolean }`
- Reads from `profiles.is_premium` via Supabase
- Used by tracker/dashboard pages to gate features

### 6. Database Migration (just output as SQL comment)
Add to profiles table:
```sql
-- Run in Supabase SQL editor:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
```

## Design System
- Primary: #2d6a5e (sage)
- Accent: #b85c5c (brick rose)  
- Use existing Button component from `src/components/ui/Button.tsx`
- Toggle switch should use sage/white colors

## Rules
- Keep it simple. Minimal files.
- Use `stripe` package (already installed)
- Import Stripe server-side only (never in client components)
- Don't break existing functionality
- Build must pass: `npm run build`
- Commit and push when done

## DO NOT
- Don't hardcode any keys or price IDs
- Don't modify unrelated files
- Don't add unnecessary dependencies
