export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    const stripe = getStripe()
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
    const stripe = getStripe()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const subscriptionId = session.subscription as string
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const supabaseUid = subscription.metadata.supabase_uid

        if (supabaseUid) {
          await supabaseAdmin
            .from('profiles')
            .update({
              stripe_customer_id: session.customer as string,
              is_premium: true,
              plan: 'pro',
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
          const isCanceled = subscription.cancel_at_period_end
          await supabaseAdmin
            .from('profiles')
            .update({
              is_premium: !isCanceled,
              plan_status: isCanceled ? 'canceled' : 'active',
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
              is_premium: false,
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
