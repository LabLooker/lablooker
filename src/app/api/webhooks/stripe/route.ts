export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export async function POST(request: Request) {
  // Instantiate inside handler so env vars are available at runtime, not build time
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const subscriptionId = session.subscription as string
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const supabaseUid = subscription.metadata.supabase_uid

        if (supabaseUid) {
          const plan = determinePlan(subscription)
          await supabaseAdmin
            .from('profiles')
            .update({
              stripe_customer_id: session.customer as string,
              plan,
              plan_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', supabaseUid)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const supabaseUid = subscription.metadata.supabase_uid

        if (supabaseUid) {
          const plan = determinePlan(subscription)
          const status = subscription.cancel_at_period_end ? 'canceled' : 'active'
          await supabaseAdmin
            .from('profiles')
            .update({
              plan,
              plan_status: status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', supabaseUid)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const supabaseUid = subscription.metadata.supabase_uid

        if (supabaseUid) {
          await supabaseAdmin
            .from('profiles')
            .update({
              plan: 'free',
              plan_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', supabaseUid)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    )
  }
}

function determinePlan(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price?.id
  const stripeProMonthly = process.env.STRIPE_PRO_MONTHLY_ID
  const stripeProAnnual = process.env.STRIPE_PRO_ANNUAL_ID
  const stripeBusinessMonthly = process.env.STRIPE_BUSINESS_MONTHLY_ID
  const stripeBusinessAnnual = process.env.STRIPE_BUSINESS_ANNUAL_ID

  if (priceId === stripeProMonthly || priceId === stripeProAnnual) return 'pro'
  if (priceId === stripeBusinessMonthly || priceId === stripeBusinessAnnual) return 'business'
  return 'pro' // default for unknown price
}
